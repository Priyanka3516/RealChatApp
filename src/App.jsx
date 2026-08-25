import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Check Firebase login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        // Clear selected chat after logout
        if (!currentUser) {
          setSelectedUser(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-box">
          <div className="loading-icon">💬</div>
          <h2>RealTimeChat</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // ================================
  // LOGIN / REGISTER
  // ================================

  if (!user) {
    return (
      <div className="auth-page">

        <div className="auth-container">

          <div className="auth-logo">
            💬
          </div>

          <h1>RealTimeChat</h1>

          <p className="auth-subtitle">
            Connect and chat in real time
          </p>

          {showRegister ? (
            <>
              <Register />

              <div className="auth-switch">
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    setShowRegister(false)
                  }
                >
                  Login
                </button>
              </div>
            </>
          ) : (
            <>
              <Login />

              <div className="auth-switch">
                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() =>
                    setShowRegister(true)
                  }
                >
                  Register
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    );
  }

  // ================================
  // MAIN CHAT DASHBOARD
  // ================================

  return (
    <div className="app">

      {/* LEFT SIDEBAR */}

      <Sidebar
        currentUser={user}
        selectedUser={selectedUser}
        onSelectUser={(selected) =>
          setSelectedUser(selected)
        }
      />


      {/* RIGHT CHAT AREA */}

      <main className="chat-area">

        {selectedUser ? (

          <Chat
            user={user}
            selectedUser={selectedUser}
            onBack={() =>
              setSelectedUser(null)
            }
          />

        ) : (

          <div className="empty-chat">

            <div className="empty-chat-icon">
              💬
            </div>

            <h2>
              Welcome to RealTimeChat
            </h2>

            <p>
              Select a user from the left
              to start chatting.
            </p>

            <div className="empty-chat-tip">
              👈 Choose someone from your
              contact list
            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;