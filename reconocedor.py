import re
import os

def clear_console():
    os_name = os.name
    if os_name == 'posix':
        # UNIX, Linux, macOS
        os.system('clear')
    elif os_name == 'nt':
        # Windows
        os.system('cls')

QE = -1 # Estado de error

# Matriz de transición
MT_MATRIX = {
    # ROBOT
    (0, "ROBOT"): 1,
    (1, "ID"): 2,
    (2, ","): 1,
    (2, "("): 3,
    (3, "NUM"): 4,
    (4, ","): 5,
    (5, "NUM"): 6,
    (6, ")"): 2,
    # AVANZAR
    (0, "AVANZAR"): 7,
    (7, "ID"): 8,
    (8, ","): 9,
    (9, "NUM"): 10,
    # GIRAR
    (0, "GIRAR"): 11,
    (11, "ID"): 12,
    (12, ","): 13,
    (13, "IZQ"): 14,
    (13, "DER"): 14,
    # TELEPORT
    (0, "TELEPORT"): 15,
    (15, "ID"): 16,
    (16, "("): 17,
    (17, "NUM"): 18,
    (18, ","): 19,
    (19, "NUM"): 20,
    (20, ")"): 21,
}

final_states = {
    2: "ROBOT",
    10: "AVANZAR",
    14: "GIRAR",
    21: "TELEPORT"
}

# Funciones auxiliares
def scanner(command):
    return re.findall(r'[a-zA-Z][a-zA-Z\d]*|\d+|[(),]', command)

def MT(q, token):
    # PALABRAS RESERVADAS
    if token in ["ROBOT", "AVANZAR", "GIRAR", "TELEPORT", "IZQ", "DER"]:
        return MT_MATRIX.get((q, token), QE)
    # ID
    elif re.match(r'^[a-zA-Z][a-zA-Z\d]*$', token):
        return MT_MATRIX.get((q, "ID"), QE)
    # NUM
    elif re.match(r'^\d+$', token):
        return MT_MATRIX.get((q, "NUM"), QE)
    # OTROS
    else:
        return MT_MATRIX.get((q, token), QE)

def get_parameters(tokens, command_type):
    if command_type == "ROBOT":
        params = {}
        i = 1
        while i < len(tokens):
            if i + 1 < len(tokens) and tokens[i+1] == '(':
                params[tokens[i]] = (int(tokens[i+2]), int(tokens[i+4]))
                i = i + 7
            else:
                params[tokens[i]] = None
                i+=2
        return params

    elif command_type == "AVANZAR":
        return {"ID": tokens[1], "steps": int(tokens[3])}

    elif command_type == "GIRAR":
        return {"ID": tokens[1], "direction": tokens[3]}

    elif command_type == "TELEPORT":
        return {"ID": tokens[1], "coords": (int(tokens[3]), int(tokens[5]))}

    return {}

# Funciones para los comandos:
def robot(params):
    for id, coords in params.items():
        if coords:
            print(f"Creando robot {id} en coordenadas {coords}")
        else:
            print(f"Creando robot {id} sin coordenadas")

def avanzar(params):
    print(f"El robot {params['ID']} avanza {params['steps']} pasos")

def girar(params):
    print(f"El robot {params['ID']} gira hacia la {params['direction']}")

def teleport(params):
    print(f"Teleportando robot {params['ID']} a coordenadas {params['coords']}")

def reconocer(q, tokens):
    params = get_parameters(tokens, final_states[q])
    print("El comando es válido.")
    print("Estado final:", final_states[q])
    print("Parámetros:", params)

    # Llama a la función relevante según el comando:
    if final_states[q] == "ROBOT":
        robot(params)
    elif final_states[q] == "AVANZAR":
        avanzar(params)
    elif final_states[q] == "GIRAR":
        girar(params)
    elif final_states[q] == "TELEPORT":
        teleport(params)

def error():
    print("El comando es inválido.")

def eval_command(command):
    tokens = scanner(command)
    q = 0
    i = 0

    print("Tokens:", tokens)

    while i < len(tokens) and q != QE:
        q = MT(q, tokens[i])
        i += 1

    # Equivalente a q !=QF 
    if q in [2, 10, 14, 21]:
        reconocer(q, tokens)
    else:
        error()

def test():
    # Pruebas
    test_commands = [
        "ROBOT A(1,3)",
        "ROBOT Robo1(1,3)",
        "ROBOT B(2,5), C, D(1,6)",
        "ROBOT A,B(2,5),C,D(1,6)",
        "AVANZAR Robo1,2",
        "AVANZAR A,   3",
        "GIRAR A,IZQ",
        "TELEPORT A(0,1)",
        "TELEPORT A(0,1",
        "TELEPORT A(0,1,3)",
    ]

    for command in test_commands:
        clear_console()
        print("Comando: ", command)
        eval_command(command)
        input("\nPresione ENTER para continuar...")

def main():
    while True:
        clear_console()
        print("\n--- Menú ---")
        print("1. Ingresar comando")
        print("2. Test")
        print("3. Salir")

        opcion = input("Elija una opción: ")

        if opcion == "1":
            clear_console()
            comando = input("\nIngrese su comando: ")
            eval_command(comando)
            input("\nPresione ENTER para continuar...")
        elif opcion == "2":
            test()
        elif opcion == "3":
            clear_console()
            break
        else:
            clear_console()
            print("\nOpción no reconocida. Intente de nuevo.")

# Si el script se ejecuta como programa principal, llama a main()
if __name__ == "__main__":
    main()
