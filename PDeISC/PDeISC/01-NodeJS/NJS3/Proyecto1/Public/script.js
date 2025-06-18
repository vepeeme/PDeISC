//asigna a cada constante su respectivo boton
const boton1 = document.getElementById('texto');
const boton2 = document.getElementById('imagen');
const boton3 = document.getElementById('texto1');
const boton4 = document.getElementById('imagen1');

let contadorTexto = 0; // Contador de clics de texto
let contadorImagen = 0; // Contador de clics de imagen
let ultimoH1 = null; // Último h1 que hemos creado
let ultimaImg = null; // Última imagen que hemos creado

// Función para crear, modificar y cambiar el color de un h1
function cambiarTexto() {
    const contenedor = document.getElementById('contiene');
    //la primera funcionalidad del boton que es crear un h1
    if (contadorTexto % 3 === 0) {
        ultimoH1 = document.createElement('h1');
        ultimoH1.textContent = 'Hola DOM';
        contenedor.appendChild(ultimoH1);

        boton1.textContent = 'Cambiar texto';
    }
    // la segunda funcionalidad del boton que es modificar el h1
    else if (contadorTexto % 3 === 1) {
        if (ultimoH1) {
            ultimoH1.textContent = 'Chau DOM';
        }

        boton1.textContent = 'Cambiar color';
    } 
    //y la ultima funcionalidad que seria cambiar el color
    else if (contadorTexto % 3 === 2) {
        if (ultimoH1) {
            ultimoH1.style.color = 'purple';
        }
        boton1.textContent = 'Crear texto';
    }

    contadorTexto++;
}

// Función para crear, cambiar y agrandar una imagen
function manejarImagen() {
    const contenedor = document.getElementById('imaginador');
    //la primera funcionalidad que es crear una imagen
    if (contadorImagen % 3 === 0) {
        ultimaImg = document.createElement('img');
        ultimaImg.src = 'imagenes/R.jpg';
        ultimaImg.style.width = '150px';
        ultimaImg.style.height = '150px';
        contenedor.appendChild(ultimaImg);

        boton2.textContent = 'Cambiar imagen';
    } 
    //la segunda funcionalidad que la modifica
    else if (contadorImagen % 3 === 1) {
        if (ultimaImg) {
            ultimaImg.src = 'imagenes/B.jpg';
        }

        boton2.textContent = 'Agrandar imagen';
    } 
    //y la ultima funcionalidad que es agrandarla
    else if (contadorImagen % 3 === 2) {
        if (ultimaImg) {
            ultimaImg.style.width = '300px';
            ultimaImg.style.height = '300px';
        }

        boton2.textContent = 'Crear imagen';
    }

    contadorImagen++;
}

// Función para quitar texto
function quitarTexto() {
    const h1 = document.querySelector('#contiene h1');
    if (h1) {
        h1.remove();
    }
}

// Función para quitar imagen
function quitarImagen() {
    const img = document.querySelector('#imaginador img');
    if (img) {
        img.remove();
    }
}

// Asigna los eventos para cada boton
boton1.addEventListener('click', cambiarTexto);
boton2.addEventListener('click', manejarImagen);
boton3.addEventListener('click', quitarTexto);
boton4.addEventListener('click', quitarImagen);