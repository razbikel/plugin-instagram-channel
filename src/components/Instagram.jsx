import React from "react";
import axios from "axios";
import qs from 'qs';
import { withTheme, withTaskContext } from '@twilio/flex-ui';
import {message} from "antd";
import {Container, Chat, MessagesChat, Message, Photo, Text, TextOnly, Time, ResponseTime, Response, ResponseText, FooterChat, Send, WriteMessage, IMG, ResponseIMG, UploadImage} from '../components/styles/ChatWindow.Styles';
import { Icon } from '@twilio/flex-ui';



const SendButton = (props) => {
    return (
      <Icon icon="SendLarge"/>
    );
  }

const Attachment = (props) => {
    return (
      <Icon icon="Attachment"/>
    );
  }


class Instagram extends React.Component {

    constructor() {
        super();
        // published = true means that message has been sent but not yet rendered to the screen
        this.state = {
            conversation: undefined,
            edit: "",
            published: false,
            messages_array_arrays: undefined,
            scroller:undefined,
        };
    }


    messagesEndRef = React.createRef()


    scrollToBottom = () => {
        this.state.scroller.scrollIntoView({ behavior: 'smooth' })
      }

    openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
      }


    fetch_conversation = async () => {
        if(this.props.task){
            let conversationsId = this.props.task.attributes.conversationsId
            console.log('***conversationsId', conversationsId);
            let sender_id = this.props.task.attributes.sender_instagram_id
            const conversation = await axios.get(`https://instagram-integration-5004-dev.twil.io/fetch_conversation_messages?conversationsId=${conversationsId}&sender_instagram_id=${sender_id}`);
            console.log('***conversation', conversation);
            this.setState({
                    conversation: conversation.data.messages.reverse(),
                    published: this.props.task.attributes.published
            }, () => {
                console.log('***messages', this.state.conversation);
                this.create_array_of_messages_array(this.state.conversation)
            })
        }
    }


    async componentDidMount() {
        console.log('***componentDidMount')
        console.log('***task', this.props.task);
        if(!this.props.task.attributes.is_story){
            await this.fetch_conversation();
            const div = this.messagesEndRef.current;
            this.setState({ scroller: div })
            this.scrollToBottom()
        }
    }


    editorOnChange = (e) => {
        this.setState({edit: e.target.value});
    };


    editorOnSubmit = async () => {
         let sender_id = this.props.task.attributes.sender_igsid
         let text = this.state.edit;
         try{
            const res = await axios.get(`https://instagram-integration-5004-dev.twil.io/send_message?sender_instagram_id=${sender_id}&message_text=${text}`);
            console.log('***send-message-res', res);
            this.setState({edit:""})
            await this.fetch_conversation();

         }
         catch(error){
             console.log('error', error);
         }
    };


    renderNewMessage = async () => {
            console.log('***RENDERING NEW MESSAGE****');
            // this.setState({ published: false })
            await this.fetch_conversation();
            if(this.props.task){
                this.props.task.setAttributes({
                    ...this.props.task.attributes
                    , published: false
                });
            }
    }


    // [message from client, client, agent, agent, client] => [ [client,client], [agent,agent], [client] ]
    create_array_of_messages_array = (messages) => {
        const res = [];
        let temp_arr = [];
        for(let i = 0; i < messages.length ; i++){
            temp_arr.push(messages[i]);
            if(messages[i+1] !== null && messages[i+1] !== undefined){
                // not last message
                if(messages[i].from.id !== messages[i+1].from.id){
                    res.push(temp_arr);
                    temp_arr = [];
                }
            }
            else{
                // last message
                res.push(temp_arr);
            }
        }
        console.log('***ARRAY-OF-ARRAYS', res);
        this.setState({
            messages_array_arrays: res
        }, () => {
            if(this.state.scroller){
                this.scrollToBottom()
            }
        })
    }


    // [ [message from client, client], [agent, agent], [client] ] => [jsx of messagem, jsx of message ...]
    get_messages_jsx = () => {
        if (this.state.messages_array_arrays){
            const jsx_arr = this.state.messages_array_arrays.map( (messages_array, index) => {
                const from_client = messages_array[0].from.id !== "17841452245932387";
                return(
                    <MessagesChat key={index}>
                        {from_client ? <Photo src={`${messages_array[0].profile_pic}`}/> : null}
                        {messages_array.map( (message, index) => {
                            console.log('***MESSAGE', message);
                            let media_url = message.attachments && message.attachments.data[0].image_data.url ? message.attachments.data[0].image_data.url : undefined;
                            if (from_client){
                                const is_story = message.hasOwnProperty('story');
                                const story_expired = message.hasOwnProperty('story') && message.story.mention.link === "";
                                return(
                                    <Message key={index}>
                                        {
                                            is_story && story_expired ? <Text>Mentioned you in their story. (data expired)</Text> : 
                                            is_story ? <IMG src={message.story.mention.link} onClick={() => this.openInNewTab(message.story.mention.link)}></IMG> : 
                                            media_url ? <IMG src={media_url} alt={`media-url-${index}`} onClick={() => this.openInNewTab(media_url)}/> : <Text>{message.message}</Text>
                                        }
                                    </Message>
                                )
                            }
                            else{
                                return(
                                    <Response key={index}>
                                         {media_url ? <ResponseIMG src={media_url} alt={`media-url-${index}`} onClick={() => this.openInNewTab(media_url)}/> : <ResponseText>{message.message}</ResponseText>}
                                    </Response>
                                )
                            }
                        })}
                        {from_client ? <Time>{messages_array[messages_array.length - 1].created_time}</Time> : <ResponseTime>{messages_array[messages_array.length - 1].created_time}</ResponseTime>}
                    </MessagesChat>
                )
            })
            console.log('***jsx_arr', jsx_arr)
            return jsx_arr;
        }
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }


    send_media_message = async (media_url, user_ig_sid) => {

        let data = {
            // 'Token': this.props.manager.store.getState().flex.session.ssoTokenPayload.token,
            'media_url': media_url,
            'sender_instagram_id': user_ig_sid
        }

        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            data: qs.stringify(data),
            url: 'https://instagram-integration-5004-dev.twil.io/send_media_message'
        };

        const send_res = await axios(options);
        console.log('***SEND_MEDIA_RES', send_res);
        await this.fetch_conversation();
    }


    send_file = async (event) => {
        console.log('***BP2', event.target.files[0])
        let sender_id = this.props.task.attributes.sender_igsid
        const file = event.target.files[0];
        const file_name = file && file.name ? file.name: null;
        const base_64_file = await this.getBase64(file);


        let data = {
            // 'Token': this.props.manager.store.getState().flex.session.ssoTokenPayload.token,
            'base64_file': base_64_file,
            'file_name': file_name
        }

        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            data: qs.stringify(data),
            url: 'https://instagram-integration-5004-dev.twil.io/upload_image'
        };
        try{
            const upload_file_res = await axios(options);
            console.log('***MEDIA_URL', upload_file_res.data.media_url)
            await this.send_media_message(upload_file_res.data.media_url, sender_id);

        }
        catch(error){
            console.log('***UPLOAD FILE ERROR', error);
        }
      

    }


    render() {
         if (this.props.task){
             if (this.props.task.attributes.published){
                this.renderNewMessage();
             }
         }

         console.log('***IS_STORY', this.props.task.attributes.is_story)

        //  story task
         if (this.props.task.attributes.is_story){
             return(
                <div>
                    <h1 style={{marginTop:"5%"}}>
                        <u><b>{`${this.props.task.attributes.name} `}</b></u> mentioned you in their story:
                    </h1>
                    <div>
                        <img
                            alt="story"
                            src={`${this.props.task.attributes.story_media}`}
                            style={{width:"100%", height:"70vh", marginTop:"5%", cursor:"pointer"}}
                            onClick={() => this.openInNewTab(this.props.task.attributes.story_media)}
                        />
                    </div>
                </div>
             )
         }
         else{
            // message task
            if (!this.state.conversation){
                return(
                    <div>loading...</div>
                )
            }
            else {
                return(
                    <div style={{width:"100%"}}>
                        <Container id='instagram-chat-container'  >
                            <Chat>
                                    {this.get_messages_jsx()}
                            </Chat>
                            <FooterChat>
                                <WriteMessage type="text" placeholder="הודעה..." onChange={this.editorOnChange} onSubmit={this.editorOnSubmit} value={this.state.edit} ></WriteMessage>
                                <Send aria-hidden="true" onClick={this.editorOnSubmit}>
                                    <SendButton/>
                                </Send>

                                <UploadImage for="file-upload" style={{border:"1px solid #ccc", display:"inline-block", padding:"6px 12px", cursor:"pointer"}}>
                                    <Attachment />
                                </UploadImage>
                                <input type="file" name="file" onChange={this.send_file} id="file-upload" style={{display:"none"}} />
                            </FooterChat>
                            <div ref={this.messagesEndRef}/>
                        </Container>
                    </div>
        
                )
            }
         }

    }
}

export default withTaskContext(withTheme(Instagram));



