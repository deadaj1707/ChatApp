import React, { Component } from 'react';
const Chat = ({user,message,messages,setMessage, sendMessage})=> {
    return (
        <div className="card border-2 border-info w-100">
            <div className="row vh-95">
          <div className="d-flex flex-column col-12 col-lg-12 col-xl-12 chat-window">
            {/*Chat Header*/}
            <div className="align-items-start py-2 px-4 w-100 border-bottom border-info d-lg-block sticky-top bg-white">
              <div className="d-flex align-items-center py-1">
                <div className="position-relative">
                  <img src="https://bootdey.com/img/Content/avatar/avatar3.png" className="rounded-circle mx-2"
                  alt={user.username}
                  width="40"
                  height="40"
                  />
              </div>
              <div className="flex-grow-1">
                <strong>Logged in as {user}</strong>
              </div>
            </div>
            </div>
            {/*Chat Header*/}
            <div className='position-relative chat-height overflow-auto'>
                <div className='d-flex flex-column p-4'>
                    {messages.map((message,index)=>{
                        return message.type === 'userStatus' ? (
                            <div key={index} className="text-center">
                              <span className="badge bg-info">
                                {message.userId === user.userId ? (
                                  'You have Joined!'
                                ) : (
                                  `${message.username} has joined`
                                )}
                              </span>
                            </div>
                          ) : (
                            <div
                              key={index}
                              className={
                                message.userId === user.userId
                                  ? 'chat-message-right pb-4'
                                  : 'chat-message-left pb-4'
                              }
                            >
                              <div>
                                <img
                                  src="https://bootdey.com/img/Content/avatar/avatar3.png"
                                  className="rounded-circle mr-1"
                                  alt={message.username}
                                  title={message.username}
                                  width="40"
                                  height="40"
                                />
                                <div className="text-muted small text-nowrap mt-2">12:00 AM</div>
                              </div>
                              <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                                <div className="font-weight-bold mb-1">
                                  {message.userId === user.userId ? 'You' : message.username}
                                </div>
                                {message.message}
                              </div>
                            </div>
                          );
                        })
                    }
                </div>
            </div>
            {/*Chat Input*/}
            <div className="mt-auto align-items-end border-info py-3 px-4 border-top d-lg-block chat-input">
                <div className="input-group flex-fill">
                    <input type='text' className='form-control' name="message" value={message} placeholder="Type your message..."
                    onChange={({currentTarget :input})=> setMessage(input.value)}
                    onKeyPress={(e)=> e.code==="Enter" ? sendMessage(): null}
                    />
                    <button className="btn btn-info">Send</button>
                </div>
            </div>
            {/*Chat Input*/}
          </div>
        </div>
        </div>
    );
}
export default Chat;