import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { getSoundPath } from "../utils/sounds-utils";
import { stateSoundSystems } from "..";
import { config } from "../config";
import { timeToEmoji } from "node-emoji-clock";

export const data = new SlashCommandBuilder()
  .setName("time")
  .setDescription("Get the time");

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    console.error("Error: Missing guildId in command interaction");
    return;
  }

  const member = interaction.member as GuildMember;
  if (!member) {
    console.error("Error: Missing member in command interaction");
    return;
  }

  if (!member.voice.channel) {
    interaction.reply("Rejoignez d'abord un salon vocal.");
    return;
  }

  const date = new Date();
  const hours = getHours(date);
  const minutes = getMinutes(date);

  interaction.reply({ content: getClockEmoji(hours, minutes), ephemeral: true });
  stateSoundSystems[interaction.guildId].play({
    channelId: member.voice.channel.id,
    sound: getSoundPath("it_is"),
  });
  stateSoundSystems[interaction.guildId].play({
    channelId: member.voice.channel.id,
    sound: getSoundPath(hours),
  });
  stateSoundSystems[interaction.guildId].play({
    channelId: member.voice.channel.id,
    sound: getSoundPath("hour"),
  });
  stateSoundSystems[interaction.guildId].play({
    channelId: member.voice.channel.id,
    sound: getSoundPath(minutes),
  });
  stateSoundSystems[interaction.guildId].play({
    channelId: member.voice.channel.id,
    sound: getSoundPath("minute"),
  });
}

function getHours(date: Date): string {
  return date
    .toLocaleString("fr-FR", {
      hour: "2-digit",
      hour12: false,
      timeZone: config.timezone,
    })
    .substring(0, 2);
}
function getMinutes(date: Date): string {
  return date.toLocaleString("fr-FR", {
    minute: "2-digit",
    timeZone: config.timezone,
  });
}

function getClockEmoji(hours: string, minutes: string): string {
  const d = new Date();
  d.setHours(parseInt(hours));
  d.setMinutes(parseInt(minutes));
  return timeToEmoji(d);
}
