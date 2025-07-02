//Obtiene los valores que se ingresan en el formulario y los muestra abajo del mismo
function enviarFormulario(e) {
    e.preventDefault();
    //crea un objeto FormData a partir del formulario
    const formData = new FormData(this);
    //Se crean constantes para los resultados de los campos del formuario
    const nombre = formData.get('nombre');
    const edad = formData.get('edad');
    const email = formData.get('email');
    const genero = formData.get('genero');
    const pais = formData.get('pais');
    const intereses = formData.getAll('intereses');
    //muestra los resultados de los campos abajo del formulario
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <h2>Datos Registrados</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Edad:</strong> ${edad}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Género:</strong> ${genero}</p>
        <p><strong>País:</strong> ${pais}</p>
        <p><strong>Intereses:</strong> ${intereses.join(', ')}</p>
    `;
}
//agrega al elemento formulario el evento submit
document.getElementById('formulario').addEventListener('submit', enviarFormulario);