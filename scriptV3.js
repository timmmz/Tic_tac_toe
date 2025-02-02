//player Factory
const player = (name, token, color) => {
    return { name, token, color }
}


// Game Board factory
const gameBoard = () => {
    const board = Array(9).fill(0)

    const getBoard = () => board

    const setToken = (board, index, activePlayer) => {

        if (board[index] == 0) {
            board[index] = activePlayer.token
            return true
        } else {
            return false
        }
    }

    const reset = () => board.fill(0)

    //return board, setToken, reset
    return { getBoard, setToken, reset }
}

const gameController = () => {
    const boardFunctions = gameBoard()
    const player1 = player("player1", "O", "#3B44F4")
    const player2 = player("player2", "X", "#F43B3B")
    const players = [
        player1, player2
    ]

    let board = boardFunctions.getBoard()
    let activePlayer = players[0]
    let player2Bot = false

    const getActivePlayer = () => activePlayer

    const switchPlayer = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0]
    }

    const setPlayerOne = () => {
        activePlayer = activePlayer == players[1] ? players[0] : players[0]
    }


    const playRound = (index) => {
        if (boardFunctions.setToken(board, index, activePlayer)) {
            if (checkWin().status == null) {
                switchPlayer()
            }
            return true
        }
    }

    const checkWin = () => {
        const winConfigurations = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [3, 4, 5],
            [1, 4, 7],
            [6, 4, 2],
            [6, 7, 8],
            [2, 5, 8]
        ]

        for (let config of winConfigurations) {
            const [a, b, c] = config

            if (board[a] !== 0 && board[b] !== 0 && board[c] !== 0 && board[a] == board[b] && board[b] == board[c])
                return { status: board[a], array: config }

        }

        return board.includes(0) ? { status: null, array: null } : { status: "draw", array: null }


    }

    const minimax = (depth, isMaximazing) => {
        let scores = { X: 1, O: - 1, draw: 0 }
        let results = checkWin().status

        if (results) return { score: scores[results], move: null }

        let bestScore = isMaximazing ? -Infinity : Infinity;
        let bestMove = null;

        for (let i = 0; i < 9; i++) {
            if (board[i] === 0) {
                board[i] = isMaximazing ? "X" : "O"
                let score = minimax(depth + 1, !isMaximazing).score
                board[i] = 0

                if (isMaximazing) {
                    if (score > bestScore) {
                        bestScore = score
                        bestMove = i
                    }
                } else {
                    if (score < bestScore) {
                        bestScore = score
                        bestMove = i
                    }
                }


            }
        }
        return { score: bestScore, move: bestMove }
    }

    const getPlayer2 = () => player2Bot

    const changePlayer2 = () => {
        player2Bot = player2Bot == true ? false : true
    }


    return { checkWin, playRound, getActivePlayer, boardFunctions, minimax, getPlayer2, changePlayer2, setPlayerOne }
}






//displayController
const displayController = (game) => {
    const boardDisplay = document.getElementById("boardDisplay")
    const endGame = document.querySelector(".endGame")



    let difficulty = 0


    const render = () => {
        boardDisplay.innerHTML = ""
        game.boardFunctions.getBoard().forEach((value, index) => {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.innerHTML = value !== 0 ? value : ""
            cell.dataset.index = index
            boardDisplay.appendChild(cell)
        });
    }

    const endGameRender = () => {
        const results = game.checkWin()
        const endGameText = document.querySelector(".endGameText")

        if (results.status == "X" || results.status == "O") {
            const cells = Array.from(boardDisplay)

            // results.array.forEach(square => {
            //     cells.forEach(cell => {
            //         const index = cell.dataset.index
            //         if (index === square) {
            //             board[square].style.backgroundColor = `${game.getActivePlayer.color}`
            //         }
            //     })

            // })
            endGameText.innerHTML = `${game.getActivePlayer().name} wins !`
            endGame.classList.toggle("active")

        } else if (results === "draw") {
            endGameText.innerHTML = `That's a draw`
            endGame.classList.toggle("active")
        }
        console.log("endgame render was called")
    }

    const gameMode = (twoPlayer, targetIndex) => {
        if (twoPlayer) {
            game.playRound(targetIndex)
            endGameRender()
            render()
        } else {
            game.playRound(targetIndex)
            endGameRender()
            render()
            game.playRound(game.minimax(-Infinity, true).move)
            endGameRender()
            endGameRender()
            render()
        }
    }

    boardDisplay.addEventListener("click", (event => {
        const targetIndex = event.target.dataset.index

        if (targetIndex !== undefined) {
            gameMode(game.getPlayer2(), targetIndex)
        }
    }))

    document.getElementById("player2").addEventListener("click", (event) => {
        document.querySelector(".botLevels").classList.toggle("active")
        event.target.innerHTML = event.target.innerHTML === "PLAYER 2" ? "COMPUTER" : "PLAYER 2"
        game.changePlayer2()
    })

    document.querySelectorAll(".resetButton").forEach(button => {
        button.addEventListener("click", () => {
            const cells = Array.from(boardDisplay.children)
            cells.forEach(cell => {
                cell.style.backgroundColor = "var(--color-board)"
            })
            game.boardFunctions.reset()
            endGame.classList.remove("active")
            game.setPlayerOne()
            render()
        })
    });

    document.querySelector(".botLevels").addEventListener("click", (event) => {
        difficulty = parseFloat(event.target.dataset.level)
        console.log(difficulty)
        const levels = document.querySelectorAll(".level")
        levels.forEach((level) => {
            level.classList.remove("active")
        })
        event.target.classList.add("active")
    })

    boardDisplay.addEventListener("mouseover", (event) => {
        const cells = Array.from(boardDisplay.children)
        cells.forEach(square => {
            square.style.backgroundColor = "var(--color-board)"

        });
        event.target.style.backgroundColor = `${game.getActivePlayer().color}`
    })

    const getDifficulty = () => difficulty



    return { render, endGameRender, getDifficulty }
}






const game = gameController()
const display = displayController(game)
display.render()