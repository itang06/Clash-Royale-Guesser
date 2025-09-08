import db from './database.js';

// game logic functions
export async function checkAnswer(req, guess, answer, username) {
  if (guess.toLowerCase().trim() === answer.toLowerCase()) {
    req.session.feedback = null;
    req.session.score += 1;
    
    const result = await db.query("SELECT * FROM users WHERE username=$1", [username]);
    const highscore = result.rows[0].highscore;
    
    if (req.session.score > highscore) {
      await db.query("UPDATE users SET highscore=$1 WHERE username=$2", [req.session.score, username]);
    }
  } else {
    req.session.score = 0;
    req.session.feedback = `Incorrect! The correct answer was ${answer}`;
  }
}

export async function getUserHighscore(username) {
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0].highscore;
  } catch (error) {
    console.error('Error getting user highscore:', error);
    return 0;
  }
}

export async function getLeaderboard(limit = 9) {
  try {
    const result = await db.query("SELECT username, highscore FROM users ORDER BY highscore DESC");
    return result.rows.slice(0, limit);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}


