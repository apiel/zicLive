# Zic Live

Zic Live is a groovebox for small screen size like handled console or Raspberry PI. The synth engine and sequencer is written in C++. The UI is base on SDL2, using NodeJS TypeScript to generate it, making the implementation/customisation much easier than using C++. Since it is using SDL, the UI don't need X server to render. There is no mouse interraction for the UI, everything is handled with a keyboard (or rotary encoder).

![sequencer](https://github.com/apiel/zicTracker/blob/main/img/zicLive_sequencer.png?raw=true)
![pattern](https://github.com/apiel/zicTracker/blob/main/img/zicLive_pattern.png?raw=true)

There is different kinds of synth engine, a basic wavetable synth, a drum kick, a PureData engine and a Midi engine.

![kick23](https://github.com/apiel/zicTracker/blob/main/img/zicLive_kick23.png?raw=true)
