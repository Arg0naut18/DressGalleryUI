import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  let endpoint;
  if(`${config.environment}`==='Production') {
    endpoint = `${config.host}`
  } else {
    endpoint = `${config.host}:${config.port}`
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    if (username===null || username==='') {
      alert('Username cannot be empty');
    }
    if (password===null || password==='') {
      alert('Password cannot be empty');
    }
    const response = await fetch(`${endpoint}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).catch((error) => {
      console.log(error);
      return {ok: false, message: "Error occurred!"}
    })

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('userId', data);
      navigate("/home");
      console.log(data);
    } else {
      alert('Login failed');
    }
  }

  const handleRegister = () => {
    navigate("/register");
  }

  return (
    <form className='login-form' id='login-form'>
      <div className='login-block'>
        <h1>Welcome to Clothes Gallery!</h1>
        <table cellSpacing={12} cellPadding={12} align='center'>
          <tbody>
            <tr>
              <th>Username:</th>
              <th><input type="text" value={username} name='login-username' onChange={(e) => setUsername(e.target.value)} /></th>
            </tr>
            <tr>
              <th>Password:</th>
              <th><input type="password" value={password} name='login-password' onChange={(e) => setPassword(e.target.value)} /></th>
            </tr>
            <tr>
              <th colSpan={2}><button type="submit" name='login' onClick={handleLogin}>Login</button></th>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='register-block'>
        <p>New here? Click Register to join in.</p>
        <button type='submit' name='register' onClick={handleRegister}>Register</button>
      </div>
    </form>
  );
};

export default Login;
