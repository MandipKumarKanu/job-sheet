import React from "react";
import "./nav.css";
import { Link } from "react-router-dom/dist";

function Nav() {
  return (
    <>
      <div className="nav">
        <div className="navbar">
          <div className="nav-left">Nexaverse.</div>
          <div className="nav-right">
            <ul>
              <li>
                <Link to={`/login`}>Login</Link>
              </li>
              <li>
                <Link to={`/SignUp`}>SignUp</Link>
              </li>
              <li>
                <Link to={`/`}>Home</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
