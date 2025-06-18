//Cambia el interior de la etiqueta p por "Has presionado la tecla: " y el evento de la tecla
function mensaje() {
    document.getElementById('mensaje').textContent = `Has presionado la tecla: ${event.key}`;
}
//le asigna el evento keydown a la etiqueta p
document.addEventListener('keydown', mensaje);