const FB = require("fb");
FB.options({accessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN,version: 'v12.0'});

exports.handler = async function (context, event, callback) {

    let response = new Twilio.Response();
    response.appendHeader('Content-Type','application/json');
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "OPTIONS,POST");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

    console.log('event', event);

    const client = context.getTwilioClient();

    const get_sender_igsid = async (message_id) => {
        const ig_id = await FB.api(`${message_id}?fields=from`)
        return ig_id.from.id
    }

    const get_conversation_id = async (sender_igsid) => {
        const thread_id = await FB.api(`me/conversations?platform=instagram&user_id=${sender_igsid}`) // THREAD_ID
        return thread_id.data[0].id
    }

    const take_thread_control = async (ig_id) => {
        const res = await FB.api(`me/thread_owner?recipient=${ig_id}`);
        console.log('res take_thread_control', res.data);
        if(!res.data || res.data.length === 0){
            return;
        }
        const thread_owner = res.data[0].thread_owner.app_id;
        console.log('thread_owner', thread_owner);
        if (thread_owner !== process.env.APP_ID){
            console.log('not thread owner - taking control');
            const result = await FB.api(`me/take_thread_control`,'post',{"recipient":{"id":`${ig_id}`}});
            console.log('result', result);
        }
    }

    const find_instagram_sender_task = async (ig_id,thread_id) => {
        let createNewTask = true;
        let taskFilter = `channelType == "instagram"`;
        var promises_tasks = [];
        let tasks = await client.taskrouter.workspaces(context.FLEX_WORKSPACE_SID)
        .tasks
        .list({evaluateTaskAttributes: taskFilter, limit:100})
        if (tasks){
            tasks = tasks.filter( task => {
                const taskAttributes = JSON.parse(task.attributes);
                let conversationId = taskAttributes.conversationsId;
                // let sender_instagram_id = taskAttributes.sender_igsid
                return thread_id === conversationId 
                // return true;
            })


            //  tasks from this sender have already exists 
            if (tasks.length > 0){

                tasks.forEach( async task => {
                    console.log('task.assignmentStatus', task.assignmentStatus)
                    if(task.assignmentStatus === 'assigned'){
                        createNewTask = false;
                        let taskAttributes = { ... JSON.parse(task.attributes) };
                        console.log('taskAttributes',taskAttributes);
                        let taskSid = task.sid;
                        taskAttributes["published"] = true;
                        console.log('taskSid', taskSid);
                        console.log('taskAttributes-update',taskAttributes);
                        try{
                            promises_tasks.push(client.taskrouter.workspaces(context.FLEX_WORKSPACE_SID)
                            .tasks(taskSid)
                            .update({
                                    // assignmentStatus: 'Assigned',
                                    //  reason:'new message',
                                     attributes: JSON.stringify(taskAttributes)
                            }))
                        }
                        catch(error){
                            console.log('error');
                        }
                    }
                    if(task.assignmentStatus === 'pending' || task.assignmentStatus === 'reserved'){
                        createNewTask = false;
                    }
                    // if there is no task which is assigned or pending or reserved, all tasks from this user are 
                    // Wrapping or Completed or Canceled, so create new task is needed
                })
                
            }
        }
        if (promises_tasks && promises_tasks.length > 0){
            // update task attribute if there is the need
            await Promise.all(promises_tasks).then(res => console.log('promise array res', res));
        }
        console.log('createNewTask', createNewTask)
        return createNewTask;
    }

    function verify() {
        console.log("correct");
        if (event["hub.verify_token"] === process.env.VERIFY_TOKEN) {
            callback(null, event["hub.challenge"]);
        } else {
            callback("wrong verify token");
        }
    }

    const send_by_agent = () => {
        if(
            event.entry[0].messaging[0].sender.id === process.env.INSTAGRAM_SID ||
            event.entry[0].id === process.env.INSTAGRAM_SID || 
            event.entry[0].messaging[0].sender.id === process.env.INSTAGRAM_USER_ID ||
            event.entry[0].id === process.env.INSTAGRAM_USER_ID 
        ){
            return true;
        }
        else{
            return false;
        }
    }

    // ***************** Main Program Start Here ***************** //

    if(event["hub.mode"] == "subscribe"){
        verify();
    }
    else{
        try{
            console.log('sender sid', event.entry[0].messaging[0].sender.id);
            if(send_by_agent()){
                // message sent by aman support from plugin, dont need to do anything
                console.log('message sent by aman support from plugin')
                callback(null, "");
            }
            else{
                // message sent by client
                let instagram_objects = [];
                if (event.object === "instagram") {
                    event.entry.forEach(e => {
                        let id = e["id"];
                        if (e.hasOwnProperty('messaging')){
                            e.messaging.forEach(m => {
                                console.log('message', m);
                                let sender_id = m.sender.id;
                                let recipient_id = m.recipient.id;
                                let message = m.message;
                                let message_id = m.message.mid;
                                instagram_objects.push({id, sender_id, recipient_id, message, message_id})
                            })
                        }
                        if (e.hasOwnProperty('changes')){
                            e.changes.forEach(c => {
                                console.log('change', c);
                            })
                        }
                    })
                }
    
                const ig_id = await get_sender_igsid(instagram_objects[0].message_id);
                console.log('ig_id', ig_id);
    
                const thread_id = await get_conversation_id(ig_id)
                console.log('thread_id', thread_id);
    
                const is_instagram_sender_task = await find_instagram_sender_task(ig_id,thread_id)
                console.log('is_instagram_sender_task', is_instagram_sender_task);
    
                // if dont need to create new task
                if(!is_instagram_sender_task){
                    // callback(null, event["hub.challenge"])
                    callback(null, "")
                }
    
                else {
                    await take_thread_control(ig_id);
                    const participants = await FB.api(`${thread_id}?fields=participants`) 
                    console.log(participants);
                    const participant1 = participants.participants.data[0] // { username: 'amantwilio', id: '17841452245932387' }
                    const participant2 = participants.participants.data[1]
    
                    console.log('participant1', participant1)
                    console.log('participant2', participant2)
    
        
                    const taskAttributes = {
                        conversationsId: thread_id,
                        name: participant2.username,
                        channelType: 'instagram',
                        published: false,
                        sender_instagram_id: participant2.id,
                        sender_igsid: ig_id
    
                    }
    
                    console.log('creating new task');
                    await client.taskrouter.workspaces(process.env.FLEX_WORKSPACE_SID).tasks
                    .create({
                        attributes: JSON.stringify(taskAttributes),
                        workflowSid: process.env.WORKFLOW_SID,
                        taskChannel: 'instagram'
                    });
    
                    callback(null, event["hub.challenge"]);
    
                }
            }    
        }
        catch(error){
            console.log(error);
            callback(null, error);
        }
    }

    callback(null, event["hub.challenge"]);

};

