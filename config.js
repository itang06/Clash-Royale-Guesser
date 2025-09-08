export const CONFIG = {
  PORT: process.env.PORT || 3000,
  SALT_ROUNDS: 10,
  SESSION_MAX_AGE: 1000 * 60 * 60 * 24, // 24 hours
  LEADERBOARD_LIMIT: 9,
  API_LIMITS: {
    POKEMON_MAX: 17000,
    BRAWL_STARS_MAX: 92,
    CLASH_ROYALE_MAX: 121
  }
};

