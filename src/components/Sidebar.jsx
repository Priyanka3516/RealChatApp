import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";

import { db, auth } from "../firebase";
import "../css/Sidebar.css";

function Sidebar({
  currentUser,
  selectedUser,
  onSelectUser,
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Load users from Firebase
  useEffect(() => {
    if (!currentUser) return;

    const usersRef = ref(db, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setUsers([]);
          return;
        }

        const userList = Object.entries(data)
          .map(([uid, userData]) => ({
            uid,
            ...userData,
          }))
          .filter(
            (userData) =>
              userData.uid !== currentUser.uid
          );

        setUsers(userList);
      },
      (error) => {
        console.error(
          "Error loading users:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Search users
  const filteredUsers = users.filter((user) =>
    user.email
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // Get first letter
  const getInitial = (email) => {
    if (!email) return "U";

    return email.charAt(0).toUpperCase();
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  return (
    <aside className="sidebar">

      {/* =================================
          APP HEADER
      ================================= */}

      <div className="sidebar-header">

        <div className="brand">

          <div className="brand-icon">
            💬
          </div>

          <div className="brand-text">
            <h1>REAL TIME</h1>
            <span>CHAT</span>
          </div>

        </div>

        {/* LOGOUT BUTTON */}

        <button
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          ⎋ Logout
        </button>

      </div>


      {/* =================================
          CURRENT USER
      ================================= */}

      <div className="current-user">

        <div className="avatar avatar-large">

          {getInitial(currentUser?.email)}

          <span className="online-indicator"></span>

        </div>

        <div className="current-user-details">

          <h3>
            {currentUser?.email}
          </h3>

          <div className="online-text">

            <span className="status-dot"></span>

            Online

          </div>

        </div>

      </div>


      {/* =================================
          SEARCH BAR
      ================================= */}

      <div className="search-wrapper">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {search && (
          <button
            className="clear-button"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}

      </div>


      {/* =================================
          CONTACT HEADER
      ================================= */}

      <div className="contacts-title">

        <span>MESSAGES</span>

        <span className="user-count">
          {filteredUsers.length}
        </span>

      </div>


      {/* =================================
          USERS
      ================================= */}

      <div className="users-container">

        {filteredUsers.length === 0 ? (

          <div className="no-users">

            <div className="no-users-icon">
              👥
            </div>

            <p>
              {search
                ? "No users found"
                : "No other users"}
            </p>

          </div>

        ) : (

          filteredUsers.map((user) => {

            const isSelected =
              selectedUser?.uid === user.uid;

            return (
              <button
                key={user.uid}
                className={`user-item ${
                  isSelected
                    ? "user-item-selected"
                    : ""
                }`}
                onClick={() =>
                  onSelectUser(user)
                }
              >

                {/* Avatar */}

                <div className="avatar">

                  {getInitial(user.email)}

                  <span className="contact-online"></span>

                </div>


                {/* User information */}

                <div className="user-information">

                  <div className="user-name">
                    {user.email}
                  </div>

                  <div className="last-message">
                    Click to start chatting
                  </div>

                </div>

              </button>
            );
          })
        )}

      </div>


      {/* =================================
          SIDEBAR FOOTER
      ================================= */}

      <div className="sidebar-footer">

        <div className="connection-status">

          <span className="status-dot"></span>

          <span>
            Connected
          </span>

        </div>

        <span className="version">
          v1.0
        </span>

      </div>

    </aside>
  );
}

export default Sidebar;