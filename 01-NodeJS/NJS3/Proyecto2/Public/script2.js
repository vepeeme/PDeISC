//cambia el color del fondo a amarillo
function encima() {
    this.style.backgroundColor = 'purple';
}
//quita el color de fondo
function soltar() {
    this.style.backgroundColor = '';
}
//asigna al div el evento del mouseover para que cambie de color y tambien el mouse out para que vuelva a su color original
document.getElementById('cuadro').addEventListener('mouseover', encima);
document.getElementById('cuadro').addEventListener('mouseout', soltar);