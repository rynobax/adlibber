import { VoiceConnection } from 'discord.js';
import { Duplex } from 'stream';
var ps = require('pocketsphinx').ps;
const convert = require('pcm-convert')

const modeldir = "model/en-us/"
var config = new ps.Decoder.defaultConfig();
config.setString("-hmm", modeldir + "en-us");
config.setString("-dict", modeldir + "cmudict-en-us.dict");
config.setString("-lm", modeldir + "en-us.lm.bin");
var decoder = new ps.Decoder(config);
//decoder.setKeyphrase('mysearch', 'hello');
//decoder.setSearch('mysearch');

export const onConnection = (con: VoiceConnection) => {
  console.log('connected');
  const recv = con.createReceiver();

  const pcmRecvs = {};
  recv.on('opus', (user, buf) => {
    const uid = user.id;
    if(!pcmRecvs[uid]) {
      const strm = recv.createPCMStream(user);
      pcmRecvs[uid] = strm;
      console.log('start');
      decoder.startUtt();

      strm.on('end', () => {
        console.log('finish');
        decoder.endUtt();
        pcmRecvs[uid] = null
        let it = decoder.seg().iter()
        let seg;
        while ((seg = it.next()) != null) {
          console.log(seg.word, seg.startFrame, seg.endFrame);
        }
        it = decoder.nbest().iter()
        console.log('nbest: ', decoder.nbest())
        let i, hyp;
        for (i = 0; i < 10 && ((hyp = it.next()) != null); i++) {
          console.log(hyp.hypstr)
        }
      });

      strm.on('data', data => {
        // src  32-bit signed stereo PCM at 48KHz.
        // dest single-channel (monaural), little-endian, unheadered 
        // 16-bit signed PCM audio file sampled at 16000 Hz.
        const convertedData = convert(data,
          'int32 le stereo',
          'int16 le mono'
        );
        decoder.processRaw(data, false, false);
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
