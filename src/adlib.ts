import { VoiceConnection } from 'discord.js';
import { ps } from 'pocketsphinx';

const modeldir = 'model/en-us/';

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
    user;
    buf;
    decoder.processRaw(buf, false, false);
    const it = decoder.seg().iter();
    const h = decoder.nbest().iter();
    console.log(decoder);
    console.log(it);
    console.log(h);
    let seg;
    while ((seg = it.next()) != null) {
        console.log(seg.word, seg.startFrame, seg.endFrame);
    }
    let i;
    let hyp;
    for (i = 0; i < 10 && ((hyp = h.next()) != null); i++) {
      console.log(hyp.hypstr)
    }
    console.log('');
    /*
    for(let seg of it) {
      console.log(seg.word, seg.startFrame, seg.endFrame);
    }
    */
    /*
    for(let hyp of decoder.nbest().iter()) {
	    console.log(hyp.hypstr)
    }
    */
  })
}
