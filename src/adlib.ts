import { VoiceConnection } from 'discord.js';

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();
  recv.on('opus', (user, buf) => {
    console.log(user.username);
    console.log(buf.length);
  })
}
