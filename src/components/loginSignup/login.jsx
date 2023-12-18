import React, { useState } from "react";
import "./loginSignup.css";
import { useFirebase } from "../../context/firebaseContext";

function Login() {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userData = await firebase.signInWithEmailAndPassword(
        email,
        password
      );

      alert("Successfully signed in");
      const authToken = await userData.user.getIdToken();

      console.log("authToken: ", authToken);
      localStorage.setItem("authToken", authToken);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <section id="login">
        <div className="form-container">
          <span>Login</span>
          <form onSubmit={handleSignIn}>
            <div className="form-grp">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-grp">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="button">
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login;