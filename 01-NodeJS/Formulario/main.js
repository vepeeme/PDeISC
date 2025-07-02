const express = require('express')
const app = express();
const path = require('path');
const PORT = 3001;
const personas = [];
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.post('/enviar', (req, res) => {
    const persona = {
        usr: req.body.usr,
        pass: req.body.pass
    }

    personas.push(persona);
    console.log(personas);
    res.send('Persona agregada correctamente <a hred="/">volver</a> <a>href="/personas"></a>');
});

app.get('/personas', (req, res) => { 
    let lista = '<h1>Lista de personas</h1><ul>';
    personas.forEach(persona => {
        lista += '<li>${persona.usr} - ${p.pass}</li>';
    });
    lisyta += '</ul><a>href="/">volver</a>';
    res.send(lista);
}); 
app.listen(PORT, () => { 
    console.log('server en:  http://localhost:${PORT}');
 });
