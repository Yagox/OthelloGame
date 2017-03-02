
    function select(){
       var time = 5000;
       var index = 1;
       var elements = document.getElementsByClassName('accesibilidad');
       var before = document.getElementsByClassName('active-access');
       before[0].className = before[0].className.replace('active-access', '');
       var element  = elements[index++];
       element.className = element.className + ' active-access';
       setInteval(accesibilidad, time);
  }
