/* global chrome */
(function () {
  var hostname = document.location.hostname.split('.').slice(-2).join('.');
  var _slice = [].slice;

  // return tags array
  var $ = function (tagName) {
    var els = document.getElementsByTagName(tagName);
    return _slice.call(els);
  };

  // rpelace a tag with newTag
  var replaceWith = function (tag, newTag) {
    var parent = tag.parentNode;

    // remove the tag to be replaced
    parent.removeChild(tag);

    // insert new tag
    parent.insertBefore(newTag, tag.nextSibling);
  };

  // clean nested embed tag inside objects
  var cleanNested = function (objectTags, embedTags) {
    objectTags.forEach(function (objectTag) {
      var childs = _slice.call(objectTag.childNodes);

      embedTags.forEach(function (embedTag, i) {
        var isNested = childs.indexOf(embedTag);
        if (isNested) {
          embedTags.splice(i, 1);
        }
      });
    });

    return objectTags.concat(embedTags);
  };

  var overlay = {
    _getTemplate: function (options) {
      var style = 'style="width: ' + options.width + 'px;height: ' + options.height + 'px"';

      return '<div class="noflash" data-id="' + options.id + '" ' + style + '>' +
        '<div class="noflash-row">' +
        '<div class="noflash-cell">' +
        '<p class="title">Flash</p>' +
        '<p class="subtitle">Click to activate</p>' +
        '</div></div></div>';
    },

    idCounter: 0,

    // store original element to restore it when the overlay is clicked
    removedTags: {},

    // generate a unique string id to get back the original element
    _uniqueId: function () {
      var id = ++this.idCounter;

      return 'overlay' + id;
    },

    // creates placeholder div to click and enable flash
    create: function (options) {
      var id = this._uniqueId();
      var div = document.createElement('div');

      options.id = id;

      // insert template
      div.innerHTML = this._getTemplate(options);

      // get the actual overlay element
      div = div.children[0];

      // replace back with the original element when clicked
      div.addEventListener('click', this._restore, false);

      // save reference to original element
      this.removedTags[id] = options.origElement;

      return div;
    },

    // returns the original element and clean reference
    _get: function (id) {
      return this.removedTags[id];
    },

    // clean reference to stored original element
    _clean: function (id) {
      delete this.removedTags[id];
    },

    // restore original element
    _restore: function () {
      var id = this.dataset.id;

      // get original object/embed element
      var origElement = overlay._get(id);

      overlay._clean(id);

      // clean event listeners
      this.removeEventListener('click', overlay._restore);

      // replace and destroy overlay
      replaceWith(this, origElement);
    }
  };

  chrome.runtime.sendMessage({method: 'getWhiteList'}, function (response) {
    var whiteList = response.whiteList;

    // check if hostname is white listed
    if (whiteList.indexOf(hostname) === -1) {
      var objectTags = $('object');
      var embedTags = $('embed');

      // clean any nested ember tag inside object tags
      var allTags = cleanNested(objectTags, embedTags);

      // replace all objects and embed tags with overlay div
      allTags.forEach(function (tag) {

        // create the overlay div for the current tag
        var div = overlay.create({
          origElement: tag,
          width: tag.clientWidth || tag.width,
          height: tag.clientHeight || tag.height
        });

        // replace the current tag with the overlay
        replaceWith(tag, div);
      });
    }
  });
}());
