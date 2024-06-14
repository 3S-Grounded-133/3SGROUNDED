// Import necessary React hooks and styles
import React, {useState} from 'react';
import './header.css';

// Import other components and images
import aerius from '../images/aerius-calculator.png'; // Adjust the path as necessary

// Define the Header component
const Header = ({ toggleModal, token, updateToken }) => {
    // State variables for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedInUsername, setLoggedInUsername] = useState('');

    // Handle input change event
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
            setLoggedInUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // Handle login button click event
    async function handleLogin() {
        let loginDetails = {
            'username': username,
            'password': password,
        }

        const requestBody = new URLSearchParams();

        // Add each key-value pair to the URLSearchParams object
        for (const [key, value] of Object.entries(loginDetails)) {
            requestBody.append(key, value);
        }

        // Make a POST request to the login endpoint
        const response = (await fetch('https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody,
        }));

        const responseBody = await response.json();

        // Check the response and log the result
        if (response.ok) {
            const newToken = responseBody.access_token;
            await updateToken('');
            await updateToken(newToken);

        } else {
            window.alert('Login failed. Please try again.');
            setLoggedInUsername('');
        }
        // Reset username and password fields
        setUsername('');
        setPassword('');
    }

    // Handle register button click event
    const handleRegister = async () => {
        // placeholder values to omit the registration form
        let registrationDetails = {
            'email': username,
            'password': password,
            'first_name': "",
            'last_name': "",
            'phone_number': "",
        }

        // Make a POST request to the register endpoint
        const response = await fetch('https://grnd-3s-133-container-api.agreeabledesert-062868ff.westeurope.azurecontainerapps.io/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(registrationDetails),
        });

        // Check the response and log the result
        if (response.ok) {
            window.alert('Registration successful. You can now log in.');
        } else {
            window.alert('Registration failed. Please try again.');
        }
        // Reset username and password fields
        setUsername('');
        setPassword('');
    };

    const handleLogout = async () => {
        updateToken('');
        setLoggedInUsername('');
    }

    // Render the Header component
    return (
        <div className="header">
            {token === '' ? (
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
            ) : (
                <div className="header-section-left">
                    <h3>Welcome, {loggedInUsername}</h3>
                    <button className="button" type="button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
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
