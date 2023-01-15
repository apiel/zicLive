import { rgb } from 'zic_node_ui';

export const color = {
    background: rgb('#21252b'),
    foreground: rgb('#2b2c2e'),
    white: { r: 255, g: 255, b: 255 },
    sequencer: {
        selected: { r: 150, g: 150, b: 150 },
        playing: rgb('#42454A'),
        pattern: {
            playing: rgb('#595f6b'),
            waiting: rgb('#3f444e'),
        },
        info: { r: 150, g: 150, b: 150 },
    },
    tracks: [
        rgb('#0d6efd'),
        rgb('#198754'),
        rgb('#dc3545'),
        rgb('#ffc107'),
        rgb('#6c757d'),
        rgb('#6f42c1'),
        rgb('#6610f2'),
        rgb('#0dcaf0'),
        rgb('#20c997'),
        rgb('#fd7e14'),
        rgb('#d63384'),
    ],
};

export const font = {
    // bold: '/usr/share/fonts/truetype/padauk/Padauk-Bold.ttf',
    // regular: '/usr/share/fonts/truetype/padauk/Padauk-Regular.ttf',

    // bold: '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
    // regular: '/usr/share/fonts/truetype/freefont/FreeSans.ttf',

    bold: '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
    regular: '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
};
