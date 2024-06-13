import React, { useRef } from "react";
import makeToast from "../Toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setupSocket }) => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const loginUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    axios
      .post("http://localhost:4000/api/v1/user/login", { userName:username, password })
      .then((response) => {
        makeToast("success", response.data.message);
        localStorage.setItem("CC_Token", response.data.token);
        console.log(response.data)
        navigate("/dashboard");
        setupSocket();
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          makeToast("error", err.response.data.message);
        }
      });
  };

  return (
    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            ref={usernameRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
          />
        </div>
        <button onClick={loginUser}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
