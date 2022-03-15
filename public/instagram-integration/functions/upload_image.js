
exports.handler = async function (context, event, callback) {

    const axios = require('axios')


    let response = new Twilio.Response();
    response.appendHeader('Content-Type','application/json');
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log('event', event);


        try{
            const UPLOAD_IMAGE_URL = 'https://us-central1-primordial-hall-305818.cloudfunctions.net/base64ToUrl';
            let params = {
                data: event.base64_file,
                fileName: event.file_name
            }
            const media_url = await axios.post(UPLOAD_IMAGE_URL, JSON.stringify(params), {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                auth: {
                    username: 'admin',
                    password: 'bHhs_!(}WZc7qGnv'
                }
            });
            console.log('media_url', media_url.data.publicUrl)
            response.setBody({ media_url: media_url.data.publicUrl })
            callback(null, response);
        }
        catch(error){
            console.log(error);
            callback(null, error);
        }
    

    callback(null, response);

};

