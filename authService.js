import db from './database.js';
import bcrypt from 'bcrypt';
import { CONFIG } from './config.js';

// authentication functions
export async function createUser(username, password) {
  try {
    // check if user already exists
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    
    if (result.rows.length > 0) {
      throw new Error('Username already registered.');
    }

    // hash password and create user
    const hash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS);
    await db.query("INSERT INTO users (username, password, highscore) VALUES ($1, $2, 0)", [username, hash]);
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function findUserByUsername(username) {
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

export async function verifyPassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

