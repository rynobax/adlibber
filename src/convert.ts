import { VoiceConnection } from 'discord.js';
const request = require('request');
const convert = require('pcm-convert');
const through2 = require('through2');

const witToken = process.env.WIT_TOKEN;

import { createTextHandler } from './adlib';

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();
  const textHandler = createTextHandler(con);

  const pcmRecvs = {};
  recv.on('opus', (user) => {
    const uid = user.id;
    if(!pcmRecvs[uid]) {
      pcmRecvs[uid] = true;
      const strm = recv.createPCMStream(user);
      strm.on('end', () => {
        delete pcmRecvs[uid];
      })
      strm
        .pipe(request.post({
          'url'     : 'https://api.wit.ai/speech?v=20170307',
          'headers' : {
            'Accept'        : 'application/vnd.wit.20160202+json',
            'Authorization' : 'Bearer ' + witToken,
            'Content-Type'  : 'audio/raw;encoding=signed-integer;bits=32;rate=48000;endian=little',
            'Transfer-encoding'  : 'chunked'
          }
        }, (err, resp, body) => {
          if(err) {
            console.error(err);
          } else {
            try {
              const { _text } = JSON.parse(body);
              if(_text) {
                textHandler.handleText(_text);
              }
            } catch(err) {
              console.error(err);
            }
          }
        }))
    }
  })
}
