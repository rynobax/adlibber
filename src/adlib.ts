import { VoiceConnection } from 'discord.js';
// import { ps } from 'pocketsphinx';
// import Sonus from 'sonus';
const Sonus = require('sonus');
const hotwords = [
  { file: 'models/Hello.pmdl', hotword: 'hello' }
];
const language = 'en-US';
var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.on('error', () => console.log('error'));
eventEmitter.on('final-result', () => console.log('final-result'));
eventEmitter.on('partial-result', () => console.log('partial-result'));
eventEmitter.on('hotword', () => console.log('hotword'));
eventEmitter.on('silence', () => console.log('silence'));
eventEmitter.on('sound', () => console.log('sound'));
eventEmitter.on('error', () => console.log('error'));
const sonus = Sonus.init({ hotwords, language, recordProgram: 'arecord' }, eventEmitter)

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();
  recv.on('opus', (user, buf) => {
    console.log(user.username);
    console.log(buf.length);
  })
}
