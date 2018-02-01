import { VoiceConnection } from 'discord.js';
import { Detector, Models } from 'snowboy';
import { WriteStream } from 'fs';
const pcm = require('pcm-util');
var wav = require('wav');

const models = new Models();

models.add({
  file: 'snowboyModels/Hello.pmdl',
  sensitivity: '0.1',
  hotwords : 'hello'
});

models.add({
  file: 'snowboyModels/snowboy.umdl',
  sensitivity: '0.9',
  hotwords : 'snowboy'
});

const detector: WriteStream = new Detector({
  resource: "snowboyModels/common.res",
  models: models,
  audioGain: 2.0,
});

detector.on('silence', function () {
  // console.log('silence');
});

detector.on('sound', function (buffer) {
  buffer;
  // <buffer> contains the last chunk of the audio that triggers the "sound"
  // event. It could be written to a wav stream.
  // console.log('sound');
});

detector.on('error', function () {
  console.log('error');
});

detector.on('hotword', function (index, hotword, buffer) {
  // <buffer> contains the last chunk of the audio that triggers the "hotword"
  // event. It could be written to a wav stream. You will have to use it
  // together with the <buffer> in the "sound" event if you want to get audio
  // data after the hotword.
  console.log(buffer);
  console.log('hotword', index, hotword);
  process.exit();
});

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();

  const pcmRecvs = {};
  recv.on('opus', (user, buf) => {
    const uid = user.id;
    if(!pcmRecvs[uid]) {
      var writer: WriteStream = new wav.FileWriter('output.wav');
      const strm = recv.createPCMStream(user);
      pcmRecvs[uid] = strm;
      console.log('start');
      strm.on('end', () => {
        console.log('finish');
        pcmRecvs[uid] = null
        writer.end();
      });
      con.playStream(strm);
      strm.on('data', data => {
        writer.write(data);
        detector.write(data);
      });
      return;
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
