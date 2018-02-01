require('dotenv').config()
// https://discordapp.com/oauth2/authorize?client_id=CLIENT_ID_HERE&scope=bot&permissions=35652608
import { Client } from 'discord.js';
import { onConnection } from './adlib';
const client = new Client();
const { BOT_TOKEN } = process.env;
console.log('BOT_TOKEN: ', BOT_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!MIGOS' || true) {
    if (!msg.guild) return;
    const voiceChannel = msg.member.voiceChannel;
    if(!voiceChannel) return;
    voiceChannel.join()
      .then(onConnection);
  }
});

client.login(BOT_TOKEN);
