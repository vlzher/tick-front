import './App.css'
import TickTackBoard from "./TickTackBoard.jsx";
import {useEffect, useRef, useState} from "react";
import UsernameInput from "./UsernameInput.jsx";

function App() {
    const [username, setUsername] = useState("");
    const [gameId, setGameId] = useState(null);
    const [isX, setIsX] = useState(null);
    const [board, setBoard] = useState(new Array(9).fill(-1));
    const [result, setResult] = useState(null)
    const [currentMessage, setCurrentMessage] = useState();
    const [isMyMove, setIsMyMove] = useState(null);
    const backupSocketUrl = `ws://${window.location.hostname}:5173/socket`;
    const primarySocketUrl = `ws://${window.location.hostname}:5173/socket-backup`;

    const connectWebSocket = (url) => {
        const ws = new WebSocket(url);

        ws.onmessage = event => {
            const message = JSON.parse(event.data);
            setCurrentMessage(message);
        };

        ws.onclose = () => {
            if (ws === socket.current && url === primarySocketUrl) {
                socket.current = connectWebSocket(backupSocketUrl);
            }
        };

        return ws;
    };


    const socket = useRef();

    const handleMove = (move) => {
        setIsMyMove(true)
        const newBoard = [...board]

        newBoard[move] = !isX ? "X" : "O"
        setBoard(newBoard);
        setResult(checkWinner(newBoard))
    }
    const makeMove = (index) =>{
        setIsMyMove(false)
        socket.current.send(JSON.stringify({type: "gameMove", username, gameID: gameId, isX, move: index}))
        const newBoard = [...board];
        newBoard[index] = isX ? "X" : "O"
        setBoard(newBoard);
        setResult(checkWinner(newBoard))
    }

    useEffect(() => {

        if(result === 1 || result === 0 || result === -1) {
            socket.current.send(JSON.stringify({type: "gameEnd", gameID: gameId}))
            setUsername("")
            setIsX(null);
            setBoard(new Array(9).fill(-1))
            setGameId(null);
            setTimeout(() => setResult(null), 2000)
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
       if(!username) return (<UsernameInput addUsername={setUsername}/>)
       if(!gameId) return (<div>Loading...</div>)
        return(<TickTackBoard board={board} handleClick={makeMove} isMyMove={isMyMove}/>)
    }

    useEffect(() => {
        if(!currentMessage) return;
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
        socket.current = connectWebSocket(primarySocketUrl)

        return () => {
            if(gameId) socket.current.send(JSON.stringify({type: "gameEnd", gameID: gameId}))
            socket.current.close();
        };
    }, []);
    useEffect(() => {
        if(username) socket.current.send(JSON.stringify({type: "login", username}))
    }, [username]);
  return (
    <>
        {renderComponent()}
    </>
  )
}

export default App
