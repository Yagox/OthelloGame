(function(){
  angular.module('starter')
    .controller('HomeController', ['$scope', '$state', 'localStorageService', 'SocketService', HomeController]);

  function HomeController($scope, $state, localStorageService, SocketService){

    var me = this;

    me.current_room = localStorageService.get('room');

    $scope.login = function(username){
      SocketService.emit('check:login', username);
    };

    SocketService.on('check:login', function(data){
        if(data['ok']){
          me.current_user = data['username'];
          localStorageService.set('username', username);
          me.rooms = data['rooms'];
          $ionicScrollDelegate.scrollTop();
          $state(rooms);
        }else{
          me.error_login = true;
        }
    });

    $scope.joinGame = function(room_name){
      var room = {
        'room_name': room_name,
        'user': me.current_user
      };
      SocketService.emit('join:game', room);
    };
    $scope.createGame = function(){
      SocketService.emit('create:game', me.current_room);
    };

    SocketService.on('join:game', function(data){
      localStorageService.set('room', data['room']);
      localStorageService.set('game', data);
      $state.go('game');
    });
  }

})();
