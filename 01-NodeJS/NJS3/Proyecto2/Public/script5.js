//agrega un mensaje y lo pone de color rojo
function handleDobleClick() {
    const mensaje = document.getElementById('caja');
    mensaje.textContent = 'Apretaste dos veces el click';
    mensaje.style.color = 'purple';

    //Borra el mensaje a los 2 segundos
    setTimeout(() => {
        mensaje.textContent = '';
        mensaje.style.color = '';
    }, 2000);
}
//le asigna al boton el boton de doble click
document.getElementById('boton').addEventListener('dblclick', handleDobleClick);
