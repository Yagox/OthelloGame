(function(){
  angular.module('starter')
    .controller('GameController', ['$scope', '$state', 'localStorageService', 'SocketService', 'moment', '$ionicScrollDelegate', GameController]);

  function GameController($scope, $state, localStorageService, SocketService, moment, $ionicScrollDelegate) {

    var me = this;
    var data = localStorageService.get('game');
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
    if(data != null && 'board' in data){ me.token = data['board'];}
    if(data != null && 'token' in data){ me.token = data['token'];}
    if(data != null && 'turn' in data){  me.turn = data['turn'];}
    if(data != null && 'next token' in data){ me.nextToken = data['next token']};

    $scope.getToken = function (row, column) {
      if(row in me.board && column in me.board[row]){
        var token = me.board[row][column];
        if(token == 0){
          return 'token token-white';
        }
        return 'token token-black';
      }
      return 'token-empty';
    };

    $scope.getOpponentName = function(){
      return me.game['opponent'];
    };

    $scope.putToken = function(row, column, getToken){
      if(getToken == 'token-empty'){
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
      console.log('Comando board');
      console.log(data)
      if(data != null && 'board' in data){ me.token = data['board'];}
      if(data != null && 'token' in data){ me.token = data['token'];}
      if(data != null && 'turn' in data){  me.turn = data['turn'];}
      if(data != null && 'next token' in data){ me.nextToken = data['next token']};
      localStorageService.set('game', data);
    });
  }
  })();
