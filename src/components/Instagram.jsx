import React from "react";
import axios from "axios";
import { withTheme, withTaskContext } from '@twilio/flex-ui';
import {message} from "antd";
import {Container, Chat, MessagesChat, Message, Photo, Text, TextOnly, Time, ResponseTime, Response, ResponseText, FooterChat, Send, WriteMessage} from '../components/styles/ChatWindow.Styles';
import { Icon } from '@twilio/flex-ui';



const SendButton = (props) => {
    return (
      <Icon icon="SendLarge"/>
    );
  }

class Instagram extends React.Component {

    constructor() {
        super();
        // published = true means that message has been sent but not yet rendered to the screen
        this.state = {conversation: undefined, edit: "", published: false, messages_array_arrays: undefined, scroller:undefined};
    }


    messagesEndRef = React.createRef()


    scrollToBottom = () => {
        this.state.scroller.scrollIntoView({ behavior: 'smooth' })
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
        await this.fetch_conversation();
        const div = this.messagesEndRef.current;
        this.setState({ scroller: div })
        this.scrollToBottom()
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
                            if (from_client){
                                return(
                                    <Message key={index}>
                                        <Text>{message.message}</Text>
                                    </Message>
                                )
                            }
                            else{
                                return(
                                    <Response key={index}>
                                        <ResponseText>{message.message}</ResponseText>
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


    render() {
         if (this.props.task){
             if (this.props.task.attributes.published){
                this.renderNewMessage();
             }
         }

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
                        </FooterChat>
                        <div ref={this.messagesEndRef}/>
                    </Container>
                </div>
      
            )
        }
    }
}

export default withTaskContext(withTheme(Instagram));



