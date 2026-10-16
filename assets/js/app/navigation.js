/* Desktop sidebar collapse + mobile drawer and theme preferences. */
(function(global){
  'use strict';
  var doc=document, body=doc.body;
  function byId(id){return doc.getElementById(id);}
  function isMobile(){return global.matchMedia('(max-width:1080px)').matches;}
  function close(){ body.classList.remove('menu-open'); sync(); }
  function open(){ body.classList.add('menu-open'); sync(); }
  function sync(){
    var btn=byId('menuBtn'), toggle=byId('sidebarToggle'), menu=byId('sideMenu');
    if(btn)btn.setAttribute('aria-expanded', String(body.classList.contains('menu-open')));
    if(toggle){
      var collapsed=body.classList.contains('sidebar-collapsed');
      toggle.setAttribute('aria-expanded',String(!collapsed));
      toggle.title=collapsed?'Mở rộng menu':'Thu gọn menu';
    }
    if(menu && !isMobile()) menu.setAttribute('aria-hidden','false');
  }
  function toggleSidebar(){
    if(isMobile()){body.classList.contains('menu-open')?close():open();return;}
    var collapsed=!body.classList.contains('sidebar-collapsed');
    body.classList.toggle('sidebar-collapsed',collapsed);
    try{localStorage.setItem('band_room_sidebar_collapsed',collapsed?'1':'0');}catch(e){}
    sync();
  }
  function init(){
    var savedTheme='';try{savedTheme=localStorage.getItem('band_room_theme')||'';}catch(e){}
    var light=savedTheme?savedTheme==='light':(global.matchMedia && global.matchMedia('(prefers-color-scheme: light)').matches);
    body.classList.toggle('light',!!light);
    try{body.classList.toggle('sidebar-collapsed',localStorage.getItem('band_room_sidebar_collapsed')==='1');}catch(e){}
    var menuBtn=byId('menuBtn'), sideClose=byId('sideCloseBtn'), toggle=byId('sidebarToggle');
    if(menuBtn)menuBtn.addEventListener('click',function(){body.classList.contains('menu-open')?close():open();});
    if(sideClose)sideClose.addEventListener('click',close);
    if(toggle)toggle.addEventListener('click',toggleSidebar);
    if(byId('drawerScrim'))byId('drawerScrim').addEventListener('click',close);
    doc.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    if(byId('themeBtn'))byId('themeBtn').addEventListener('click',function(){
      var value=!body.classList.contains('light');body.classList.toggle('light',value);
      try{localStorage.setItem('band_room_theme',value?'light':'dark');}catch(e){}
    });
    if(byId('sideThemeBtn'))byId('sideThemeBtn').addEventListener('click',function(){byId('themeBtn').click();});
    if(byId('sideSettingsBtn'))byId('sideSettingsBtn').addEventListener('click',function(){byId('settingsBtn').click();});
    if(byId('backBtn'))byId('backBtn').addEventListener('click',function(){if(history.length>1)history.back();else location.href='login.html';});
    var practice=byId('practiceNavBtn'),examiner=byId('examinerNavBtn'),hist=byId('historyNavBtn');
    function gotoPanel(btn,target){[practice,examiner,hist].forEach(function(item){if(item)item.classList.toggle('is-active',item===btn);}); close(); if(byId(target))byId(target).scrollIntoView({behavior:'smooth',block:'start'});}
    if(practice)practice.addEventListener('click',function(){gotoPanel(practice,'practicePanel');});
    if(examiner)examiner.addEventListener('click',function(){gotoPanel(examiner,'aiPanel');});
    if(hist)hist.addEventListener('click',function(){gotoPanel(hist,'historyPanel');});
    if(byId('mobileHistoryBtn'))byId('mobileHistoryBtn').addEventListener('click',function(){if(hist)hist.click();});
    global.addEventListener('resize',function(){if(!isMobile())close();sync();},{passive:true});
    sync();
  }
  global.BandRoomNavigation={init:init,open:open,close:close,toggle:toggleSidebar};
  init();
})(window);
