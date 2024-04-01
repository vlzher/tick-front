import React, {useState} from 'react';
import './styles.css';

const UsernameInput = ({addUsername}) => {
    const [username, setUsername] = useState("");
    return (
        <div className="username-container">
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="username-input"
            />
            <button className="enter-button" onClick={()=>{if(username) addUsername(username)}}>Enter</button>
        </div>
    );
};

export default UsernameInput;
