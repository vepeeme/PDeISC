var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host);//devuelve 'localhost:8080'
console.log(q.pathname);//devuelve '/default.htm'
console.log(q.search);//devuelve '?year=2017&month=february'

var qdata = q.query;//devuelve un objeto: { year: 2017, month: 'february' }
console.log(qdata.month); //devuelve 'february'