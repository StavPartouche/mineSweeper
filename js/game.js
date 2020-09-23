'use strict'

var MINE = '💣'

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


function init(num) {
    gGame.isOn = true;
    gFirstClick = true;
    gHint = false;
    gLives = ['❤️', '❤️', '❤️']
    gHints = ['💡', '💡', '💡']
    var elLives = document.querySelector('.lives');
    elLives.innerText = `Lives: ${gLives.toString()}`
    var elHints = document.querySelector('.hints')
    elHints.innerText = `Hints: ${gHints.toString()}`
    var elBtn = document.querySelector('.win-or-lose button');
    elBtn.innerText = '😃'
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gameLevel(num)
    gBoard = creatBoard(gLevel.SIZE);
    putRandomMines(gBoard, gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container')
}




function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]
    if (cell.isShown) return
    if (gFirstClick) {
        if (cell.isMine) {
            putRandomMine(gBoard)
            gBoard[i][j].isMine = false;
            gBoard[i][j].minesAroundCount = countNegs(gBoard, i, j)
            gBoard[i][j].isShown = true;
            elCell.classList.add('show')
            elCell.classList.remove('hidden')
            console.log(elCell)
        }
        gFirstClick = false
    } else if (gHint) {
        showNegs(i, j)
    } else {
        // if (cell.isShown) return
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
            elCell.classList.add('show')
            elCell.classList.remove('hidden')
            gGame.shownCount++
        } else {
            showNegs(i, j);
            setTimeout(HideNegs, 1000)
            var elHints = document.querySelector('.hints');
            elHints.style.backgroundColor = 'white'
        }
        // console.log('shown', gGame.shownCount);
        // console.log('marked: ', gGame.markedCount);
        if (checkIfWon()) youWon()

    }
}

function markCell(elCell, i, j) {
    preventMenu();
    if (!gGame.isOn) return
    var cell = gBoard[i][j];
    if (cell.isShown) return;
    if (!cell.isMarked) {
        cell.isMarked = true;
        elCell.classList.remove('hidden')
        elCell.classList.add('marked')
        gGame.markedCount++
    } else {
        cell.isMarked = false;
        elCell.classList.add('hidden')
        elCell.classList.remove('marked')
        gGame.markedCount--
    }
    if (checkIfWon()) youWon()
}

function youLost() {
    var elBtn = document.querySelector('.win-or-lose button');
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

function hint() {
    console.log('hint');
    var elHints = document.querySelector('.hints');
    if(elHints.style.backgroundColor === 'white'){
        elHints.style.backgroundColor = 'yellow'
    }else{
        elHints.style.backgroundColor = 'white'
    }
    gHint = true;
}









