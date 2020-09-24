function creatBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false,
                wasShown: false,
                wasMarked: false
            };
        }
    }

    return board;
}

function renderBoard(board, selector) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (currCell.minesAroundCount === 0) {
                currCell.minesAroundCount = ''
            }
            var showOrHide = '';
            if (currCell.isShown) {
                showOrHide = 'show'
            } else {
                showOrHide = 'hidden'
            }
            var className = ` ${showOrHide} cell cell-${i}-${j}`
            strHTML += `<td 
            oncontextmenu = "markCell(this, ${i}, ${j})"
            onclick = "cellClicked(this ,${i}, ${j})" 
            class = "${className}">
            <span>${currCell.minesAroundCount}<span>
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
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue;
            var cell = gBoard[i][j];
            if (cell.isShown) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (cell.isMarked) {
                cell.isShown = true;
                cell.isMarked = false
                elCell.classList.add('show');
                elCell.classList.remove('marked')
            } else {
                cell.isShown = true;
                elCell.classList.add('show');
                elCell.classList.remove('hidden')

            }
            console.log(gGame.shownCount);
        }
    }
}

function HideNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue;
            var cell = gBoard[i][j];
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (cell.wasShown) {
                cell.isShown = true;
                elCell.classList.remove('hidden');
                elCell.classList.add('show')
            } else if (cell.wasMarked) {
                cell.isMarked = true;
                cell.isShown = false
                elCell.classList.remove('show');
                elCell.classList.add('marked')
            } else {
                cell.isShown = false;
                elCell.classList.remove('show');
                elCell.classList.add('hidden')
                console.log(gGame.shownCount);
            }
        }
    }
}

function fullExpansion(rowIdx, colIdx) {
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
            if (cell.minesAroundCount === '') fullExpansion(i, j)
        }
    }
}

// function showCell(elCell, cell) {
//     cell.isShown = true
//     elCell.classList.add('show')
//     elCell.classList.remove('hidden')
//     gGame.shownCount++
// }

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

function loseALife() {
    var elLives = document.querySelector('.lives')
    gLives.pop();
    elLives.innerText = `Lives: ${gLives.toString()}`
    document.querySelector('table').classList.add('shake')
    setTimeout(function () {
        document.querySelector('table').classList.remove('shake')
    }, 500);
}

function loseAHint() {
    var elHints = document.querySelector('.hints')
    gHints.pop();
    if (gHints.length < 1) {
        elHints.innerText = `You are out of 💡`
    } else {
        elHints.innerText = `Hints: ${gHints.toString()}`
    }
}

function allMinesPos() {
    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            currCell = gBoard[i][j];
            if (currCell.isMine) {
                mines.push({
                    i: i,
                    j: j
                })
            }
        }
    }
    return mines;
}

function allClearPos() {
    var clears = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            currCell = gBoard[i][j];
            if (currCell.isShown) continue
            if (!currCell.isMine) {
                clears.push({
                    i: i,
                    j: j
                })
            }
        }
    }
    return clears;
}

function hideCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isShown)
                var elCell = document.querySelector(`.cell-${i}-${j}`)
            console.log(elCell);
            elCell.classList.add('hidden')
        }
    }
}
