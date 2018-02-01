import { VoiceConnection } from 'discord.js';
import { Detector, Models } from 'snowboy';

const models = new Models();

models.add({
  file: 'snowboyModels/Hello.pmdl',
  sensitivity: '0.5',
  hotwords : 'hello'
});

const detector = new Detector({
  resource: "snowboyModels/common.res",
  models: models,
  audioGain: 2.0
});

detector.on('silence', function () {
  console.log('silence');
});

detector.on('sound', function (buffer) {
  buffer;
  // <buffer> contains the last chunk of the audio that triggers the "sound"
  // event. It could be written to a wav stream.
  console.log('sound');
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
});

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();
  recv.on('opus', (user, buf) => {
    detector.write(buf);
    user;
    buf;
  })
}
