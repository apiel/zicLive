import { getBpm, getMasterVolume, setBpm, setMasterVolume } from 'zic_node';
import { clear, Events } from 'zic_node_ui';
import { config } from '../config';
import { drawButton } from '../draw/drawButton';
import { drawField } from '../draw/drawField';
import { rowNext, rowReset } from '../draw/rowNext';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { color, unit } from '../style';
import { minmax } from '../util';

const col = config.screen.col;

export async function masterView() {
    cleanSelectableItems();
    clear(color.background);

    // There could come:
    //   - Master FX1 and FX2, those field might have more than 1 value
    //   - Master Filter? (or should it be part of master FX?)
    //   - Mixer?
    //   - Scatter?

    rowReset();
    drawField(`Volume`, Math.round(getMasterVolume() * 100).toString(), rowNext(1), {
        edit: (direction) => {
            const volume = minmax(getMasterVolume() + direction, 0, 1);
            setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(
        `BPM`,
        getBpm().toString(),
        rowNext(2),
        {
            edit: (direction) => {
                setBpm(minmax(getBpm() + direction, 10, 250));
            },
        },
        {
            col,
        },
    );

    drawField(`Project id`, `#000`, rowNext(1), {
        edit: (direction) => {
            console.log('change project', direction);
        },
    });
    drawField(
        `Name`,
        `Tek23!`,
        rowNext(2),
        {
            edit: (direction) => {
                console.log('edit project name', direction);
            },
        },
        {
            col,
        },
    );

    drawButton('Save', rowNext(1), () => console.log('save project'));
    drawButton('Reload', rowNext(2), () => console.log('reload project'), { col });
}

export async function masterEventHandler(events: Events) {
    const editMode = await getEditMode(events);
    if (editMode.refreshScreen) {
        await masterView();
        return true;
    }
    if (editMode.edit) {
        const updated = await eventEdit(events);
        if (updated) {
            await masterView();
            return true;
        }
        return false;
    } else {
        const item = eventSelector(events, unit.height2);
        if (item) {
            // if (item.position.x < config.screen.size.w / 2) {
            //     if (item.position.y > config.screen.size.h - 50) {
            //         scrollY -= 50;
            //     } else if (item.position.y < 40 && scrollY < 0) {
            //         scrollY += 50;
            //     }
            // }
            await masterView();
            return true;
        }
    }
    return false;
}
