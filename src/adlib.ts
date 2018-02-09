import { VoiceConnection } from 'discord.js';
import { random } from 'lodash';

const migos = ['quavo_migo.mp3'];

const phrases = {
    'seventeen thirty-eight': ['fetty_1738.mp3', 'fetty_yeahbaby'],
    'me guess': migos,
    'me go': migos,
    'me goes': migos,
    'oh god': ['bigsean_ohgod.mp3'],
    'true': ['2chainz_tru.mp3'],
    'twenty one': ['21savage_21.mp3'],
    'another one': ['khaled-anotherone.mp3'],
    'dj calling': ['djkhaled_2.mp3'],
    'gucci': ['gucci_1', 'gucci_4', 'gucci_9', 'gucci_14'],
    'metro blooming': ['metro_somemo'],
    'metro booming': ['metro_somemo'],
    'metro moving': ['metro_somemo'],
};

let playing = false;
export const createTextHandler = (con: VoiceConnection) => {
    const handleText = (text: string) => {
        console.log(text);
        const matches = Object.keys(phrases).filter(p => text.includes(p));
        console.log(matches);
        if(matches.length === 0) return;
        const keywordToUse = matches[random(0, matches.length - 1)];
        const possibleAdlibs = phrases[keywordToUse];
        const adlib = possibleAdlibs[random(0, possibleAdlibs.length - 1)];

        if(playing === false) {
            playing = true;
            console.log(`./audio/${adlib}`);
            con.playFile(`./audio/${adlib}`, {
                volume: .1,
            });
            setTimeout(() => {
                playing = false;
            }, 3000);
        }
    };
    return {
        handleText,
    };
};
