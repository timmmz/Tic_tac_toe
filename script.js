const players = [
    {
        name: "playerOneName",
        token: "O"
    },
    {
        name: "playerTowName",
        token: "X"
    }
]

let activePlayer = players[0]
const boardDisplay = document.getElementById("boardDisplay")




const createBoard = () => {
    const board = Array(9).fill(0)
    return board
}

const setToken = (board, targetIndex, activePlayer) => {
    if (board[targetIndex] == 0) {
        board[targetIndex] = activePlayer.token
        displayBoard(board)
        switchPlayer()
    }
}

const displayBoard = (board) => {
    boardDisplay.innerHTML = ""
    board.forEach((value, index) => {
        const cell = document.createElement("div")
        cell.classList.add("cell")
        if (value == 0) {
            cell.innerHTML = ""
        } else {
            cell.innerHTML = `${value}`

        }
        cell.setAttribute("data-index", `${index}`)
        boardDisplay.appendChild(cell)
    });

}

//Switch player 
const switchPlayer = () => {
    activePlayer = activePlayer == players[0] ? players[1] : players[0]
}

let board = createBoard()
displayBoard(board)

boardDisplay.addEventListener("click", (event) => {
    console.log("I'm clicked !")
    const target = event.target
    console.log(target)
    const targetCellIndex = target.getAttribute("data-index")
    console.log(targetCellIndex)

    setToken(board, targetCellIndex, activePlayer)
})