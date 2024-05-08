import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Game from "./Game.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import {useEffect, useRef, useState} from "react";


function App() {
    const [currentMessage, setCurrentMessage] = useState();
    const url= `ws://${window.location.hostname}:8080`;
    const connectWebSocket = (url) => {
        const ws = new WebSocket(url);

        ws.onmessage = event => {
            const message = JSON.parse(event.data);
            setCurrentMessage(message);
        };


        return ws;
    };

    const socket = useRef();

    useEffect(() => {
        socket.current = connectWebSocket(url)


        return () => {
            socket.current.close();
        };
    }, []);
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Login socket={socket} currentMessage={currentMessage}/> } />
                <Route path={"/register"} element={<Register socket={socket} currentMessage={currentMessage}/>} />
                <Route path={"/game"} element={<Game socket={socket} currentMessage={currentMessage}/>} />
            </Routes>
        </BrowserRouter>
        )
}

export default App;
