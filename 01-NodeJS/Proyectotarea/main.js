const express = require('express')
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pagina1.html'));
});

app.get('/pagina2', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pagina2.html'));
});

app.get('/pagina3', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pagina3.html'));
});

app.get('/pagina4', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pagina4.html'));
});

app.listen(8082,()=>{
    console.log('http://127.0.0.1:8082');
});