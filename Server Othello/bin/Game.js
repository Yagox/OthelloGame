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
        let boardGame = this.getIndexOfBoardGame(nameBoard);
        let res;
        if (boardGame != null) {
            console.log(boardGame);
            if (boardGame.canPutUser(idUser)) {
                boardGame.setToken(parseInt(row, 10), parseInt(col, 10));
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
        let board = null;
        this.boardsGame.forEach(function(element) {
            if(element.getNameBoard() == nameBoard) {
                board = element;
            }
        }, this);
        return board;
    }
    getBoard(boardGame) {
        let array = new Array();
        let next = boardGame.getNextTokens();
        next.forEach(function(element){
            let token = new Array();
            token.push(parseInt(element/10, 10));
            token.push(element % 10);
            array.push(token);
        });

        return {
            'next token': array,
            'turn': boardGame.getUserTurn(),
            'token' : boardGame.getTurn(),
            'board': boardGame.getTokens(),
            'room': boardGame.getNameBoard(),
        }
    }
    getBoarInitial(boardGame) {
        return {
            'room': boardGame.getNameBoard(),
            'next token': [],
            'turn': '',
            'token' : "blanca",
            'board': boardGame.getTokens()
        }
    }
    playersGameInfoCurrent(nameBoard, idUser) {
        let board = this.getIndexOfBoardGame(nameBoard);
        if (board) {
          return board.infoPlayer(idUser);
        }
    }

}
module.exports = Game;
