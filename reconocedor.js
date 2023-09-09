const QE = -1; // Estado de error

// Matriz de transición
const MT_MATRIX = {
  // ROBOT
  '0,ROBOT': 1,
  '1,ID': 2,
  '2,,': 1,
  '2,(': 3,
  '3,NUM': 4,
  '4,,': 5,
  '5,NUM': 6,
  '6,)': 2,
  // AVANZAR
  '0,AVANZAR': 7,
  '7,ID': 8,
  '8,,': 9,
  '9,NUM': 10,
  // GIRAR
  '0,GIRAR': 11,
  '11,ID': 12,
  '12,,': 13,
  '13,IZQ': 14,
  '13,DER': 14,
  // TELEPORT
  '0,TELEPORT': 15,
  '15,ID': 16,
  '16,(': 17,
  '17,NUM': 18,
  '18,,': 19,
  '19,NUM': 20,
  '20,)': 21,
};

const finalStates = {
  2: 'ROBOT',
  10: 'AVANZAR',
  14: 'GIRAR',
  21: 'TELEPORT',
};

// Funciones auxiliares
const scanner = (command) => {
  return command.match(/[a-zA-Z][a-zA-Z\d]*|\d+|[(),]/g);
};

const MT = (q, token) => {
  // PALABRAS RESERVADAS
  if (['ROBOT', 'AVANZAR', 'GIRAR', 'TELEPORT', 'IZQ', 'DER'].includes(token)) {
    return MT_MATRIX[`${q},${token}`] || QE;
  }
  // ID
  else if (/^[a-zA-Z][a-zA-Z\d]*$/.test(token)) {
    return MT_MATRIX[`${q},ID`] || QE;
  }
  // NUM
  else if (/^\d+$/.test(token)) {
    return MT_MATRIX[`${q},NUM`] || QE;
  }
  // OTROS
  else {
    return MT_MATRIX[`${q},${token}`] || QE;
  }
};

const getParameters = (tokens, commandType) => {
  switch (commandType) {
    case 'ROBOT':
      let params = {};
      let i = 1;
      while (i < tokens.length) {
        if (i + 1 < tokens.length && tokens[i + 1] === '(') {
          params[tokens[i]] = [
            parseInt(tokens[i + 2]),
            parseInt(tokens[i + 4]),
          ];
          i += 7;
        } else {
          params[tokens[i]] = null;
          i += 2;
        }
      }
      return params;

    case 'AVANZAR':
      return {
        id: tokens[1],
        pasos: parseInt(tokens[3]),
      };

    case 'GIRAR':
      return {
        id: tokens[1],
        direccion: tokens[3],
      };

    case 'TELEPORT':
      return {
        id: tokens[1],
        coords: [parseInt(tokens[3]), parseInt(tokens[5])],
      };

    default:
      return {};
  }
};

const evalCommand = (command) => {
  const tokens = scanner(command);
  let q = 0;
  let i = 0;

  // console.log('Tokens:', tokens);

  while (i < tokens.length && q !== QE) {
    q = MT(q, tokens[i]);
    i++;
  }

  if (q in finalStates) {
    return {
      commandType: finalStates[q],
      parameters: getParameters(tokens, finalStates[q]),
      };
  } else {
    return null;
  }
};

export { evalCommand };
