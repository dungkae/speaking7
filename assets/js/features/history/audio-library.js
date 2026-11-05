/* Audio lưu trong IndexedDB; cache trong phiên chỉ là dự phòng. */
(function(global){
'use strict';
var cache=new Map(),objectUrls=new Map();
function openDb(){return new Promise(function(resolve,reject){
  if(!global.indexedDB){reject(new Error('Trình duyệt không hỗ trợ IndexedDB.'));return;}
  var req=global.indexedDB.open('band_room_media_v1',1);
  req.onupgradeneeded=function(){var db=req.result;if(!db.objectStoreNames.contains('audio'))db.createObjectStore('audio');};
  req.onsuccess=function(){resolve(req.result);};req.onerror=function(){reject(req.error||new Error('Không mở được kho audio.'));};
  req.onblocked=function(){reject(new Error('Kho audio đang bị một tab khác chặn.'));};
});}
function store(blob){
  if(!blob || !blob.size)return Promise.resolve('');
  var id='aud_'+Date.now()+'_'+Math.random().toString(36).slice(2,10);cache.set(id,blob);
  return openDb().then(function(db){
    return new Promise(function(resolve,reject){
      try{
        var tx=db.transaction('audio','readwrite');tx.objectStore('audio').put(blob,id);
        tx.oncomplete=function(){db.close();resolve(id);};
        tx.onerror=tx.onabort=function(){db.close();reject(tx.error||new Error('Không lưu được audio.'));};
      }catch(err){db.close();reject(err);}
    });
  }).catch(function(cause){
    var error=new Error('Audio chỉ lưu trong phiên này; tải lại trang sẽ mất audio. '+(cause&&cause.message||''));
    error.audioId=id;throw error;
  });
}
function load(id){
  if(!id)return Promise.resolve(null);if(cache.has(id))return Promise.resolve(cache.get(id));
  return openDb().then(function(db){return new Promise(function(resolve){
    try{
      var r=db.transaction('audio','readonly').objectStore('audio').get(id);
      r.onsuccess=function(){if(r.result)cache.set(id,r.result);db.close();resolve(r.result||null);};
      r.onerror=function(){db.close();resolve(null);};
    }catch(err){db.close();resolve(null);}
  });}).catch(function(){return null;});
}
function hydrate(root){
 (root||document).querySelectorAll('audio[data-audio-id]').forEach(function(el){
  if(el.dataset.ready)return;el.dataset.ready='1';var id=el.dataset.audioId;
  load(id).then(function(blob){
   if(blob){
    var url=objectUrls.get(id);if(!url){url=URL.createObjectURL(blob);objectUrls.set(id,url);}el.src=url;
   }else{
    el.style.display='none';
    if(el.insertAdjacentText)el.insertAdjacentText('afterend','Audio không còn trên thiết bị này.');
   }
  });
 });
}
global.addEventListener('pagehide',function(){objectUrls.forEach(function(url){URL.revokeObjectURL(url);});objectUrls.clear();});
global.BandRoomAudio={store:store,load:load,hydrate:hydrate};
})(window);
