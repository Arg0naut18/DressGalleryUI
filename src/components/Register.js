import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`${config.host}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email, phoneNumber }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('userId', data);
          navigate('/login');
        } else {
          console.log(response.json())
          alert(`Registration failed! Username already exists!`);
        }
    };

    return (
        <form className='register-form' onSubmit={handleSubmit} id='register-form'>
          <div className='register-body'>
            <h1>Welcome to Clothes Gallery!</h1>
            <h3>Thank you for trying out clothes gallery. Join our community to keep a better track of all your outfits.</h3>
            <table cellSpacing={12} cellPadding={12} align='center'>
              <tbody>
                <tr>
                  <th>Username:</th>
                  <th><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></th>
                </tr>
                <tr>
                  <th>Email:</th>
                  <th><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></th>
                </tr>
                <tr>
                  <th>Phone Number:</th>
                  <th><input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/></th>
                </tr>
                <tr>
                  <th>Password:</th>
                  <th><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></th>
                </tr>
                <tr>
                  <th colSpan={2}><button type="submit">Register</button></th>
                </tr>
              </tbody>
            </table>

          </div>
          <div className='login-block'>
            <p>Already a member? Login <a href='/login'>here</a>.</p>
          </div>
        </form>
    );
}

export default Register;
