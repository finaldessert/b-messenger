import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets/CloseCreateChannel';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
  const handleChange = (e) => {
    e.preventDefault();

    setChannelName(e.target.value);
  };
  
  return (
    <div className='channel-name-input__wrapper'>
        <p>Name</p>
        <input value={channelName} onChange={handleChange} placeholder='Channel Name'/>
        <p>Add Members</p>
    </div>
  );
};

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const[channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

  const createChannel = async (e) => {
    e.preventDefault();

    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName, members: selectedUsers
      });

      await newChannel.watch();

      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newChannel);
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <div className='create-channel__container'>
        <div className='create-channel__header'> 
          <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
          <CloseCreateChannel setIsCreating={setIsCreating} />
        </div>
        {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>}
        <UserList setSelectedUsers={setSelectedUsers} />
        <div className='create-channel__button-wrapper' onClick={createChannel}>
          <p>{createType === 'team' ? 'Create Channel' : 'Create Message'}</p>
        </div>
    </div>
  );
};

export default CreateChannel;