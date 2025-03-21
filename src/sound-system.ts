import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  VoiceConnection,
} from "@discordjs/voice";
import { Guild } from "discord.js";

interface SoundSystemItem {
  channelId: string;
  sound: string;
}

class Queue<Type> {
  private data: Type[];

  constructor() {
    this.data = [];
  }
  enqueue(item: Type): void {
    this.data.push(item);
  }
  dequeue(): Type | undefined {
    return this.data.shift();
  }
  peek(): Type | undefined {
    return this.data[0];
  }
  isEmpty(): boolean {
    return !this.data.length;
  }
}

export class SoundSystem {
  private readonly player: AudioPlayer;
  private readonly guild: Guild;
  private queue: Queue<SoundSystemItem>;
  private connection: VoiceConnection | null;
  private playing: boolean;

  constructor(guild: Guild) {
    this.guild = guild;
    this.queue = new Queue<SoundSystemItem>();
    this.player = createAudioPlayer();
    this.connection = null;
    this.playing = false;
  }

  play(item: SoundSystemItem) {
    this.queue.enqueue(item);
    this.check();
  }

  private check() {
    if (this.queue.isEmpty() && this.connection) {
      this.connection.destroy();
      this.connection = null;
      return;
    }
    if (!this.queue.isEmpty() && !this.connection) {
      this.connection = joinVoiceChannel({
        adapterCreator: this.guild
          .voiceAdapterCreator as DiscordGatewayAdapterCreator,
        channelId: this.queue.peek()!.channelId,
        guildId: this.guild.id,
      });
      this.connection.subscribe(this.player);

      const resource = createAudioResource(this.queue.peek()!.sound);
      this.playResourceAddListener(resource);
    }
    if (!this.queue.isEmpty() && this.connection) {
      if (!this.playing) {
        const resource = createAudioResource(this.queue.peek()!.sound);
        this.playResourceAddListener(resource);
      }
    }
  }

  private playResourceAddListener(resource: AudioResource) {
    this.player.once(AudioPlayerStatus.Idle, () => {
      this.queue.dequeue();
      this.playing = false;
      this.check();
    });
    this.player.play(resource);
    this.playing = true;
  }
}
