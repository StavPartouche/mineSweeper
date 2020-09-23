function creatBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }

    return board;
}

function renderBoard(board, selector) {
    var strHTML = '<table border="5"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if(currCell.minesAroundCount === 0){
                currCell.minesAroundCount = ''
            }
            var className = `hidden cell cell-${i}-${j}`
            strHTML += `<td 
            oncontextmenu = "markCell(this, ${i}, ${j})"
            onclick = "cellClicked(this ,${i}, ${j})" 
            class = "${className}">
            ${currCell.minesAroundCount}
            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = countNegs(board, i, j)
        }
    }
}

function countNegs(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx ||
                (j < 0 || j > board.length - 1)) continue;
            var cell = board[i][j];
            if (cell.isMine === true) count++;
        }
    }
    return count
}

function showNegs(rowIdx, colIdx) {
    // var elLives = document.querySelector('.lives')
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue;
            var cell = gBoard[i][j];
            if (cell.isShown) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            cell.isShown = true;
            elCell.classList.add('show');
            elCell.classList.remove('hidden')
            gGame.shownCount++

        }
    }
}

function HideNegs(rowIdx, colIdx){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue;
            var cell = gBoard[i][j];
            if (cell.isShown) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            cell.isShown = false;
            elCell.classList.remove('show');
            elCell.classList.add('hidden')
            gGame.shownCount--

        }
    }
}

function showCell(elCell, cell) {
    cell.isShown = true
    elCell.classList.add('show')
    elCell.classList.remove('hidden')
    gGame.shownCount++
}

function putRandomMines(board, num) {
    for (var i = 0; i < num; i++) {
        var randI = getRandomIntInclusive(0, board.length - 1)
        var randJ = getRandomIntInclusive(0, board.length - 1)
        if (board[randI][randJ].minesAroundCount === MINE) {
            i = i - 1;
            continue
        }
        board[randI][randJ] = {
            minesAroundCount: MINE,
            isShown: false,
            isMine: true,
            isMarked: false
        }
    }

}

function putRandomMine(board) {
    var randI = getRandomIntInclusive(0, board.length - 1)
    var randJ = getRandomIntInclusive(0, board.length - 1)
    if (board[randI][randJ].minesAroundCount === MINE) {
        putRandomMine(board)
    }
    board[randI][randJ] = {
        minesAroundCount: MINE,
        isShown: false,
        isMine: true,
        isMarked: false
    }
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preventMenu() {
    document.addEventListener("contextmenu", function (a) {
        a.preventDefault();
    })
}

function gameLevel(num) {
    if (num === 1) {
        gLevel = {
            SIZE: 4,
            MINES: 2
        };
    }
    if (num === 2) {
        gLevel = {
            SIZE: 8,
            MINES: 12
        };
    }
    if (num === 3) {
        gLevel = {
            SIZE: 12,
            MINES: 30
        };
    }
}

function loseALife() {
    var elLives = document.querySelector('.lives')
    gLives.pop()
    elLives.innerText = `Lives: ${gLives.toString()}`
}