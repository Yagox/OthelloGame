'use strict';
const Board = require('./board');

class Game {
    constructor() {
        this.boardsGame = new Array();
        this.boardsWait = new Array();
        this.numbersGame = 0;
    }
//Create Board
    nuevoGame(idPlayerOne ,NamePlayerOne) {
        let boardGame = new Board(
                "Game " + this.numbersGame,
                idPlayerOne,
                NamePlayerOne);
        this.boardsWait.push(boardGame);
        this.numbersGame ++;
        return this.getBoarInitial(boardGame);
    }
//joinGame
    joinGame(nameBoard,idPlayer, namePlayerTwo) {
        let indexBoard = this.getIndexOfBoardWait(nameBoard);
        if (indexBoard != -1 ) {
            let changeBoard = this.boardsWait[indexBoard];
            changeBoard.joinPlayer(
                idPlayer,
                namePlayerTwo);
            this.boardsGame.push(changeBoard);
            this.boardsWait.splice(indexBoard , 1);
            return this.getBoard(changeBoard);
        } else {
            console.log("No existe ningun tablero con ese nombre");
        }        
    }
    getIndexOfBoardWait(nameBoard) {
        let indexBoard = -1;
        this.boardsWait.forEach(function(element) {
            if(element.getNameBoard() == nameBoard) {
                indexBoard = this.boardsWait.indexOf(element);
            }
        }, this);
        return indexBoard;
    }
//listRooms
    listRooms() {
        let i;
        let palabra = {};
        this.boardsWait.forEach(function(element) {
            palabra[element.getNameBoard()] = element.infoBoard()
        }, this);
        return palabra;
    }
//Put disk
    putDisk(nameBoard, idUser, row, col) {
        let indexBoard = this.getIndexOfBoardGame(nameBoard);
        let res;
        if (indexBoard != 1) {
            let boardGame = this.boardsGame[indexBoard];
            if (boardGame.canPutUser(idUser)) {
                boardGame.setToken(row, col);
                res = this.getBoard(boardGame)
                return res;
            } else {
                console.log("no le toca al usuario" + idUser);
            }
        } else {
            console.log("El usuario que está intentando poner ficha no existe");
        }
    }
    getIndexOfBoardGame(nameBoard) {
        let indexBoard = -1;
        this.boardsGame.forEach(function(element) {
            if(element.getNameBoard() == nameBoard) {
                indexBoard = this.boardsGame.indexOf(element);
            }
        }, this);
        return indexBoard;
    }
    getBoard(boardGame) {
        return {
            'next token': boardGame.getNextTokens(),
            'turn': boardGame.getUserTurn(),
            'token' : boardGame.getTurn(),
            'board': boardGame.getTokens()
        }
    }
    getBoarInitial(boardGame) {
        return {
            'next token': undefined,
            'turn': '',
            'token' : "blanca",
            'board': boardGame.getTokens()
        }
    }

}
module.exports = Game;
