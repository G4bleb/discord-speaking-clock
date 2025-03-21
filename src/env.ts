import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error(
    "Missing environment variables. Please copy the .env.placeholder file, rename it to .env and fill it out with your credentials",
  );
}

export const env = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};
