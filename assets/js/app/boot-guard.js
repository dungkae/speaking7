/* Thông báo dễ hiểu thay cho màn hình trống nếu một module không thể khởi tạo. */
(function (global) {
  'use strict';
  var lastError = '';
  global.addEventListener('error', function (event) {
    if (event.target && event.target.tagName === 'SCRIPT') {
      var file = (event.target.src || '').split('/').pop().split('?')[0];
      lastError = 'Không tải được: ' + file;
    } else if (event.message) {
      lastError = event.message;
    }
  }, true);

  global.setTimeout(function () {
    if (global.BandRoomReady) return;
    var alertBox = document.getElementById('startupAlert');
    if (!alertBox) return;
    alertBox.hidden = false;
    var detail = document.getElementById('startupErrorDetail');
    if (detail && lastError) detail.textContent = 'Chi tiết: ' + lastError;
  }, 7000);
})(window);
