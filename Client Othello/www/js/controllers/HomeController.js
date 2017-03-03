(function(){
  angular.module('starter')
    .controller('HomeController', ['$scope', '$state', '$interval', 'localStorageService', 'SocketService', HomeController]);

  function HomeController($scope, $state, $interval, localStorageService, SocketService, AccesibilidadService){
    var me = this;
    me.current_room = null;
    me.rooms = localStorageService.get('rooms');
    me.mode = false;
    me.barrido = true;
    me.current_user = null;
    me.color = null;
    me.opponent_user = null;
    me.current_room = 'login';

    $scope.login = function(accesibilidad, username){
      me.mode = accesibilidad;
      localStorageService.set('mode', accesibilidad);
      localStorageService.set('user_current', username);
      SocketService.emit('login', "");
      me.current_room = 'waitRooms';
      localStorageService.set('room', me.current_room)
      console.log('Entra');
    };

    SocketService.on('list rooms', function(data){
        var first = true;
        var index = 0;
        angular.forEach(data, function(info){
            if(first){
              info['active'] = "active-room";
              first = false;
            }else{
              info['active'] = "desactive-room";
            }
            info['index'] = index;
            index ++;
        });
        localStorageService.set('active', 0);
        localStorageService.set('rooms', data)
        me.rooms = data;
        me.current_room = 'waitRoom';
        localStorageService.set('room', me.current_room)
        if(localStorageService.get('mode')){
          $state.go('rooms-accesible');
        }else{
          $state.go('rooms');
        }
    });

    $scope.joinGame = function(room_name){
      if(!localStorageService.get("mode")){
        var room = {
          'room': room_name,
          'user': localStorageService.get('user_current')
        };
        me.current_room = room_name;
        localStorageService.set('room', room_name);
        SocketService.emit('join board', room);
      }
    };

    $scope.joinGameAccesible = function(){
       var element = angular.element(document.querySelector('.active-room'));

       me.barrido = false;
       var room_name = element.find('div')[0].textContent;
       var room = {
         'room': room_name,
         'user': localStorageService.get('user_current')
       };
       me.current_room = room_name;
       localStorageService.set('room', room_name);
       SocketService.emit('join board', room);

    };

    $scope.createGame = function(){
      SocketService.emit('create board', {'user': localStorageService.get('user_current')});
      console.log('Crear board');
    };

    SocketService.on('playersGame', function(data){
        localStorageService.set('start', true)
        me.current_user = data['current'];
        me.color = data['color'];
        me.opponent_user = data['opponent'];
        localStorageService.set('current_user', me.current_user);
        localStorageService.set('color', me.color);
        localStorageService.set('opponent_user', me.opponent_user);
    });

    SocketService.on('board inicial', function(data){
      localStorageService.set('start', false)
      localStorageService.set('game', data);
      localStorageService.set('room', data['room'])
      me.current_room = data['room'];
      localStorageService.set('room', me.current_room);
      console.log(data);
      if(localStorageService.get('mode')){
        $state.go('game-accesible');
      }else{
        $state.go('game');
      }
    });

    $interval(function() {
      if(localStorageService.get('mode') && $state.current["name"] == 'rooms-accesible' && me.barrido){
           var rooms = localStorageService.get('rooms');
           var index = localStorageService.get('active');
           var new_index = -1;
           angular.forEach(rooms, function(info){
                new_index ++;
                info['active'] = "desactive-room";
           });
           if(new_index < index){
              index = 0;
           }
           var active = true;
           angular.forEach(rooms, function(info){
              if(active && info['index'] == index){
                info['active'] = "active-room";
                index++;
                active = false;
              }
           });
           localStorageService.set('active', index);
           localStorageService.set('rooms', rooms);
           me.rooms = rooms;
           $state.go($state.current, {}, {reload: true});
           }
    }, 3000);
  }
})();
