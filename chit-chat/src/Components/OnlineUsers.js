// OnlineUsers.js
import React from 'react';
import './OnlineUsers.css';

const OnlineUsers = ({ users }) => {
  return (
    <div className="online-users-container">
      <h5>Online Users</h5>
      <ul className="online-users-list">
        {users.map((user) => (
          <li key={user.userId} className="online-user">
            <img 
              src={`https://ui-avatars.com/api/?name=${user.username}&size=40`} 
              alt={`${user.username}'s avatar`} 
              className="user-avatar"
            />
            <span>{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
