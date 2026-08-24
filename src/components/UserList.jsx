import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";

import { db } from "../firebase";

function UserList({
  currentUser,
  onSelectUser,
  search = "",
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setUsers([]);
          setLoading(false);
          return;
        }

        const userList = Object.entries(data)
          .map(([uid, user]) => ({
            uid,
            ...user,
          }))
          .filter(
            (user) => user.uid !== currentUser.uid
          );

        setUsers(userList);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Error loading users:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  /* Search users */
  const filteredUsers = users.filter((user) =>
    user.email
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-users">
        Loading users...
      </div>
    );
  }

  return (
    <div className="user-list">

      <div className="user-list-title">
        <span>Messages</span>
        <span className="user-count">
          {filteredUsers.length}
        </span>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-users">
          <div className="no-users-icon">
            👤
          </div>

          <p>No users found</p>
        </div>
      ) : (
        filteredUsers.map((user) => (

          <button
            key={user.uid}
            className="user-item"
            onClick={() =>
              onSelectUser(user)
            }
          >

            {/* Avatar */}
            <div className="user-avatar">
              {user.email
                ? user.email
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            {/* User information */}
            <div className="user-info">

              <div className="user-name">
                {user.email}
              </div>

              <div className="user-last-message">
                Click to start chatting
              </div>

            </div>

            {/* Online indicator */}
            <div className="user-online-dot"></div>

          </button>

        ))
      )}

    </div>
  );
}

export default UserList;