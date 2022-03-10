const FB = require("fb");
FB.options({accessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,version: 'v12.0'});

exports.handler = async function (context, event, callback) {

    let response = new Twilio.Response();
    response.appendHeader('Content-Type','application/json');
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log('event', event);

        try{
            const sender_instagram_id = event.sender_instagram_id;
            const message_text = event.message_text;
            const send_message = await FB.api(`/me/messages?access_token=${process.env.INSTAGRAM_PAGE_ACCESS_TOKEN}`, 'post', {message:{text:`${message_text}`}, recipient:{id:`${sender_instagram_id}`}});
            console.log('send_message', send_message)
            response.setBody({status: 'success'})
            callback(null, response);
        }
        catch(error){
            console.log(error);
            callback(null, error);
        }
    

    callback(null, response);

};

