import { VoiceConnection } from 'discord.js';
import { Detector, Models } from 'snowboy';

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();
  recv.on('opus', (user, buf) => {
    user;
    buf;
  })
}
