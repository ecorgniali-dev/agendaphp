const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody'),
    inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
    // Cuando el formualrio de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar el boton
    if (listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    // Buscador
    inputBuscador.addEventListener('input', buscarContactos);

    numeroContactos();
    
}

function leerFormulario(e) {
    e.preventDefault();

    // Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        // 2 parametros: texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        // Pasa la validación, crear llamado a ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        // console.log(...infoContacto);  

        if (accion === 'crear') {
            // crearemos un nuevo contacto
            insertarBD(infoContacto);
        } else {
            // editar el contacto
            // leer el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }    
}

//** Inserta en la base de datos via Ajax */
function insertarBD(datos) {
    // llamado a ajax

    // crear el objeto
    const xhr = new XMLHttpRequest();

    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // pasar los datos
    xhr.onload = function() {
        if (this.status === 200) {            
            console.log(JSON.parse(xhr.responseText));
            // leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);

            // Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.innerText = 'Editar';
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.innerText = 'Eliminar';
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            // resetear el formulario
            document.querySelector('form').reset();

            // mostrar la notificación
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

            // Actualizamos el número de contactos
            numeroContactos();
        }
    }
    // enviar los datos
    xhr.send(datos)
}

function actualizarRegistro(datos) {
    // crear el objeto
    const xhr = new XMLHttpRequest();

    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // leer la respuesta
    xhr.onload = function() {
        if (this.status === 200) {
            const resultado = JSON.parse(xhr.responseText);

            if (resultado.respuesta === 'correcto') {
                // mostrar notificación de correcto
                mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
            } else {
                // hubo un error
                mostrarNotificacion('Hubo un error...', 'error');
            }
            // redireccionar a la pagina principal
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 1500);
        }
    }

    // enviar la peticion
    xhr.send(datos);
}

// Eliminar el contacto
function eliminarContacto(e) {
    if (e.target.classList.contains('btn-borrar')) {
        // tomar el ID
        const id = e.target.getAttribute('data-id');
        
        // preguntar al usuario si está seguro
        const respuesta = confirm('¿Estás seguro (a) ?');

        if (respuesta) {
            // llamado a ajax
            // crear el objeto
            const xhr = new XMLHttpRequest();

            // abrir la conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            // leer la respuesta
            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);

                    if(resultado.respuesta == 'correcto') {
                        // Eliminar el registro del DOM
                        e.target.parentElement.parentElement.remove();

                        // Mostrar notificación
                        mostrarNotificacion('Contacto eliminado', 'correcto');

                        // Actualizamos el número de contactos
                        numeroContactos();
                    } else {
                        // Mostramos una notificación
                        mostrarNotificacion('Hubo un error...', 'error');
                    }
                    
                }
            }

            // enviar la petición
            xhr.send();            
        }        
    }    
}

// Notificación en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');

            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}

// Buscador de registros
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');

        registros.forEach(registro => {
            registro.style.display = 'none';

            if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
                registro.style.display = 'table-row';
            }
            numeroContactos();
        })
}

// Muestra el número de contactos
function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if(contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });

    // console.log(total);
    contenedorNumero.textContent = total;
}