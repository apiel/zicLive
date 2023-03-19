import { rgb } from 'zic_node_ui';
import { config } from './config';

const baseColor = {
    background: rgb('#21252b'),
    foreground: rgb('#2b2c2e'),
    foreground2: rgb('#383a3d'),
    foreground3: rgb('#42454A'),
    header: rgb('#2f3645'),
    primary: rgb('#0d6efd'), // #3761a1
    white: { r: 255, g: 255, b: 255 },
    // lightgrey: { r: 200, g: 200, b: 200 },
    info: { r: 150, g: 150, b: 150 },
    secondaryInfo: { r: 100, g: 100, b: 100 },
    selected: { r: 150, g: 150, b: 150 },
    secondarySelected: { r: 100, g: 100, b: 100 },
    chart: rgb('#595f6b'),
    separator: { r: 70, g: 70, b: 70 },
};

export const color = {
    ...baseColor,
    sequencer: {
        selected: baseColor.selected,
        playing: baseColor.foreground3,
        pattern: {
            step: rgb('#595f6b'),
            currentStep: rgb('#ffffff'),
        },
        info: baseColor.info,
    },
    tracks: [
        { color: rgb('#33bdff'), padColor: 78 },
        { color: rgb('#d5198a'), padColor: 95 },
        { color: rgb('#e0e310'), padColor: 96 },
        { color: rgb('#7ce793'), padColor: 73 },
        { color: rgb('#f7980a'), padColor: 84 },
        { color: rgb('#e12310'), padColor: 5 },
        { color: rgb('#5b2cb5'), padColor: 50 },
        { color: rgb('#23afaf'), padColor: 102 },
        { color: rgb('#ffb6b6'), padColor: 4 },
        { color: rgb('#5bfff7'), padColor: 32 },
    ],
    message: [rgb('#666666'), rgb('#198754'), rgb('#dc3545')],
};

export const font = {
    // bold: '/usr/share/fonts/truetype/padauk/Padauk-Bold.ttf',
    // regular: '/usr/share/fonts/truetype/padauk/Padauk-Regular.ttf',

    // bold: '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
    // regular: '/usr/share/fonts/truetype/freefont/FreeSans.ttf',

    bold: '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
    regular: '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
};

export const unit = {
    margin: 2,
    extraMargin: 5,
    height: 25,
    height2: 50,
    halfScreen: config.screen.size.w * 0.5,
    thirdScreen: config.screen.size.w / 3,
    quarterScreen: config.screen.size.w * 0.25,
};
