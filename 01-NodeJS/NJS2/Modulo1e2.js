const fs = require('fs');

function crearArchivo(nombreArchivo, callback) {
  fs.writeFile(nombreArchivo, '', (err) => {
    if (err) throw err;
    console.log(`Archivo ${nombreArchivo} creado.`);
    if (callback) callback();
  });
}

module.exports = Modulo1e2;
