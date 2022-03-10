import React from "react";
import axios from "axios";
import { withTheme, withTaskContext } from '@twilio/flex-ui';

import {Container, Chat, MessagesChat, Message, Photo, Text, TextOnly, Time, ResponseTime, Response, ResponseText, FooterChat, Send, WriteMessage} from '../../src/components/styles/ChatWindow.Styles';

import { Icon } from '@twilio/flex-ui';





const SendButton = (props) => {
    return (
      <Icon icon="SendLarge"/>
    );
  }



class ChatWindow extends React.Component {

    constructor() {
        super();
    }


    messagesEndRef = React.createRef()


    async componentDidMount() {
        const div = this.messagesEndRef.current;
            this.scrollToBottom(div)
    }

    scrollToBottom = (div) => {
        div.scrollIntoView({ behavior: 'smooth' })
      }


    render() {
        return(
            <Container id='instagram-chat-container'  >
                <Chat >
                    <MessagesChat>
                        <Photo src='https://scontent-iad3-1.xx.fbcdn.net/v/t51.2885-15/274642099_500143544805971_4872613845511312091_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=86c713&_nc_ohc=LjoI-58UWSEAX_wa3Au&_nc_ht=scontent-iad3-1.xx&edm=AAIyh0EEAAAA&oh=00_AT_eH18vdnfRz3MuaSVG7aOXrbEVuvwVMPmhrThFh89o3Q&oe=622BCD54' />
                        <Message>
                            <Text> Hi, how are you ? </Text>
                        </Message>
                        <Message>
                            <Text> What are you doing tonight ? Want to go take a drink ?</Text>
                        </Message>
                        <Message>
                            <Text>fngkjdnglngd nvdklvn</Text>
                        </Message>
                        <Message>
                            <Text>efjkwenfjkfw fwejkfnkew</Text>
                        </Message>
                        <Time> 14h58</Time>
                    </MessagesChat>

                    <MessagesChat>
                        <Response>
                            <ResponseText> Hey Megan ! It's been a while 😃</ResponseText>
                        </Response>
                        <Response>
                            <ResponseText> When can we meet ?</ResponseText>
                        </Response>
                        <Response>
                            <ResponseText>kdjnsgkfn jefnewjkfn efwef</ResponseText>
                        </Response>
                        <ResponseTime> 15h04</ResponseTime>
                    </MessagesChat> 

                    <MessagesChat>
                        <Photo src='https://scontent-iad3-1.xx.fbcdn.net/v/t51.2885-15/274642099_500143544805971_4872613845511312091_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=86c713&_nc_ohc=LjoI-58UWSEAX_wa3Au&_nc_ht=scontent-iad3-1.xx&edm=AAIyh0EEAAAA&oh=00_AT_eH18vdnfRz3MuaSVG7aOXrbEVuvwVMPmhrThFh89o3Q&oe=622BCD54' />  
                        <Message>
                            <Text> 9 pm at the bar if possible 😳</Text>
                        </Message>
                        <Message>
                            <Text> 9 pm at the bar if possible 😳</Text>
                        </Message>
                        <Message>
                            <Text> 9 pm at the bar if possible 😳</Text>
                        </Message>
                        <Message>
                            <Text> 9 pm at the bar if possible 😳</Text>
                        </Message>
                        <Message>
                            <Text> 9 pm at the bar if possible 😳</Text>
                        </Message>
                        <Time> 15h09</Time>
                    </MessagesChat>
                </Chat>
                <FooterChat>
                    <WriteMessage type="text" placeholder="Type your message here"></WriteMessage>
                    <Send aria-hidden="true">
                        <SendButton/>
                    </Send>
                </FooterChat>
                <div ref={this.messagesEndRef}/>
            </Container>            
        )

    }
}

export default withTaskContext(withTheme(ChatWindow));



