// Generated by CoffeeScript 1.6.3
(function() {
  var debug, log, tinywings, tpl, tpl1, tpl2, travel,
    __hasProp = {}.hasOwnProperty;

  debug = true;

  log = function() {
    if (debug) {
      return console.log.apply(console, arguments);
    }
  };

  travel = function(node, callback) {
    var done, stop, _results;
    node = node.firstChild;
    stop = false;
    done = function() {
      return stop = true;
    };
    _results = [];
    while (node) {
      log("travel " + node);
      callback(node, done);
      if (!stop) {
        travel(node, callback);
      }
      _results.push(node = node.nextSibling);
    }
    return _results;
  };

  tinywings = function(tpl) {
    var frag, tw;
    log('START BIND');
    tw = {};
    frag = document.createElement('div');
    frag.innerHTML = tpl;
    tw.frag = frag;
    travel(frag, function(node, done) {
      var attr, attrLink, bind, firstAttr, innerTpl, type, _ref, _ref1;
      if ((_ref = node.dataset) != null ? _ref.bind : void 0) {
        bind = node.dataset.bind;
        _ref1 = bind.split(':'), type = _ref1[0], attr = _ref1[1];
        switch (type) {
          case 'text':
            log("text-bind to " + node + " with " + attr);
            if (attr.indexOf('.') > -1) {
              attrLink = attr.split('.');
              firstAttr = attrLink.shift();
              tw.attrLinkCb = tw.attrLinkCb || {};
              tw.attrLinkCb[firstAttr] = tw.attrLinkCb[firstAttr] || [];
              tw.attrLinkCb[firstAttr].push(function(val) {
                var atr, _i, _len;
                for (_i = 0, _len = attrLink.length; _i < _len; _i++) {
                  atr = attrLink[_i];
                  val = val[atr];
                }
                node.innerHTML = val;
                return log("text-refrash to " + node + " with " + val);
              });
              tw[firstAttr] = function(val) {
                var callback, _i, _len, _ref2, _results;
                _ref2 = tw.attrLinkCb[firstAttr];
                _results = [];
                for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                  callback = _ref2[_i];
                  _results.push(callback(val));
                }
                return _results;
              };
            } else {
              tw[attr] = function(val) {
                node.innerHTML = val;
                return log("text-refrash to " + node + " with " + val);
              };
            }
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
                      innerDomTpl[key](item[key]);
                    }
                  }
                }
              }
            };
        }
      }
    });
    log('END BIND');
    return tw;
  };

  tpl = '<div data-bind="text:text">\n</div>\n<p data-bind="text:content"></p>';

  tpl1 = '<div data-bind="foreach:people"><p data-bind="text:content"></p><p data-bind="text:name"></p><div data-bind="foreach:pens"><p data-bind="text:color"></p></div></div>';

  tpl2 = '<div data-bind="text:it.text">\n</div>\n<p data-bind="text:it.content"></p>\n<p data-bind="text:it.content"></p>\n<p data-bind="text:that.content"></p>';

  window.onload = function() {
    var test1, test2, test3;
    test1 = function() {
      var domTpl;
      domTpl = tinywings(tpl);
      document.body.appendChild(domTpl.frag.firstChild);
      document.body.appendChild(domTpl.frag.firstChild.nextSibling);
      domTpl.text('something like this');
      return domTpl.content('more');
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
    test1();
    test2();
    return test3();
  };

}).call(this);
