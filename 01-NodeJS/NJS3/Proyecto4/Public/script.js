//se asigna constantes con los id de cada boton 
const botonCrear = document.getElementById('crearNodos');
const botonModificar = document.getElementById('modificarNodos');
const botonEliminar = document.getElementById('eliminarNodos');
const contenedorLinks = document.getElementById('links');

//cantidad de enlaces
const enlace = 5;

// array que tiene los enlaces para crear
const enlacesIniciales = [
    { texto: 'Google', href: 'https://www.google.com' },
    { texto: 'YouTube', href: 'https://www.youtube.com' },
    { texto: 'Wikipedia', href: 'https://www.wikipedia.org' },
    { texto: 'GitHub', href: 'https://www.github.com' },
    { texto: 'Twitter', href: 'https://www.twitter.com' }
];

// array con los nuevos enlaces
const nuevosEnlaces = [
    { texto: 'Bing', href: 'https://www.bing.com' },
    { texto: 'Vimeo', href: 'https://www.vimeo.com' },
    { texto: 'Britannica', href: 'https://www.britannica.com' },
    { texto: 'GitLab', href: 'https://www.gitlab.com' },
    { texto: 'Instagram', href: 'https://www.instagram.com' }
];

// crea los enlaces 
function crearNodos() {
    const enlacesActuales = document.querySelectorAll('#links a').length;

    if (enlacesActuales >= enlace) {
        return;
    }
    //recorre el array de los enlaces iniciales y crea las etiquetas de enlaces con sus atributos
    for (let i = enlacesActuales; i < enlace; i++) {
        const enlace = enlacesIniciales[i];
        const a = document.createElement('a');
        a.textContent = enlace.texto;
        a.href = enlace.href;
        a.target = '_blank'; // Abrir en nueva pestaña
        a.id = `enlace${i}`;
        a.style.display = 'block';
        a.style.marginBottom = '5px';
        contenedorLinks.appendChild(a);
    }
}

// Modifica los enlaces ya creados
function modificarNodos() {
    const enlaces = document.querySelectorAll('#links a');
    if (enlaces.length === 0) {
        return;
    }
    //recorre el array para cambiar los atributos de los enlaces
    enlaces.forEach((a, index) => {
        if (nuevosEnlaces[index]) {
            a.href = nuevosEnlaces[index].href;
            a.textContent = nuevosEnlaces[index].texto;
        }
    });
}

// Elimina los enlaces creados
function eliminarNodos() {
    const enlaces = document.querySelectorAll('#links a');
    if (enlaces.length === 0) {
        return;
    }
    //recorre el array y va borrando elemento por elemento
    enlaces.forEach(a => a.remove());
}

// Asigna a cada boton su respectivo evento al hacer click
botonCrear.addEventListener('click', crearNodos);
botonModificar.addEventListener('click', modificarNodos);
botonEliminar.addEventListener('click', eliminarNodos);
