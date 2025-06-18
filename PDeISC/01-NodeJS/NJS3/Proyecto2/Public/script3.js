//cambia el color de fondo
function enfoque() {
    this.style.backgroundColor = 'blue';
}
//quita el color de fondo
function desenfoque() {
    this.style.backgroundColor = '';
}
//le asigna los eventos focus y blur al div
document.getElementById('campo').addEventListener('focus', enfoque);
document.getElementById('campo').addEventListener('blur', desenfoque);