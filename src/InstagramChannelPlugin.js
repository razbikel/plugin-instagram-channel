import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';
import Instagram from './components/Instagram'
import 'antd/dist/antd.css';



const PLUGIN_NAME = 'InstagramChannelPlugin';

const icon = () => {
  return (
      <img style={{height: '90%', width: '90%'}} src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/800px-Instagram_logo_2016.svg.png' alt="instagram_logo"></img>
  )
}

export default class InstagramChannelPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    // flex.ChatOrchestrator.setOrchestrations("accepted", ["AddToChatChannel"]);
    // flex.ChatOrchestrator.setOrchestrations("accepted", []);
    // createChatTaskChannel
    const instagram_chat_channel = flex.DefaultTaskChannels.createDefaultTaskChannel("instagram", task => {
      return task.taskChannelUniqueName === "instagram"
    })
    instagram_chat_channel.icons = {
      active: icon,
      // list: {
      //   Assigned:  icon,
      //   Canceled:  icon,
      //   Completed: icon,
      //   Pending:   icon,
      //   Reserved:  icon,
      //   Wrapping:  icon
      // },
      list: icon,
      main: icon
    }


    instagram_chat_channel.addedComponents = [
      {
        target: "TaskCanvasTabs",
        sortOrder: 1,
        align: "end",
        component: <Instagram manager={manager} icon="MessageBold" iconActive="MessageBold" key="InstagramChat" />
      }
    ];
    
    flex.TaskChannels.register(instagram_chat_channel)
    // console.log('***channels', flex.TaskChannels.getRegistered())

  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
