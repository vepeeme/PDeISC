// crea constantes con los valores de los botones 
const botonCrear = document.getElementById('crearNodos');
const botonModificar = document.getElementById('modificarNodos');
const botonEliminar = document.getElementById('eliminarNodos');
const contenedorLinks = document.getElementById('links');
const listaCambios = document.getElementById('listaCambios');

//cantidad de enlaces que se puede crear
const enlace = 5;

// Array con los enlaces que se van a crear
const enlacesIniciales = [
    { texto: 'Google', href: 'https://www.google.com' },
    { texto: 'YouTube', href: 'https://www.youtube.com' },
    { texto: 'Wikipedia', href: 'https://www.wikipedia.org' },
    { texto: 'GitHub', href: 'https://www.github.com' },
    { texto: 'Twitter', href: 'https://www.twitter.com' }
];

// Enlaces con los que se van a modificar
const nuevosEnlaces = [
    { texto: 'Bing', href: 'https://www.bing.com' },
    { texto: 'Vimeo', href: 'https://www.vimeo.com' },
    { texto: 'Britannica', href: 'https://www.britannica.com' },
    { texto: 'GitLab', href: 'https://www.gitlab.com' },
    { texto: 'Instagram', href: 'https://www.instagram.com' }
];

// Crea los enlaces 
function crearNodos() {
    const enlacesActuales = document.querySelectorAll('#links a').length;

    if (enlacesActuales >= enlace) {
        agregarCambio('Ya existen 5 enlaces. No se pueden crear más.');
        return;
    }

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
    agregarCambio(`Se crearon ${enlace - enlacesActuales} enlaces.`);
}

// Modifica los enlaces ya existentes
function modificarNodos() {
    const enlaces = document.querySelectorAll('#links a');
    if (enlaces.length === 0) {
        agregarCambio('No hay enlaces para modificar.');
        return;
    }

    listaCambios.innerHTML = ''; // Limpiar lista de cambios anteriores

    enlaces.forEach((a, index) => {
        if (nuevosEnlaces[index]) {
            const hrefAntiguo = a.href;
            const textoAntiguo = a.textContent;

            a.href = nuevosEnlaces[index].href;
            a.textContent = nuevosEnlaces[index].texto;

            const itemCambio = document.createElement('li');
            itemCambio.textContent = `Enlace cambiado de "${textoAntiguo}" a "${a.textContent}" `;
            listaCambios.appendChild(itemCambio);
        }
    });
}

// Elimina todos los enlaces
function eliminarNodos() {
    const enlaces = document.querySelectorAll('#links a');
    if (enlaces.length === 0) {
        agregarCambio('No hay enlaces para eliminar.');
        return;
    }
    enlaces.forEach(a => a.remove());
    agregarCambio('Todos los enlaces fueron eliminados.');
}

// Mustra los cambios realizados en la lista
function agregarCambio(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    listaCambios.appendChild(li);
}

// Asigna los eventos a los botones creados
botonCrear.addEventListener('click', crearNodos);
botonModificar.addEventListener('click', modificarNodos);
botonEliminar.addEventListener('click', eliminarNodos);
