import { VoiceConnection } from 'discord.js';
const request = require('request');
const witToken = process.env.WIT_TOKEN;

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();

  const pcmRecvs = {};
  recv.on('opus', (user, buf) => {
    const uid = user.id;
    if(!pcmRecvs[uid]) {
      pcmRecvs[uid] = true;
      const strm = recv.createPCMStream(user);
      strm.pipe(request.post({
        'url'     : 'https://api.wit.ai/speech?v=20170307',
        'headers' : {
          'Accept'        : 'application/vnd.wit.20160202+json',
          'Authorization' : 'Bearer ' + witToken,
          'Content-Type'  : 'audio/raw;encoding=unsigned-integer;bits=32;rate=48000;endian=big',
          'Transfer-encoding'  : 'chunked'
        }
      }, (err, resp, body) => {
        if(err) {
          console.error(err);
        } else {
          console.log(body);
        }
      }))
    }
  })
}
