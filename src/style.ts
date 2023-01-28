import { rgb } from 'zic_node_ui';
import { config } from './config';

const baseColor = {
    background: rgb('#21252b'),
    foreground: rgb('#2b2c2e'),
    header: rgb('#2f3645'),
    primary: rgb('#0d6efd'), // #3761a1
    white: { r: 255, g: 255, b: 255 },
    info: { r: 150, g: 150, b: 150 },
    secondaryInfo: { r: 100, g: 100, b: 100 },
    selected: { r: 150, g: 150, b: 150 },
    secondarySelected: { r: 100, g: 100, b: 100 },
    chart: rgb('#595f6b'),
};

export const color = {
    ...baseColor,
    sequencer: {
        selected: baseColor.selected,
        playing: rgb('#42454A'),
        pattern: {
            playing: baseColor.chart,
            waiting: rgb('#3f444e'),
        },
        info: baseColor.info,
    },
    tracks: [
        rgb('#0d6efd'),
        rgb('#198754'),
        rgb('#dc3545'),
        rgb('#ffc107'),
        rgb('#d63384'),
        rgb('#6f42c1'),
        rgb('#6610f2'),
        rgb('#0dcaf0'),
        rgb('#20c997'),
        rgb('#fd7e14'),
        rgb('#6c757d'),
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
    margin: 1,
    extraMargin: 5,
    height: 25,
    halfScreen: config.screen.size.w * 0.5,
    quarterScreen: config.screen.size.w * 0.25,
};
