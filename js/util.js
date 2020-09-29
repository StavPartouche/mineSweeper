function gameLevel(num) {
    if (num === 1) {
        gLevel = {
            DIFFICULTY: num,
            SIZE: 4,
            MINES: 2
        };
    }
    if (num === 2) {
        gLevel = {
            DIFFICULTY: num,
            SIZE: 8,
            MINES: 12
        };
    }
    if (num === 3) {
        gLevel = {
            DIFFICULTY: num,
            SIZE: 12,
            MINES: 30
        };
    }
}

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

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = countNegs(board, i, j)
        }
    }
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

function loseAHint() {
    var elHints = document.querySelector('.hints')
    gHints.pop();
    if (gHints.length < 1) {
        elHints.innerText = `You are out of 💡`
    } else {
        elHints.innerText = `Click for a hint: ${gHints.join('')}`
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
            elCell.classList.add('hidden')
        }
    }
}


function startTimer() {
    gTimerStarter = setInterval(function () {
        gSeconds++
        var elTimer = document.querySelector('.timer');
        elTimer.innerText = `Time: ${gSeconds / 100} `
    }, 10)
}

function renderScores() {
    var currScores = gScores[gLevel.DIFFICULTY - 1].bestScores

    if (gLevel.DIFFICULTY === 1) elScores = document.querySelector('.easy-scores')
    if (gLevel.DIFFICULTY === 2) elScores = document.querySelector('.normal-scores')
    if (gLevel.DIFFICULTY === 3) elScores = document.querySelector('.hard-scores')

    currScores.push(gSeconds / 100)
    currScores.sort(sortNumbers)

    var strHTML = `<h2 class="">${gScores[gLevel.DIFFICULTY - 1].difficult}</h2>`

    for (var i = 0; i < currScores.length; i++) {
        strHTML += `<h4>${currScores[i]}</h4>`
    }
    elScores.innerHTML = strHTML;
}

function loseALife() {
    var elLives = document.querySelector('.lives')
    gLives.pop();
    elLives.innerText = `Lives: ${gLives.join('')}`
    document.querySelector('table').classList.add('shake')
    setTimeout(function () {
        var elTable = document.querySelector('table')
        elTable.classList.remove('shake')
    }, 500);
    if (gSound) gHitAMineSound.play();
}

function youLost() {
    clearInterval(gTimerStarter)
    var elBtn = document.querySelector('.win-or-lose button');
    var mines = allMinesPos();
    for (var i = 0; i < mines.length; i++) {
        gBoard[mines[i].i][mines[i].j].minesAroundCount = '💥'
        gBoard[mines[i].i][mines[i].j].isShown = true
    }
    renderBoard(gBoard, '.board-container')
    elBtn.innerText = '😭'
    gGame.isOn = false
    var elTable = document.querySelector('table')
    elTable.classList.toggle('end-game')
    clearInterval(gTimerStarter)
    if (gSound) gLostSound.play();
}

function checkIfWon() {
    if ((gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES) &&
        (gGame.markedCount === gLevel.MINES)) return true;

}

function youWon() {
    clearInterval(gTimerStarter)
    var elBtn = document.querySelector('.win-or-lose button');
    elBtn.innerText = '😎'
    gGame.isOn = false;
    if (gSound) gWinSound.play();
    renderScores();
}

function toggleHint() {
    var elTable = document.querySelector('table');
    var elModal = document.querySelector('.hint-modal');
    if (gHints.length < 1) return
    elTable.classList.toggle('table-hint')
    elModal.classList.toggle('show-hint-modal')
    if (!gHint) {
        gHint = true
        if (gSound) gHintOnSound.play()
    } else {
        gHint = false
        if (gSound) gHintOffSound.play()
    }
}

function toggleSound() {
    elSoundBtn = document.querySelector('.sound-btn')
    if (gSound) {
        gSound = false;
        elSoundBtn.innerText = '🔈'
    } else {
        gSound = true;
        elSoundBtn.innerText = '🔊'
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

function sortNumbers(a, b) {
    return a - b;
}


