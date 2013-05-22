(function () {
  var hostname = document.location.hostname.split('.').slice(-2).join('.');
  var slice = [].slice;
  var whiteList;

  // return tags array
  var $ = function (tagName) {
    var els = document.getElementsByTagName(tagName);
    return slice.call(els);
  };

  // rpelace a tag with another tag
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
      var childs = slice.call(objectTag.childNodes);

      embedTags.forEach(function (embedTag, i) {
        var isNested = childs.indexOf(embedTag);
        if (isNested) {
          embedTags.splice(i, 1);
        }
      });
    });

    return objectTags.concat(embedTags);
  };

  var elements = {
    _idCounter: 0,

    // store original elements to restore later if needed
    removedTags: {},


    // generate a unique integer id to get back the original element
    _uniqueId: function () {
      var id = ++this._idCounter;
      return 'id' + id;
    },

    // creates placeholder div to click and enable flash
    create: function (width, height) {
      var div = document.createElement('div');
      var id = div.dataset.id = this._uniqueId();
      div.classList.add('noflash');
      div.innerHTML = '<span>Flash</span>';
      div.style.width = width + 'px';
      div.style.height = height + 'px';
      // current id
      this._id = id;
      return div;
    },


    // save reference to original element
    save: function (tag) {
      this.removedTags[this._id] = tag;
    },

    // returns the original element and clean reference
    get: function (id) {
      var el = this.removedTags[id];
      delete this.removedTags[id];
      return el;
    },

    // restore original element
    restore: function () {
      var origElement = elements.get(this.dataset.id);
      replaceWith(this, origElement);
      this.removeEventListener('click', elements.restore);
    }
  };

  chrome.runtime.sendMessage({method: 'getWhiteList'}, function (response) {
    whiteList = response.whiteList;

    // check if hostname is white listed
    if (whiteList.indexOf(hostname) === -1) {
      var objectTags = $('object');
      var embedTags = $('embed');
      var allTags = cleanNested(objectTags, embedTags);

      // replace all objects and embed tags with placeholder div
      allTags.forEach(function (tag) {
        var width = tag.clientWidth || tag.width;
        var height = tag.clientHeight || tag.height;
        var div = elements.create(width, height);

        // save reference to original element
        elements.save(tag);

        // replace back to original tag when clicked
        div.addEventListener('click', elements.restore, false);

        // replace with the placeholder
        replaceWith(tag, div);

        // clean current element id
        delete elements._id;
      });
    }
  });
}());
