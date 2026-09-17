window.FumeniInstall=(function(){
  var deferred=null, shown=false;
  function ios(){return /iphone|ipad|ipod/i.test(navigator.userAgent||'') && !window.MSStream}
  function standalone(){return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone===true}
  function android(){return /android/i.test(navigator.userAgent||'')}
  function isMobile(){return FumeniDevice.detect().type==='mobile'}
  function showIOS(){
    if(!ios()||standalone()||shown)return;
    shown=true;
    Swal.fire({icon:'info',title:'Cài Fumeni trên iPhone',html:'Nhấn <b>Chia sẻ</b> trên Safari → chọn <b>Thêm vào Màn hình chính</b> → <b>Thêm</b>.',confirmButtonText:'Đã hiểu'});
  }
  function showAndroid(){
    if(!android()||standalone()||!deferred||shown)return;
    shown=true;
    Swal.fire({icon:'info',title:'Cài Fumeni',text:'Fumeni có thể cài như ứng dụng trên Android.',showCancelButton:true,confirmButtonText:'Cài đặt',cancelButtonText:'Để sau'}).then(function(r){
      if(r.isConfirmed && deferred){deferred.prompt();deferred.userChoice.then(function(){deferred=null})}
    });
  }
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;setTimeout(showAndroid,800)});
  window.addEventListener('appinstalled',function(){deferred=null;shown=true});
  return {init:function(){if(!isMobile()||standalone())return;setTimeout(showIOS,1200);setTimeout(showAndroid,1800)}};
})();
