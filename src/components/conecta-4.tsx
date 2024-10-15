"use client"

import { useState, useCallback } from 'react'

const ROWS = 6
const COLS = 7
const EMPTY = null
const PLAYER_1 = 'red'
const PLAYER_2 = 'yellow'

export default function ConnectFour() {
  const [board, setBoard] = useState<Array<Array<string | null>>>(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1)
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = useCallback((board: Array<Array<string | null>>, row: number, col: number, player: string) => {
    // Check horizontal
    for (let c = 0; c <= COLS - 4; c++) {
      if (board[row][c] === player &&
          board[row][c+1] === player &&
          board[row][c+2] === player &&
          board[row][c+3] === player) {
        return true
      }
    }

    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      if (board[r][col] === player &&
          board[r+1][col] === player &&
          board[r+2][col] === player &&
          board[r+3][col] === player) {
        return true
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (board[r][c] === player &&
            board[r+1][c+1] === player &&
            board[r+2][c+2] === player &&
            board[r+3][c+3] === player) {
          return true
        }
      }
    }

    // Check diagonal (top-right to bottom-left)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 3; c < COLS; c++) {
        if (board[r][c] === player &&
            board[r+1][c-1] === player &&
            board[r+2][c-2] === player &&
            board[r+3][c-3] === player) {
          return true
        }
      }
    }

    return false
  }, [])

  const dropPiece = useCallback((col: number) => {
    if (winner) return;

    const newBoard = board.map(row => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
        if (newBoard[row][col] === EMPTY) {
            newBoard[row][col] = currentPlayer;
            if (checkWinner(newBoard, row, col, currentPlayer)) {
                setWinner(currentPlayer);
            } else {
                setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1);
            }
            setBoard(newBoard);
            break;
        }
    }
}, [board, currentPlayer, winner, checkWinner]);


    const resetGame = useCallback(() => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
        setCurrentPlayer(PLAYER_1);
        setWinner(null);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Conecta 4</h1>
      <div className="bg-blue-500 p-4 rounded-lg shadow-lg">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="w-12 h-12 bg-white rounded-full m-1 flex items-center justify-center cursor-pointer"
                onClick={() => dropPiece(colIndex)}
              >
                {cell && (
                  <div
                    className={`w-10 h-10 rounded-full ${
                      cell === PLAYER_1 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {winner && (
        <div className="mt-4 text-2xl font-bold">
          ¡El jugador {winner === PLAYER_1 ? 'Rojo' : 'Amarillo'} ha ganado!
        </div>
      )}
      {!winner && (
        <div className="mt-4 text-xl">
          Turno del jugador: {currentPlayer === PLAYER_1 ? 'Rojo' : 'Amarillo'}
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={resetGame}
      >
        Reiniciar juego
      </button>
    </div>
  )
}