// Import necessary React hooks and styles
import React, { useState } from 'react';
import './header.css';

// Import other components and images
import LayerDropdown from "./layerdropdown";
import aerius from '../images/aerius-calculator.png'; // Adjust the path as necessary

// Define the Header component
const Header = ({ toggleModal }) => {
    // State variables for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle input change event
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // Handle login button click event
    const handleLogin = async () => {
        // Make a POST request to the login endpoint
        const response = await fetch('YOUR_API_ENDPOINT/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check the response and log the result
        if (response.ok) {
            console.log('Login successful');
        } else {
            console.log('Login failed');
        }
        // Reset username and password fields
        setUsername('');
        setPassword('');
    };

    // Handle register button click event
    const handleRegister = async () => {
        // Make a POST request to the register endpoint
        const response = await fetch('YOUR_API_ENDPOINT/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check the response and log the result
        if (response.ok) {
            console.log('Registration successful');
        } else {
            console.log('Registration failed');
        }
        // Reset username and password fields
        setUsername('');
        setPassword('');
    };

    // Render the Header component
    return (
        <div className="header">
            <div className="header-section-left">
                {/* Username input field */}
                <input
                    className="header-input"
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                    aria-label="Username"
                />
                {/* Password input field */}
                <input
                    className="header-input"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    aria-label="Password"
                />
                {/* Login button */}
                <button className="button" type="button" onClick={handleLogin}>
                    Log In
                </button>
                {/* Register button */}
                <button className="button" type="button" onClick={handleRegister}>
                    Register
                </button>
            </div>
            <div className="header-section-center">
                <h1>GRND133</h1>
            </div>
            <div className="header-section-right">
                {/* Button to toggle the modal */}
                <button onClick={toggleModal} className="license-button">Licenses</button>
                {/* Link to Aerius Calculator with image */}
                <a href="https://calculator.aerius.nl/wnb/" target="_blank" rel="noopener noreferrer">
                    <img src={aerius} alt="Aerius Calculator" className="header-image"/>
                </a>
            </div>
        </div>
    );
}

export default Header;
