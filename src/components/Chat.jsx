import { useEffect, useState } from "react";

import {
  ref,
  push,
  onValue,
  serverTimestamp,
} from "firebase/database";

import { auth, db } from "../firebase";

function Chat({ user, selectedUser, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Create the same conversation ID for both users
  const getConversationId = () => {
    const ids = [user.uid, selectedUser.uid];

    ids.sort();

    return `${ids[0]}_${ids[1]}`;
  };

  // Listen to this private conversation
  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const conversationId = getConversationId();

    const messagesRef = ref(
      db,
      `conversations/${conversationId}/messages`
    );

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setMessages([]);
          return;
        }

        const messageList = Object.entries(data).map(
          ([id, messageData]) => ({
            id,
            ...messageData,
          })
        );

        messageList.sort(
          (a, b) =>
            (a.createdAt || 0) - (b.createdAt || 0)
        );

        setMessages(messageList);
      },
      (error) => {
        console.error("Database error:", error);
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, [selectedUser, user.uid]);

  // Send private message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const conversationId = getConversationId();

      const messagesRef = ref(
        db,
        `conversations/${conversationId}/messages`
      );

      await push(messagesRef, {
        text: text,
        senderId: user.uid,
        senderEmail: user.email,
        receiverId: selectedUser.uid,
        receiverEmail: selectedUser.email,
        createdAt: serverTimestamp(),
      });

      setMessage("");

    } catch (error) {
      console.error("Send message error:", error);

      setError(
        "Message could not be sent: " +
          error.message
      );

    } finally {
      setSending(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
        }}
      >

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <button onClick={onBack}>
            ← Back
          </button>

          <h2 style={{ margin: 0 }}>
            {selectedUser.email}
          </h2>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

        <hr />

        {/* Error */}
        {error && (
          <div
            style={{
              color: "red",
              backgroundColor: "#ffe5e5",
              padding: "10px",
              margin: "15px 0",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        {/* Messages */}
        <div
          style={{
            height: "450px",
            overflowY: "auto",
            padding: "15px",
            marginBottom: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => {
              const isMine =
                msg.senderId === user.uid;

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: isMine
                      ? "flex-end"
                      : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      backgroundColor: isMine
                        ? "#2563eb"
                        : "#e5e7eb",
                      color: isMine
                        ? "white"
                        : "black",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        marginBottom: "4px",
                        opacity: 0.8,
                      }}
                    >
                      {isMine
                        ? "You"
                        : msg.senderEmail}
                    </div>

                    <div>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSendMessage}
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            disabled={sending}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Chat;