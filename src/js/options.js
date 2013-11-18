(function () {

  // my jquery
  var $ = function (id) {
    return document.getElementById(id);
  };

  // default white listed domains
  var defaults = ['youtube.com', 'google.com', 'facebook.com', 'vimeo.com'];

  var $elements = {
    status: $('status'),
    whiteList: $('whiteList'),
    saveBtn: $('save'),
    closeBtn: $('close')
  };

  var close = function () {
    window.close();
  };

  var save = function () {
    var val = $elements.whiteList.value.split('\n');

    // save new options
    localStorage.whiteList = JSON.stringify(val);

    // show success text
    $elements.status.classList.remove('hide');

    // auto-close options popup
    window.setTimeout(close, 750);
  };

  var whiteList = localStorage.whiteList;

  if (!whiteList) {
    whiteList = localStorage.whiteList = JSON.stringify(defaults);
  }

  whiteList = JSON.parse(whiteList);

  $elements.saveBtn.addEventListener('click', save, false);
  $elements.closeBtn.addEventListener('click', close, false);

  // set default values into the textbox
  $elements.whiteList.value = whiteList.join('\n');
}());
