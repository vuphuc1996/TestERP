window.FumeniAPI=(function(){
  var bridgeFrame=null, ready=false, queue=[], pending={};
  function bridgeUrl(){return String(FUMENI_CONFIG.gasUrl||'').replace(/\/$/,'')+'?mode=bridge'}
  function initBridge(){
    if(!FUMENI_CONFIG.gasUrl || FUMENI_CONFIG.gasUrl.indexOf('PASTE_')===0) return Promise.reject(new Error('Chưa cấu hình GAS Web App URL.'));
    return new Promise(function(resolve,reject){
      var timer=setTimeout(function(){reject(new Error('Không kết nối được GAS Bridge.'))},15000);
      window.addEventListener('message',function on(e){
        if(e.data&&e.data.type==='FUMENI_BRIDGE_READY'){clearTimeout(timer);ready=true;window.removeEventListener('message',on);resolve()}
      });
      bridgeFrame=document.createElement('iframe');
      bridgeFrame.title='Fumeni Secure Bridge'; bridgeFrame.setAttribute('aria-hidden','true');
      bridgeFrame.style.cssText='position:fixed;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
      bridgeFrame.src=bridgeUrl(); document.body.appendChild(bridgeFrame);
    });
  }
  window.addEventListener('message',function(e){
    var d=e.data||{}; if(d.type!=='FUMENI_RPC_RESULT'||!pending[d.id]) return;
    var x=pending[d.id]; delete pending[d.id]; d.result.success?x.resolve(d.result):x.reject(new Error(d.result.message||d.result.code||'RPC error'));
  });
  return {
    ready:function(){return ready?Promise.resolve():initBridge()},
    call:function(module,action,payload,extra){
      return this.ready().then(function(){return new Promise(function(resolve,reject){
        var id=(crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random());
        pending[id]={resolve:resolve,reject:reject};
        bridgeFrame.contentWindow.postMessage({type:'FUMENI_RPC',id:id,request:Object.assign({module:module,action:action,payload:payload||{}},extra||{})}, '*');
      })});
    }
  };
})();
