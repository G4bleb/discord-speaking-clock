import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Guild,
} from "discord.js";

import { env } from "./env";
import { config } from "./config";
import { deployGlobalCommands } from "./deploy-commands";
import { commands } from "./commands";
import { buildSoundMap } from "./utils/sounds-utils";
import { SoundSystem } from "./sound-system";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, async () => {
  client.user!.setActivity({
    type: ActivityType.Watching,
    name: config.activityName,
  });
  await buildSoundMap();
  await deployGlobalCommands();
  await setupGuildsOnce();
  console.log("Discord bot is ready! 🤖");
});

export const stateSoundSystems: Record<string, SoundSystem> = {};

client.on(Events.GuildCreate, async (guild) => {
  console.log("Joined a new guild: " + guild.name);
  stateSoundSystems[guild.id] = new SoundSystem(guild);
});

client.on(Events.GuildDelete, async (guild) => {
  console.log("Quit a guild: " + guild.name);
  delete stateSoundSystems[guild.id];
});

async function setupGuildsOnce() {
  for (const [_, guild] of client.guilds.cache) {
    stateSoundSystems[guild.id] = new SoundSystem(guild);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const { commandName } = interaction;
  const typedCommandName = commandName as keyof typeof commands;
  if (commands[typedCommandName]) {
    commands[typedCommandName].execute(interaction);
  }
});

client.login(env.DISCORD_TOKEN);
