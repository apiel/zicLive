var size = 4;
var pos = 0;
var editMode = false;

function renderer() {
    CONFIG.sort(function (a, b) {
        return a[1] - b[1];
    });

    useColor(1, 2, COLOR_LIGHT);
    useColor(2, 2, COLOR_LIGHT);
    useColor(3, 2, COLOR_LIGHT);
    useColor(4, 2, COLOR_LIGHT);

    useColor(1, 3, COLOR_DARK, 6);
    useColor(2, 3, COLOR_DARK, 5);
    useColor(3, 3, COLOR_DARK, 7);
    useColor(4, 3, COLOR_DARK, 7);

    var hilight = editMode ? COLOR_CURSOR : COLOR_HILIGHT;
    useColor(1, 0, pos === 0 ? hilight : COLOR_HIDE);
    useColor(2, 0, pos === 1 ? hilight : COLOR_HIDE);
    useColor(3, 0, pos === 2 ? hilight : COLOR_HIDE);
    useColor(4, 0, pos === 3 ? hilight : COLOR_HIDE);

    // log('hello:' + JSON.stringify(CONFIG));

    render(
        'Envelop:\n* Attack:  ' +
            Math.pow(CONFIG[6][2], 2) +
            ' ms\n* Decay:   ' +
            CONFIG[7][2] * 10 +
            ' ms\n* Sustain: ' +
            Math.round((CONFIG[8][2] / 127) * 100) +
            '%\n* Release: ' +
            Math.pow(CONFIG[9][2], 2) +
            ' ms'
    );
}

function update(keys) {
    // log(JSON.stringify(keys));
    editMode = false;
    if (keys.Edit) {
        editMode = true;
        if (keys.Up) {
            CONFIG[pos+6][2] = Math.min(CONFIG[pos+6][2] + 5, 127);
            updateConfigCC(CONFIG[pos+6][1], CONFIG[pos+6][2]);
        } else if (keys.Down) {
            CONFIG[pos+6][2] = Math.max(CONFIG[pos+6][2] - 5, 0);
            updateConfigCC(CONFIG[pos+6][1], CONFIG[pos+6][2]);
        } else if (keys.Right) {
            CONFIG[pos+6][2] =  Math.min(CONFIG[pos+6][2] + 1, 127);
            updateConfigCC(CONFIG[pos+6][1], CONFIG[pos+6][2]);
        } else if (keys.Left) {
            CONFIG[pos+6][2] = Math.max(CONFIG[pos+6][2] - 1, 0);
            updateConfigCC(CONFIG[pos+6][1], CONFIG[pos+6][2]);
        }
    } else if (keys.Down) {
        pos = (pos + 1) % size;
    } else if (keys.Up) {
        pos = (pos - 1 + size) % size;
    }

    return VIEW_CHANGED;
}
