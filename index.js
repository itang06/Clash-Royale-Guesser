import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import flash from "connect-flash";

// Import our refactored modules
import { CONFIG } from './config.js';
import db from './database.js';
import { fetchClashRoyaleCard } from './apiService.js';
import { checkAnswer, getUserHighscore, getLeaderboard } from './gameService.js';
import { createUser, findUserByUsername, verifyPassword } from './authService.js';

dotenv.config();
const app = express();

// View engine setup
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: CONFIG.SESSION_MAX_AGE
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.flash("error");
  next();
});

// Passport configuration
passport.use(new Strategy(async function verify(username, password, cb) {
  try {
    const user = await findUserByUsername(username);
    
    if (user) {
      const isValidPassword = await verifyPassword(password, user.password);
      if (isValidPassword) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: "Incorrect password" });
      }
    } else {
      return cb(null, false, { message: "User not found" });
    }
  } catch (error) {
    return cb(error);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// http routes
app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    await createUser(username, password);
    res.redirect("/");
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/guess");
    });
  })(req, res, next);
});

app.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.get("/guess", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      // initialize session variables
      if (req.session.feedback === undefined) {
        req.session.feedback = null;
      }
      if (req.session.score === undefined) {
        req.session.score = 0;
      }

      const user = req.user;
      const highscore = await getUserHighscore(user.username);
      const card = await fetchClashRoyaleCard();
      
      if (!card) {
        return res.status(500).send('Failed to fetch card');
      }

      req.session.cardName = card.name;

      res.render("index.ejs", {
        card: card,
        currentScore: req.session.score,
        highscore: highscore,
        feedback: req.session.feedback
      });
    } catch (error) {
      console.error('Error in /guess:', error);
      res.status(500).send('Something went wrong');
    }
  } else {
    res.redirect("/");
  }
});

app.post("/guess", async (req, res) => {
  const { guess } = req.body;
  const cardName = req.session.cardName;
  const currentUser = req.user;
  
  try {
    await checkAnswer(req, guess, cardName, currentUser.username);
    res.redirect("/guess");
  } catch (error) {
    console.error('Error processing guess:', error);
    res.status(500).send('Something went wrong');
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await getLeaderboard(CONFIG.LEADERBOARD_LIMIT);
    res.render("leaderboard.ejs", { leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).send('Failed to load leaderboard');
  }
});

// Start server
app.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${CONFIG.PORT}`);
});