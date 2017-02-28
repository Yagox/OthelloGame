class Board {
    constructor(name, idOne, playerOne) {
        this.name = name;
        this.playerOne = {
            id : idOne,
            name: playerOne || ('Guess' + idOne)
        };
        this.playerTwo = {
            id : '',
            name: ''
        };
        this.rowNcol = 8;
        this.tokens = this.generateBoard(this.rowNcol);
        this.turn = "negra";
        this.nextTokens = new Set(this.generateFirstNextsTokens());
        this.neightbours = new Set(this.generateFirstNeightBours());
        this.nextChange = this.generateFirstChange();
        /*{
            34: 44,
            43: 44,
            56: 55,
            65: 55
        };*/
    }
    joinPlayer(idTwo, playerTwo) {
        if (this.playerTwo.id == '') {
            if(parseInt(Math.random() * 100, 10)% 2 == 0){
                let playerOneId = this.playerOne.id;
                let playerOneName = this.playerOne.name;

                this.playerOne.id = idTwo;
                this.playerOne.name = playerTwo || ('Guess' + idTwo);
                this.playerTwo.id = playerOneId;
                this.playerTwo.name = playerOneName;
            }else{
                this.playerTwo.id = idTwo;
                this.playerTwo.name = playerTwo || ('Guess' + idTwo);
            }
        } else
        console.log("No es posible añadir un jugador");
    }
    canPutUser(idUser) {
        if (this.getTurn() == "negra" && this.playerOne.id == idUser ||
            this.getTurn() == "blanca" && this.playerTwo.id == idUser
        ) {
            return true;
        } else {
            return false;
        }
    }
// Consultores Atributos
    getNameBoard() {
        return this.name;
    }
    getPlayerOne() {
        return this.playerOne;
    }
    getPlayerTwo() {
        return this.playerTwo;
    }
    getTokens() {
        return this.tokens;
    }
    getTurn() {
        return this.turn;
    }
    getNextTokens() {
        return this.nextTokens;
    }
    getArray(row, col) {
        return this.nextChange[row*10 + col];
    }
    getUserTurn() {
        if (this.getTurn() == "negra")
            return this.getPlayerOne.id;
        else
            return this.playerTwo.id;
    }
// Consultores
    //Obtiene la ficha en la posición indicada
    getToken(row, col) {
        return this.tokens[row][col];
    }
    getNumberToken(row, col) {
        return row*10 + col;
    }
    changeTurn() {
        if (this.turn == "negra")
            this.turn = "blanca";
        else
            this.turn = "negra"
    }
//Servidor
    infoBoard() {
        return {
            'user' : this.playerOne.name,
            'ide' : this.playerOne.id
        }
    }
//Poner ficha
    setToken(row, col) {
        let r1 = this.nextTokens.has(this.getNumberToken(row, col));
        
        if (r1) {
            this.changeColor(this.turn, row, col);
            this.changeDisks(this.turn, this.getArray(row, col));
            this.changeTurn();
            this.newNeightBours(row, col);
            this.newNextTokens(row, col);
        } else {
            console.log("Ficha no posible");
        }
    }
/* Voltea fichas en las 8 direcciones */
    flipDisks(color, row, col, number) {
        let newsTokens = new Set();
        this.flipDisksDiskCenterLeft(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);
        this.flipDisksDiskCenterTop(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);
        this.flipDisksDiskCenterRight(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);
        this.flipDisksDiskCenterDown(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);

        this.flipDisksDiskTopRight(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);
        this.flipDisksDiskTopLeft(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);

        this.flipDisksDiskDownLeft(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);
        this.flipDisksDiskDownRight(color, row, col).forEach(function(element) {
            newsTokens.add(element);
        }, this);
        if(newsTokens.size > 0) {
            this.nextChange[number] = newsTokens;
            this.nextTokens.add(number);
            console.log(this.nextChange);
        }
    }
    flipDisksDiskCenterTop(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row - 1;
        j = col;
        let change = false;
        while(i > 0) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                i--;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
    flipDisksDiskCenterLeft(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row;
        j = col - 1;
        let change = false;
        while(j > 0) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                j--;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
    flipDisksDiskCenterRight(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row;
        j = col + 1;
        let change = false;
        
        while(j <= this.rowNcol) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                j++;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
    flipDisksDiskCenterDown(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row + 1;
        j = col;
        let change = false;
        
        while(i <= this.rowNcol) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                i++;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
    flipDisksDiskTopLeft(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row - 1;
        j = col - 1;
        let change = false;
        
        while(i > 0 && j > 0) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                i--;
                j--;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
    flipDisksDiskTopRight(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row - 1;
        j = col + 1;
        let change = false;
        
        while(i > 0 && j <= 8) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                i--;
                j++;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
    flipDisksDiskDownLeft(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row + 1;
        j = col - 1;
        let change = false;
        
        while(i <= 8 && j > 0) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                i++;
                j--;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
    flipDisksDiskDownRight(color, row, col) {
        let i,j;
        let numeros = new Set();
        i = row + 1;
        j = col + 1;
        let change = false;
        
        while(i <= 8 && j <= 8) {
            /* Para cuando es el mismo color */
            if (this.getToken(i,j) == color) {
                change = true;
                break;
            /* Para si no encuentra ficha */
            } else if (!this.existDisk(i,j)) {
                break;
            } else {
                numeros.add(i*10 + j);
                i++;
                j++;
            }
        }
        if (change) {
            return numeros;
        } else {
            return new Set();
        }
    }
//Vecinos
    newNeightBours(row, col) {
        let newNeightBours = this.neightbours;
        newNeightBours.delete(row*10 + col);
        let i,j;
        //row top col left
        i = row - 1;
        j = col - 1;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }
        // row top col center
        j++;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }
        // row top col right
        j++;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }
        // row center col right
        i++;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }        
        // row center col left
        j = col - 1;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }
        // row down col left
        i++;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }
        // row down col center
        j++;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }
        // row down col right
        j++;
        if (this.isValid(i,j) && !this.existDisk(i,j)) {
            newNeightBours.add(i*10 + j);
        }
        this.neightbours = newNeightBours;
    }
    newNextTokens() {
        this.nextChange = {};
        this.nextTokens = new Set();
        let row, col;
        this.neightbours.forEach(function(element) {
            row = parseInt(element / 10, 10);
            col = element%10;
            this.flipDisks(this.turn, row, col, element);
            
        }, this);


    }
//Auxiliares
    generateBoard(rowNcol){
	    let matriz = new Array(rowNcol+1);
	    let i, j;
	    for (i = 1; i <= rowNcol; i++) {
	        matriz[i] = new Array(rowNcol+1);
	        for (j = 1; j <= rowNcol; j++) {
		        matriz[i][j] = 0;
	        }
	    }
	    matriz[4][4] = "blanca";
        matriz[4][5] = "negra";
        matriz[5][4] = "negra";
        matriz[5][5] = "blanca";

	    return matriz;
    }
    generateFirstNeightBours() {
        return [33, 34, 35, 36, 43, 46, 53, 56, 63, 64, 65, 66];
    }
    generateFirstNextsTokens() {
        return [
            34,
            43,
            56,
            65
            ];
    }
    generateFirstChange() {
        let s1 = new Set();
        let s2 = new Set();
        let s3 = new Set();
        let s4 = new Set();
        s1.add(34);
        s1.add(44);

        s2.add(43);
        s2.add(44);

        s3.add(56);
        s3.add(55);

        s4.add(65);
        s4.add(55);

        return {
            34 : s1,
            43 : s2,
            56 : s3,
            65 : s4
        };
    }
    existDisk(row, col) {
        if (this.getToken(row, col) != 0) {
            return true;
        } else {
            return false;
        }

    }
    isValid(row, col) {
        if(row > 0 && row <= 8 && col > 0 && col <=8) {
            return true;
        } else
            return false;
    }
    changeColor(color, row, col) {
        this.tokens[row][col] = color;
    }
    changeDisks(color, array) {
        let row, col, i;
        array.forEach(function(element) {
            row = parseInt(element / 10, 10);
            col = element%10;
            this.changeColor(color, row, col);
        }, this);
    }
}
module.exports = Board