import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./LoginAdmin.css";
import axios from "axios";
import { useNavigate } from "react-router";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(email, password);
    await axios
      .post("https://api-car-rental.binaracademy.org/admin/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.access_token);
        navigate("/dashboard/dashboard");
        console.log(response);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <div className="login">
      <div className="left">
        <div className="formtitle">
          <h1>BCR</h1>
          <h2>Welcome, Admin BCR</h2>
          {errorMessage !== "" && (
            <div className="errorMessage">
              <span>{errorMessage} </span>
            </div>
          )}
          <Form onSubmit={handleClick}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Password"
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              SignIn
            </Button>
          </Form>
        </div>
      </div>
      <div className="right">
        <img src="./assets/loginadmin.png" alt=""></img>
      </div>
    </div>
  );
};

export default LoginAdmin;
