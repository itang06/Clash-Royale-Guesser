import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from './config.js';

dotenv.config();

// API functions
export async function fetchClashRoyaleCard() {
  try {
    const result = await axios.get("https://proxy.royaleapi.dev/v1/cards", {
      headers: {
        Authorization: `Bearer ${process.env.CR_API_KEY}`
      }
    });
    const randomNumber = Math.floor(Math.random() * result.data.items.length);
    return result.data.items[randomNumber];
  } catch (error) {
    console.error('Clash Royale API error:', error);
    return null;
  }
}


