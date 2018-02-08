import { VoiceConnection } from 'discord.js';
const request = require('request');
console.log(request);
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
          'Content-Type'  : 'audio/wav',
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
    /*
    let newBuf;
    const len = buf.length;
    if(len % 2 === 1) {
      newBuf = buf.slice(0, len-1);
    } else {
      newBuf = buf;
    }
    */
    // console.log(newBuf.length);
    // chunker.write(buf);
    
    user;
    buf;
  })
}
