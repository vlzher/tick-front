import React, { useState } from 'react';
import './styles.css';

const TicTacToeBoard = ({board,handleClick, isMyMove}) => {


    const renderSquare = (index) => {
        return (
            <button className="square" onClick={isMyMove ? () => handleClick(index) : () => {}} style={{cursor: isMyMove ? "pointer" : "not-allowed"}}>
                {board[index] !== -1 && board[index] }
            </button>
        );
    };

    return (
        <div className="board">
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};

export default TicTacToeBoard;
