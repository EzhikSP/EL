import React from "react";

function OnlineUsersList({ users }) {
  return (
    <div className="online-users">
      <h3>Онлайн</h3>
      <ul>
        {users.map((user, idx) => (
          <li key={idx}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default OnlineUsersList;
