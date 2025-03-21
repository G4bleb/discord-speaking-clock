import { REST, Routes } from "discord.js";
import { env } from "./env";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

// This is instant
export async function deployGuildCommands(guildId: string) {
  try {
    console.log("Started deploying guild (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      },
    );

    console.log("Successfully deployed guild (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

// This is instant
export async function clearGuildCommands(guildId: string) {
  try {
    console.log("Started clearing guild (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId),
      {
        body: [],
      },
    );

    console.log("Successfully cleaned guild (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

// Careful: this can take some time
export async function deployGlobalCommands() {
  try {
    console.log("Started deploying application (/) commands.");

    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
      body: commandsData,
    });

    console.log("Successfully deployed application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

// Careful: this can take some time
export async function clearGlobalCommands() {
  try {
    console.log("Started clearing application (/) commands.");

    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
      body: [],
    });

    console.log("Successfully cleaned application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
