'use strict'

const MINE = '💣'

var gBoard;
var gLevel;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gFirstClick;
var gLives;
var gHints;
var gHint = false
var gSafeClickOn = false;
var gSafeClicks;


function init(num) {
    gGame.isOn = true;
    gFirstClick = true;
    gHint = false;
    gLives = ['❤️', '❤️', '❤️']
    gHints = ['💡', '💡', '💡']
    gSafeClicks = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;


    var elLives = document.querySelector('.lives');
    elLives.innerText = `Lives: ${gLives.toString()}`

    var elHints = document.querySelector('.hints')
    elHints.innerText = `Hints: ${gHints.toString()}`

    var elBtn = document.querySelector('.win-or-lose button');
    elBtn.innerText = '😃'

    var elMarkCount = document.querySelector('.marks-count');
    elMarkCount.innerText = `Marks: ${gGame.markedCount.toString()}`

    var elSafeBtn = document.querySelector('.safe-click-btn')
    elSafeBtn.classList.remove('btn-off')

    gameLevel(num);
    gBoard = creatBoard(gLevel.SIZE);
    putRandomMines(gBoard, gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container')
    var elNumMines = document.querySelector('.number-of-mines');
    elNumMines.innerText = `Number of 💣: ${gLevel.MINES}`
    document.querySelector('table').scrollIntoView()

}




function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gSafeClickOn) return
    var cell = gBoard[i][j]
    if (gHint) {
        var elTable = document.querySelector('table');
        elTable.classList.toggle('table-hint')
        showNegs(i, j)
        setTimeout(function () {
            HideNegs(i, j)
        }, 1000)
        loseAHint()
        gHint = false
        return
    }
    if (cell.isShown) return
    if (gFirstClick === true && cell.isMine === true) {
        putRandomMine(gBoard)
        gBoard[i][j].isMine = false;
        gBoard[i][j].minesAroundCount = countNegs(gBoard, i, j)
        renderBoard(gBoard, '.board-container')
        console.log(gBoard[i][j].minesAroundCount);
        if (gBoard[i][j].minesAroundCount === '') {
            fullExpansion(i, j)
        } else {
            gBoard[i][j].isShown = true;
            gBoard[i][j].wasShown = true;
            elCell.classList.add('show')
            elCell.classList.remove('hidden')
            renderBoard(gBoard, '.board-container')
        }

        gFirstClick = false
    } else {
        if (cell.isMarked) return
        if (cell.isMine) {
            var elLives = document.querySelector('.lives')
            if (gLives.length > 1) {
                loseALife()
                return
            } else {
                elLives.innerText = ' You are out of ❤️'
                youLost();
                return
            }
        }
        if (cell.minesAroundCount > 0) {
            cell.isShown = true
            cell.wasShown = true
            elCell.classList.add('show')
            elCell.classList.remove('hidden')
            gGame.shownCount++
            console.log(gGame.shownCount);
        } else {
            fullExpansion(i, j)
        }
        if (checkIfWon()) youWon()
    }
    gFirstClick = false
}

function markCell(elCell, i, j) {
    preventMenu();
    if (!gGame.isOn) return
    if (gFirstClick) return
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    if (!cell.isMarked) {
        cell.isMarked = true;
        cell.wasMarked = true;
        elCell.classList.remove('hidden')
        elCell.classList.add('marked')
        gGame.markedCount++
    } else {
        cell.isMarked = false;
        cell.wasMarked = false;
        elCell.classList.add('hidden')
        elCell.classList.remove('marked')
        gGame.markedCount--
    }
    var elMarksCount = document.querySelector('.marks-count')
    elMarksCount.innerText = `Marks: ${gGame.markedCount}`
    if (checkIfWon()) youWon()
}

function youLost() {
    var elBtn = document.querySelector('.win-or-lose button');
    var mines = allMinesPos();
    for (var i = 0; i < mines.length; i++) {
        gBoard[mines[i].i][mines[i].j].minesAroundCount = '💥'
        gBoard[mines[i].i][mines[i].j].isShown = true
    }
    renderBoard(gBoard, '.board-container')
    elBtn.innerText = '😭'
    gGame.isOn = false
}

function youWon() {
    var elBtn = document.querySelector('.win-or-lose button');
    elBtn.innerText = '😎'
    gGame.isOn = false
}

function checkIfWon() {
    if ((gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES) &&
        (gGame.markedCount === gLevel.MINES)) return true;

}

function activateHint() {
    var elTable = document.querySelector('table');

    if (gHints.length < 1) return
    // if (!gHint) {
    //     elHints.style.backgroundColor = 'yellow'
    //     gHint = true;
    // } else {
    //     elHints.style.backgroundColor = 'white'
    //     gHint = false;
    // }

    elTable.classList.toggle('table-hint')
    if (!gHint) {
        gHint = true
    } else {
        gHint = false
    }
}

function safeToClick() {
    if (gSafeClicks === 0) {
        return;
    }
    gSafeClickOn = true
    var clears = allClearPos();
    if (clears.length === 0) return
    var randomIndex = getRandomIntInclusive(0, clears.length - 1);
    var cell = clears[randomIndex]
    var elClearCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
    elClearCell.classList.remove('hidden')
    elClearCell.classList.add('safe')
    setTimeout(function () {
        elClearCell.classList.remove('safe')
        elClearCell.classList.add('hidden')
    }, 500)
    setTimeout(function () {
        elClearCell.classList.remove('hidden')
        elClearCell.classList.add('safe')
    }, 1000)
    setTimeout(function () {
        elClearCell.classList.remove('safe')
        elClearCell.classList.add('hidden')
        gSafeClickOn = false
    }, 1500)
    console.log(gSafeClicks);
    gSafeClicks--;
    if (gSafeClicks === 0) {
        var elSafeBtn = document.querySelector('.safe-click-btn')
        elSafeBtn.classList.add('btn-off')
    }
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









