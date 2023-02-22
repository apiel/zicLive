# Zic Live

Zic Live is a groovebox for small screen size like handled console or Raspberry PI. The synth engine and sequencer is written in C++. The UI is base on [SDL2](https://www.libsdl.org/), using NodeJS TypeScript to generate it, making the implementation/customisation much easier than using C++. Since it is using SDL, the UI don't need X server to render. There is no mouse interraction for the UI, everything is handled with a keyboard (or rotary encoder).

![sequencer](https://github.com/apiel/zicLive/blob/main/img/zicLive_sequencer.png?raw=true)
![pattern](https://github.com/apiel/zicLive/blob/main/img/zicLive_pattern.png?raw=true)

There is different kinds of track: 1 drum kick, 3 basic wavetable synth, and 4 Midi track.

![kick23](https://github.com/apiel/zicLive/blob/main/img/zicLive_kick23.png?raw=true)

# Installation

```sh
sudo apt-get install libsdl2-ttf-dev libsdl2-ttf-2.0-0 libsdl2-dev

# TODO #15 fix recursive git repo
# TODO add nodejs addon in repo and update package.json
git clone --recursive https://github.com/apiel/zicLive.git
cd zicLive
npm install
npm start
```

# Ressources

- [ZicNode](https://github.com/apiel/zicNode) C++ NodeJs addon for the synth engine and sequencer.
- [ZicNodeUI](https://github.com/apiel/zicNodeUI) C++ NodeJs addon for SDL2 user interface.
