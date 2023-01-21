import { getBpm, getMasterVolume, setBpm, setMasterVolume } from 'zic_node';
import { clear } from 'zic_node_ui';
import { drawButton, drawField } from '../draw';
import { eventEdit, eventSelector, getEditMode } from '../events';
import { cleanSelectableItems } from '../selector';
import { color } from '../style';
import { minmax } from '../util';
export async function masterView() {
    cleanSelectableItems();
    clear(color.background);
    // There could come:
    //   - Master FX1 and FX2, those field might have more than 1 value
    //   - Master Filter? (or should it be part of master FX?)
    //   - Mixer?
    //   - Scatter?
    let row = 0;
    drawField(`Volume`, Math.round(getMasterVolume() * 100).toString(), row, {
        edit: (direction) => {
            const volume = minmax(getMasterVolume() + direction, 0, 1);
            setMasterVolume(volume);
        },
        steps: [0.01, 0.1],
    });
    drawField(`BPM`, getBpm().toString(), row++, {
        edit: (direction) => {
            setBpm(minmax(getBpm() + direction, 10, 250));
        },
    }, {
        col: 2,
    });
    drawField(`Project id`, `#000`, row, {
        edit: (direction) => {
            console.log('change project', direction);
        },
    });
    drawField(`Name`, `Tek23!`, row++, {
        edit: (direction) => {
            console.log('edit project name', direction);
        },
    }, {
        col: 2,
    });
    drawButton('Save', row, () => console.log('save project'));
    drawButton('Reload', row++, () => console.log('reload project'), { col: 2 });
}
export async function masterEventHandler(events) {
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
    }
    else {
        const item = eventSelector(events);
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
