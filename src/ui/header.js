import React, { useState } from 'react';
import './header.css';
import LayerDropdown from "./layerdropdown";
import aerius from '../images/aerius-calculator.png'; // Adjust the path as necessary

const Header = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleLogin = async () => {
        const response = await fetch('YOUR_API_ENDPOINT/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            // Handle successful login
            console.log('Login successful');
        } else {
            // Handle error
            console.log('Login failed');
        }
        setUsername('');
        setPassword('');
    };

    const handleRegister = async () => {
        const response = await fetch('YOUR_API_ENDPOINT/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            // Handle successful registration
            console.log('Registration successful');
        } else {
            // Handle error
            console.log('Registration failed');
        }
        setUsername('');
        setPassword('');
    };

    return (
        <div className="header">
            <div className="header-section-left">
                <input
                    className="header-input"
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                    aria-label="Username"
                />
                <input
                    className="header-input"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    aria-label="Password"
                />
                <button className="button" type="button" onClick={handleLogin}>
                    Log In
                </button>
                <button className="button" type="button" onClick={handleRegister}>
                    Register
                </button>
            </div>
            <div className="header-section-center">
                <h1>GRND133</h1>
            </div>
            <div className="header-section-right">
                <a href="https://calculator.aerius.nl/wnb/" target="_blank" rel="noopener noreferrer">
                    <img src={aerius} alt="Aerius Calculator" className="header-image"/>
                </a>
            </div>
        </div>
    );
}

export default Header;
