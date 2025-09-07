import axios from 'axios';
import dotenv from 'dotenv';
import { CONFIG } from './config.js';

dotenv.config();

// API functions
export async function fetchPokemonCard() {
  try {
    const randomNumber = Math.floor(Math.random() * CONFIG.API_LIMITS.POKEMON_MAX + 1);
    const result = await axios.get(`https://api.pokemontcg.io/v2/cards?page=${randomNumber}&pageSize=1`, {
      headers: {
        'X-Api-Key': process.env.API_KEY
      }
    });
    return result.data.data[0];
  } catch (error) {
    console.error('Pokemon API error:', error);
    return null;
  }
}

export async function fetchBrawlStarsCard() {
  try {
    const result = await axios.get("https://api.brawlstars.com/v1/brawlers", {
      headers: {
        Authorization: `Bearer ${process.env.BS_API_KEY}`
      }
    });
    return result.data.items[0];
  } catch (error) {
    console.error('Brawl Stars API error:', error);
    return null;
  }
}

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

