import "./Game.css";
import React, { useEffect, useState } from "react";

// src/Game.js

const gridSize = 4; // 4x4 grid
const numLights = 10; // Number of squares that will light up

const Game = () => {
    const [lights, setLights] = useState([]);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);

    useEffect(() => {
        if (gameActive) {
            const interval = setInterval(() => {
                lightUpSquares();
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameActive]);

    const startGame = () => {
        setScore(0);
        setGameActive(true);
        lightUpSquares();
    };

    const lightUpSquares = () => {
        const newLights = new Set();
        while (newLights.size < numLights) {
            newLights.add(Math.floor(Math.random() * gridSize * gridSize));
        }
        setLights(Array.from(newLights));
    };

    const handleSquareClick = (index) => {
        if (lights.includes(index)) {
            setScore(score + 1);
            // Remove the clicked square from lights
            setLights(lights.filter(light => light !== index));
            if (lights.length === 1) {
                setGameActive(false);
                alert(`Game over! Your score: ${score + 1}`);
            }
        } else {
            setGameActive(false);
            alert(`Wrong square! Game over! Your score: ${score}`);
        }
    };

    return (
        <div className="game-container">
            <h1>Brain Teaser Game</h1>
            <button onClick={startGame} disabled={gameActive}>
                Start Game
            </button>
            <div className="grid">
                {Array.from({ length: gridSize * gridSize }, (_, index) => (
                    <div
                        key={index}
                        className={`square ${lights.includes(index) ? 'lit' : ''}`}
                        onClick={() => handleSquareClick(index)}
                    />
                ))}
            </div>
            <div className="score">Score: {score}</div>
        </div>
    );
};

export default Game;
