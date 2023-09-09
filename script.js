import { evalCommand } from './reconocedor.js';

class Robot {
  constructor(tablero, id, x, y, orientacion = 'norte') {
    this.tablero = tablero;
    this.id = id;
    this.x = x;
    this.y = y;
    this.orientacion = orientacion;
  }

  get urlImagen() {
    return `https://robohash.org/${this.id}`;
  }

  getRotationDegree() {
    switch (this.orientacion) {
      case 'norte':
        return '0deg';
      case 'este':
        return '90deg';
      case 'sur':
        return '180deg';
      case 'oeste':
        return '270deg';
      default:
        return '0deg';
    }
  }

  avanzar(pasos) {
    let nuevoX = this.x;
    let nuevoY = this.y;

    switch (this.orientacion) {
      case 'norte':
        nuevoX -= pasos;
        break;
      case 'sur':
        nuevoX += pasos;
        break;
      case 'este':
        nuevoY += pasos;
        break;
      case 'oeste':
        nuevoY -= pasos;
        break;
    }

    if (this.tablero.puedeMoverA(nuevoX, nuevoY)) {
      this.tablero.matrizTablero[this.x][this.y] = null; // Elimina el robot de la posición anterior
      this.x = nuevoX;
      this.y = nuevoY;
      this.tablero.matrizTablero[this.x][this.y] = this; // Coloca el robot en la nueva posición
    }
    this.tablero.renderizar();
  }

  girar(direccion) {
    const orientaciones = ['norte', 'este', 'sur', 'oeste'];
    let indiceActual = orientaciones.indexOf(this.orientacion);

    if (direccion === 'DER') {
      indiceActual = (indiceActual + 1) % 4;
    } else if (direccion === 'IZQ') {
      indiceActual = (indiceActual - 1 + 4) % 4;
    }

    this.orientacion = orientaciones[indiceActual];
    this.tablero.renderizar();
  }

  teletransportar(nuevoX, nuevoY) {
    if (this.tablero.puedeMoverA(nuevoX, nuevoY)) {
      this.tablero.matrizTablero[this.x][this.y] = null; // Elimina el robot de la posición anterior
      this.x = nuevoX;
      this.y = nuevoY;
      this.tablero.matrizTablero[this.x][this.y] = this; // Coloca el robot en la nueva posición
    }
    this.tablero.renderizar();
  }
}

class Tablero {
  constructor(filas, columnas) {
    this.filas = filas;
    this.columnas = columnas;
    this.matrizTablero = this.crearMatrizVacia();
    this.robots = []; // Almacena los robots en el tablero
  }

  crearMatrizVacia() {
    return Array(this.filas)
      .fill(null)
      .map((fila) => Array(this.columnas).fill(null));
  }

  agregarRobot(id, x = 0, y = 0) {
    if (this.puedeMoverA(x, y)) {
      const robot = new Robot(this, id, x, y);
      this.robots.push(robot);
      this.matrizTablero[robot.x][robot.y] = robot;
      this.renderizar();
      return robot;
    } else {
      console.log('No se puede agregar el robot en la posición indicada');
      return null;
    }
  }

  encontrarRobotPorId(id) {
    return this.robots.find((robot) => robot.id === id);
  }

  puedeMoverA(x, y) {
    if (x >= 0 && x < this.filas && y >= 0 && y < this.columnas) {
      if (!this.matrizTablero[x][y]) {
        return true;
      } else {
        // Si hay un robot en la posición, lo eliminamos
        const idRobot = this.matrizTablero[x][y];
        delete this.robots[idRobot];
        return true;
      }
    }
    return false;
  }

  // Genera el tablero visualmente en el DOM
  renderizar() {
    const tabla = document.getElementById('tablero');
    tabla.innerHTML = ''; // Limpia el tablero previo

    for (let i = 0; i < this.filas; i++) {
      const fila = document.createElement('tr');
      for (let j = 0; j < this.columnas; j++) {
        const celda = document.createElement('td');
        const robot = this.matrizTablero[i][j];
        if (robot) {
          let img = document.createElement('img');
          img.src = robot.urlImagen;
          img.style.transform = `rotate(${robot.getRotationDegree()})`; // Aplica la rotación
          celda.appendChild(img);
        }
        fila.appendChild(celda);
      }
      tabla.appendChild(fila);
    }
  }

  createRobot(parameters) {
    for (let id in parameters) {
      if (parameters[id]) {
        // Si tiene coordenadas
        // Colocar robot con ID 'id' en las coordenadas 'parameters[id]' en el tablero
        this.agregarRobot(id, parameters[id][0], parameters[id][1]);
      } else {
        // Colocar robot con ID 'id' en una posición por defecto o la siguiente disponible
        this.agregarRobot(id);
      }
    }
  }

  moveRobot(parameters) {
    const robotId = parameters.id;
    const pasos = parameters.pasos;
    this.encontrarRobotPorId(robotId).avanzar(pasos);
  }

  rotateRobot(parameters) {
    const robotId = parameters.id;
    const direccion = parameters.direccion;
    this.encontrarRobotPorId(robotId).girar(direccion);
  }

  teleportRobot(parameters) {
    const robotId = parameters.id;
    const coords = parameters.coords;
    this.encontrarRobotPorId(robotId).teletransportar(coords[0], coords[1]);
  }
}

function evalCommands(tablero) {
  // Obtiene el contenido del input.
  const command = document.getElementById('terminalInput').value;
  const result = evalCommand(command);

  if (result) {
    // console.log(`Comando: ${result.commandType}`);
    // console.log('Parámetros:', result.parameters);
    document.getElementById('output').innerText = `Comando: ${
      result.commandType
    }\nParámetros: ${JSON.stringify(result.parameters)}`;

    switch (result.commandType) {
      case 'ROBOT':
        tablero.createRobot(result.parameters);
        break;
      case 'AVANZAR':
        tablero.moveRobot(result.parameters);
        break;
      case 'GIRAR':
        tablero.rotateRobot(result.parameters);
        break;
      case 'TELEPORT':
        tablero.teleportRobot(result.parameters);
        break;
      default:
        console.log('Comando no reconocido.');
        break;
    }
  } else {
    document.getElementById('output').innerText = 'Error de sintaxis';
  }
}

// Historial
let commandHistory = [];
let currentIndex = -1;
let tempCommand = '';

document
  .getElementById('terminalInput')
  .addEventListener('keyup', function (event) {
    const inputField = document.getElementById('terminalInput');

    switch (event.keyCode) {
      case 13: // Enter
        event.preventDefault();

        // Si el comando actual es el mismo que el comando del historial en el índice actual, lo eliminamos
        if (
          currentIndex !== commandHistory.length &&
          inputField.value === commandHistory[currentIndex]
        ) {
          commandHistory.splice(currentIndex, 1);
        }

        // Si se ingresó un comando (no está vacío), añadirlo al historial
        if (inputField.value.trim() !== '') {
          commandHistory.push(inputField.value);
        }
        currentIndex = commandHistory.length; // Actualizar el índice

        evalCommands(tablero);
        inputField.value = ''; // Limpiar el input
        break;
      case 38: // Flecha arriba
        event.preventDefault();
        if (commandHistory.length > 0) {
          // Si es la primera vez que presionamos hacia arriba, guardamos el comando actual
          if (currentIndex === commandHistory.length) {
            tempCommand = inputField.value;
          }

          // Decrementamos el índice y mostramos el comando anterior
          currentIndex = Math.max(0, currentIndex - 1);
          inputField.value = commandHistory[currentIndex];
        }
        break;
      case 40: // Flecha abajo
        event.preventDefault();
        if (commandHistory.length > 0 && currentIndex < commandHistory.length) {
          // Incrementamos el índice
          currentIndex++;

          // Mostramos el comando siguiente o el comando temporal si hemos llegado al final del historial
          inputField.value =
            currentIndex === commandHistory.length
              ? tempCommand
              : commandHistory[currentIndex];
        }
        break;
    }
  });

// Inicialización
let numColumns = 10;
let tablero = new Tablero(numColumns, numColumns);
document.documentElement.style.setProperty('--num-columns', `${numColumns}`);

window.addEventListener('DOMContentLoaded', function () {
  tablero.renderizar();
});