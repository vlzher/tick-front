import React, {useEffect, useState} from 'react';
import './styles.css';
import {useNavigate} from "react-router-dom";
const Register = ({socket,currentMessage}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(currentMessage)
        if(currentMessage && currentMessage.type === "register_success"){
            navigate("/");
        }
    }, [currentMessage]);
    function handleRegister(){
        socket.current.send(JSON.stringify({
            type: "register",
            email: email,
            username: username,
            password: password
        }));
    }
    return (
        <div className="username-container">
            <input
                type="text"
                placeholder="Enter email"
                className="username-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <input
                type="text"
                placeholder="Enter username"
                className="username-input"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
            <input
                type="text"
                placeholder="Enter password"
                className="username-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <button className="enter-button" onClick={handleRegister}>Registration
            </button>
            <button className="enter-button" onClick={() => navigate("/")}>Go to Login
            </button>
        </div>
    );
};

export default Register;