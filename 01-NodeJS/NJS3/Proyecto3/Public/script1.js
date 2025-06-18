//cambia el color del fondo y cambia el texto
function cambiarColor() {
    this.style.backgroundColor = 'blue';
    this.textContent = 'Apretado';
}
//asigna al boton el evento de contextmenu
document.getElementById('boton').addEventListener('contextmenu', cambiarColor);