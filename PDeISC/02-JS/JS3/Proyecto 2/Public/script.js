document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos los elementos de la página con los que vamos a interactuar.
    const inputArchivo = document.getElementById('input-archivo');
    const btnAnalizarArchivo = document.getElementById('btn-analizar-archivo');
    const resultadosAnalisisDiv = document.getElementById('resultados-analisis');
    const totalNumerosProcesadosSpan = document.getElementById('total-numeros-procesados');
    const numerosUtilesContadorSpan = document.getElementById('numeros-utiles-contador');
    const porcentajeUtilesSpan = document.getElementById('porcentaje-utiles');
    const numerosNoUtilesContadorSpan = document.getElementById('numeros-no-utiles-contador');
    const porcentajeNoUtilesSpan = document.getElementById('porcentaje-no-utiles');
    const listaNumerosFiltradosDiv = document.getElementById('lista-numeros-filtrados');
    const btnDescargarFiltrados = document.getElementById('btn-descargar-filtrados');
    const mensajeAnalisisErrorP = document.getElementById('mensaje-analisis-error');

    // Creamos un array donde guardamos los números que cumplen el criterio.
    let numerosUtiles = [];

    // Esta función se usa para mostrar mensajes de error en la pantalla.
    function mostrarMensajeError(mensaje, elementoMensaje) {
        elementoMensaje.textContent = mensaje; 
        elementoMensaje.classList.remove('hidden'); 
        setTimeout(() => {
            elementoMensaje.classList.add('hidden');
            elementoMensaje.textContent = ''; 
        }, 5000);
    }

    // Verifica si el número cumple el criterio de que su primer y último dígito son iguales
    function cumpleCriterio(numeroCadena) {
        if (typeof numeroCadena !== 'string' || numeroCadena.length === 0) {
            return false;
        }
        return numeroCadena[0] === numeroCadena[numeroCadena.length - 1];
    }

    // Al hacer clic en el botón "Analizar Archivo", activara el siguiente evento
    btnAnalizarArchivo.addEventListener('click', () => {
        // variable para almacenar el archivo
        const archivo = inputArchivo.files[0];

        // Si no se selecciono un archivo muestra el siguiente mensaje
        if (!archivo) {
            mostrarMensajeError('Por favor, selecciona un archivo TXT.', mensajeAnalisisErrorP);
            return;
        }

        // Verifica que sea un archivo .txt
        if (!archivo.name.toLowerCase().endsWith('.txt')) {
            mostrarMensajeError('Por favor, sube un archivo de tipo .txt', mensajeAnalisisErrorP);
            inputArchivo.value = ''; 
            return;
        }
        // Objeto que se usa para leer el contenido del archivo
        const lector = new FileReader(); 

        // Ejecuta esta función cuando el archivo se ha leído
        lector.onload = (evento) => {
            const contenido = evento.target.result; // Texto completo del archivo
            const lineas = contenido.split('\n'); // Dividimos el texto en líneas individuales

            let totalNumeros = 0;
            let contadorUtiles = 0;
            let contadorNoUtiles = 0;
            numerosUtiles = []; // Reiniciamos la lista de números que cumplen el criterio

            // Recorremos cada línea del archivo
            lineas.forEach(linea => {
                const numeroRecortado = linea.trim();
                //Convertir la línea a un número
                const numeroValido = parseInt(numeroRecortado, 10);

                // Si la línea está vacía o no es un número, la saltamos
                if (numeroRecortado === '' || isNaN(numeroValido)) {
                    return;
                }

                totalNumeros++; // Contamos los numeros totales

                // Convertimos el número a texto para revisar su primer y último dígito
                const numeroComoCadena = numeroValido.toString(); 

                // Si el número cumple nuestro criterio lo añade a numeros utiles, caso contrario como no util
                if (cumpleCriterio(numeroComoCadena)) {
                    numerosUtiles.push(numeroValido); 
                    contadorUtiles++; 
                } else {
                    contadorNoUtiles++;
                }
            });

            // Ordenamos los números útiles de menor a mayor.
            numerosUtiles.sort((a, b) => a - b);

            // Actualizamos los textos en la pantalla con los resultados
            totalNumerosProcesadosSpan.textContent = totalNumeros;
            numerosUtilesContadorSpan.textContent = contadorUtiles;
            numerosNoUtilesContadorSpan.textContent = contadorNoUtiles;

            // Calculamos los porcentajes
            const porcentajeU = totalNumeros > 0 ? ((contadorUtiles / totalNumeros) * 100).toFixed(2) : 0;
            const porcentajeNoU = totalNumeros > 0 ? ((contadorNoUtiles / totalNumeros) * 100).toFixed(2) : 0;

            porcentajeUtilesSpan.textContent = `${porcentajeU}%`;
            porcentajeNoUtilesSpan.textContent = `${porcentajeNoU}%`;

            // Mostramos los números filtrados en la lista de la pantalla
            listaNumerosFiltradosDiv.innerHTML = '';
            if (numerosUtiles.length > 0) {
                numerosUtiles.forEach(num => {
                    // Creamos una etiqueta para cada número filtrado
                    const span = document.createElement('span'); 
                    span.textContent = num;
                    listaNumerosFiltradosDiv.appendChild(span);
                });
                // Mostramos el botón para descargar los filtrados
                btnDescargarFiltrados.classList.remove('hidden'); 
            } else {
                listaNumerosFiltradosDiv.textContent = 'Ningún número cumple el criterio.';
                // Ocultamos el botón si no hay números útiles
                btnDescargarFiltrados.classList.add('hidden'); 
            }

            resultadosAnalisisDiv.classList.remove('hidden');
        };

        // Se ejecuta si ocurre un error al leer el archivo.
        lector.onerror = () => {
            mostrarMensajeError('Error al leer el archivo. Intenta de nuevo.', mensajeAnalisisErrorP);
        };
        // El lector lee el archivo como texto
        lector.readAsText(archivo);
    });
    // Al hacer clic en el botón de descarga se activa el siguiente evento
    btnDescargarFiltrados.addEventListener('click', () => {
        // Si no hay números útiles, no se descarga
        if (numerosUtiles.length === 0) {
            mostrarMensajeError('No hay números filtrados para descargar.', mensajeAnalisisErrorP);
            return;
        }

        // Convertimos la lista de números útiles en un texto
        const contenidoTxt = numerosUtiles.join('\n');
        const nombreArchivo = 'numeros_filtrados.txt';

        // Creamos un Blob con el contenido del archivo y lo descarga
        const blob = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = url;
        enlaceDescarga.download = nombreArchivo;
        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        document.body.removeChild(enlaceDescarga);
        URL.revokeObjectURL(url);
    });
});