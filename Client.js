// this code plays two roles :
// 1. that of a BorderRouter that receives/executes/ command from LPCloud and returns status
// 2. that of an LPApp (Android/iOS) that generates the command from user input
// in reality '2' above will run on the app, and '1' on the BorderRouter

var
    io = require('socket.io-client'),
    ioClient = io.connect('http://localhost:8002');

function runLPCmd(msg) {
    //    console.log("turning on the switch");
    console.info("[LPDevice]:executed command from LPCloud "+JSON.stringify(msg));
    ioClient.emit('LPCmdStatus','[BorderRouter]: completed LPCommand - '+JSON.stringify(msg));
}

ioClient.on('LPCmd', function(msg) {
	console.info("[BorderRouter]:received command from LPCloud "+JSON.stringify(msg));
	runLPCmd(msg);
	//	ioClient.emit('LPCmdStatus','i received'+JSON.stringify(msg)+' from you');
    });


// role 2 below - will not be part of BorderRouter code in actuality
//this LP cloud emulator will go away once socket.io code integrated with lp-command-architecture
//code borrowed from https://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request/
var http = require('http');
var options = {
    host: 'localhost',
    path: '/foo',
    //since we are listening on a custom port, we need to specify it by hand
    port: '8002',
    //This is what changes the request to a POST request
    method: 'POST'
};


callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
	  str += chunk;
      });

  response.on('end', function () {
	  //	  console.log(str);
      });
}

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
var cmd = "{ lpcommand: 'turn ON sajid study light' }";
console.log("[LPApp]: sending command "+cmd+" to LPCloud");
req.write(cmd);
req.end();
