import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ============================
  // LOGIN
  // ============================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  // ============================
  // FORGOT PASSWORD
  // ============================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage(
        "Password reset link has been sent to your email."
      );
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email.");
      } else {
        setError(
          "Could not send password reset email."
        );
      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* TITLE */}

        <h2>LOGIN</h2>


        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {message && (
          <div className="login-success">
            {message}
          </div>
        )}


        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          {/* FORGOT PASSWORD */}

          <div className="forgot-password">
            <button
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
          >
            LOGIN
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;