import { drawText } from 'zic_node_ui';
import { config } from '../config';
import { color, font } from '../style';

export const graphRect = { position: { x: 10, y: 10 }, size: { w: config.screen.size.w - 20, h: 70 } };

export const drawPatchTitle = (title: string) =>
    drawText(title, { x: 30, y: 10 }, { size: 64, color: color.foreground3, font: font.regular });

export const drawSubTitle = (title: string) =>
    drawText(title, { x: 300, y: 10 }, { size: 14, color: color.info, font: font.bold });
