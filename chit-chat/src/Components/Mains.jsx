import React, { useState, useEffect } from 'react';
import Login from './Login';
import Chat from './Chat';
import PdfUpload from './PdfUpload';
import OnlineUsers from './OnlineUsers';
import './Mains.css';

const Mains = ({ socket }) => {
  const [newUser, setNewUser] = useState('');
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [previewPdf, setPreviewPdf] = useState(null);
  useEffect(() => {
    socket.on('users', (users) => {
      const messagesArr = [];
      for (const { userId, username } of users) {
        const newMessage = { type: 'userStatus', userId, username };
        messagesArr.push(newMessage);
      }
      setMessages([...messages, ...messagesArr]);
      setUsers(users);
    });

    socket.on('session', ({ userId, username }) => {
      setUser({ userId, username });
    });

    socket.on("user connected", ({ userId, username }) => {
      const newMessage = { type: "userStatus", userId, username };
      setMessages([...messages, newMessage]);
    });

    socket.on("new message", ({ userId, username, message }) => {
      const newMessage = {
        type: "message",
        userId,
        username,
        message
      };
      setMessages([...messages, newMessage]);
    });

    socket.on("pdf summary", ({ userId, username, fileName, summary }) => {
      const newMessage = {
        type: "summary",
        userId,
        username,
        message: `Summary of ${fileName}: ${summary}`
      };
      setMessages(messages => [...messages, newMessage]);
    });

    return () => {
      socket.off('users');
      socket.off('session');
      socket.off('user connected');
      socket.off('new message');
      socket.off('pdf summary');
    };
  }, [socket, messages]);

  const handleChange = ({ currentTarget: input }) => setNewUser(input.value);

  const logNewUser = () => {
    setUser({ username: newUser });
    socket.auth = { username: newUser };
    socket.connect();
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const pdfData = reader.result.split(',')[1]; // Base64 part

      const newMessage = {
        type: "file",
        userId: user.userId,
        username: user.username,
        file: pdfData,
        fileName: file.name,
        fileType: file.type,
      };

      // Emit the file upload event to the server
      socket.emit('file upload', newMessage);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfPreview = (file) => {
    setPreviewPdf(file);
  };

  const sendMessage = () => {
    if (!message) return;
    socket.emit("new message", message);
    const newMessage = {
      type: "message",
      userId: user.userId,
      username: user.username,
      message,
    };
    setMessages(messages => [...messages, newMessage]);
    setMessage("");
  };

  const leaveChat = () => {
    socket.disconnect();
    setUser({});
    setMessages([]);
    setNewUser('');
  };

  return (
    <div className="main-content d-flex">
      {user.userId && (
        <div className="online-users-wrapper">
          <OnlineUsers users={users} />
        </div>
      )}
      <div className="chat-container flex-grow-1">
        {user.userId ? (
          <Chat 
            user={user} 
            message={message} 
            messages={messages} 
            setMessage={setMessage} 
            sendMessage={sendMessage} 
            leaveChat={leaveChat} 
          />
        ) : (
          <Login newUser={newUser} handleChange={handleChange} logNewUser={logNewUser} />
        )}
      </div>
      {user.userId && (
        <div className="pdf-upload-container">
          <PdfUpload
  handlePdfUpload={handleFileUpload}
  handlePdfPreview={handlePdfPreview}/>
        </div>
      )}
    </div>
  );
};

export default Mains;
