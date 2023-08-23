// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function () {

  // Función para calcular el promedio de notas
  const calcularPromedio = (notas) =>
    notas.reduce((total, nota) => total + nota, 0) / notas.length;

  // Función para renderizar los usuarios en el DOM
  const renderizarUsuarios = (usuarios) => {
    const usuariosContainer = document.getElementById("usuarios");
    usuariosContainer.innerHTML = ""; // Limpiar el contenedor antes de renderizar

    usuarios.forEach((usuario, index) => {
      // Crear un elemento DIV para mostrar la información del usuario
      const usuarioElement = document.createElement("div");
      usuarioElement.classList.add("usuario");

      // Insertar HTML con los datos del usuario
      usuarioElement.innerHTML = `
        <p>${usuario.nombre} ${usuario.apellido}</p>
        <p>Materia: ${usuario.materia}</p>
        <p>Notas: ${usuario.notas.join(", ")}</p>
        <p>Promedio: ${usuario.promedio}</p>
        <p>Estado: ${usuario.aprobado}</p>
        <div class="botones">
          <button class="eliminar" data-index="${index}">Eliminar</button>
          <button class="editar" data-index="${index}">Editar</button>
        </div>
      `;

      // Evento para eliminar usuario al hacer clic en el botón "Eliminar"
      usuarioElement.querySelector(".eliminar").addEventListener("click", () => {
        eliminarUsuario(index);
      });

      // Evento para editar usuario al hacer clic en el botón "Editar"
      usuarioElement.querySelector(".editar").addEventListener("click", () => {
        editarUsuario(index);
      });

      // Agregar el elemento de usuario al contenedor
      usuariosContainer.appendChild(usuarioElement);
    });
  };

  // Función para guardar datos en el almacenamiento local
  const guardarDatosLocalStorage = (datos) => {
    localStorage.setItem("alumnos", JSON.stringify(datos));
  };

  // Función para cargar datos almacenados en el almacenamiento local
  const cargarDatosAlmacenados = () => {
    const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
    renderizarUsuarios(almacenados);
  };

  // Función para validar una nota y asegurarse de que esté en el rango adecuado
  const validarNota = (nota) => {
    const maxNota = 10;
    return Math.min(Math.max(nota, 0), maxNota);
  };

  // Función para mostrar resultados en el DOM
  const mostrarResultado = (nombre, apellido, materia, notas, indexEditar) => {
    const promedio = calcularPromedio(notas).toFixed(2);
    const aprobado = promedio >= 6 ? "Aprobado" : "Desaprobado";

    const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
    if (indexEditar !== undefined) {
      // Editar usuario existente
      const usuarioEditado = almacenados[indexEditar];
      usuarioEditado.nombre = nombre;
      usuarioEditado.apellido = apellido;
      usuarioEditado.materia = materia;
      usuarioEditado.notas = notas;
      usuarioEditado.promedio = promedio;
      usuarioEditado.aprobado = aprobado;
    } else {
      // Agregar nuevo usuario
      almacenados.push({
        nombre,
        apellido,
        materia,
        notas,
        promedio,
        aprobado,
      });
    }

    // Guardar los cambios en el almacenamiento local y renderizar usuarios
    guardarDatosLocalStorage(almacenados);
    renderizarUsuarios(almacenados);
  };

  // Función para editar un usuario existente
  const editarUsuario = (index) => {
    const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
    const usuarioEditado = almacenados[index];

    // Llenar los campos de entrada con los datos del usuario a editar
    document.getElementById("nombre").value = usuarioEditado.nombre;
    document.getElementById("apellido").value = usuarioEditado.apellido;
    document.getElementById("materia").value = usuarioEditado.materia;
    document.getElementById("parcial1").value = usuarioEditado.notas[0];
    document.getElementById("parcial2").value = usuarioEditado.notas[1];
    document.getElementById("parcial3").value = usuarioEditado.notas[2];

    // Eliminar al usuario para editarlo y ajustar el evento del botón "Calcular"
    eliminarUsuario(index);
    document.getElementById("calcular").removeEventListener("click", calcularListener);
    document.getElementById("calcular").addEventListener("click", () => {
      // Obtener los valores ingresados por el usuario
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const materia = document.getElementById("materia").value;
      const parcial1 = validarNota(Number(document.getElementById("parcial1").value));
      const parcial2 = validarNota(Number(document.getElementById("parcial2").value));
      const parcial3 = validarNota(Number(document.getElementById("parcial3").value));

      // Crear un array con las notas validadas
      const notas = [parcial1, parcial2, parcial3];

      // Mostrar los resultados con la función mostrarResultado
      mostrarResultado(nombre, apellido, materia, notas, index);
    });
  };

  // Función para eliminar un usuario
  const eliminarUsuario = (index) => {
    const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
    almacenados.splice(index, 1);
    guardarDatosLocalStorage(almacenados);
    renderizarUsuarios(almacenados);
  };

  // Cargar datos almacenados en el inicio
  cargarDatosAlmacenados();

  // Evento para cargar datos desde un JSON local
  fetch("https://ejemplo-json.com/datos.json")
    .then((response) => response.json())
    .then((data) => {
      // Mostrar los resultados obtenidos del JSON local
      mostrarResultado(data.nombre, data.apellido, data.materia, data.notas);
    })
    .catch((error) => {
      console.error("Error al cargar datos desde JSON: ", error);
    });

  // Evento para cargar datos desde una API externa
  fetch("https://ejemplo.api.com/data")
    .then((response) => response.json())
    .then((data) => {
      // Mostrar los resultados obtenidos de la API externa
      mostrarResultado(data.nombre, data.apellido, data.materia, data.notas);
    })
    .catch((error) => {
      console.error("Error al cargar datos desde la API: ", error);
    });

  // Evento para calcular promedio y agregar usuario
  document.getElementById("calcular").addEventListener("click", () => {
    // Obtener los valores ingresados por el usuario
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const materia = document.getElementById("materia").value;
    const parcial1 = validarNota(Number(document.getElementById("parcial1").value));
    const parcial2 = validarNota(Number(document.getElementById("parcial2").value));
    const parcial3 = validarNota(Number(document.getElementById("parcial3").value));

    // Crear un array con las notas validadas
    const notas = [parcial1, parcial2, parcial3];

    // Mostrar los resultados con la función mostrarResultado
    mostrarResultado(nombre, apellido, materia, notas);
  });

  // Evento para borrar los datos ingresados
  document.getElementById("borrar").addEventListener("click", () => {
    // Restablecer los valores de los campos de entrada a vacío
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("materia").value = "";
    document.getElementById("parcial1").value = "";
    document.getElementById("parcial2").value = "";
    document.getElementById("parcial3").value = "";
  });
});
