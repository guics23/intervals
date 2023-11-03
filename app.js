
const minNote = 36;
const maxNote = 90;

const noteNames = ['C', ['C#', 'Db'], 'D', ['D#', 'Eb'], 'E', 'F', ['F#', 'Gb'], 'G', ['G#', 'Ab'], 'A', ['A#', 'Bb'], 'B'];

function getRandomNumber(lower, upper) {
    return lower + Math.floor(Math.random() * (upper - lower));
}

export function getIntervalName(note1, note2) {
    const interval = Math.abs(note1 - note2);
    switch (interval) {
        case 0: return 'U1';
        case 1: return 'm2';
        case 2: return 'M2';
        case 3: return 'm3';
        case 4: return 'M3';
        case 5: return 'P4';
        case 6: return '3T';
        case 7: return 'P5';
        case 8: return 'm6';
        case 9: return 'M6';
        case 10: return 'm7';
        case 11: return 'M7';
        case 12: return 'P8';
    }
}


export function getNoteName(number) {
    while (number > minNote + 12) {
        number = number - 12;
    }
    const index = number % 12;
    return noteNames[index];
}


function hasSharps(list) {
    return list.some(el => isSharp(el));
}

function hasFlats(list) {
    return list.some(el => isFlat(el));
}

function isFlat(name) {
    return name.charAt(1) === 'b';
}

function isSharp(name) {
    return name.charAt(1) === '#';
}

function preferSharp(options) {
    return options.find(name => isSharp(name));
}

function preferFlat(options) {
    return options.find(name => isFlat(name));
}

export function getRandomNotes(qty) {
    const notes = [getRandomNumber(minNote, maxNote - 20)];
    for (let i = 0; i < qty - 1; i++) {
        let note;
        do {
            note = getRandomNumber(notes[0] + 1, notes[0] + 20);
        } while (notes.includes(note));
        notes.push(note);
    }
    return notes;
}