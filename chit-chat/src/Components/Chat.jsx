import React from 'react';
import { FaPaperclip } from 'react-icons/fa';

const handleFileDownload = (e, msg) => {
  e.preventDefault();
  const link = document.createElement('a');
  link.href = msg.file;
  link.download = msg.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Chat = ({ user, message, messages, setMessage, sendMessage, handleFileUpload }) => {
  return (
    <div className="card border-2 border-info w-100 bg-dark text-white">
      <div className="row vh-95">
        <div className="d-flex flex-column col-12 col-lg-12 col-xl-12 chat-window">
          {/* Chat Header */}
          <div className="align-items-start py-2 px-4 w-100 border-bottom border-info d-lg-block sticky-top bg-secondary">
            <div className="d-flex align-items-center py-1">
              <div className="position-relative">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar3.png"
                  className="rounded-circle mx-2"
                  alt={user.username}
                  width="40"
                  height="40"
                />
              </div>
              <div className="flex-grow-1">
                <strong>Logged in as {user.username}</strong>
              </div>
            </div>
          </div>
          {/* End Chat Header */}

          {/* Chat Messages */}
          <div className="position-relative chat-height overflow-auto p-4" style={{ maxHeight: '75vh' }}>
            <div className="d-flex flex-column">
              {messages.map((msg, index) => (
                msg.type === 'userStatus' ? (
                  // User status message (e.g., user joined)
                  <div key={index} className="text-center mb-2">
                    <span className="badge bg-info text-dark">
                      {msg.userId === user.userId
                        ? 'You have Joined!'
                        : `${msg.username} has joined`}
                    </span>
                  </div>
                ) : msg.type === 'file' && msg.file && msg.fileType ? (
                  <div key={index} className="mb-2">
                    {msg.fileType.startsWith('image/') ? (
                      <img
                        src={msg.file}
                        alt={msg.fileName}
                        className="img-fluid rounded"
                        style={{ maxWidth: '100%' }}
                      />
                    ) : msg.fileType === 'application/pdf' ? (
                      <div className="bg-light text-dark p-3 rounded shadow-sm" style={{ position: 'relative', marginLeft: '40px', maxWidth: '75%' }}>
                        <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                        <a href={msg.file} download={msg.fileName} onClick={(e) => handleFileDownload(e, msg)} className="text-primary">
                          {msg.fileName}
                        </a>
                      </div>
                    ) : (
                      <div className="bg-light text-dark p-3 rounded shadow-sm" style={{ position: 'relative', marginLeft: '40px', maxWidth: '75%' }}>
                        <i className="fa fa-file-o" aria-hidden="true"></i>
                        <a href={msg.file} download={msg.fileName} onClick={(e) => handleFileDownload(e, msg)} className="text-primary">
                          {msg.fileName}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular text message
                  <div
                    key={index}
                    className={
                      msg.userId === user.userId
                        ? 'chat-message-right pb-4'
                        : 'chat-message-left pb-4'
                    }
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar3.png"
                        className="rounded-circle mr-1"
                        alt={msg.username}
                        title={msg.username}
                        width="40"
                        height="40"
                      />
                      <div className="bg-light text-dark rounded py-2 px-3 shadow-sm ml-3" style={{ maxWidth: '75%', position: 'relative' }}>
                        <div className="font-weight-bold mb-1">
                          {msg.userId === user.userId ? 'You' : msg.username}
                        </div>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
          {/* End Chat Messages */}

          {/* Chat Input */}
          <div className="mt-auto align-items-end border-info py-3 px-4 border-top d-lg-block chat-input bg-secondary">
            <div className="input-group flex-fill">
              <input
                type="text"
                className="form-control bg-light text-dark"
                name="message"
                value={message}
                placeholder="Type your message..."
                onChange={({ currentTarget: input }) => setMessage(input.value)}
                onKeyPress={(e) => (e.code === "Enter" ? sendMessage() : null)}
              />
              <label htmlFor="file-upload" className="btn btn-link text-info">
                <FaPaperclip size={24} />
              </label>
              <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button className="btn btn-info" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
          {/* End Chat Input */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
