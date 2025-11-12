import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from './config.js';

dotenv.config();

// API functions
export async function fetchClashRoyaleCard() {
  try {
    const randomNumber = Math.floor(Math.random() * CONFIG.API_LIMITS.CLASH_ROYALE_MAX);
    const result = await axios.get("https://api.clashroyale.com/v1/cards", {
      headers: {
        Authorization: `Bearer ${process.env.CR_API_KEY}`
      }
    });
    return result.data.items[randomNumber];
  } catch (error) {
    console.error('Clash Royale API error:', error);
    return null;
  }
}


