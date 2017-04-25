/**************************************************************************
 * Lambda function to change light values for the LightPad skillset.
 * 
 * @authors Curtis Holden, Brandon LaVigne, Brian Moore
 * @date April 25, 2017
 **************************************************************************/

'use strict';
var Alexa = require('alexa-sdk');

// Set to application ID from skillset
var APP_ID = "amzn1.ask.skill.bdd0dd4f-f85a-482c-a657-98d0028fcb33";
var SKILL_NAME = 'Lightpad';

/***********************************************************************
 * Set handlers for Lambda request input.
 * 
 * @param Lambda request
 * @param Context of the lambda request
 * @param Variable for error handling
 **********************************************************************/
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

// Hanldler Functions
var handlers = {
    
    /**************************************************************************
     * Change all lights at once using lambda request value 'Position'.
     **************************************************************************/
    'AllRoomLights': function () {
        
        // Get value from lambda request
        var position = this.event.request.intent.slots.Position.value
        var p = 0;
        
        // On position
        if (position == "on"){
            p = 1;
        }
        var temp = this;
        // Create speech output
        var speechOutput = "All lights turned " + position;
        
        changeAllLightsRequestFunction(function requestCallback(err) {
        
            // If error occurs during http.get request - respond with console.log
            if (err) {
                console.log('HTTP Error: request not sent');
            }
            
            // Produce card on Alexa app
            temp.emit(':tellWithCard', speechOutput, SKILL_NAME, 'Turned '+position+' all lights.');
        }, p);

    },
    
    /**************************************************************************
     * Change a single light using lambda request values 'Position' and 'Room'.
     **************************************************************************/
    'SingleRoomLight': function () {
        
        // Get values from lambda request
        var position = this.event.request.intent.slots.Position.value;
        var room = this.event.request.intent.slots.Room.value;
        
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
        var temp = this;
        // Create speech output
        var speechOutput = "Light " + roomNum + " turned " + position;
        
        changeSingleLightRequestFunction(function requestCallback(err) {
        
            // If error occurs during http.get request - respond with console.log
            if (err) {
                console.log('HTTP Error: request not sent');
            }
        
            // Produce card on Alexa app
            temp.emit(':tellWithCard', speechOutput, SKILL_NAME, 'Turned '+position+' light '+roomNum+'.');
        }, p , roomNum);

    },
    
    /**************************************************************************
     * Change entire floor using lambda request values 'Position' and 'Floor'.
     **************************************************************************/
    'FloorLights': function () {
        
        // Get values from lambda request
        var position = this.event.request.intent.slots.Position.value;
        var floor = this.event.request.intent.slots.Floor.value;
        
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
        var temp = this;
        // Create speech output
        var speechOutput = "Floor " + floorNum + " turned " + position;
        
        changeFloorLightsRequestFunction(function requestCallback(err) {
        
            // If error occurs during http.get request - respond with console.log
            if (err) {
                console.log('HTTP Error: request not sent');
            }
        
            // Produce card on Alexa app
            temp.emit(':tellWithCard', speechOutput, SKILL_NAME, 'Turned '+position+' floor '+floorNum+'.');
        }, p , floorNum);

    },
    
    /**************************************************************************
     * Help response to give instruction to user.
     **************************************************************************/
    'AMAZON.HelpIntent': function () {
        var speechOutput = "Ask lightpad to turn on or off light one through nine, floor one through three, or all lights.";
        this.emit(':tellWithCard', speechOutput+' What can I help you with?', SKILL_NAME, 'Help: '+speechOutput);
    },
    
    /**************************************************************************
     * When request is canceled by user.
     **************************************************************************/
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    
    /**************************************************************************
     * When request is stopped by user.
     **************************************************************************/
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    
    /**************************************************************************
     * When request is unknown.
     **************************************************************************/
    'Unhandled': function() {
        this.emit('AMAZON.HelpIntent');
    },
};

/***********************************************************************
 * Carry out communications to change all lights (change web page).
 * 
 * @param variable for error handling
 * @param position of lights ('on' or 'off')
 **********************************************************************/
function changeAllLightsRequestFunction(requestCallback, position){
        
    var http = require('http');

    // Web page to change all light values
    var url = "http://cis.gvsu.edu/~lavigneb/lightpad/changeAllLights.php?light=" + position;

    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        requestCallback(null);
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

/***********************************************************************
 * Carry out communications to change a single light (change web page).
 * 
 * @param variable for error handling
 * @param position of lights ('on' or 'off')
 * @param room number (1-9)
 **********************************************************************/
function changeSingleLightRequestFunction(requestCallback, position, room){
        
    var http = require('http');

    // Web page to change a room light value
    var url = "http://cis.gvsu.edu/~lavigneb/lightpad/light.php?light="+position+"&position="+room;

    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        requestCallback(null);
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

/***********************************************************************
 * Carry out communications to change an entire floor (change web page).
 * 
 * @param variable for error handling
 * @param position of lights ('on' or 'off')
 * @param floor number (1-3)
 **********************************************************************/
function changeFloorLightsRequestFunction(requestCallback, position, floor){
        
    var http = require('http');

    // Web page to change a floors light values
    var url = "http://cis.gvsu.edu/~lavigneb/lightpad/changeFloorLights.php?light="+position+"&floor="+floor;

    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        requestCallback(null);
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}
