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
var gSound = true;
var gSeconds;
var gTimerStarter;
var gScores;
gScores = [{ difficult: 'Easy', bestScores: [] },
{ difficult: 'Normal', bestScores: [] },
{ difficult: 'Hard', bestScores: [] }]

var gHitAMineSound = new Audio(`${location.href.includes('local host') ? '..' : ''}sounds/hitABombSound.mp3`)
var gLostSound = new Audio(`${location.href.includes('local host') ? '..' : ''}sounds/lostTheGameSound.mp3`)
var gWinSound = new Audio(`${location.href.includes('local host') ? '..' : ''}sounds/winTheGameSound.mp3`)
var gHintOnSound = new Audio(`${location.href.includes('local host') ? '..' : ''}sounds/hintOnSound.mp3`)
var gHintOffSound = new Audio(`${location.href.includes('local host') ? '..' : ''}sounds/hintOffSound.mp3`)


function init(num) {
    gGame.isOn = true;
    gFirstClick = true;
    gHint = false;
    gLives = ['❤️', '❤️', '❤️']
    gHints = ['💡', '💡', '💡']
    gSafeClicks = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gSeconds = 0;

    clearInterval(gTimerStarter)
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = `Time: ${gSeconds / 100}`

    var elLives = document.querySelector('.lives');
    elLives.innerText = `Lives: ${gLives.toString()}`

    var elHints = document.querySelector('.hints')
    elHints.innerText = `Click for a hint: ${gHints.toString()}`

    var elBtn = document.querySelector('.win-or-lose button');
    elBtn.innerText = '😃'

    var elMarkCount = document.querySelector('.marks-count');
    elMarkCount.innerText = `Marks: ${gGame.markedCount.toString()}`

    var elSafeBtn = document.querySelector('.safe-click-btn')
    elSafeBtn.innerText = `Safe-Click (3)`
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
    if (gFirstClick) {
        startTimer()
    }
    if (gFirstClick === true && cell.isMine === true) {
        firstClickOnMine(elCell, i, j);
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

function safeToClick() {
    if (gSafeClicks === 0) {
        return;
    }
    var elSafeBtn = document.querySelector('.safe-click-btn')
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
    gSafeClicks--;
    if (gSafeClicks === 0) {
        elSafeBtn.classList.add('btn-off')
    }
    elSafeBtn.innerText = `Safe-Click (${gSafeClicks})`
}

function firstClickOnMine(elCell, i, j) {
    startTimer()
    putRandomMine(gBoard)
    gBoard[i][j].isMine = false;
    gBoard[i][j].minesAroundCount = countNegs(gBoard, i, j)
    renderBoard(gBoard, '.board-container')
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
}





