"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unit = exports.font = exports.color = void 0;
const zic_node_ui_1 = require("zic_node_ui");
const config_1 = require("./config");
const baseColor = {
    background: (0, zic_node_ui_1.rgb)('#21252b'),
    foreground: (0, zic_node_ui_1.rgb)('#2b2c2e'),
    primary: (0, zic_node_ui_1.rgb)('#0d6efd'),
    white: { r: 255, g: 255, b: 255 },
    info: { r: 150, g: 150, b: 150 },
    secondaryInfo: { r: 100, g: 100, b: 100 },
    selected: { r: 150, g: 150, b: 150 },
    secondarySelected: { r: 100, g: 100, b: 100 },
};
exports.color = {
    ...baseColor,
    sequencer: {
        selected: baseColor.selected,
        playing: (0, zic_node_ui_1.rgb)('#42454A'),
        pattern: {
            playing: (0, zic_node_ui_1.rgb)('#595f6b'),
            waiting: (0, zic_node_ui_1.rgb)('#3f444e'),
        },
        info: baseColor.info,
    },
    tracks: [
        (0, zic_node_ui_1.rgb)('#0d6efd'),
        (0, zic_node_ui_1.rgb)('#198754'),
        (0, zic_node_ui_1.rgb)('#dc3545'),
        (0, zic_node_ui_1.rgb)('#ffc107'),
        (0, zic_node_ui_1.rgb)('#d63384'),
        (0, zic_node_ui_1.rgb)('#6f42c1'),
        (0, zic_node_ui_1.rgb)('#6610f2'),
        (0, zic_node_ui_1.rgb)('#0dcaf0'),
        (0, zic_node_ui_1.rgb)('#20c997'),
        (0, zic_node_ui_1.rgb)('#fd7e14'),
        (0, zic_node_ui_1.rgb)('#6c757d'),
    ],
};
exports.font = {
    // bold: '/usr/share/fonts/truetype/padauk/Padauk-Bold.ttf',
    // regular: '/usr/share/fonts/truetype/padauk/Padauk-Regular.ttf',
    // bold: '/usr/share/fonts/truetype/freefont/FreeSansBold.ttf',
    // regular: '/usr/share/fonts/truetype/freefont/FreeSans.ttf',
    bold: '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
    regular: '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
};
exports.unit = {
    margin: 1,
    height: 25,
    halfScreen: config_1.config.screen.size.w * 0.5,
    quarterScreen: config_1.config.screen.size.w * 0.25,
};
