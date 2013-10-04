// Generated by CoffeeScript 1.6.3
(function() {
  var bind, debug, log, tinywings, tpl, tpl1, tpl2, travel,
    __hasProp = {}.hasOwnProperty;

  debug = true;

  log = function() {
    if (debug) {
      return console.log.apply(console, arguments);
    }
  };

  travel = function(node, callback) {
    var done, next, stop;
    node = node.firstChild;
    stop = false;
    done = function() {
      return stop = true;
    };
    while (node) {
      log("travel " + node);
      next = node.nextSibling;
      callback(node, done);
      if (!stop) {
        travel(node, callback);
      }
      node = next;
    }
  };

  bind = function(tw, attr, updater) {
    var attrLink, firstAttr;
    firstAttr = attr.split('.')[0];
    tw.callbacks[firstAttr] = tw.callbacks[firstAttr] || [];
    tw[firstAttr] = tw[firstAttr] || function(val, parent) {
      var callback, _i, _len, _ref;
      _ref = tw.callbacks[firstAttr];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(val, parent);
      }
    };
    if (attr.indexOf('.') > -1) {
      attrLink = attr.split('.');
      firstAttr = attrLink.shift();
      tw.callbacks[firstAttr].push(function(val, parent) {
        var atr, _i, _len;
        for (_i = 0, _len = attrLink.length; _i < _len; _i++) {
          atr = attrLink[_i];
          val = val[atr];
        }
        updater(val, parent);
      });
    } else {
      tw.callbacks[firstAttr].push(function(val, parent) {
        updater(val, parent);
      });
    }
  };

  tinywings = function(tpl) {
    var frag, tw;
    log('START BIND');
    tw = {};
    frag = document.createElement('div');
    frag.innerHTML = tpl;
    tw.frag = frag;
    tw.callbacks = {};
    travel(frag, function(node, done) {
      var attr, binder, child, first, innerTpl, last, match, matches, newData, newNode, next, o, parent, type, _fn, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      if ((_ref = node.dataset) != null ? _ref.bind : void 0) {
        binder = node.dataset.bind;
        _ref1 = binder.split(':'), type = _ref1[0], attr = _ref1[1];
        switch (type) {
          case 'text':
            log("text-bind to " + node + " with " + attr);
            bind(tw, attr, function(val) {
              node.innerHTML = val;
              return log("text-refrash to " + node + " with " + val);
            });
            break;
          case 'foreach':
            done();
            innerTpl = node.innerHTML;
            log("foreach-bind to " + node + " with " + attr);
            tw[attr] = function(val) {
              var child, innerDomTpl, item, key, next, value, _i, _len;
              node.innerHTML = '';
              log("foreach-refrash to " + node + " with " + val);
              for (_i = 0, _len = val.length; _i < _len; _i++) {
                item = val[_i];
                innerDomTpl = tinywings(innerTpl);
                child = innerDomTpl.frag.firstChild;
                while (child) {
                  next = child.nextSibling;
                  node.appendChild(child);
                  child = next;
                }
                for (key in innerDomTpl) {
                  if (!__hasProp.call(innerDomTpl, key)) continue;
                  value = innerDomTpl[key];
                  if (key !== 'frag') {
                    if (item[key]) {
                      innerDomTpl[key](item[key], node);
                    }
                  }
                }
              }
            };
        }
      } else if (node.nodeType === 3 && /{{[^}]*}}/.test(node.data)) {
        log("text-bind to " + node);
        matches = node.data.match(/{{[^}]*}}/g);
        o = {};
        for (_i = 0, _len = matches.length; _i < _len; _i++) {
          match = matches[_i];
          o[match] = match;
        }
        matches = Object.keys(o);
        newData = node.data;
        parent = node.parentNode;
        _fn = function(attr, parent) {
          return bind(tw, attr, function(val, p) {
            var nodes, _k, _len2;
            p || (p = parent);
            nodes = p.childNodes;
            for (_k = 0, _len2 = nodes.length; _k < _len2; _k++) {
              node = nodes[_k];
              if ((node.data != null) && node.data.indexOf("data-bind='_text:" + attr + "'") > -1) {
                node.nextSibling.data = val;
                log("text-refrash to " + node + " with " + val);
              }
            }
          });
        };
        for (_j = 0, _len1 = matches.length; _j < _len1; _j++) {
          match = matches[_j];
          _ref2 = /{{([^}]*)}}/.exec(match), binder = _ref2[0], attr = _ref2[1];
          newData = newData.replace(new RegExp(binder, 'g'), "<!-- data-bind='_text:" + attr + "' -->" + binder + "<!-- -->");
          _fn(attr, parent);
        }
        newNode = document.createElement('div');
        newNode.innerHTML = newData;
        first = child = newNode.firstChild;
        while (child) {
          next = child.nextSibling;
          if (child === first) {
            parent.replaceChild(child, node);
          } else {
            if (parent.lastChild === last) {
              parent.appendChild(child);
            } else {
              parent.insertBefore(child, last.nextSibling);
            }
          }
          last = child;
          child = next;
        }
      }
    });
    log('END BIND');
    return tw;
  };

  tpl = '<div data-bind="text:text">\n</div>\n<p data-bind="text:content"></p>\n<p>this is inline {{content}} bind.</p>\n<p>this is inline {{it.content}} bind and {{content}} bind.</p>\n<p data-bind="with:it"><span data-bind="text:content"></span></p>';

  tpl1 = '<div data-bind="foreach:people">this is {{content}}  and {{name}}.<p data-bind="text:content"></p><p data-bind="text:name"></p><div data-bind="foreach:pens"><p data-bind="text:color"></p></div></div>';

  tpl2 = '<div data-bind="text:it.text">\n</div>\n<p data-bind="text:it.content"></p>\n<p data-bind="text:it.content"></p>\n<p data-bind="text:that.content"></p>';

  window.onload = function() {
    var test1, test2, test3;
    test1 = function() {
      var domTpl;
      domTpl = tinywings(tpl);
      document.body.appendChild(domTpl.frag.firstChild);
      document.body.appendChild(domTpl.frag.firstChild.nextSibling);
      document.body.appendChild(domTpl.frag.firstChild.nextSibling.nextSibling);
      document.body.appendChild(domTpl.frag.firstChild.nextSibling.nextSibling.nextSibling);
      domTpl.text('something like this');
      domTpl.content('more');
      return domTpl.it({
        content: 'it.content'
      });
    };
    test2 = function() {
      var domTpl1;
      domTpl1 = tinywings(tpl1);
      document.body.appendChild(domTpl1.frag.firstChild);
      return domTpl1.people([
        {
          content: 'xxx',
          name: 'yyyy',
          pens: []
        }, {
          content: 'xxx',
          name: 'yyy',
          pens: []
        }
      ]);
    };
    test3 = function() {
      var domTpl;
      domTpl = tinywings(tpl2);
      document.body.appendChild(domTpl.frag.firstChild);
      document.body.appendChild(domTpl.frag.firstChild.nextSibling);
      document.body.appendChild(domTpl.frag.firstChild.nextSibling.nextSibling);
      document.body.appendChild(domTpl.frag.firstChild.nextSibling.nextSibling.nextSibling);
      domTpl.it({
        text: 'it.xxxx',
        content: 'it.xxxx'
      });
      return domTpl.that({
        content: 'that.xxxx'
      });
    };
    return test2();
  };

}).call(this);
