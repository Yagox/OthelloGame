(function(){
  angular.module('starter')
    .controller('GameController', ['$scope', '$state', '$interval', 'localStorageService', 'SocketService', 'moment', '$ionicScrollDelegate', GameController]);

  function GameController($scope, $state, $interval, localStorageService, SocketService, moment, $ionicScrollDelegate) {

    var me = this;
    var data = localStorageService.get('game');
    me.barrido = true;
    me.start = localStorageService.get('start');
    me.current_user = localStorageService.get('current_user');
    me.color = localStorageService.get('color');
    me.opponent_user = localStorageService.get('opponent_user');;
    me.current_room = localStorageService.get('room');
    me.rowsT = ["1", "2", "3", "4", "5", "6", "7", "8"];
    me.columnsT = ["1", "2", "3", "4", "5", "6", "7", "8"];
    me.board = {
        "4" : {
          "4": 0,
          "5": 1
        },
        "5": {
          "4": 1,
          "5": 0
        }
    }

  SocketService.on('playersGame', function(data){
          me.start = true;
          me.current_user = data['current'];
          me.color = data['color'];
          me.opponent_user = data['opponent'];
          localStorageService.set('current_user', me.current_user);
          localStorageService.set('color', me.color);
          localStorageService.set('opponent_user', me.opponent_user);
      });

    me.token = null;
    me.turn = null;
    me.nextToken = null;
    if(data != null && 'token' in data){ me.token = data['token'];}
    if(data != null && 'turn' in data){  me.turn = data['turn'];}
    if(data != null && 'next token' in data){me.nextToken = data['next token'] };

    $scope.getToken = function (row, column) {
      if(row in me.board && column in me.board[row]){
        var token = me.board[row][column];
        if(token == 0){
          return 'token token-white';
        }
        return 'token token-black';
      }
      if(me.color == me.token && me.nextToken != null && row in me.nextToken && column in me.nextToken[row]){
        return 'token-empty token-posible';
      }else{
        return 'token-empty';
      }
    };

    $scope.getOpponentName = function(){
      return me.game['opponent'];
    };

    $scope.putToken = function(row, column, getToken){
      if(getToken == 'token-empty token-posible'){
        var data = {
          'row': row,
          'column': column,
          'user': me.current_user,
          'room': me.current_room
        };
        SocketService.emit('put disk', data);
        console.log("ha entrado");
      }
    };

    SocketService.on('board', function(data){
      console.log("------1");
      console.log(data);
      console.log(me.current_room);
      if(data['room'] == me.current_room){
        console.log('Comando board');
        console.log(data)
        if(data != null && 'next token' in data){ me.nextToken = data['next token']};
        var board = {}
        for(var r = 1; r <=8; r++){
            for(var c=1; c<=8; c++){
                var token = data['board'][r][c];
                if(token != 0){
                    if(!(r in board)){
                        board[r] = {};
                        board[r][c] = 0;
                    }
                    board[r][c] = (token == "blanca") ? 0 : 1;
                }
            }
        }
        me.token = data['token'];
        me.board = board;
        data["board"] = board;
        me.nextToken = {};
        for(var i=0; i< data['next token'].length; i++){
          var token = data['next token'][i];
          if(me.nexToken[token[0]] !=null){
            me.nextToken[token[0]] = {}
          }
          me.nextToken[token[0]][token[1]] = true;
        }
        data['next token'] = me.nexToken;
        me.turn = (me.token == me.color) ? me.current_user : me.opponent_user;
        data['turn'] = me.turn;
        localStorageService.set('game', data);
      }
    });

  }
  })();
