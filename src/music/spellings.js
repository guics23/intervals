// Major keys, ordered by cycle of fourths starting from C.
// Auto-progression follows this order: every 10 successful rounds, advance.
export const KEYS = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'];

// For each major key, every degree label maps to its spelled note name.
// Labels: 1, b2, 2, b3, 3, 4, #4, b5, 5, b6, 6, b7, 7.
// #4 and b5 share a pitch class but render differently per key.
// Where strict spelling would require a double-accidental (e.g., Bbb in Eb major),
// the enharmonic natural is used instead.
export const SPELLINGS = {
  C:  { '1':'C',  'b2':'Db', '2':'D',  'b3':'Eb', '3':'E',  '4':'F',  '#4':'F#', 'b5':'Gb', '5':'G',  'b6':'Ab', '6':'A',  'b7':'Bb', '7':'B'  },
  F:  { '1':'F',  'b2':'Gb', '2':'G',  'b3':'Ab', '3':'A',  '4':'Bb', '#4':'B',  'b5':'Cb', '5':'C',  'b6':'Db', '6':'D',  'b7':'Eb', '7':'E'  },
  Bb: { '1':'Bb', 'b2':'Cb', '2':'C',  'b3':'Db', '3':'D',  '4':'Eb', '#4':'E',  'b5':'Fb', '5':'F',  'b6':'Gb', '6':'G',  'b7':'Ab', '7':'A'  },
  Eb: { '1':'Eb', 'b2':'Fb', '2':'F',  'b3':'Gb', '3':'G',  '4':'Ab', '#4':'A',  'b5':'A',  '5':'Bb', 'b6':'Cb', '6':'C',  'b7':'Db', '7':'D'  },
  Ab: { '1':'Ab', 'b2':'A',  '2':'Bb', 'b3':'Cb', '3':'C',  '4':'Db', '#4':'D',  'b5':'D',  '5':'Eb', 'b6':'Fb', '6':'F',  'b7':'Gb', '7':'G'  },
  Db: { '1':'Db', 'b2':'D',  '2':'Eb', 'b3':'Fb', '3':'F',  '4':'Gb', '#4':'G',  'b5':'G',  '5':'Ab', 'b6':'A',  '6':'Bb', 'b7':'Cb', '7':'C'  },
  Gb: { '1':'Gb', 'b2':'G',  '2':'Ab', 'b3':'A',  '3':'Bb', '4':'Cb', '#4':'C',  'b5':'C',  '5':'Db', 'b6':'D',  '6':'Eb', 'b7':'Fb', '7':'F'  },
  B:  { '1':'B',  'b2':'C',  '2':'C#', 'b3':'D',  '3':'D#', '4':'E',  '#4':'E#', 'b5':'F',  '5':'F#', 'b6':'G',  '6':'G#', 'b7':'A',  '7':'A#' },
  E:  { '1':'E',  'b2':'F',  '2':'F#', 'b3':'G',  '3':'G#', '4':'A',  '#4':'A#', 'b5':'Bb', '5':'B',  'b6':'C',  '6':'C#', 'b7':'D',  '7':'D#' },
  A:  { '1':'A',  'b2':'Bb', '2':'B',  'b3':'C',  '3':'C#', '4':'D',  '#4':'D#', 'b5':'Eb', '5':'E',  'b6':'F',  '6':'F#', 'b7':'G',  '7':'G#' },
  D:  { '1':'D',  'b2':'Eb', '2':'E',  'b3':'F',  '3':'F#', '4':'G',  '#4':'G#', 'b5':'Ab', '5':'A',  'b6':'Bb', '6':'B',  'b7':'C',  '7':'C#' },
  G:  { '1':'G',  'b2':'Ab', '2':'A',  'b3':'Bb', '3':'B',  '4':'C',  '#4':'C#', 'b5':'Db', '5':'D',  'b6':'Eb', '6':'E',  'b7':'F',  '7':'F#' },
};
