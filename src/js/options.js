(function () {
  // defaults white listed
  var defaults = ['youtube.com', 'google.com', 'facebook.com', 'vimeo.com'];

  // my jquery
  var $ = function (id) {
    return document.getElementById(id);
  };

  // returns the list or set it if missing
  var getWhiteList = function () {
    var whiteList = localStorage.whiteList;
    if (!whiteList) {
      whiteList = localStorage.whiteList = JSON.stringify(defaults);
    }
    return JSON.parse(whiteList);
  };

  var whiteList = getWhiteList();

  var close = function () {
    window.close();
  };

  var save = function () {
    var val = $('whiteList').value.split('\n');
    localStorage.whiteList = JSON.stringify(val);
    $('status').textContent = 'White List Saved!';
    window.setTimeout(close, 750);
  };

  var restore = function () {
    $('whiteList').value = whiteList.join('\n');
  };

  document.addEventListener('DOMContentLoaded', function () {
    $('save').addEventListener('click', save, false);
    $('close').addEventListener('click', close, false);
    restore();
  });
}());
