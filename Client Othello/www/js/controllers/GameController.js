(function(){
  angular.module('starter')
    .controller('GameController', ['$scope', '$state', 'localStorageService', 'SocketService', 'moment', '$ionicScrollDelegate', GameController]);

  function GameController($scope, $state, localStorageService, SocketService, moment, $ionicScrollDelegate) {

    var me = this;
    me.rowsT = ["1", "2", "3", "4", "5", "6", "7", "8"];
    me.columnsT = ["A", "B", "C", "D", "E", "F", "G", "H"];

    me.current_room = localStorageService.get('room');
    me.current_user = localStorageService.get('username');
    me.game = localStorageService.get('game');
    if(me.game == null){
      me.game = {
        'table': {"4":{"D":0, "E":1}, "5":{"D":1, "E":0}},
        'opponent': '',
        'tokens': 4,
        'turn': '',
        'color': '',
        'room': me.current_room
      };
      localStorageService.set('game', me.game);
    }

    $scope.getToken = function (row, column) {
      if(row in me.game && column in me.game[row]){
        var token = me.game[row][column];
        if(token == 0){
          return 'token-white';
        }
        return 'token-black';
      }
      return 'token-empty';
    };

    $scope.getOpponentName = function(){
      return me.game['opponent'];
    };

    $scope.create = function(){
      var data = {
        'user': me.current_user,
        'room': me.current_room,
        'time': moment()
      };
      SocketService.emit('join:room', data);
    };

    SocketService.on('game:start', function(data){

    });

    $scope.putToken = function(row, column, getToken){
      if(getToken == 'token-empty'){
        var data = {
          'row': row,
          'column': column,
          'turn': me.current_user,
          'room': me.current_room,
          'table': me.game['table']
        };
        SocketService.emit('game:put', data);
      }
    };

    SocketService.on('game:put', function(data){
      var game = me.game;
      game['table'] = data['table'];
      game['tokens'] +=1;
      game['turn'] = data['turn'];
      localStorageService.set('game', game);
      me.game = game;
      $state('game');
    });
  }
  })();
