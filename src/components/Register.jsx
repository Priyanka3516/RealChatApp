import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set, serverTimestamp } from "firebase/database";

import { auth, db } from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      // Create Firebase Authentication account
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // Save user in Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      setMessage("Account created successfully!");

      setEmail("");
      setPassword("");

    } catch (error) {
      console.error("Registration error:", error);

      setError(error.message);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
        padding: "25px",
        boxSizing: "border-box",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        Create Account
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#666",
        }}
      >
        Join RealTimeChatApp today
      </p>

      <form onSubmit={handleRegister}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#2563eb",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>

      </form>

      {message && (
        <p
          style={{
            color: "green",
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          {message}
        </p>
      )}

      {error && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Register;