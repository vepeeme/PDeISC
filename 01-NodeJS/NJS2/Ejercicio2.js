const fs = require('fs');
const http = require('http');
const url = require('url');

fs.writeFile('index.html', '<h1>Titulo</h1><p>Lorem ipsum</p>', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

const server = http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  let filename = "." + q.pathname;
  if (filename === './') {
    filename = './index.html';
  }
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});
server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
