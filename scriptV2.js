//player Factory
const player = (name, token) => {
    return { name, token }
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
    const player1 = player("player1", "O")
    const player2 = player("player2", "X")
    const players = [
        player1, player2
    ]

    let board = boardFunctions.getBoard()
    let activePlayer = players[0]

    const getActivePlayer = () => activePlayer

    const switchPlayer = () => {
        activePlayer = activePlayer == players[0] ? players[1] : players[0]
    }


    const playRound = (index) => {
        if (boardFunctions.setToken(board, index, activePlayer)) {
            if (checkWin() == null) {
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
                return board[a]

        }

        return board.includes(0) ? null : "draw"


    }


    return { checkWin, playRound, getActivePlayer, boardFunctions }
}






//displayController
const displayController = (game) => {
    const boardDisplay = document.getElementById("boardDisplay")
    const resetButton = document.getElementById("resetButton")
    const main = document.getElementById("main")
    console.log(resetButton)


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
        if (game.checkWin() == "X" || game.checkWin() == "O") {
            console.log("windisplay")
            const winMessage = document.createElement("div")
            winMessage.classList.add("endGame")
            winMessage.innerHTML = `${game.getActivePlayer().name} wins !`
            main.appendChild(winMessage)
        } else if (game.checkWin() == "draw") {
            console.log("drawdisplay")
            const drawMessage = document.createElement("div")
            drawMessage.classList.add("endGame")
            drawMessage.innerHTML = " That's a draw"
            main.appendChild(drawMessage)
        }
        console.log("endgame render was called")
    }

    boardDisplay.addEventListener("click", (event => {
        const targetIndex = event.target.dataset.index
        if (targetIndex !== undefined) {
            game.playRound(targetIndex)
            endGameRender()
            render()

        }
    }))


    resetButton.addEventListener("click", () => {
        game.boardFunctions.reset()
        render()
    })
    return { render, endGameRender }
}






const game = gameController()
const display = displayController(game)
display.render()