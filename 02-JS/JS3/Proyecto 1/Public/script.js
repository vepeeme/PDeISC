document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos los elementos de la página que vamos a usar.
    const inputNumero = document.getElementById('input-numero');
    const btnAgregarNumero = document.getElementById('btn-agregar-numero');
    const btnGenerarTxt = document.getElementById('btn-generar-txt');
    const listaNumerosDiv = document.getElementById('lista-numeros');
    const contadorNumerosSpan = document.getElementById('contador-numeros');
    const mensajeErrorP = document.getElementById('mensaje-error');

    // Array donde almacenamos los numeros que ingresamos
    let numerosIngresados = [];

    // Definimos cuántos números se necesitan como mínimo y máximo.
    const MIN_NUMEROS = 10;
    const MAX_NUMEROS = 20;

    // Muestra un mensaje de error en la pantalla que dura 3 segundos
    function mostrarMensajeError(mensaje) {
        mensajeErrorP.textContent = mensaje;
        mensajeErrorP.classList.remove('hidden'); 
        setTimeout(() => {
            mensajeErrorP.classList.add('hidden');
            mensajeErrorP.textContent = '';
        }, 3000);
    }
    // Actualiza la lista de los numeros mostrados en pantalla, ademas de que si hay suficientes numeros muestra el boton
    function actualizarListaNumeros() {
        listaNumerosDiv.innerHTML = '';
        // Recorremos cada número que hemos guardado y lo mostramos en la lista
        numerosIngresados.forEach(numero => {
            const spanNumero = document.createElement('span'); 
            spanNumero.textContent = numero; 
            listaNumerosDiv.appendChild(spanNumero); 
        });
        // Actualizamos el número que se muestra en el contador 
        contadorNumerosSpan.textContent = numerosIngresados.length;

        // Si tenemos suficientes números, mostramos el botón para generar el TXT
        if (numerosIngresados.length >= MIN_NUMEROS && numerosIngresados.length <= MAX_NUMEROS) {
            btnGenerarTxt.classList.remove('hidden');
        } else {
            btnGenerarTxt.classList.add('hidden');
        }

        // Si ya llegamos al máximo de números, deshabilitamos el botón de agregar y el campo de texto
        if (numerosIngresados.length >= MAX_NUMEROS) {
            btnAgregarNumero.disabled = true;
            inputNumero.disabled = true;
            inputNumero.value = '';
            mostrarMensajeError(`Has alcanzado el número máximo de ${MAX_NUMEROS} números.`);
        } else {
            btnAgregarNumero.disabled = false;
            inputNumero.disabled = false;
        }
    }

    /**
     * Se ejecuta cuando el usuario hace clic en el botón "Agregar Número".
     * Toma el número del campo de texto, lo valida y lo añade a la lista.
     */
    // Al hacer click en el boton de agregar numero, se activa el siguiente evento
    btnAgregarNumero.addEventListener('click', () => {
        const valorInput = inputNumero.value.trim(); 
        const numero = parseInt(valorInput, 10); // Convertimos el texto a un número entero

        // Comprobamos si el campo está vacío.
        if (valorInput === '') {
            mostrarMensajeError('Por favor, ingresa un número.');
            return;
        }
        // Comprobamos si lo que se escribió no es un número válido.
        if (isNaN(numero)) {
            mostrarMensajeError('Entrada inválida. Por favor, ingresa un número válido.');
            return;
        }
        // Comprobamos si ya se llegó al límite de números.
        if (numerosIngresados.length >= MAX_NUMEROS) {
            mostrarMensajeError(`Ya has ingresado el máximo de ${MAX_NUMEROS} números.`);
            return;
        }
         // Añadimos el número a nuestra lista.
        numerosIngresados.push(numero);
        inputNumero.value = ''; 
        actualizarListaNumeros();
        inputNumero.focus();
    });

    /**
     * Permite al usuario agregar un número al presionar la tecla Enter en el campo de texto.
     */
    // Se activa un evento el cual si apretas el Enter, simula que se hizo click en el boton de agregar numero
    inputNumero.addEventListener('keypress', (evento) => {
        if (evento.key === 'Enter') {
            btnAgregarNumero.click();
        }
    });

    // Al hacer click en el boton de generar txt, se activa el siguiente evento
    btnGenerarTxt.addEventListener('click', () => {
        // Verificamos que tengamos al menos el mínimo de números
        if (numerosIngresados.length < MIN_NUMEROS) {
            mostrarMensajeError(`Necesitas ingresar al menos ${MIN_NUMEROS} números para generar el archivo.`);
            return;
        }

        // Convertimos la lista de números en un texto
        const contenidoTxt = numerosIngresados.join('\n');
        const nombreArchivo = 'numeros_generados.txt';

        // Creamos un Blob que es el contenedor de datos para el archivo
        const blob = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });

        // Creamos una URL temporal para el Blob
        const url = URL.createObjectURL(blob);

        // Creamos un enlace invisible en la página, ademas de darle la URL del Blob y el nombre del archivo para poder descargarlo
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = url; 
        enlaceDescarga.download = nombreArchivo; 
        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click(); 
        document.body.removeChild(enlaceDescarga);
        URL.revokeObjectURL(url); 
    });
    actualizarListaNumeros();
});