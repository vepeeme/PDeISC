//importamos las funciones del archivo calculo.js a ejercicio4.js
import { sumar, restar, dividir, multiplicar } from './calculo.js';
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