console.log('Loading event');

var config = require('./config');
var client = require('twilio')(config.twilio.production.accountsid, config.twilio.production.authtoken);

var async = require('async');

function consolelog (err, messageResponse) {
  if (err) {
    console.log(err);
  }
  else {
    console.dir(messageResponse);
  }
}

// Lambda function:
exports.handler = function (event, context) {

    console.log('Running event');

    // Send an SMS message to the number provided in the event data.
    // End the lambda function when the send function completes.

    async.waterfall([
    	function sendTwilioMessage(next) {
        client.sendMessage({
            to: event.to, // Any number Twilio can deliver to
            from: config.twilio.phoneNumber, // A number you bought from Twilio and can use for outbound communication
            body: 'Welcome to FastEvac! Click here to download the FastEvac app: http://onelink.to/uhenmj To activate the app, use activation code: ' + event.code // body of the SMS message
        }, function(err, responseData) { //this function is executed when a response is received from Twilio
            if (!err) { // "err" is an error received during the request, if any

                // "responseData" is a JavaScript object containing data received from Twilio.
                // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                // console.log(responseData.from); // outputs "+14506667788"
                // console.log(responseData.body); // outputs "word to your mother."

                consolelog(err, responseData);
                next(err);
            }
			    });
		}
    ], function (err) {
        if (err) {
            console.error('Failed to publish notifications: ', err);
        } else {
            console.log('Successfully published all notifications.');
        }
        context.done(err);
    });
};
