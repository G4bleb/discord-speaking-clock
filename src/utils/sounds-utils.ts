import fspromises from "node:fs/promises";
import fs from "node:fs";
import { join as pathJoin } from "node:path";

export const SOUNDS_DIRECTORY = pathJoin(process.cwd(), "assets", "sounds");
export var soundMap: { [name: string]: string } = {};

export async function buildSoundMap() {
  const dir = await fspromises.readdir(SOUNDS_DIRECTORY);
  const newSoundMap: typeof soundMap = {};

  let count = 0;
  for (const filename of dir) {
    const name = filename.split(".")[0];
    newSoundMap[name] = filename;
    count++;
  }
  console.log("Built sound map, size =", count);
  soundMap = newSoundMap;
}

export function getSoundPath(soundName: string) {
  if (!(soundName in soundMap)) {
    throw new Error(`Sound "${soundName}" not in soundMap`);
  }
  return pathJoin(SOUNDS_DIRECTORY, soundMap[soundName]);
}
