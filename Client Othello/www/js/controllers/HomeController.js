(function(){
  angular.module('starter')
    .controller('HomeController', ['$scope', '$state', 'localStorageService', 'SocketService', HomeController]);

  function HomeController($scope, $state, localStorageService, SocketService, AccesibilidadService){

    var me = this;

    me.rooms = {}
    me.current_room = localStorageService.get('rooms');
    me.mode = false;
    $scope.login = function(accesibilidad){
      me.mode = accesibilidad;
      localStorageService.set('mode', accesibilidad);
      SocketService.emit('login', "");
    };

    SocketService.on('list rooms', function(data){
        me.rooms = data;
        console.log('Comando list rooms');
        console.log(data);
        $state.go('rooms');
    });

    $scope.joinGame = function(room_name){
      var room = {
        'room': room_name,
      };
      localStorageService.set('room', room_name);
      SocketService.emit('join board', room);
    };
    $scope.createGame = function(){
      SocketService.emit('create board', '');
    };
    SocketService.on('board', function(data){
      localStorageService.set('game', data);
      console.log(data);
      $state.go('game');
    });
  }

})();
