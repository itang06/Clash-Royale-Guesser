# Clash Royale Card Guessing Game

## Project Snapshot (Non-Technical Overview)
An interactive web experience where players try to recognize Clash Royale cards from their artwork. You sign in, guess the card name, and see your score climb on a shared leaderboard. Think of it as a quick, competitive trivia game for Supercell fans that's built to be easy to host, play, and share.

## Why I Built It
I grew up grinding Clash Royale and always loved how instantly recognizable the cards are to me. I wanted a project that blended that nostalgia with a modern web stack so I could keep practicing full-stack skills. This app let me tackle:
- real user accounts and scores with a persistent database
- a live leaderboard that friends can actually compete on
- integrating an external API (Clash Royale) in a way that still works in a hosted environment
- my first time building and deploying a full-stack app from scratch

It also doubled as a playground for deployment—figuring out how to keep API keys secure, handle a production database, and still ship something fun.

## What It Looks Like
![Gameplay mock](public/images/Clash_Royale_Logo.png)
*The main game screen highlights a card image and the guess form.*

![Leaderboard mock](public/images/leaderboard.png)
*The leaderboard showcases the top scorers and crowns the current champion.*

> These assets mirror what users see in the app. Replace or extend with real screenshots if you capture them later.

## Feature Highlights
- **Fast Onboarding:** Lightweight registration and login with password hashing.
- **Instant Feedback:** Guess results update your score and show the correct answer when you miss.
- **High Score Tracking:** Session score plus persistent personal bests.
- **Global Leaderboard:** Everyone’s top scores ranked in one place.
- **Stay Signed In:** Cookie-based sessions keep you logged in while tracking your current run securely.
- **Modern UI:** Built with Bootstrap 5 and custom styling.

## How Everything Fits Together
- **Frontend:** EJS templates rendered by Express, with Bootstrap for speedy layout tweaks.
- **Backend:** Node.js + Express.js for routes, Passport.js for authentication, bcrypt for hashing.
- **Database:** PostgreSQL stores user accounts and high scores.
- **External Data:** Card images and metadata pulled from the Clash Royale API via the RoyaleAPI proxy (so the app keeps a stable IP address).

```
└── Project1/
    ├── public/           # Fonts, images, and CSS
    ├── views/            # EJS templates (pages + shared partials)
    ├── apiService.js     # Clash Royale API client
    ├── authService.js    # Registration/login helpers
    ├── gameService.js    # Scoring and leaderboard logic
    ├── database.js       # PostgreSQL connection
    ├── index.js          # Express app entry point
    └── config.js         # Centralized app settings
```

## Detailed Setup Guide

### 0. Prerequisites
- Node.js **18.x or newer**
- PostgreSQL **13+** running locally or remotely
- npm (ships with Node)
- A Supercell developer account (for the Clash Royale API key)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Project1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root. Everything is relative—no hard-coded paths needed:
```env
# PostgreSQL connection
PG_USER=your_postgres_username
PG_HOST=localhost
PG_DATABASE=clash_guesser
PG_PASSWORD=your_postgres_password
PG_PORT=5432

# Session + API
SESSION_SECRET=replace_me_with_a_random_string
CR_API_KEY=your_supercell_developer_key
PORT=3000
```

### 4. Prepare the Database
Create the database and required table (run this once in `psql`, DBeaver, or your tool of choice):
```sql
CREATE DATABASE clash_guesser;
\c clash_guesser

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  highscore INTEGER NOT NULL DEFAULT 0
);
```

### 5. Add Your Clash Royale API Key
1. Visit the [Supercell developer portal](https://developer.clashroyale.com/).
2. Create a key, ensure the `royale` scope is enabled.
3. Add the RoyaleAPI proxy IP `45.79.218.79/32` to the allow list (required for hosted environments).
4. Copy the key into the `.env` file as `CR_API_KEY`.

> Want to use the official API endpoint instead of the proxy? Swap the URL in `apiService.js` to `https://api.clashroyale.com/v1/cards` and whitelist your hosting provider’s outbound IP when you deploy.

### 6. Run the App Locally
```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000) and you’ll land on the login page.

## Gameplay Flow
1. **Create an Account:** Quick form; credentials stored securely.
2. **Start Guessing:** Each round shows a card image—type your best guess.
3. **Score Updates:** Correct answers bump your session score; miss and you restart from zero (but see what you missed).
4. **Leaderboard:** Jump to the leaderboard to view top players and your own high score.

## Known Issues & TODO
- **Session Store:** Currently uses Express’s in-memory store. Needs Redis or another persistent store for a production-grade deployment.
- **Mobile Layout:** Works on mobile but some spacing could be tighter—needs responsive polish.
- **Rate Limiting:** API requests aren’t throttled yet. Add guards if opening to public traffic.
- **Testing:** No automated tests have been written; integration tests for auth and gameplay are on the roadmap.
- **Card Pool Expansion:** Right now it pulls from the default Clash Royale card list; adding filters (rarity, arena) would be a neat enhancement.

## License
ISC License

