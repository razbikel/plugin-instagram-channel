import styled from 'react-emotion';

export const Container = styled('div')`
    padding:0;
    background-color: #FFF; 
    height: 90%;
    overflow-y:scroll;
    border-bottom:solid;
    border-color:#cccccc;
    border-width: 0px 0px 1px;
`;

export const Chat = styled('div')`
    // width: 45%; 
`

    export const MessagesChat = styled('div')`
        padding: 2% 2%;
        display:flex;
        flex-direction:column;
        align-items:inherit;
    `

        export const Message = styled('div')`
            display:flex;
            align-items: center;
            margin-bottom: 2%;
        `

            export const Photo = styled('img')`
                display: block;
                width: 45px;
                height: 45px;
                background: #E6E7ED;
                -moz-border-radius: 50px;
                -webkit-border-radius: 50px;
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
            `
    
        export const Text = styled('p')`
            margin: 0 10%;
            background-color: #f6f6f6;
            padding:2%;
            border-radius: 12px;
        `

        export const IMG = styled('img')`
            height: 25%;
            width: 25%;
            background-color: #f6f6f6;
            padding:2%;
            margin: 0 10%;
            border-radius: 12px;
            cursor: pointer;
        `

export const TextOnly = styled('div')`
    margin-left: 45px;
`

export const Time = styled('p')`
    font-size: 85%;
    color:lightgrey;
`

export const ResponseTime = styled('p')`
    font-size: 85%;
    float: right;
    color:#ffb0f9;
    // flex-direction: row-reverse;
    // margin-left: auto;
    margin-right: auto;
`

export const Response = styled('div')`
    display:flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-bottom: 2%;
    float: right;
`

    export const ResponseText = styled('p')`
        // margin: 0 10%;
        background-color: #f6f6f6;
        padding: 2%;
        border-radius: 12px;
        background-color: #ffb0f9 !important;
        margin-bottom: 0 !important;
    `

        export const ResponseIMG = styled('img')`
        height: 25%;
        width: 25%;
        background-color: #ffb0f9 !important;
        padding:2%;
        // margin: 0 10%;
        border-radius: 12px;
        cursor: pointer;
    `

export const FooterChat = styled('div')`
    display:flex;
    flex-direction:row;
    align-items:center;
    position:absolute;
    bottom:2.5%;
    width:100%;
    // margin-left:10%;
    margin-right:3%;
`

    export const Icon = styled('i')`
        margin-left: 30px;
        color:#C0C0C0;
        font-size: 14pt;
        cursor: pointer;
    `

    export const Send = styled('div')`
        color:#fff;
        background-color: #4f6ebd;
        // margin-left:5%;
        margin-right:3%;
        padding: 1% 1% 1% 1%;
        border-radius: 50px;
        font-size: 14pt;
        cursor:pointer;
        &:hover{
            background:#95a8d7;
        }
    `

    export const UploadImage = styled('label')`
        color:#fff;
        background-color: #4f6ebd;
        // margin-left:5%;
        margin-right:3%;
        padding: 1% 1% 1% 1%;
        border-radius: 50px;
        font-size: 14pt;
        cursor:pointer;
        &:hover{
            background:#95a8d7;
        }
    `

export const WriteMessage = styled('input')`
    width:75%;
    height: 4vh;
    padding: 2%;
    border: 2px solid #EEE;
    border-radius:50px;
`

