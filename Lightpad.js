'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = "amzn1.ask.skill.bdd0dd4f-f85a-482c-a657-98d0028fcb33";
var SKILL_NAME = 'Lightpad';


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('Test');
    },
    'AllRoomLights': function () {
        var position = this.event.request.intent.slots.Position.value;
        this.emit('ChangeAllLights', position);
    },
    'ChangeAllLights': function (position) {
        // Position set initially to off
        var p = 0;
        
        // On position
        if (position == "on"){
            p = 1;
        }
        
        // Create speech output
        var speechOutput = "All lights turned " + position;
        
        var temp = this;
        
        changeAllLightsRequestFunction(function requestCallback(err) {
        
            // If error occurs during http.get request - respond with console.log
            if (err) {
                console.log('HTTP Error: request not sent');
            }
        
            temp.emit(':tellWithCard', speechOutput, SKILL_NAME, 'Change all lights.');
        }, p);

    },
    'SingleRoomLight': function () {
        var position = this.event.request.intent.slots.Position.value;
        var room = this.event.request.intent.slots.Room.value;
        this.emit('ChangeLight', position, room);
    },
    'ChangeLight': function (position, room) {
        // Often interprets the word "two" as "to"
        var roomNum = room;
        if(!(room < 2 || room > 2)){
            roomNum = 2;
        }
        
        console.log(position + roomNum);
        var p = 0;
        
        // On position
        if (position == "on"){
            p = 1;
        }
        
        // Create speech output
        var speechOutput = "Light " + roomNum + " turned " + position;
        
        var temp = this;
        
        changeSingleLightRequestFunction(function requestCallback(err) {
        
            // If error occurs during http.get request - respond with console.log
            if (err) {
                console.log('HTTP Error: request not sent');
            }
        
            temp.emit(':tellWithCard', speechOutput, SKILL_NAME, 'Change a single light');
        }, p , roomNum);

    },
      'FloorLights': function() {
        var position = this.event.request.intent.slots.Position.value;
        var floor = this.event.request.intent.slots.Floor.value;
        this.emit('ChangeFloor', position, floor);
    },
    'ChangeFloor': function (position, floor) {
        // Often interprets the word "two" as "to"
        var floorNum = floor;
        if(floor != 1 && floor != 3){
            floorNum = 2;
        }
        console.log(position + floorNum);
        var p = 0;
        
        // On position
        if (position == "on"){
            p = 1;
        }
        
        // Create speech output
        var speechOutput = "Floor " + floorNum + " turned " + position;
        
        var temp = this;
        
        changeFloorLightsRequestFunction(function requestCallback(err) {
        
            // If error occurs during http.get request - respond with console.log
            if (err) {
                console.log('HTTP Error: request not sent');
            }
        
            temp.emit(':tellWithCard', speechOutput, SKILL_NAME, 'Change a floor');
        }, p , floorNum);

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "Ask lightpad to turn on or off light one through nine, floor one through three, or all lights. What can I help you with?";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function() {
        this.emit('AMAZON.HelpIntent');
    },
};


function changeAllLightsRequestFunction(requestCallback, position){
        
    var http = require('http');

    var url = "http://cis.gvsu.edu/~lavigneb/lightpad/changeAllLights.php?light=" + position;

    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        requestCallback(null);
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function changeSingleLightRequestFunction(requestCallback, position, room){
        
    var http = require('http');

    var url = "http://cis.gvsu.edu/~lavigneb/lightpad/light.php?light="+position+"&position="+room;

    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        requestCallback(null);
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function changeFloorLightsRequestFunction(requestCallback, position, floor){
        
    var http = require('http');

    var url = "http://cis.gvsu.edu/~lavigneb/lightpad/changeFloorLights.php?light="+position+"&floor="+floor;

    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        requestCallback(null);
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}
