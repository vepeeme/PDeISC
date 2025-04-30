//agrega una constante que es el contenedor
const contenedor = document.getElementById('contenedor');
//agrega con innerHTML un parrafo
function agregarParrafo() {
    contenedor.innerHTML += `<p>Este es un nuevo párrafo agregado dinámicamente.</p>`;
}
//agrega con innerHTML un h2
function agregarTitulo() {
    contenedor.innerHTML += `<h2>Nuevo título agregado</h2>`;
}
//agrega con innerHTML una imagen
function agregarImagen() {
    contenedor.innerHTML += `<img src="imagenes/OIP.jpg" alt="Imagen de ejemplo" style="display: block; margin: 10px auto;">`;
}
//agrega con innerHTML una lista
function agregarLista() {
    contenedor.innerHTML += `
        <ul>
            <li>Elemento 1</li>
            <li>Elemento 2</li>
            <li>Elemento 3</li>
        </ul>
    `;
}
//agrefa con innerHTML un div
function agregarCaja() {
    contenedor.innerHTML += `<div style="background-color: lightblue; padding: 10px; margin-top: 10px;">Soy una caja Div agregada.</div>`;
}
//borra los elementos del contenedor
function limpiarContenedor() {
    contenedor.innerHTML = '';
}
