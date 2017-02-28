(function(){
  angular.module('starter')
    .controller('HomeController', ['$scope', '$state', 'localStorageService', 'SocketService', HomeController]);

  function HomeController($scope, $state, localStorageService, SocketService, AccesibilidadService){

    var me = this;
    me.current_room = null;
    localStorageService.set('room', null);
    me.rooms = localStorageService.get('rooms');
    me.mode = false;
    $scope.login = function(accesibilidad){
      me.mode = accesibilidad;
      localStorageService.set('mode', accesibilidad);
      SocketService.emit('login', "");
      me.current_room = 'waitRooms';
      localStorageService.set('room', me.current_room)
      console.log('Entra');
    };

    SocketService.on('list rooms', function(data){
        localStorageService.set('rooms', data)
        me.rooms = data;
        console.log('Comando list rooms');
        console.log(data);
        me.current_room = 'waitRoom';
        localStorageService.set('room', me.current_room)
        $state.go('rooms');
    });

    $scope.joinGame = function(room_name){
      var room = {
        'room': room_name,
      };
      me.current_room = room_name;
      localStorageService.set('room', room_name);
      SocketService.emit('join board', room);
    };

    $scope.createGame = function(){
      SocketService.emit('create board', '');
      console.log('Crear board');
    };

    SocketService.on('board inicial', function(data){
      localStorageService.set('game', data);
      localStorageService.set('room', data['room'])
      me.current_room = data['room'];
      localStorageService.set('room', me.current_room);
      console.log(data);
      $state.go('game');
    });
  }

})();
