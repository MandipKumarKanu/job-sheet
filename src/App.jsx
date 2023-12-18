import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/nav/nav";
import Login from "./components/loginSignup/login";
import SignUp from "./components/loginSignup/signUp";
import Home from "./components/home/home";
import { ProtectedRoute } from "./util/protectedRoute";
import Assign from "./components/home/assign";

function App() {



  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/assign" element={<Assign />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
