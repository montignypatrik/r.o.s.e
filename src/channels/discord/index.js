/**
 * R.O.S.E Discord Channel
 * Handles Discord text and voice interactions
 */

import { Client, GatewayIntentBits, Events } from 'discord.js';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  entersState
} from '@discordjs/voice';

let discordClient = null;
let roseCore = null;

export async function initializeDiscord(rose, claw) {
  roseCore = rose;

  discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.DirectMessages
    ]
  });

  // Handle ready event
  discordClient.once(Events.ClientReady, (client) => {
    console.log(`[DISCORD] ✓ Logged in as ${client.user.tag}`);
  });

  // Handle text messages
  discordClient.on(Events.MessageCreate, handleMessage);

  // Handle voice state updates
  discordClient.on(Events.VoiceStateUpdate, handleVoiceState);

  // Login to Discord
  if (process.env.DISCORD_BOT_TOKEN) {
    await discordClient.login(process.env.DISCORD_BOT_TOKEN);
  } else {
    console.warn('[DISCORD] No DISCORD_BOT_TOKEN set, Discord disabled');
  }

  return discordClient;
}

async function handleMessage(message) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if Rose is mentioned or it's a DM
  const isMentioned = message.mentions.has(discordClient.user);
  const isDM = !message.guild;
  const hasPrefix = message.content.toLowerCase().startsWith('rose,');

  if (!isMentioned && !isDM && !hasPrefix) return;

  // Clean the message content
  let content = message.content;
  if (hasPrefix) {
    content = content.substring(5).trim();
  } else if (isMentioned) {
    content = content.replace(/<@!?\d+>/g, '').trim();
  }

  if (!content) return;

  try {
    // Show typing indicator
    await message.channel.sendTyping();

    // Process through Rose
    const response = await roseCore.processMessage(
      { content },
      {
        type: 'discord',
        conversationId: `discord-${message.channel.id}`,
        userId: message.author.id,
        voiceEnabled: false
      }
    );

    // Send response (split if too long)
    if (response.content.length > 2000) {
      const chunks = splitMessage(response.content);
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } else {
      await message.reply(response.content);
    }

  } catch (error) {
    console.error('[DISCORD] Error processing message:', error);
    await message.reply('I apologize, Sir. I encountered an error processing your request.');
  }
}

async function handleVoiceState(oldState, newState) {
  // TODO: Implement voice channel joining/leaving logic
  // This will handle joining voice channels when invited
}

/**
 * Join a voice channel and start listening
 */
export async function joinVoice(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    console.log(`[DISCORD] ✓ Joined voice channel: ${channel.name}`);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

/**
 * Play audio in voice channel
 */
export async function playAudio(connection, audioBuffer) {
  const player = createAudioPlayer();
  const resource = createAudioResource(audioBuffer);

  connection.subscribe(player);
  player.play(resource);

  return new Promise((resolve, reject) => {
    player.on('idle', resolve);
    player.on('error', reject);
  });
}

function splitMessage(content, maxLength = 2000) {
  const chunks = [];
  while (content.length > maxLength) {
    let splitIndex = content.lastIndexOf('\n', maxLength);
    if (splitIndex === -1) splitIndex = maxLength;
    chunks.push(content.substring(0, splitIndex));
    content = content.substring(splitIndex);
  }
  if (content) chunks.push(content);
  return chunks;
}
