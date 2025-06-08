import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import flash from "connect-flash";

dotenv.config();
const app = express();
const port = 3000;
const saltRounds = 10

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use(passport.initialize());
app.use(passport.session())

app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash("error");
  next();
});

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
})
db.connect()

async function fetchPokemonCard() {
  try {
    const randomNumber = Math.floor(Math.random()*17000 + 1)
    const result = await axios.get(`https://api.pokemontcg.io/v2/cards?page=${randomNumber}&pageSize=1`, {
      headers: {
        'X-Api-Key': process.env.API_KEY
      }
    });
    const data = result.data;
    return data.data[0]
  } catch (error) {
    console.error(error)
    return null;
  }
}
async function fetchBrawlStarsCard() {
  try {
    const randomNumber = Math.floor(Math.random()*92)
    const result = await axios.get("https://api.brawlstars.com/v1/brawlers", {
      headers: {
        Authorization: `Bearer ${process.env.BS_API_KEY}`
      }
    })
    return result.data.items[0]
  } catch (error) {
    console.error(error)
    return null;
  }
}

async function fetchClashRoyaleCard() {
  try {
    const randomNumber = Math.floor(Math.random()*119)
    const result = await axios.get("https://api.clashroyale.com/v1/cards", {
      headers: {
        Authorization: `Bearer ${process.env.CR_API_KEY}`
      }
    })
    return result.data.items[randomNumber]
  } catch (error) {
    console.error(error)
    return null;
  }
}

async function checkAnswer(req, guess, answer, username) {
  
  if (guess.toLowerCase().trim() == answer.toLowerCase()) {
    req.session.feedback = null
    req.session.score += 1
    const result = await db.query("SELECT * FROM users WHERE username=$1", [username])
    const highscore = result.rows[0].highscore
    if (req.session.score > highscore) {
      await db.query ("UPDATE users SET highscore=$1 WHERE username=$2", [req.session.score, username])
    }
  } else {
    req.session.score = 0
    req.session.feedback = `Incorrect! The correct answer was ${answer}`
  }
}

app.get("/", async (req, res) => {
  res.render("login.ejs")
})

app.get("/guess", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.session.feedback == undefined) {
      req.session.feedback = null
    }
    if (req.session.score == undefined) {
      req.session.score = 0
    }
    const user = req.user
    const result = await db.query("SELECT * FROM users WHERE username = $1", [user.username])
    const highscore = result.rows[0].highscore
    const card = await fetchClashRoyaleCard()
    req.session.cardName = card.name

    res.render("index.ejs", {card: card, currentScore: req.session.score, highscore: highscore, feedback: req.session.feedback}) 
  } else {
    res.redirect("/")
  }
})

app.post("/guess", async (req, res) => {
  const guess = req.body.guess;
  const cardName = req.session.cardName
  const currentUser = req.user
  checkAnswer(req, guess, cardName, currentUser.username)
  res.redirect("/guess")
})

app.post("/register", async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      res.send("Username already registered.")
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error Hashing password:", err)
        } else {
          await db.query(
            "INSERT INTO users (username, password, highscore) VALUES ($1, $2, 0)",
            [username, hash]
          );
          res.redirect("/")
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
})

app.get("/register", async (req, res) => {
  res.render("register.ejs")
})

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/")
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/guess")
    })
  }) (req, res, next);
})

passport.use(new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0]
      const storedPassword = user.password

      bcrypt.compare(password, storedPassword, (err, result) => {
        if (err) {
          return cb(err)
        } else {
          if (result) {
            return cb(null, user)
          } else {
            return cb(null, false, {message: "Incorrect password"})
          }
        }
      })
    } else {
      return cb(null, false, {message: "User not found"})
    }
  } catch (error) {
    return cb(error)
  }
}))

app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/leaderboard", async (req, res) => {
  try {
    const result = await db.query("SELECT username, highscore FROM users ORDER by highscore DESC")
    const data = result.rows.slice(0,9)
    res.render("leaderboard.ejs", {leaderboard: data})
  } catch (error) {
    console.error(error)
  }
})

passport.serializeUser((user, cb) => {
  cb(null, user);
})

passport.deserializeUser((user, cb) => {
  cb(null, user);
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})