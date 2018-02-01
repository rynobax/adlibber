import { VoiceConnection } from 'discord.js';
import { ps } from 'pocketsphinx';

const modeldir = '../models';

var config = new ps.Decoder.defaultConfig();
config.setString("-hmm", modeldir + "en-us");
config.setString("-dict", modeldir + "cmudict-en-us.dict");
config.setString("-lm", modeldir + "en-us.lm.bin");
const decoder = new ps.Decoder(config);

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();
  decoder.startUtt();
  recv.on('opus', (user, buf) => {
    console.log(user.username);
    console.log(buf.length);
    decoder.processRaw(buf, false, false);
    const it = decoder.seg().iter();
    for(let seg of it) {
      console.log(seg.word, seg.startFrame, seg.endFrame);
    }
  })
}
