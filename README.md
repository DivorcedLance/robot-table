# Robot Table

Bienvenido al proyecto Robot Table. Coloca y mueve robots por el tablero utilizando comandos específicos y observa cómo interactúan en tiempo real.

# Ver demo:

Demo de la página: https://divorcedlance.github.io/robot-table/

## Características

1. **Tablero Interactivo**: Un espacio gráfico para visualizar y mover robots.
2. **Reconocimiento de Comandos**: Usa comandos de texto específicos para interactuar con los robots. La implementación detrás de esta característica utiliza un Autómata Finito Determinista (AFD) que actúa como un reconocedor del lenguaje de comandos.
3. **Imágenes de Robots**: Las imágenes de los robots se obtienen de [RoboHash](https://robohash.org/), proporcionando representaciones únicas y divertidas para cada robot.

## Comandos Soportados

- **ROBOT `<ID>` `(x,y)`**: Crea un robot con ID `<ID>` en las coordenadas `(x,y)`.
- **ROBOT `<ID>`**: Crea un robot con ID `<ID>` en las coordenadas por defecto `(0,0)`.
- **GIRAR `<ID>`, dirección**: Gira el robot con ID `<ID>` en la dirección especificada (puede ser 'IZQ' o 'DER').
- **AVANZAR `<ID>`, pasos**: Mueve el robot con ID `<ID>` la cantidad de pasos indicada en la dirección que esté mirando.
- **TELEPORT `<ID>` `(x,y)`**: Teletransporta al robot con ID `<ID>` a las coordenadas `(x,y)`.

## Cómo Usar

### Crear un Robot

Utiliza el comando `ROBOT` seguido del ID del robot y, opcionalmente, las coordenadas `(x,y)`.

### Mover un Robot

Para mover un robot, emplea el comando `AVANZAR` con el ID del robot y la cantidad de pasos.

### Girar un Robot

Usa el comando `GIRAR` seguido del ID del robot y la dirección ('IZQ' o 'DER').

### Teletransportar un Robot

Para teletransportar un robot, utiliza el comando `TELEPORT` seguido del ID y las coordenadas de destino `(x,y)`.

## Instalación y Configuración

1. Clona este repositorio.

## Contribuir

Si tienes ideas o sugerencias para mejorar este proyecto, no dudes en crear un issue o enviar un pull request.
