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
            console.log(currentMessage)
            const {accessToken, refreshToken, photo} = currentMessage;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("username", username)
            localStorage.setItem("photo", photo)
            navigate("/game");
        }
        if(currentMessage.type === "connected"){
            const refreshToken = localStorage.getItem("refreshToken")
            socket.current.send(JSON.stringify({
                type: "refresh_token", refreshToken
            }))
        }
        if(currentMessage.type === "refresh_success"){
            localStorage.setItem("accessToken", currentMessage.accessToken)
            navigate("/game")
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