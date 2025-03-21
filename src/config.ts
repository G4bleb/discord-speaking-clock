import { join as pathJoin } from "node:path";
import fspromises from "node:fs/promises";

const CONFIG_JSON_PATH = pathJoin(process.cwd(), "config", "config.json");

export interface Config {
  activityName: string;
  timezone: string;
  locale: string;
  maximumFileSize: number;
}

export const config = require(CONFIG_JSON_PATH) as Config;

export function setTimezone(newTimezone: string) {
  config.timezone = newTimezone;
  saveConfigJson();
}

async function saveConfigJson() {
  console.log(`Saving config.json`);
  await fspromises.writeFile(CONFIG_JSON_PATH, JSON.stringify(config, null, 2));
  console.log(`Saved config.json`);
}
