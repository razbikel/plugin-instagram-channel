const FB = require("fb");
FB.options({accessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,version: 'v12.0'});

exports.handler = async function (context, event, callback) {

    let response = new Twilio.Response();
    response.appendHeader('Content-Type','application/json');
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    try{
        console.log('event', event);
        const conversationsId = event.conversationsId;
        console.log('conversationsId', conversationsId);
        console.log('sender_instagram_id', event.sender_instagram_id)

        const my_avatar = await FB.api(`${process.env.INSTAGRAM_ACCOUNT}?fields=profile_pic`);

        console.log('my_img', my_avatar)


        // const conversations = await FB.api(`${process.env.FB_PAGE_ID}/conversations?platform=instagram`) // THREAD_ID
        // console.log(conversations);


        const participants = await FB.api(`${conversationsId}?fields=participants`) 
        console.log(participants);
        const participant1 = participants.participants.data[0] // { username: 'amantwilio', id: '17841452245932387' }
        const participant2 = participants.participants.data[1]

        console.log('participant1', participant1)
        console.log('participant2', participant2)

        const participant1_img = await FB.api(`${participant1.id}?metadata=1`)  // contains fields of profile_pic and id
        const participant2_img = await FB.api(`${participant2.id}?metadata=1`)

        console.log('participant1_img', participant1_img);
        console.log('participant2_img', participant2_img)


        const id_avatar_map = {
            [process.env.INSTAGRAM_USER_ID]: my_avatar.profile_pic,
            [participant2.id]: participant2_img.profile_pic
        }

        console.log('id_avatar_map', id_avatar_map)


        const messageList = await FB.api(`${conversationsId}?fields=messages`) 

        let messages = [];
        messageList.messages.data.forEach( message => {
            messages.push(FB.api(`${message.id}?fields=message,from{username,id},created_time`))
        } )

        messages = await Promise.all(messages);

        messages = messages.map( message => {
            const with_img = { ...message }
            with_img["profile_pic"] = id_avatar_map[message.from.id]
            return with_img
        })

        messages.forEach( message => {
            console.log('message', message);
        })

        response.setBody({messages})
        callback(null, response);
    }
    catch(error){
        console.log(error);
        callback(null, error);
    }

    


}