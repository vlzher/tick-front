import React, {useEffect, useState} from 'react';
import './styles.css';
import {useNavigate} from "react-router-dom";
const Register = ({socket,currentMessage}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fileData, setFileData] = useState(null);

    useEffect(() => {
        console.log(currentMessage)
        if(currentMessage && currentMessage.type === "register_success"){
            navigate("/");
        }
    }, [currentMessage]);
    function handleRegister(){
        console.log(fileData)
        socket.current.send(JSON.stringify({
            type: "register",
            email: email,
            username: username,
            password: password,
            image: fileData
        }));
    }
    const convertFileToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileData(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        convertFileToBase64(file);
    };
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
            <input
                type="file" accept="image/*" onChange={handleFileChange}
            />
            <button className="enter-button" onClick={handleRegister}>Registration
            </button>
            <button className="enter-button" onClick={() => navigate("/")}>Go to Login
            </button>
        </div>
    );
};

export default Register;