export const CONFIG = {
  PORT: process.env.PORT || 3000,
  SALT_ROUNDS: 10,
  SESSION_MAX_AGE: 1000 * 60 * 60 * 24, // 24 hours
  LEADERBOARD_LIMIT: 9
};

