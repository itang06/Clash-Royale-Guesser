# Clash Royale Card Guessing Game

A web-based card guessing game where players try to identify Clash Royale cards from their images. Built with Node.js, Express, PostgreSQL, and Bootstrap.

## Features

- **User Authentication**: Register and login system with secure password hashing
- **Card Guessing Game**: Players guess Clash Royale card names from displayed images
- **Score Tracking**: Current session score and personal high score tracking
- **Leaderboard**: View top players and their scores
- **Responsive Design**: Modern UI built with Bootstrap 5
- **Session Management**: Persistent user sessions with flash messages

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js with local strategy
- **Frontend**: EJS templating, Bootstrap 5, CSS
- **Security**: bcrypt for password hashing, express-session for session management
- **API Integration**: Clash Royale API for card data

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PG_USER=your_postgres_username
   PG_HOST=localhost
   PG_DATABASE=your_database_name
   PG_PASSWORD=your_postgres_password
   PG_PORT=5432
   SESSION_SECRET=your_session_secret_key
   PORT=3000
   ```

4. **Set up the database**
   - Create a PostgreSQL database
   - The application will need tables for users and scores (check the database schema in the code)

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
Project1/
├── public/                 # Static assets
│   ├── fonts/             # Custom fonts
│   ├── images/            # Game images and icons
│   └── styles.css         # Custom styles
├── views/                 # EJS templates
│   ├── partials/          # Reusable template components
│   ├── index.ejs          # Main game page
│   ├── leaderboard.ejs    # Leaderboard page
│   ├── login.ejs          # Login page
│   └── register.ejs       # Registration page
├── apiService.js          # Clash Royale API integration
├── authService.js         # User authentication logic
├── config.js              # Application configuration
├── database.js            # PostgreSQL connection
├── gameService.js         # Game logic and scoring
├── index.js               # Main application entry point
└── package.json           # Dependencies and scripts
```

## How to Play

1. **Register/Login**: Create an account or login with existing credentials
2. **Guess Cards**: Look at the displayed Clash Royale card image and type your guess
3. **Score Points**: Correct guesses increase your score
4. **Track Progress**: View your current score and personal high score
5. **Compete**: Check the leaderboard to see how you rank against other players

## API Endpoints

- `GET /` - Login page
- `GET /register` - Registration page
- `POST /register` - Create new user account
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /guess` - Main game page
- `POST /guess` - Submit card guess
- `GET /leaderboard` - View leaderboard

## Configuration

The application configuration can be modified in `config.js`:

- **PORT**: Server port (default: 3000)
- **SALT_ROUNDS**: bcrypt salt rounds for password hashing
- **SESSION_MAX_AGE**: Session duration in milliseconds
- **LEADERBOARD_LIMIT**: Number of players shown on leaderboard
- **API_LIMITS**: Maximum card IDs for different game APIs

## Development

The application uses nodemon for development, which automatically restarts the server when files change.

```bash
npm start  # Starts with nodemon for development
```

## Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **passport**: Authentication middleware
- **bcrypt**: Password hashing
- **express-session**: Session management
- **connect-flash**: Flash messages
- **axios**: HTTP client for API calls
- **dotenv**: Environment variable management
- **bootstrap**: CSS framework

## License

ISC License
