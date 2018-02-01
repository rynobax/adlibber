import { VoiceConnection } from 'discord.js';
process.chdir('./lib');
require('../lib/pocketsphinx');
var PS;
setInterval(() => console.log('p', PS), 1000);


export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();
  recv.on('opus', (user, buf) => {
    console.log(user.username);
    console.log(buf.length);
  })
}
