import React, {useEffect, useState} from 'react';
import './styles.css';
import {useNavigate} from "react-router-dom";

const Login = ({socket,currentMessage}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(currentMessage);
        if(!currentMessage) return;
        if(currentMessage.type === "login_success"){
            const {accessToken, refreshToken} = currentMessage;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("username", username)
            navigate("/game");
        }
        if(currentMessage.type === "connected"){
            localStorage.setItem("accessToken", "");
            localStorage.setItem("refreshToken", "");
            localStorage.setItem("username", "")
        }
    }, [currentMessage]);




    function handleLogin(){
        socket.current.send(JSON.stringify({
            type: "login",
            username: username,
            password: password
        }));
    }

    return (
        <div className="username-container">
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="username-input"
            />
            <button className="enter-button" onClick={handleLogin}>Login
            </button>
            <button className="enter-button" onClick={()=> navigate("/register")}>Go to Register
            </button>
        </div>
    );
};

export default Login;