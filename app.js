var express = require('express');

//var app = require('http').createServer(handler);
var exp = express();
var app = require('http').createServer(exp);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8002, function() {console.log("listening at 8002");});

// sockets.emit is a hack that sends message to every conected home
// ultimately we'll use the rooms feature from this 
//- http://stackoverflow.com/questions/9411793/how-to-use-express-post-request-to-emit-socket-io-or-sockjs
exp.post('/foo', function(req,res) {
	var body = "";

	req.on('readable', function() {
		body += req.read();
	    });
	req.on('end', function() {
		console.log("[LPCloud] received command from LPApp:"+body);

		io.sockets.emit('LPCmd',body);

		res.send("[LPCloud]: processing command "+body+" from LPApp");
	    });
    });

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
		function (err, data) {
		    if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		    }

		    res.writeHead(200);
		    res.end(data);
		});
}


io.on('connection', function (socket) {
	//	socket.emit('LPCmd', { lpcommand: 'turn on sajid study light' });
	socket.on('LPCmdStatus', function (data) {
		console.log("[LPCloud]: Received cmd exec status: :"+JSON.stringify(data));
	    });
    });
