//funcion que devuelve la suma de a y b
function sumar(a,b){
    return a + b;
}
//funcion que devuelve la resta de a y b
function restar(a,b){
    return a - b;
}
//funcion que devuelve la multiplicación de a y b
function multiplicar(a,b){
    return a*b;
}
//funcion que devuelve la division de a y b
function dividir(a,b){
    return a/b;
}
//asignacion de los valores a la funciones
var sum = sumar(4,5);
var res = restar(3,6);
var mul = multiplicar(2,7);
var div = dividir(20,4);

//muestra en la consola los valores que devuelve las funciones
console.log("4 + 5 = ", sum);
console.log("3 - 6 = ", res);
console.log("2 * 7 = ", mul);
console.log("20 / 4 = ", div);
