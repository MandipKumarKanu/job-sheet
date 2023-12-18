import React, { useState } from "react";
import { useFirebase } from "../../context/firebaseContext";

function SignUp() {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userData = await firebase.signupUserWithEmailAndPassword(
        email,
        password
      );

      alert("Done Signup")
    } catch (error) {
      alert(error.message)
    }
  };

  return (
    <>
      <section id="signup">
        <div className="form-container">
          <span>SignUp</span>
          <form onSubmit={handleSignUp}>
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
              <button type="submit">SignUp</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default SignUp;
