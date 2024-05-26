import React, {useEffect, useState} from 'react';
import TickTackBoard from "./TickTackBoard.jsx";
import './App.css'
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Game = ({socket,currentMessage,setCurrentMessage}) => {

    const [gameId, setGameId] = useState(null);
    const [isStarted, setIsStarted] = useState(null)
    const [isX, setIsX] = useState(null);
    const [board, setBoard] = useState(new Array(9).fill(-1));
    const [result, setResult] = useState(null)
    const navigate = useNavigate();
    const [isMyMove, setIsMyMove] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const image = localStorage.getItem("photo")




    useEffect(() => {
        if(!currentMessage) return;
        console.log(currentMessage)
        if(currentMessage.type === "access_token_invalid"){
            const refreshToken = localStorage.getItem("refreshToken");
            socket.current.send(JSON.stringify({type: "refresh_token", "refreshToken": refreshToken}))
        }
        if(currentMessage.type === "refresh_success"){
            localStorage.setItem("accessToken", currentMessage.accessToken)
            console.log("last message", lastMessage)
            socket.current.send(lastMessage)
        }
        if(currentMessage.type === "refresh_failed"){
            navigate("/")
        }
        if(currentMessage.type === "game_start"){
            setGameId(currentMessage.gameID);
            setIsX(currentMessage.isX);
            setIsMyMove(currentMessage.isX)
        }
    }, [currentMessage]);

    function handleStartGame(){
        setIsStarted(true)
        const accessToken = localStorage.getItem("accessToken");
        const username = localStorage.getItem("username");
        if(!accessToken || !username|| !socket.current) navigate("/")
        const message = JSON.stringify({type: "start_game", username, access_token: accessToken});
        setLastMessage(message)
        socket.current.send(message)
    }
    function handleLogout(){
        localStorage.setItem("accessToken", "")
        localStorage.setItem("refreshToken", "")
        setCurrentMessage({type: "logout"})
        navigate("/")
    }

    const handleMove = (move) => {
        setIsMyMove(true)
        const newBoard = [...board]

        newBoard[move] = !isX ? "X" : "O"
        setBoard(newBoard);
        setResult(checkWinner(newBoard))
    }
    const makeMove = (index) =>{
        console.log(index)
        setIsMyMove(false)
        const username = localStorage.getItem("username");
        const accessToken = localStorage.getItem("accessToken");
        const message = JSON.stringify({type: "gameMove", access_token: accessToken, username, gameID: gameId, isX, move: index});
        setLastMessage(message)
        socket.current.send(message)
        const newBoard = [...board];
        newBoard[index] = isX ? "X" : "O"
        setBoard(newBoard);
        setResult(checkWinner(newBoard))
    }

    useEffect(() => {

        if(result === 1 || result === 0 || result === -1) {
            const accessToken = localStorage.getItem("accessToken");
            const username = localStorage.getItem("username");
            const message = JSON.stringify({type: "gameEnd", gameID: gameId, username: username, result: result, access_token: accessToken});
            setLastMessage(message)
            socket.current.send(message)
            setIsX(null);
            setBoard(new Array(9).fill(-1))
            setGameId(null);
            setTimeout(() => setResult(null), 2000)
            setIsStarted(false)
        }
    }, [result]);


    const checkWinner = (newBoard) =>  {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (newBoard[a] !== -1 && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                return (newBoard[a] === "X" && isX)||(newBoard[a] === "O" && !isX) ? 1 : -1;
            }
        }
        if (!newBoard.includes(-1)) {
            return 0;
        }
        return null;
    }

    const renderComponent = () => {
        if(result === 1) return (<div>Win</div>)
        if(result === -1) return (<div>Lose</div>)
        if(result === 0) return (<div>Draw</div>)
        if(!isStarted) return (<>
            <button onClick={() => handleStartGame()} className="enter-button">Start Game</button>
            <button onClick={() => handleLogout()} className="enter-button">Logout</button>


        </>)
        if (!gameId) return (<div>Loading...</div>)
        return (
            <>
                <img src={image} width={200} height={200} alt={"bruh"}/>

                <TickTackBoard board={board} handleClick={makeMove} isMyMove={isMyMove}/>
            </>
        )
    }

    useEffect(() => {
        if (!currentMessage) return;
        switch (currentMessage.type){
            case 'gameStart':
                setGameId(currentMessage.gameID);
                setIsX(currentMessage.isX);
                setIsMyMove(currentMessage.isX)
                break;
            case 'move':
                handleMove(currentMessage.move)
                break;

        }
    }, [currentMessage]);

    useEffect(() => {

        return () => {
            // eslint-disable-next-line react/prop-types
            if(gameId) socket.current.send(JSON.stringify({type: "gameEnd", gameID: gameId}))
        };
    }, [gameId, socket]);
    return (
        <>
            {renderComponent()}
        </>
    )
};

export default Game;