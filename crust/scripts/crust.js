!function($) {
  var self = {};
  /** @type {boolean} */
  self.isFirefoxOrIE = typeof InstallTrigger !== "undefined" || (false || !!document.documentMode);
  /** @type {string} */
  self.version = "6.0.0";
  /** @type {number} */
  self.PI = Math.PI;
  /** @type {number} */
  self.A90 = Math.PI / 2;
  /** @type {boolean} */
  self.isTouch = false;
  self.corners = {
    backward : ["bl", "tl", "l"],
    forward : ["br", "tr", "r"],
    all : ["tl", "bl", "tr", "br", "l", "r"]
  };
  /** @type {number} */
  self.DISPLAY_SINGLE = 1;
  /** @type {number} */
  self.DISPLAY_DOUBLE = 2;
  /** @type {number} */
  self.DIRECTION_LTR = 1;
  /** @type {number} */
  self.DIRECTION_RTL = 2;
  /** @type {number} */
  self.EVENT_PREVENTED = 1;
  /** @type {number} */
  self.EVENT_STOPPED = 2;
  self.fragStatus = {
    assigned : 0,
    requested : 1,
    waiting : 2,
    nsplit : 6,
    fetched : 3,
    splitted : 4,
    full : 5
  };
  /**
   * @return {?}
   */
  self.getVendorPrefix = function() {
    /** @type {Array} */
    var vendorPrefixes = ["Moz", "Webkit", "Khtml", "O", "ms"];
    /** @type {number} */
    var len = vendorPrefixes.length;
    /** @type {string} */
    var prefix = "";
    for (;len--;) {
      if (vendorPrefixes[len] + "Transform" in document.body.style) {
        /** @type {string} */
        prefix = "-" + vendorPrefixes[len].toLowerCase() + "-";
      }
    }
    return prefix;
  };
  /**
   * @param {?} opt_attributes
   * @return {?}
   */
  self.addCssWithPrefix = function(opt_attributes) {
    var value = this.vendor || this.getVendorPrefix();
    var options = {};
    var field;
    for (field in opt_attributes) {
      if (this.has(field, opt_attributes)) {
        options[field.replace("@", value)] = opt_attributes[field].replace("@", value);
      }
    }
    return options;
  };
  /**
   * @param {Object} elem
   * @param {Function} callback
   * @return {?}
   */
  self.transitionEnd = function(elem, callback) {
    var t;
    var type;
    /** @type {Element} */
    var el = document.createElement("fakeelement");
    var transitions = {
      transition : "transitionend",
      OTransition : "oTransitionEnd",
      MSTransition : "transitionend",
      MozTransition : "transitionend",
      WebkitTransition : "webkitTransitionEnd"
    };
    for (t in transitions) {
      if (void 0 !== el.style[t]) {
        type = transitions[t];
        break;
      }
    }
    return elem && (type ? elem.bind(type, function() {
      elem.unbind(type);
      callback.call(elem);
    }) : window.setTimeout(function() {
      callback.call(elem);
    }, Math.ceil(1E3 * parseFloat(elem.css(getVendorPrefix() + "transition-duration"))))), type;
  };
  /**
   * @param {Element} el
   * @return {?}
   */
  self.findPos = function(el) {
    var o = {
      top : 0,
      left : 0
    };
    do {
      o.left += el.offsetLeft;
      o.top += el.offsetTop;
    } while (el = el.offsetParent);
    return o;
  };
  /**
   * @param {Element} el
   * @param {?} fn
   * @return {?}
   */
  self.offsetWhile = function(el, fn) {
    var o = {
      top : 0,
      left : 0
    };
    do {
      if (!fn(el, o)) {
        break;
      }
      o.left += el.offsetLeft;
      o.top += el.offsetTop;
    } while (el = el.offsetParent);
    return o;
  };
  /**
   * @return {?}
   */
  self.getSelectedText = function() {
    return window.getSelection ? window.getSelection().toString() : document.selection.createRange ? document.selection.createRange().text : void 0;
  };
  /**
   * @param {Array} data
   * @param {number} t
   * @param {number} message
   * @return {?}
   */
  self.bezier = function(data, t, message) {
    /** @type {number} */
    var mum1 = 1 - t;
    /** @type {number} */
    var mum13 = mum1 * mum1 * mum1;
    /** @type {number} */
    var t3 = t * t * t;
    return this.peelingPoint(message, Math.round(mum13 * data[0].x + 3 * t * mum1 * mum1 * data[1].x + 3 * t * t * mum1 * data[2].x + t3 * data[3].x), Math.round(mum13 * data[0].y + 3 * t * mum1 * mum1 * data[1].y + 3 * t * t * mum1 * data[2].y + t3 * data[3].y));
  };
  /**
   * @param {number} recurring
   * @param {number} mayParseLabeledStatementInstead
   * @param {(number|string)} lab
   * @param {number} overf
   * @return {?}
   */
  self.layerCSS = function(recurring, mayParseLabeledStatementInstead, lab, overf) {
    return{
      css : {
        position : "absolute",
        top : recurring,
        left : mayParseLabeledStatementInstead,
        overflow : overf || "hidden",
        "z-index" : lab || "auto"
      }
    };
  };
  /**
   * @param {number} degrees
   * @return {?}
   */
  self.rad = function(degrees) {
    return degrees / 180 * PI;
  };
  /**
   * @param {number} radians
   * @return {?}
   */
  self.deg = function(radians) {
    return 180 * (radians / PI);
  };
  /**
   * @param {number} childrenVarArgs
   * @param {?} funcToCall
   * @param {number} millis
   * @return {?}
   */
  self.peelingPoint = function(childrenVarArgs, funcToCall, millis) {
    return{
      corner : childrenVarArgs,
      x : funcToCall,
      y : millis
    };
  };
  /**
   * @param {string} line
   * @param {number} g
   * @return {?}
   */
  self.transformUnit = function(line, g) {
    var m;
    return "string" == typeof line && (m = /^(\d+)(px|%)$/.exec(line)) ? "px" == m[2] ? parseInt(m[1], 10) : "%" == m[2] ? parseInt(m[1], 10) / 100 * g : void 0 : line;
  };
  /**
   * @param {number} recurring
   * @param {number} mayParseLabeledStatementInstead
   * @return {?}
   */
  self.point2D = function(recurring, mayParseLabeledStatementInstead) {
    return{
      x : recurring,
      y : mayParseLabeledStatementInstead
    };
  };
  /**
   * @param {number} z
   * @param {number} mayParseLabeledStatementInstead
   * @param {string} deepDataAndEvents
   * @return {?}
   */
  self.translate = function(z, mayParseLabeledStatementInstead, deepDataAndEvents) {
    return this.has3d && deepDataAndEvents ? " translate3d(" + z + "px," + mayParseLabeledStatementInstead + "px, 0px) " : " translate(" + z + "px, " + mayParseLabeledStatementInstead + "px) ";
  };
  /**
   * @param {number} value
   * @param {number} dataAndEvents
   * @param {string} deepDataAndEvents
   * @return {?}
   */
  self.scale = function(value, dataAndEvents, deepDataAndEvents) {
    return this.has3d && deepDataAndEvents ? " scale3d(" + value + "," + dataAndEvents + ", 1) " : " scale(" + value + ", " + dataAndEvents + ") ";
  };
  /**
   * @param {number} x
   * @return {?}
   */
  self.rotate = function(x) {
    return " rotate(" + x + "deg) ";
  };
  /**
   * @param {string} property
   * @param {?} target
   * @return {?}
   */
  self.has = function(property, target) {
    return Object.prototype.hasOwnProperty.call(target, property);
  };
  /**
   * @return {?}
   */
  self.rotationAvailable = function() {
    var components;
    if (components = /AppleWebkit\/([0-9\.]+)/i.exec(navigator.userAgent)) {
      /** @type {number} */
      var version = parseFloat(components[1]);
      return version > 534.3;
    }
    return true;
  };
  /**
   * @return {?}
   */
  self.css3dAvailable = function() {
    return "WebKitCSSMatrix" in window || "MozPerspective" in document.body.style;
  };
  /**
   * @param {Object} $elem
   * @param {Function} oldValMethod
   * @return {?}
   */
  self.getTransitionEnd = function($elem, oldValMethod) {
    var t;
    var type;
    /** @type {Element} */
    var el = document.createElement("fakeelement");
    var transitions = {
      transition : "transitionend",
      OTransition : "oTransitionEnd",
      MSTransition : "transitionend",
      MozTransition : "transitionend",
      WebkitTransition : "webkitTransitionEnd"
    };
    for (t in transitions) {
      if (void 0 !== el.style[t]) {
        type = transitions[t];
        break;
      }
    }
    return $elem && (type ? $elem.bind(type, function() {
      $elem.unbind(type);
      oldValMethod.call($elem);
    }) : setTimeout(function() {
      oldValMethod.call($elem);
    }, Math.ceil(1E3 * parseFloat($elem.css(getVendorPrefix() + "transition-duration"))))), type;
  };
  /**
   * @param {boolean} recurring
   * @return {?}
   */
  self.makeGradient = function(recurring) {
    var vendor;
    return "-webkit-" == this.vendor ? recurring ? (vendor = "-webkit-gradient(linear, left top, right top,", vendor += "color-stop(0, rgba(0,0,0,0)),", vendor += "color-stop(0.3, rgba(0,0,0, 0.3)),", vendor += "color-stop(0.5, rgba(0,0,0, 0.8))", vendor += ")") : (vendor = "-webkit-gradient(linear, left top, right top,", vendor += "color-stop(0, rgba(0,0,0,0)),", vendor += "color-stop(0.2, rgba(0,0,0,0.5)),", vendor += "color-stop(0.2, rgba(0,0,0,0.6)),", vendor += "color-stop(0.4, rgba(0,0,0,0.2)),", 
    vendor += "color-stop(1, rgba(0,0,0,0))", vendor += ")") : (vendor = this.vendor + "linear-gradient(left, ", recurring ? (vendor += "rgba(0,0,0,0) 0%,", vendor += "rgba(0,0,0,0.3) 30%,", vendor += "rgba(0,0,0,0.8) 50%") : (vendor += "rgba(0,0,0,0) 0%,", vendor += "rgba(0,0,0,0.2) 20%,", vendor += "rgba(0,0,0,0.6) 20%,", vendor += "rgba(0,0,0,0.2) 40%,", vendor += "rgba(0,0,0,0) 100%"), vendor += ")"), vendor;
  };
  /**
   * @param {Object} el
   * @param {?} pos
   * @param {?} p1
   * @param {Array} colors
   * @param {number} a
   * @return {undefined}
   */
  self.gradient = function(el, pos, p1, colors, a) {
    var b;
    /** @type {Array} */
    var tagNameArr = [];
    if ("-webkit-" == this.vendor) {
      /** @type {number} */
      b = 0;
      for (;a > b;b++) {
        tagNameArr.push("color-stop(" + colors[b][0] + ", " + colors[b][1] + ")");
      }
      el.css({
        "background-image" : "-webkit-gradient(linear, " + pos.x + "% " + pos.y + "%," + p1.x + "% " + p1.y + "%, " + tagNameArr.join(",") + " )"
      });
    }
  };
  /**
   * @param {string} event
   * @param {Array} obj
   * @param {Array} data
   * @return {?}
   */
  self.trigger = function(event, obj, data) {
    var e = $.Event(event);
    return obj.trigger(e, data), e.isDefaultPrevented() ? self.EVENT_PREVENTED : e.isPropagationStopped() ? self.EVENT_STOPPED : "";
  };
  /**
   * @param {string} msg
   * @return {?}
   */
  self.error = function(msg) {
    /**
     * @param {string} message
     * @return {undefined}
     */
    function AssertionError(message) {
      /** @type {string} */
      this.name = "TurnError";
      /** @type {string} */
      this.message = message;
    }
    return TurnJsError.prototype = new Error, TurnJsError.prototype.constructor = AssertionError, new AssertionError(msg);
  };
  /**
   * @param {?} obj
   * @param {string} type
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  self.getListeners = function(obj, type, dataAndEvents) {
    var events = $._data(obj[0]).events;
    /** @type {Array} */
    var assigns = [];
    if (events) {
      var list = events[type];
      if (list) {
        $.each(list, function(dataAndEvents, vvar) {
          assigns.push(vvar);
        });
        if (dataAndEvents) {
          obj.unbind(type);
        }
      }
    }
    return assigns;
  };
  /**
   * @param {Object} cy
   * @param {string} event
   * @param {Array} codeSegments
   * @return {undefined}
   */
  self.setListeners = function(cy, event, codeSegments) {
    if (codeSegments) {
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        cy.on(event, codeSegments[i].selector, codeSegments[i].handler);
      }
    }
  };
  /**
   * @return {undefined}
   */
  self.cleanSelection = function() {
    if (window.getSelection().empty) {
      window.getSelection().empty();
    } else {
      if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      } else {
        if (document.selection) {
          document.selection.empty();
        }
      }
    }
  };
  /**
   * @return {?}
   */
  self.hasHardPage = function() {
    return-1 == navigator.userAgent.indexOf("MSIE 9.0");
  };
  /**
   * @param {Function} cssText
   * @return {?}
   */
  self.UIComponent = function(cssText) {
    /**
     * @param {?} element
     * @param {?} opt_renderer
     * @return {undefined}
     */
    var Tabs = function(element, opt_renderer) {
      this._data = {};
      this._hashKey = opt_renderer;
      this.$el = $(element);
    };
    return Tabs.prototype = {
      /** @type {Function} */
      _init : cssText,
      /**
       * @param {?} fn
       * @return {?}
       */
      _bind : function(fn) {
        return Tabs.prototype[fn].apply(this, Array.prototype.slice.call(arguments, 1));
      },
      /**
       * @param {string} type
       * @return {?}
       */
      _trigger : function(type) {
        return self.trigger(type, this.$el, Array.prototype.slice.call(arguments, 1));
      },
      /**
       * @return {undefined}
       */
      _destroy : function() {
        var _hashKey = this.$el.data();
        delete _hashKey[this._hashKey];
      }
    }, Tabs;
  };
  /**
   * @param {Function} model
   * @param {EventTarget} options
   * @param {?} checkSet
   * @return {?}
   */
  self.widgetInterface = function(model, options, checkSet) {
    var data = $.data(this, options);
    return data ? data._bind.apply(data, checkSet) : (self.oneTimeInit(), data = new model(this, options), $.data(this, options, data), data._init.apply(data, checkSet));
  };
  /**
   * @param {string} name
   * @param {?} obj
   * @return {undefined}
   */
  self.widgetFactory = function(name, obj) {
    /** @type {string} */
    var fqn = "turn." + name;
    /**
     * @return {?}
     */
    $.fn[name] = function() {
      if (1 == this.length) {
        return self.widgetInterface.call(this[0], obj, fqn, arguments);
      }
      /** @type {number} */
      var i = 0;
      for (;i < this.length;i++) {
        self.widgetInterface.call(this[i], obj, fqn, arguments);
      }
      return this;
    };
  };
  /**
   * @return {undefined}
   */
  self.oneTimeInit = function() {
    if (!this.vendor) {
      this.has3d = this.css3dAvailable();
      this.hasRotation = this.rotationAvailable();
      this.vendor = this.getVendorPrefix();
    }
  };
  /**
   * @param {?} params
   * @return {?}
   */
  self.calculateBounds = function(params) {
    var img = {
      width : params.width,
      height : params.height
    };
    if (img.width > params.boundWidth || img.height > params.boundHeight) {
      /** @type {number} */
      var delta = img.width / img.height;
      if (params.boundWidth / delta > params.boundHeight && params.boundHeight * delta <= params.boundWidth) {
        /** @type {number} */
        img.width = Math.round(params.boundHeight * delta);
        img.height = params.boundHeight;
      } else {
        img.width = params.boundWidth;
        /** @type {number} */
        img.height = Math.round(params.boundWidth / delta);
      }
    }
    return img;
  };
  /**
   * @param {Object} options
   * @param {Object} animation
   * @return {?}
   */
  self.animate = function(options, animation) {
    if (!animation) {
      return options.animation && options.animation.stop(), void 0;
    }
    if (options.animation) {
      /** @type {number} */
      options.animation._time = (new Date).getTime();
      /** @type {number} */
      var j = 0;
      for (;j < options.animation._elements;j++) {
        options.animation.from[j] = options.animation.current[j];
        /** @type {number} */
        options.animation.to[j] = animation.to[j] - options.animation.from[j];
      }
    } else {
      if (!animation.to.length) {
        /** @type {Array} */
        animation.to = [animation.to];
      }
      if (!animation.from.length) {
        /** @type {Array} */
        animation.from = [animation.from];
      }
      /** @type {boolean} */
      var e = true;
      options.animation = $.extend({
        current : [],
        _elements : animation.to.length,
        _time : (new Date).getTime(),
        /**
         * @return {undefined}
         */
        stop : function() {
          /** @type {boolean} */
          e = false;
          /** @type {null} */
          options.animation = null;
        },
        /**
         * @param {number} t
         * @param {number} x
         * @param {?} easing
         * @param {number} d
         * @return {?}
         */
        easing : function(t, x, easing, d) {
          return-easing * ((t = t / d - 1) * t * t * t - 1) + x;
        },
        /**
         * @return {undefined}
         */
        _frame : function() {
          /** @type {number} */
          var t = Math.min(this.duration, (new Date).getTime() - this._time);
          /** @type {number} */
          var i = 0;
          for (;i < this._elements;i++) {
            this.current[i] = this.easing(t, this.from[i], this.to[i], this.duration);
          }
          /** @type {boolean} */
          e = true;
          this.frame(this.current);
          if (t >= this.duration) {
            this.stop();
            if (this.completed) {
              this.completed();
            }
          } else {
            window.requestAnimationFrame(function() {
              if (e) {
                options.animation._frame();
              }
            });
          }
        }
      }, animation);
      /** @type {number} */
      var i = 0;
      for (;i < options.animation._elements;i++) {
        options.animation.to[i] -= options.animation.from[i];
      }
      options.animation._frame();
    }
  };
  /**
   * @param {?} o
   * @param {?} f
   * @return {undefined}
   */
  self.addDelegateList = function(o, f) {
    if (o) {
      var i;
      for (i in o) {
        if (self.has(i, o)) {
          f.on(i, o[i]);
        }
      }
    }
  };
  /**
   * @return {?}
   */
  self.getDeviceName = function() {
    /** @type {string} */
    var userPlatform = "";
    /** @type {string} */
    var u = navigator.userAgent;
    return/ipad/i.test(u) ? userPlatform = "ipad" : /iphone/i.test(u) ? userPlatform = "iphone" : /ipod/i.test(u) ? userPlatform = "ipod" : /kindle/i.test("iPod") && (userPlatform = "kindle"), userPlatform;
  };
  if (!window.requestAnimationFrame) {
    /** @type {function (this:Window, function (number): ?, (Element|null)=): number} */
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || function(after) {
      window.setTimeout(after, 1E3 / 60);
    })));
  }
  /**
   * @param {string} value
   * @param {?} dest
   * @return {?}
   */
  $.fn.transform = function(value, dest) {
    var properties = {};
    return dest && (properties[self.vendor + "transform-origin"] = dest), properties[self.vendor + "transform"] = value, this.css(properties);
  };
  /**
   * @return {undefined}
   */
  self.toggleFullScreen = function() {
    if (document.fullscreenElement || (document.mozFullScreenElement || document.webkitFullscreenElement)) {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else {
        if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else {
          if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
        }
      }
    } else {
      /** @type {Element} */
      var element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else {
        if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else {
          if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        }
      }
    }
  };
  window.Turn = self;
  var val = $.isTouch || "ontouchstart" in window;
  /** @type {string} */
  self.eventPrefix = "";
  self.isTouchDevice = val;
  /**
   * @param {?} point
   * @param {Element} container
   * @return {?}
   */
  self.isInside = function(point, container) {
    if (container) {
      if (container == document.body || container == window) {
        return true;
      }
      var rect = $(container).offset();
      return rect && (point.x >= rect.left && (point.y >= rect.top && (point.x <= rect.left + container.offsetWidth && point.y <= rect.top + container.offsetHeight)));
    }
  };
  /**
   * @param {Event} ev
   * @return {?}
   */
  self.eventPoint = function(ev) {
    var orig = ev.originalEvent;
    var hasBody = orig.touches && orig.touches[0];
    var data = hasBody ? self.point2D(orig.touches[0].pageX, orig.touches[0].pageY) : self.point2D(ev.pageX, ev.pageY);
    return data.time = ev.timeStamp, data.target = ev.target, data;
  };
  /**
   * @param {string} name
   * @param {Object} opt_attributes
   * @return {?}
   */
  self.Event = function(name, opt_attributes) {
    name = this.eventPrefix + name;
    /** @type {boolean} */
    var iTime = false;
    /**
     * @param {?} el
     * @param {(Function|string)} selector
     * @return {undefined}
     */
    var init = function(el, selector) {
      this.el = el;
      this.$el = $(el);
      this.eventName = name;
      /** @type {(Function|string)} */
      this._selector = selector;
      this._data = {};
      this._init();
    };
    return opt_attributes._triggerVirtualEvent = function(evt) {
      if (iTime != evt.timeStamp) {
        iTime = evt.timeStamp;
        this.$el.trigger(evt);
      }
    }, opt_attributes._trigger = function(eventName) {
      var touch = self.eventPoint(eventName);
      var event = this.Event(eventName, {
        pageX : touch.x,
        pageY : touch.y
      });
      this._triggerVirtualEvent(event);
    }, opt_attributes.Event = function(event, e) {
      e = e || {};
      e.type = this.eventName;
      e.target = event.target;
      e.toElement = event.toElement;
      e.currentTarget = event.currentTarget;
      e.delegateTarget = event.delegateTarget;
      e.pageX = e.pageX || event.pageX;
      e.pageY = e.pageY || event.pageY;
      var info = $.Event(event, e);
      return info.type = this.eventName, info;
    }, init.eventName = name, init.prototype = opt_attributes, init;
  };
  /**
   * @param {Function} Resource
   * @param {string} evtName
   * @return {undefined}
   */
  self._registerEvent = function(Resource, evtName) {
    $.event.special[evtName] = {
      /**
       * @param {Object} handleObj
       * @return {undefined}
       */
      add : function(handleObj) {
        var opt = handleObj.selector || "";
        /** @type {string} */
        var that = "e." + evtName + opt;
        var target = $(this);
        var self = target.data(that) || {
          listeners : 0
        };
        if (!self.instance) {
          self.instance = new Resource(this, opt);
        }
        self.listeners++;
        target.data(that, self);
      },
      /**
       * @param {(Object|string)} handleObj
       * @return {undefined}
       */
      remove : function(handleObj) {
        var endpoint = handleObj.selector || "";
        /** @type {string} */
        var full = "e." + evtName + endpoint;
        var d = $(this);
        var view = d.data(full);
        if (view) {
          if (view.listeners > 0) {
            view.listeners--;
            if (0 === view.listeners) {
              view.instance._remove();
              delete view.instance;
            }
          }
        }
      }
    };
  };
  /**
   * @param {Array} codeSegments
   * @return {undefined}
   */
  self._registerEvents = function(codeSegments) {
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      this._registerEvent(codeSegments[i], codeSegments[i].eventName);
    }
  };
  var tap = self.Event("tap", {
    /**
     * @return {undefined}
     */
    _init : function() {
      if (val) {
        this.$el.on("touchstart", this._selector, $.proxy(this, "_touchstart"));
        this.$el.on("touchmove", this._selector, $.proxy(this, "_touchmove"));
        this.$el.on("touchend", this._selector, $.proxy(this, "_touchend"));
      } else {
        this.$el.on("click", this._selector, $.proxy(this, "_trigger"));
      }
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      if (val) {
        this.$el.off("touchstart", this._selector, this._touchstart);
        this.$el.off("touchmove", this._selector, this._touchmove);
        this.$el.off("touchend", this._selector, this._touchend);
      } else {
        this.$el.off("click", this._selector, this._trigger);
      }
    },
    /**
     * @param {Object} value
     * @return {undefined}
     */
    _touchstart : function(value) {
      /** @type {Object} */
      this._data.startEvent = value;
      this._data.initScrollTop = $(window).scrollTop();
      this._data.initScrollLeft = $(window).scrollLeft();
    },
    /**
     * @param {Object} value
     * @return {undefined}
     */
    _touchmove : function(value) {
      /** @type {Object} */
      this._data.startEvent = value;
    },
    /**
     * @return {undefined}
     */
    _touchend : function() {
      if (this._data.startEvent) {
        var x = self.eventPoint(this._data.startEvent);
        var todayMonth = $(window).scrollTop();
        var todayYear = $(window).scrollLeft();
        if (self.isInside(x, this._data.startEvent.currentTarget || this.el) && (this._data.initScrollTop == todayMonth && this._data.initScrollLeft == todayYear)) {
          var $this = this;
          var type = this._data.startEvent;
          setTimeout(function() {
            $this._trigger(type);
          }, 0);
        }
        /** @type {null} */
        this._data.startEvent = null;
      }
    }
  });
  var e = self.Event("doubletap", {
    /**
     * @return {undefined}
     */
    _init : function() {
      /** @type {Array} */
      this._data.queue = [0, 0];
      this.$el.on("tap", this._selector, $.proxy(this, "_tap"));
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      this.$el.off("tap", this._selector, this._tap);
    },
    /**
     * @param {Event} e
     * @return {undefined}
     */
    _tap : function(e) {
      var keys = this._data.queue;
      if (keys.shift(), keys.push(e.timeStamp), keys[1] - keys[0] < 300) {
        var event = e.originalEvent;
        var pointer = self.eventPoint(event);
        this._triggerVirtualEvent(this.Event(event, {
          pageX : pointer.x,
          pageY : pointer.y
        }));
      }
    }
  });
  var vmouseover = self.Event("vmouseover", {
    /**
     * @return {undefined}
     */
    _init : function() {
      if (val) {
        this.$el.on("touchstart", this._selector, $.proxy(this, "_trigger"));
      } else {
        this.$el.on("mouseover", this._selector, $.proxy(this, "_trigger"));
      }
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      if (val) {
        this.$el.off("touchstart", this._selector, this._trigger);
      } else {
        this.$el.off("mouseover", this._selector, this._trigger);
      }
    }
  });
  var vmouseout = self.Event("vmouseout", {
    /**
     * @return {undefined}
     */
    _init : function() {
      if (val) {
        this.$el.on("touchend", this._selector, $.proxy(this, "_trigger"));
      } else {
        this.$el.on("mouseout", this._selector, $.proxy(this, "_trigger"));
      }
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      if (val) {
        this.$el.off("touchend", this._selector, this._trigger);
      } else {
        this.$el.off("mouseout", this._selector, this._trigger);
      }
    }
  });
  var vmousedown = self.Event("vmousedown", {
    /**
     * @return {undefined}
     */
    _init : function() {
      if (val) {
        this.$el.on("touchstart", this._selector, $.proxy(this, "_trigger"));
      } else {
        this.$el.on("mousedown", this._selector, $.proxy(this, "_trigger"));
      }
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      if (val) {
        this.$el.off("touchstart", this._selector, this._trigger);
      } else {
        this.$el.off("mousedown", this._selector, this._trigger);
      }
    }
  });
  var vmouseup = self.Event("vmouseup", {
    /**
     * @return {undefined}
     */
    _init : function() {
      if (val) {
        this.$el.on("touchend", this._selector, $.proxy(this, "_trigger"));
      } else {
        this.$el.on("mouseup", this._selector, $.proxy(this, "_trigger"));
      }
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      if (val) {
        this.$el.off("touchend", this._selector, this._trigger);
      } else {
        this.$el.off("mouseup", this._selector, this._trigger);
      }
    }
  });
  var vmousemove = self.Event("vmousemove", {
    /**
     * @return {undefined}
     */
    _init : function() {
      if (val) {
        this.$el.on("touchmove", this._selector, $.proxy(this, "_trigger"));
      } else {
        this.$el.on("mousemove", this._selector, $.proxy(this, "_trigger"));
      }
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      if (val) {
        this.$el.off("touchmove", this._selector, this._trigger);
      } else {
        this.$el.off("mousemove", this._selector, this._trigger);
      }
    }
  });
  var message = self.Event("swipe", {
    /**
     * @return {undefined}
     */
    _init : function() {
      this.$el.on("vmousedown", this._selector, $.proxy(this, "_vmousedown"));
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      this.$el.off("vmousedown", this._selector, this._vmousedown);
    },
    /**
     * @param {Event} end
     * @return {undefined}
     */
    _vmousedown : function(end) {
      var data = this._data;
      data.firstEvent = self.eventPoint(end);
      data.currentEvent = data.firstEvent;
      data.prevEvent = data.firstEvent;
      $(document).on("vmousemove", $.proxy(this, "_vmousemove"));
      $(document).on("vmouseup", $.proxy(this, "_vmouseup"));
    },
    /**
     * @param {Event} part
     * @return {undefined}
     */
    _vmousemove : function(part) {
      var options = this._data;
      var len = options.currentEvent;
      options.currentEvent = self.eventPoint(part);
      options.prevEvent = len;
    },
    /**
     * @return {undefined}
     */
    _vmouseup : function() {
      var d = this._data;
      /** @type {number} */
      var movingSpace = d.prevEvent.x - d.currentEvent.x;
      /** @type {number} */
      var deltaTime = d.prevEvent.time - d.currentEvent.time;
      /** @type {number} */
      var speed = movingSpace / deltaTime;
      if (-0.2 > speed || speed > 0.2) {
        var t = {};
        t.pageX = d.currentEvent.x;
        t.pageY = d.currentEvent.y;
        /** @type {number} */
        t.speed = speed;
        this._triggerVirtualEvent(this.Event(d.firstEvent, t));
      }
      $(document).off("vmousemove", this._vmousemove);
      $(document).off("vmouseup", this._vmouseup);
    }
  });
  var error = self.Event("pinch", {
    /**
     * @return {undefined}
     */
    _init : function() {
      this.$el.on("touchstart", this._selector, $.proxy(this, "_touchstart"));
    },
    /**
     * @return {undefined}
     */
    _remove : function() {
      this.$el.off("touchstart", this._selector, this._touchstart);
    },
    /**
     * @param {Event} touch
     * @return {undefined}
     */
    _touchstart : function(touch) {
      var data = this._data;
      data.firstEvent = self.eventPoint(touch);
      /** @type {null} */
      data.pinch = null;
      $(document).on("touchmove", $.proxy(this, "_touchmove"));
      $(document).on("touchend", $.proxy(this, "_touchend"));
    },
    /**
     * @param {KeyboardEvent} e
     * @return {undefined}
     */
    _touchmove : function(e) {
      var touches = e.originalEvent.touches;
      var data = this._data;
      if (2 == touches.length) {
        var evt = {};
        /** @type {number} */
        var z0 = touches[1].pageX - touches[0].pageX;
        /** @type {number} */
        var z1 = touches[1].pageY - touches[0].pageY;
        var ev = self.point2D(touches[1].pageX / 2 + touches[0].pageX / 2, touches[1].pageY / 2 + touches[0].pageY / 2);
        /** @type {number} */
        var x = Math.sqrt(z0 * z0 + z1 * z1);
        if (!data.pinch) {
          data.pinch = {
            initDistance : x,
            prevDistance : x,
            prevMidpoint : ev
          };
        }
        evt.pageX = ev.x;
        evt.pageY = ev.y;
        /** @type {number} */
        evt.dx = ev.x - data.pinch.prevMidpoint.x;
        /** @type {number} */
        evt.dy = ev.y - data.pinch.prevMidpoint.y;
        /** @type {number} */
        evt.factor = x / data.pinch.initDistance;
        /** @type {number} */
        evt.dfactor = x / data.pinch.prevDistance;
        /** @type {number} */
        data.pinch.prevDistance = x;
        data.pinch.prevMidpoint = ev;
        this._triggerVirtualEvent(this.Event(data.firstEvent, evt));
      }
    },
    /**
     * @return {undefined}
     */
    _touchend : function() {
      $(document).off("touchmove", this._touchmove);
      $(document).off("touchend", this._touchend);
    }
  });
  self._registerEvents([tap, e, message, error, vmouseover, vmouseout, vmousedown, vmousemove, vmouseup]);
  var defaults = {
    acceleration : true,
    animatedAutoCenter : false,
    autoCenter : true,
    autoScroll : true,
    autoScaleContent : false,
    fragments : 0,
    hoverAreaSize : 50,
    cornerPosition : "50px 20px",
    margin : "0px 0px",
    display : "double",
    duration : 600,
    /**
     * @param {number} t
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @return {?}
     */
    easing : function(t, b, c, d) {
      /** @type {number} */
      var ts = (t /= d) * t;
      /** @type {number} */
      var tc = ts * t;
      return b + c * (-1.95 * tc * ts + 7.8 * ts * ts + -10.7 * tc + 4.8 * ts + 1.05 * t);
    },
    elevation : "10%",
    hover : true,
    ignoreElements : "[ignore=1]",
    page : 1,
    pageMargin : "0px 0px",
    smartFlip : false,
    swipe : true,
    responsive : false,
    gradients : true,
    turnCorners : "l,r",
    events : null,
    showDoublePage : false,
    zoomAnimationDuration : 1E4
  };
  var that = self.UIComponent(function(options) {
    var data = this._data;
    var codeSegments = this.$el.children();
    /** @type {number} */
    var entered = 0;
    options = $.extend({
      width : options.pageWidth ? 2 * options.pageWidth : this.$el.width(),
      height : options.pageHeight ? options.pageHeight : this.$el.height(),
      direction : this.$el.attr("dir") || (this.$el.css("direction") || "ltr"),
      viewer : this.$el.parent(),
      cacheSize : options && options.blocks ? 8 : 6
    }, defaults, options);
    var octalLiteral = options.cornerPosition.split(" ");
    if (options.cornerPosition = self.point2D(parseInt(octalLiteral[0], 10), parseInt(octalLiteral[1], 10)), data.options = options, data.dynamicMode = false, data.turningPage = false, data.watchSizeChange = true, data.pageObjs = {}, data.pageBlocks = {}, data.pages = {}, data.pageWrap = {}, data.blocks = {}, data.pageMv = [], data.front = [], data.scroll = {
      left : 0,
      top : 0
    }, data.margin = [0, 0, 0, 0], data.pageMargin = [0, 0, 0, 0], data.zoom = 1, data.totalPages = options.pages || 0, options.when && (options.delegate = options.when), options.delegate) {
      var eventName;
      for (eventName in options.delegate) {
        if (self.has(eventName, options.delegate)) {
          if ("tap" == eventName || "doubletap" == eventName) {
            this.$el.on(eventName, ".page", options.delegate[eventName]);
          } else {
            this.$el.on(eventName, options.delegate[eventName]);
          }
        }
      }
    }
    this.$el.css({
      position : "relative",
      width : options.width,
      height : options.height
    });
    if (val) {
      this.$el.addClass("touch-device");
    } else {
      this.$el.addClass("no-touch-device");
    }
    this.display(options.display);
    if ("" !== options.direction) {
      this.direction(options.direction);
    }
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      if (!$(codeSegments[i]).is(options.ignoreElements)) {
        this.addPage(codeSegments[i], ++entered);
      }
    }
    return options.pages = data.totalPages, data.dynamicMode = 0 === entered, options.swipe && this.$el.on("swipe", $.proxy(this, "_eventSwipe")), this.$el.parent().on("start", $.proxy(this, "_eventStart")), this.$el.on("vmousedown", $.proxy(this, "_eventPress")).on("vmouseover", $.proxy(this, "_eventHover")).on("vmouseout", $.proxy(this, "_eventNoHover")), this._resizeObserver(), "number" != typeof options.page || (isNaN(options.page) || (options.page < 1 || options.page > data.totalPages)) ? this.page(1) : 
    this.page(options.page), options.animatedAutoCenter && this.$el.css(self.addCssWithPrefix({
      "@transition" : "margin-left " + options.duration + "ms"
    })), data.done = true, this.$el;
  });
  self.directions;
  /** @type {number} */
  var lastAngle = self.A90;
  /** @type {number} */
  var PI = self.PI;
  var results = self.UIComponent(function(self, session) {
    return self = self || {}, self.disabled = false, self.hover = false, self.turn = session, self.turnData = session._data, self.effect = this.$el.hasClass("hard") || this.$el.hasClass("cover") ? "hard" : "sheet", this.$el.data("f", self), this._addPageWrapper(), self.turnData.disabled && this.disable(), this.$el;
  });
  /**
   * @return {?}
   */
  results.prototype._cornerAllowed = function() {
    var result = this.$el.data("f");
    var id = result.page;
    var data = result.turnData;
    /** @type {number} */
    var leftBottom = id % 2;
    switch(result.effect) {
      case "hard":
        /** @type {boolean} */
        var f = data.direction == self.DIRECTION_LTR;
        return f ? [leftBottom ? "r" : "l"] : [leftBottom ? "l" : "r"];
      case "sheet":
        if (data.display == self.DISPLAY_SINGLE) {
          return 1 == id ? self.corners.forward : id == data.totalPages ? self.corners.backward : "tapping" == result.status ? self.corners.all : self.corners.forward;
        }
        if (data.display == self.DISPLAY_DOUBLE) {
          return data.options.showDoublePage ? self.corners[leftBottom ? "backward" : "forward"] : self.corners[leftBottom ? "forward" : "backward"];
        }
      ;
    }
  };
  /**
   * @param {?} e
   * @return {?}
   */
  results.prototype._cornerActivated = function(e) {
    var x = this.$el.width();
    var y = this.$el.height();
    var me = self.peelingPoint("", e.x, e.y);
    if (me.x <= 0 || (me.y <= 0 || (me.x >= x || me.y >= y))) {
      return false;
    }
    var result = this.$el.data("f");
    var msg = result.turnData;
    if (result.dpoint) {
      var max = msg.options.cornerPosition;
      var field = this._startPoint(result.dpoint.corner, $.extend({}, me));
      if (max = Math.max(max.x, max.y), field.x <= max && field.y <= max) {
        return me.corner = result.dpoint.corner, me;
      }
    }
    var delta = msg.options.hoverAreaSize;
    var elems = this._cornerAllowed();
    switch(result.effect) {
      case "hard":
        if (me.x > x - delta) {
          /** @type {string} */
          me.corner = "r";
        } else {
          if (!(me.x < delta)) {
            return false;
          }
          /** @type {string} */
          me.corner = "l";
        }
        break;
      case "sheet":
        if (me.y < delta) {
          me.corner += "t";
        } else {
          if (me.y >= y - delta) {
            me.corner += "b";
          }
        }
        if (me.x <= delta) {
          me.corner += "l";
        } else {
          if (me.x >= x - delta) {
            me.corner += "r";
          }
        }
      ;
    }
    return me.corner && -1 != $.inArray(me.corner, elems) ? me : false;
  };
  /**
   * @param {Event} ev
   * @return {?}
   */
  results.prototype._isIArea = function(ev) {
    var mousePos = self.eventPoint(ev);
    var g = this.$el.data("f");
    var docPos = (g.clip || g.ipage).parent().offset();
    return this._cornerActivated(self.point2D(mousePos.x - docPos.left, mousePos.y - docPos.top));
  };
  /**
   * @param {?} corner
   * @param {?} rp
   * @return {?}
   */
  results.prototype._startPoint = function(corner, rp) {
    var o;
    switch(rp = rp || self.point2D(0, 0), corner) {
      case "tr":
        /** @type {number} */
        rp.x = this.$el.width() - rp.x;
        break;
      case "bl":
        /** @type {number} */
        rp.y = this.$el.height() - rp.y;
        break;
      case "br":
        /** @type {number} */
        rp.x = this.$el.width() - rp.x;
        /** @type {number} */
        rp.y = this.$el.height() - rp.y;
        break;
      case "l":
        o = this.$el.data("f");
        if (o.startPoint) {
          rp.y = o.startPoint.y;
        }
        break;
      case "r":
        /** @type {number} */
        rp.x = this.$el.width() - rp.x;
        o = this.$el.data("f");
        if (o.startPoint) {
          rp.y = o.startPoint.y;
        }
      ;
    }
    return rp;
  };
  /**
   * @param {?} dataAndEvents
   * @param {Object} rp
   * @return {?}
   */
  results.prototype._endPoint = function(dataAndEvents, rp) {
    var o;
    switch(rp = rp || self.point2D(0, 0), dataAndEvents) {
      case "tl":
        /** @type {number} */
        rp.x = 2 * this.$el.width() - rp.x;
        break;
      case "tr":
        rp.x = -this.$el.width() + rp.x;
        break;
      case "bl":
        /** @type {number} */
        rp.x = 2 * this.$el.width() - rp.x;
        /** @type {number} */
        rp.y = this.$el.height() - rp.y;
        break;
      case "br":
        rp.x = -this.$el.width() + rp.x;
        /** @type {number} */
        rp.y = this.$el.height() - rp.y;
        break;
      case "l":
        /** @type {number} */
        rp.x = 2 * this.$el.width() - rp.x;
        o = this.$el.data("f");
        if (o.startPoint) {
          rp.y = o.startPoint.y;
        }
        break;
      case "r":
        /** @type {number} */
        rp.x = -this.$el.width() - rp.x;
        o = this.$el.data("f");
        if (o.startPoint) {
          rp.y = o.startPoint.y;
        }
      ;
    }
    return rp;
  };
  /**
   * @param {string} off
   * @return {?}
   */
  results.prototype._foldingPage = function(off) {
    var s = this.$el.data("f");
    if (s) {
      var data = s.turnData;
      return off = off || "pageObjs", data.display == self.DISPLAY_SINGLE ? data[off][0] : s.over ? data[off][s.over] : data[off][s.next];
    }
    return false;
  };
  /**
   * @param {number} x
   * @param {number} y
   * @return {?}
   */
  results.prototype.resize = function(x, y) {
    var s = this.$el.data("f");
    switch(x = x || this.$el.width(), y = y || this.$el.height(), s.effect) {
      case "hard":
        s.ipage.css({
          width : x,
          height : y
        });
        s.igradient.css({
          width : x,
          height : y
        });
        s.ogradient.css({
          width : x,
          height : y
        });
        break;
      case "sheet":
        /** @type {number} */
        var side = Math.round(Math.sqrt(x * x + y * y));
        s.clip.css({
          width : side,
          height : side
        });
        s.ipage.css({
          width : x,
          height : y
        });
        s.igradient.css({
          width : 100,
          height : 2 * y,
          top : -y / 2
        });
        s.ogradient.css({
          width : 100,
          height : 2 * y,
          top : -y / 2
        });
    }
    return this.$el;
  };
  /**
   * @return {undefined}
   */
  results.prototype._addPageWrapper = function() {
    var options = this.$el.data("f");
    options.turnData;
    var css;
    var content = this.$el.parent();
    var html = $("<div />", {
      "class" : "inner-page"
    });
    var modal = $("<div />", {
      "class" : "inner-gradient"
    });
    var $el = $("<div />", {
      "class" : "outer-gradient"
    });
    switch(options.effect) {
      case "hard":
        css = self.layerCSS(0, 0, 2).css;
        /** @type {string} */
        css[self.vendor + "transform-style"] = "preserve-3d";
        /** @type {string} */
        css[self.vendor + "backface-visibility"] = "hidden";
        html.css(css).appendTo(content).prepend(this.$el);
        modal.css(self.layerCSS(0, 0, 0).css).appendTo(html);
        $el.css(self.layerCSS(0, 0, 0));
        options.ipage = html;
        options.igradient = modal;
        options.ogradient = $el;
        break;
      case "sheet":
        var container = $("<div />", {
          "class" : "clip"
        });
        css = self.layerCSS(0, 0, 0).css;
        container.css(css);
        html.css($.extend({
          cursor : "default"
        }, css));
        /** @type {number} */
        css.zIndex = 1;
        modal.css({
          background : self.makeGradient(true),
          display : self.isFirefoxOrIE ? "" : "none",
          visibility : "hidden",
          position : "absolute",
          "z-index" : 2
        });
        $el.css({
          background : self.makeGradient(false),
          visibility : "hidden",
          position : "absolute",
          "z-index" : 2
        });
        modal.appendTo(html);
        html.appendTo(container).prepend(this.$el);
        $el.appendTo(content);
        container.appendTo(content);
        options.clip = container;
        options.ipage = html;
        options.igradient = modal;
        options.ogradient = $el;
    }
    this.resize();
  };
  /**
   * @param {Object} pos
   * @return {?}
   */
  results.prototype._fold = function(pos) {
    var e = this.$el.data("f");
    if (e.dpoint && (e.dpoint.corner == pos.corner && (e.dpoint.x == pos.x && e.dpoint.y == pos.y))) {
      return false;
    }
    switch(e.effect) {
      case "hard":
        this._hard(pos);
        break;
      case "sheet":
        this._pageCURL(pos);
    }
    return e.dpoint = self.peelingPoint(pos.corner, pos.x, pos.y), true;
  };
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  results.prototype._bringClipToFront = function(recurring) {
    var s = this.$el.data("f");
    if (s) {
      var data = s.turnData;
      /** @type {boolean} */
      var key = data.display == self.DISPLAY_SINGLE;
      if (recurring) {
        var id = key ? 0 : s.next;
        if (s.over && (s.over != id && this._bringClipToFront(false)), "hard" == s.effect) {
          s.igradient.show();
        } else {
          if ("sheet" == s.effect) {
            var container = data.pageWrap[id];
            var result = data.pages[id].data("f");
            var w = container.width();
            var dialogHeight = container.height();
            if (container.css({
              overflow : "visible",
              "pointer-events" : "none",
              zIndex : 3 + data.front.length
            }), result.ipage.css({
              overflow : "hidden",
              position : "absolute",
              width : w,
              height : dialogHeight
            }), result.igradient.show().css({
              visibility : "visible"
            }), s.ipage.css({
              "z-index" : 1
            }), s.ogradient.show().css({
              zIndex : 2,
              visibility : "visible"
            }), key && result.tPage != s.page) {
              data.pageObjs[0].find("*").remove();
              var clone = data.pageObjs[s.page].clone(false).css({
                opacity : "0.2",
                overflow : "hidden"
              }).transform("rotateY(180deg)", "50% 50%");
              clone.appendTo(data.pageObjs[0]);
              result.tPage = s.page;
            }
          }
        }
        s.over = id;
      } else {
        if (s.over) {
          var modal = data.pageWrap[s.over];
          if (modal) {
            modal.css({
              overflow : "hidden",
              display : self.isFirefoxOrIE ? "" : "none",
              visibility : self.isFirefoxOrIE ? "hidden" : "",
              "pointer-events" : "",
              zIndex : 0
            });
          }
          this._restoreClip(true);
          delete s.over;
        }
      }
    }
  };
  /**
   * @param {boolean} cell
   * @param {?} dataAndEvents
   * @return {undefined}
   */
  results.prototype._restoreClip = function(cell, dataAndEvents) {
    var c;
    var i = this.$el.data("f");
    var that = i.turnData;
    var text = cell ? self.translate(0, 0, that.options.acceleration) : "";
    if (dataAndEvents) {
      c = i;
    } else {
      if (that.pages[i.over]) {
        c = that.pages[i.over].data("f");
      }
    }
    if (c) {
      if (c.clip) {
        c.clip.transform(text);
      }
      c.ipage.transform(text).css({
        top : 0,
        left : 0,
        right : "auto",
        bottom : "auto"
      });
      c.igradient.hide();
    }
  };
  /**
   * @param {Object} elem
   * @param {boolean} dataAndEvents
   * @return {undefined}
   */
  results.prototype._setFoldedPagePosition = function(elem, dataAndEvents) {
    var entry = this.$el.data();
    var p = entry.f;
    var o = p.turnData;
    if (dataAndEvents) {
      var offsetCoordinate;
      var rhtml = this;
      var corner = elem.corner;
      offsetCoordinate = p.point && p.point.corner == corner ? p.point : this._startPoint(corner, self.point2D(1, 1));
      this._animate({
        from : [offsetCoordinate.x, offsetCoordinate.y],
        to : [elem.x, elem.y],
        duration : 500,
        easing : o.options.easing,
        /**
         * @param {Array} args
         * @return {undefined}
         */
        frame : function(args) {
          /** @type {number} */
          elem.x = Math.round(args[0]);
          /** @type {number} */
          elem.y = Math.round(args[1]);
          elem.corner = corner;
          rhtml._fold(elem);
        }
      });
    } else {
      this._fold(elem);
      if (this.animation) {
        if (!this.animation.turning) {
          this._animate(false);
        }
      }
    }
  };
  /**
   * @param {Object} c
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  results.prototype._showFoldedPage = function(c, dataAndEvents) {
    var options = this.$el.data("f");
    var xCreateElement = this._foldingPage();
    if (options && xCreateElement) {
      var _visible = options.visible;
      var corner = c.corner;
      var async = options.turn;
      var data = options.turnData;
      if (!_visible || (!options.point || options.point.corner != c.corner)) {
        if (data.corner = corner, this._trigger("start", options.page, data.tpage ? null : c.corner) == self.EVENT_PREVENTED) {
          return false;
        }
        if (data.pages[options.next] && options.effect != data.pages[options.next].data("f").effect) {
          return false;
        }
        if ("hard" == options.effect && "turning" == data.status) {
          /** @type {number} */
          var i = 0;
          for (;i < data.front.length;i++) {
            if (!data.pages[data.front[i]].hasClass("hard")) {
              that.prototype.stop.call(async);
              break;
            }
          }
        }
        if (!_visible) {
          data.front.push(data.display == self.DISPLAY_SINGLE ? 0 : options.next);
          data.pageMv.push(options.page);
        }
        options.startPoint = options.startPoint || self.point2D(c.x, c.y);
        /** @type {boolean} */
        options.visible = true;
        this._bringClipToFront(true);
        that.prototype.update.call(async);
        if (data.options.blocks) {
          that.prototype._fetchBlocks.call(async, Math.max(data.options.pages + 1, that.prototype.view.call(async, options.next)[0]), "hover");
        }
      }
      return this._setFoldedPagePosition(c, dataAndEvents), true;
    }
    return false;
  };
  /**
   * @return {?}
   */
  results.prototype.hide = function() {
    var data = this.$el.data("f");
    var config = data.turnData;
    var udataCur = self.translate(0, 0, config.options.acceleration);
    switch(data.effect) {
      case "hard":
        var out = config.pages[data.over];
        data.ogradient.remove();
        data.igradient.remove();
        data.ipage.transform(udataCur);
        if (out) {
          out.data("f").ipage.transform(udataCur);
        }
        break;
      case "sheet":
        var $control = config.pageWrap[data.over];
        if ($control) {
          $control.css({
            overflow : "hidden",
            "pointer-events" : ""
          });
        }
        data.ipage.css({
          left : 0,
          top : 0,
          right : "auto",
          bottom : "auto"
        }).transform(udataCur);
        data.clip.transform(udataCur);
        data.ogradient.css({
          visibility : "hidden"
        });
    }
    return data.visible && (0 === config.front.length && that.prototype._removeFromDOM.call(data.turn)), data.status = "", data.visible = false, delete data.point, delete data.dpoint, delete data.startPoint, this.$el;
  };
  /**
   * @param {boolean} dataAndEvents
   * @return {undefined}
   */
  results.prototype.hideFoldedPage = function(dataAndEvents) {
    var p = this.$el.data("f");
    if (p.dpoint) {
      var $scope = this;
      var code = p.status;
      var o = p.turnData;
      var alpha = p.peel && p.peel.corner == p.dpoint.corner;
      /**
       * @return {undefined}
       */
      var hide = function() {
        if (dataAndEvents && ("move" == code && alpha)) {
          /** @type {string} */
          p.status = "peel";
        } else {
          $scope._animationCompleted(p.page, false);
        }
      };
      if (dataAndEvents) {
        /** @type {Array} */
        var data = [p.dpoint, 0, 0, 0];
        data[3] = alpha ? this._startPoint(data[0].corner, self.point2D(p.peel.x, p.peel.y)) : this._startPoint(data[0].corner, self.point2D(0, 1));
        /** @type {number} */
        var dy = data[0].y - data[3].y;
        /** @type {number} */
        dy = "tr" == data[0].corner || "tl" == data[0].corner ? Math.min(0, dy) / 2 : Math.max(0, dy) / 2;
        data[1] = self.point2D(data[0].x, data[0].y + dy);
        data[2] = self.point2D(data[3].x, data[3].y - dy);
        this._animate(false);
        this._animate({
          from : 0,
          to : 1,
          /**
           * @param {number} action
           * @return {undefined}
           */
          frame : function(action) {
            $scope._fold(self.bezier(data, action, data[0].corner));
          },
          /** @type {function (): undefined} */
          complete : hide,
          easing : o.options.easing,
          duration : 800,
          hiding : true
        });
      } else {
        this._animate(false);
        hide();
      }
    }
  };
  /**
   * @param {number} key
   * @return {undefined}
   */
  results.prototype.turnPage = function(key) {
    var position;
    var path;
    var elem = this.$el;
    var data = elem.data("f");
    var config = data.turnData;
    /** @type {Array} */
    var styles = [0, 0, 0, 0];
    if (has3d = self.css3dAvailable(), config.display == self.DISPLAY_SINGLE && -1 == $.inArray(key, self.corners.forward)) {
      var html = config.pages[data.next];
      var e = html.data("f");
      var pos = e.peel;
      /** @type {number} */
      var _zIndex = parseInt(config.pageWrap[data.page].css("z-index"), 10) || 0;
      path = e.dpoint ? e.dpoint.corner : key;
      position = self.peelingPoint(config.direction == self.DIRECTION_LTR ? path.replace("l", "r") : path.replace("r", "l"));
      elem = html;
      config.pageWrap[data.page - 1].show().css({
        zIndex : _zIndex + 1
      });
      styles[0] = e.dpoint ? self.point2D(e.dpoint.x, e.dpoint.y) : this._endPoint(position.corner);
      styles[1] = styles[0];
      styles[2] = this._startPoint(position.corner, self.point2D(0, 20));
      styles[3] = pos ? this._startPoint(position.corner, self.point2D(pos.x, pos.y)) : this._startPoint(position.corner);
    } else {
      var def = "r" == key || "l" == key ? 0 : config.options.elevation;
      var errors = self.transformUnit(def, this.$el.height());
      path = data.dpoint ? data.dpoint.corner : key;
      position = self.peelingPoint(path || this._cornerAllowed()[0]);
      styles[0] = data.dpoint || this._startPoint(position.corner);
      styles[1] = data.dpoint ? styles[0] : this._startPoint(position.corner, self.point2D(0, errors));
      if (styles[0].x < 0 || styles[0].x > this.$el.width()) {
        /** @type {number} */
        errors = 0;
      }
      styles[2] = this._endPoint(position.corner, self.point2D(0, errors));
      styles[3] = this._endPoint(position.corner);
    }
    elem.flip("_animate", false);
    if (elem.flip("_showFoldedPage", styles[0])) {
      if (data.turnData.options.autoCenter) {
        that.prototype.center.call(data.turn, data.next);
      }
      elem.flip("_animate", {
        from : 0,
        to : 1,
        easing : config.options.easing,
        /**
         * @param {number} action
         * @return {undefined}
         */
        frame : function(action) {
          elem.flip("_fold", self.bezier(styles, action, position.corner));
        },
        /**
         * @return {undefined}
         */
        complete : function() {
          elem.flip("_animationCompleted", data.page, true);
        },
        duration : config.options.duration,
        turning : true
      });
    } else {
      elem.flip("_animationCompleted", data.page, true);
    }
    /** @type {null} */
    data.corner = null;
  };
  /**
   * @return {?}
   */
  results.prototype.isTurning = function() {
    return this.animation && this.animation.turning;
  };
  /**
   * @return {undefined}
   */
  results.prototype._showWhenHolding = function() {
    var message;
    var e = this.$el;
    var result = e.data("f");
    var node = result.turn;
    var data = result.turnData;
    if (result.holdingPoint) {
      /** @type {boolean} */
      var l = data.display == self.DISPLAY_SINGLE;
      var elems = this._cornerAllowed();
      if (message = data.direction == self.DIRECTION_LTR ? l ? result.holdingPoint.x > e.width() / 2 ? "r" : "l" : data.options.showDoublePage ? 0 === result.page % 2 ? "r" : "l" : 0 === result.page % 2 ? "l" : "r" : l ? result.holdingPoint.x > e.width() / 2 ? "l" : "r" : data.options.showDoublePage ? 0 === result.page % 2 ? "l" : "r" : 0 === result.page % 2 ? "r" : "l", that.prototype.stop.call(node), this._animate(false), result.status = "holding", ~$.inArray(message, elems)) {
        if (!data.tmpListeners) {
          data.tmpListeners = {};
          data.tmpListeners.tap = self.getListeners(node.$el, "tap", true);
          data.tmpListeners.doubleTap = self.getListeners(node.$el, "doubleTap", true);
        }
        var ast = self.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y);
        if (l) {
          if (this._detectSinglePage(ast, ast, true)) {
            result.corner = self.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y);
          }
        } else {
          if (this._showFoldedPage(ast, true)) {
            result.corner = self.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y);
          }
        }
      }
    }
  };
  /**
   * @param {Event} method
   * @return {?}
   */
  results.prototype._pagePress = function(method) {
    var data = this.$el.data("f");
    var elem = data.turn;
    if (!data.corner && (!data.disabled && !this.isTurning())) {
      var response = data.turnData;
      /** @type {string} */
      response.status = "tapping";
      /** @type {string} */
      data.status = "tapping";
      var opts = this._isIArea(method);
      if (!(response.options.hover || data.peel && data.peel.corner == opts.corner)) {
        return response.status = "", data.status = "", void 0;
      }
      if (response.display == self.DISPLAY_SINGLE && (response.pages[data.next] && (data.effect != response.pages[data.next].data("f").effect && (response.pageObjs[data.next].hasClass("cover") && ~$.inArray(opts.corner, self.corners.forward))))) {
        return response.status = "", data.status = "", void 0;
      }
      if (data.corner = opts, data.startPoint = null, has3d = self.css3dAvailable(), data.corner && this._foldingPage()) {
        return that.prototype.update.call(elem), true;
      }
      /** @type {null} */
      data.corner = null;
      var ret = self.eventPoint(method);
      var boundary = response.pageWrap[data.page].offset();
      ret.x -= boundary.left;
      ret.y -= boundary.top;
      if (response.options.smartFlip) {
        if (~$.inArray(data.page, that.prototype.view.call(elem))) {
          if (ret.x > 0) {
            if (ret.y > 0) {
              if (ret.x < this.$el.width()) {
                if (ret.y < this.$el.height()) {
                  data.holdingPoint = ret;
                  data.startPoint = ret;
                  /** @type {number} */
                  data.holding = setTimeout($.proxy(this._showWhenHolding, this), 100);
                }
              }
            }
          }
        }
      }
    }
  };
  /**
   * @param {Event} ev
   * @return {?}
   */
  results.prototype._pageMove = function(ev) {
    var position;
    var offset;
    var image;
    var data;
    var options = this.$el.data("f");
    if (!options.disabled) {
      if (ev.preventDefault(), options.corner) {
        return image = options.turn, data = options.turnData, offset = data.pageWrap[options.page].offset(), options.status = "move", position = self.eventPoint(ev), position.x -= offset.left, position.y -= offset.top, position.corner = options.corner.corner, data.display == self.DISPLAY_SINGLE ? this._detectSinglePage(position, options.corner) : this._showFoldedPage(position), options.holdingPoint && self.cleanSelection(), true;
      }
      if (!this.animation) {
        if (position = this._isIArea(ev)) {
          if (options.hover) {
            if ("sheet" == options.effect && 2 != position.corner.length) {
              return false;
            }
            if ("peel" != options.status || (!options.peel || options.peel.corner != position.corner)) {
              if (data = options.turnData, data.display == self.DISPLAY_SINGLE && data.page == data.totalPages) {
                return false;
              }
              var pos = data.options.cornerPosition;
              var initialOffset = this._startPoint(position.corner, self.point2D(pos.x, pos.y));
              /** @type {string} */
              options.status = "peel";
              position.x = initialOffset.x;
              position.y = initialOffset.y;
              this._showFoldedPage(position, true);
            }
          }
        } else {
          if ("peel" == options.status) {
            if (!(options.peel && options.peel.corner == options.dpoint.corner)) {
              /** @type {string} */
              options.status = "";
              this.hideFoldedPage(true);
            }
          }
        }
      }
      return false;
    }
  };
  /**
   * @return {undefined}
   */
  results.prototype._pageUnpress = function() {
    var opts = this.$el.data("f");
    var corner = opts.corner;
    var turn = opts.turn;
    var response = opts.turnData;
    if (!opts.disabled && (corner && ("turning" != response.status && "swiped" != response.status))) {
      var data = opts.point || corner;
      var page = opts.page;
      var width = this.$el.width();
      if (response.display == self.DISPLAY_SINGLE) {
        if (1 == page) {
          if ("tapping" == opts.status || data.x < width / 2) {
            that.prototype._turnPage.call(turn, opts.next, data.corner);
          } else {
            this.hideFoldedPage(true);
          }
        } else {
          if (~$.inArray(data.corner, self.corners.forward)) {
            if ("tapping" == opts.status || data.x < width / 2) {
              that.prototype._turnPage.call(turn, opts.next, data.corner);
            } else {
              this.hideFoldedPage(true);
            }
          } else {
            var d = response.pages[opts.page - 1];
            data = d.data("f").point;
            if ("tapping" == opts.status || data.x > 0.1 * width) {
              that.prototype._turnPage.call(turn, opts.page - 1, data ? data.corner : null);
              /** @type {string} */
              response.status = "turning";
            } else {
              d.flip("turnPage", data.corner);
            }
          }
        }
      } else {
        if (response.display == self.DISPLAY_DOUBLE) {
          if ("tapping" == opts.status || (data.x < 0 || data.x > width)) {
            that.prototype._turnPage.call(turn, opts.next, data.corner);
          } else {
            this.hideFoldedPage(true);
          }
        }
      }
    }
    if (opts.holdingPoint) {
      clearInterval(opts.holding);
      delete opts.holdingPoint;
      delete opts.holding;
    }
    /** @type {string} */
    opts.status = "";
    /** @type {null} */
    opts.corner = null;
  };
  /**
   * @param {Error} c
   * @param {?} node
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  results.prototype._detectSinglePage = function(c, node, dataAndEvents) {
    var event = this.$el.data("f");
    var eventTarget = event.turn;
    var data = event.turnData;
    if (data.pageWrap[event.page].offset(), -1 == $.inArray(node.corner, self.corners.forward)) {
      var b;
      var d = data.pages[event.page - 1];
      var e = d.data("f");
      if (c.corner = data.direction == self.DIRECTION_LTR ? c.corner.replace("l", "r") : c.corner.replace("r", "l"), e.visible) {
        return b = d.flip("_showFoldedPage", c, false), data.corner = node.corner, b;
      }
      var pos = d.flip("_endPoint", c.corner);
      return e.point = self.peelingPoint(c.corner, pos.x, pos.y), that.prototype.stop.call(eventTarget), b = d.flip("_showFoldedPage", c, true), data.corner = node.corner, b;
    }
    return this._showFoldedPage(c, dataAndEvents);
  };
  /**
   * @param {boolean} recurring
   * @return {?}
   */
  results.prototype.disable = function(recurring) {
    return this.$el.data("f").disabled = recurring, this.$el;
  };
  /**
   * @param {string} hover
   * @return {?}
   */
  results.prototype.hover = function(hover) {
    return this.$el.data("f").hover = hover, this.$el;
  };
  /**
   * @param {string} opts
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  results.prototype.peel = function(opts, dataAndEvents) {
    var s = this.$el.data("f");
    if (opts.corner) {
      if (-1 == $.inArray(opts.corner, self.corners.all)) {
        throw self.turnError("Corner " + opts.corner + " is not permitted");
      }
      if (~$.inArray(opts.corner, this._cornerAllowed())) {
        var that = s.turnData;
        var center = that.options.cornerPosition;
        opts.x = opts.x || center.x;
        opts.y = opts.y || center.y;
        var pos = this._startPoint(opts.corner, self.point2D(opts.x, opts.y));
        /** @type {string} */
        s.peel = opts;
        /** @type {string} */
        s.status = "peel";
        this._showFoldedPage(self.peelingPoint(opts.corner, pos.x, pos.y), dataAndEvents);
      }
    } else {
      /** @type {string} */
      s.status = "";
      this.hideFoldedPage(dataAndEvents);
    }
    return this.$el;
  };
  /**
   * @param {number} name
   * @param {boolean} code
   * @return {undefined}
   */
  results.prototype._animationCompleted = function(name, code) {
    var options = this.$el.data("f");
    var async = options.turn;
    var data = options.turnData;
    if ((code || (!options.peel || options.peel.corner != options.dpoint.corner)) && (data.front.splice(data.front.indexOf(parseInt(options.next, 10)), 1), data.pageMv.splice(data.pageMv.indexOf(parseInt(options.page, 10)), 1), this.$el.css({
      visibility : "hidden"
    }), this.hide(), 0 === data.front.length && (data.corner = null)), code) {
      var port = data.tpage || data.page;
      if (port == options.next || port == options.page) {
        delete data.tpage;
        that.prototype._fitPage.call(async, port || options.next);
      } else {
        data.pageWrap[options.page].hide();
      }
    } else {
      if (data.display == self.DISPLAY_SINGLE && name == data.tpage) {
        delete data.tpage;
        that.prototype._fitPage.call(async, name);
      } else {
        that.prototype.update.call(async);
        that.prototype._updateShadow.call(async);
      }
    }
    this.$el.css({
      visibility : ""
    });
    this.$el.trigger("end", [name, code]);
  };
  /**
   * @param {boolean} animation
   * @return {?}
   */
  results.prototype._animate = function(animation) {
    if (!animation) {
      return this.animation && this.animation.stop(), void 0;
    }
    if (this._animation) {
      /** @type {number} */
      this.animation._time = (new Date).getTime();
      /** @type {number} */
      var i = 0;
      for (;i < this.animation._elements;i++) {
        this.animation.from[i] = this._animation.current[i];
        /** @type {number} */
        this.animation.to[i] = animation.to[i] - this._animation.from[i];
      }
    } else {
      if (!animation.to.length) {
        /** @type {Array} */
        animation.to = [animation.to];
      }
      if (!animation.from.length) {
        /** @type {Array} */
        animation.from = [animation.from];
      }
      var options = this;
      /** @type {boolean} */
      var e = true;
      this.animation = $.extend({
        current : [],
        _elements : animation.to.length,
        _time : (new Date).getTime(),
        /**
         * @return {undefined}
         */
        stop : function() {
          /** @type {boolean} */
          e = false;
          /** @type {null} */
          options.animation = null;
        },
        /**
         * @return {undefined}
         */
        _frame : function() {
          /** @type {number} */
          var t = Math.min(this.duration, (new Date).getTime() - this._time);
          /** @type {number} */
          var i = 0;
          for (;i < this._elements;i++) {
            this.current[i] = this.easing(t, this.from[i], this.to[i], this.duration);
          }
          /** @type {boolean} */
          e = true;
          this.frame(1 == this._elements ? this.current[0] : this.current);
          if (t >= this.duration) {
            this.stop();
            if (this.complete) {
              this.complete();
            }
          } else {
            window.requestAnimationFrame(function() {
              if (e) {
                options.animation._frame();
              }
            });
          }
        }
      }, animation);
      /** @type {number} */
      var j = 0;
      for (;j < this.animation._elements;j++) {
        this.animation.to[j] -= this.animation.from[j];
      }
      this.animation._frame();
    }
  };
  /**
   * @return {undefined}
   */
  results.prototype.destroy = function() {
    var g = this.$el.data("f");
    if (g.clip) {
      this._animate(false);
      g.clip.detach();
      delete g.clip;
      delete g.igradient;
      delete g.ogradient;
      delete g.ipage;
      delete g.turnData;
      delete g.turn;
    }
    this._destroy();
  };
  /**
   * @param {?} element
   * @param {number} page
   * @param {Object} func
   * @return {?}
   */
  that.prototype.addPage = function(element, page, func) {
    var data = this._data;
    if (data.destroying) {
      return null;
    }
    var octalLiteral;
    /** @type {string} */
    var activeClassName = "";
    /** @type {boolean} */
    var i = false;
    var lastPage = data.totalPages + 1;
    if (func = func || {}, (octalLiteral = /\bpage\-([0-9]+|last|next\-to\-last)\b/.exec($(element).attr("class"))) && (page = "last" == octalLiteral[1] ? data.totalPages : "next-to-last" == octalLiteral[1] ? data.totalPages - 1 : parseInt(octalLiteral[1], 10)), page) {
      if (page <= lastPage) {
        /** @type {boolean} */
        i = true;
      } else {
        if (page > lastPage) {
          throw self.error('Page "' + page + '" cannot be inserted');
        }
      }
    } else {
      page = lastPage;
      /** @type {boolean} */
      i = true;
    }
    return page >= 1 && (lastPage >= page && (page in data.pageObjs && this._movePages(page, 1), i && (data.totalPages = lastPage), data.pageObjs[page] = $(element), data.pageObjs[page].hasClass("cover") || (activeClassName += "page "), activeClassName += "page-" + page + " ", activeClassName += data.display == self.DISPLAY_DOUBLE ? page % 2 ? "page-odd" : "page-even" : "page-odd", data.pageObjs[page].css({
      "float" : "left"
    }).addClass(activeClassName), data.pageObjs[page].data({
      f : func
    }), !self.hasHardPage() && (data.pageObjs[page].hasClass("hard") && data.pageObjs[page].removeClass("hard")), this._addPage(page), data.done && this._removeFromDOM())), this.$el;
  };
  /**
   * @param {number} page
   * @return {undefined}
   */
  that.prototype._addPage = function(page) {
    var data = this._data;
    var element = data.pageObjs[page];
    if (element) {
      if (this._pageNeeded(page)) {
        if (!data.pageWrap[page]) {
          data.pageWrap[page] = $("<div/>", {
            "class" : "page-wrapper",
            page : page,
            css : {
              position : "absolute",
              overflow : "hidden"
            }
          });
          this.$el.append(data.pageWrap[page]);
          data.pageObjs[page].appendTo(data.pageWrap[page]);
          var tmp = this._pageSize(page, true);
          element.css({
            width : tmp.width,
            height : tmp.height
          });
          data.pageWrap[page].css(tmp);
        }
        this._makeFlip(page);
      } else {
        data.pageObjs[page].remove();
      }
    }
  };
  /**
   * @param {string} page
   * @return {?}
   */
  that.prototype.hasPage = function(page) {
    return self.has(page, this._data.pageObjs);
  };
  /**
   * @param {number} page
   * @param {number} api
   * @return {?}
   */
  that.prototype.effect = function(page, api) {
    var thingy;
    var data = this._data;
    if (thingy = data.pageObjs[page]) {
      if (void 0 === api) {
        return thingy.hasClass("hard") ? "hard" : "sheet";
      }
      var type = data.dynamicMode;
      switch(data.dynamicMode = false, api) {
        case "hard":
          thingy.removeClass("sheet");
          thingy.addClass("hard");
          this._removePageFromDOM(page);
          break;
        case "sheet":
          thingy.removeClass("hard");
          thingy.addClass("sheet");
          this._removePageFromDOM(page);
      }
      return data.dynamicMode = type, this._pageNeeded(page) && this._addPage(page), this.$el;
    }
    throw self.turnError('Page "' + page + '" is not loaded yet');
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype._pageSize = function(page) {
    var data = this._data;
    var s = {};
    var w = this.$el.width();
    var size = this.$el.height();
    var element = data.pageObjs[page];
    if (data.display == self.DISPLAY_SINGLE) {
      s.width = w;
      s.height = size;
      /** @type {number} */
      s.top = 0;
      /** @type {number} */
      s.left = 0;
      /** @type {string} */
      s.right = "auto";
      if (element.hasClass("page")) {
        s.top = data.pageMargin[0];
        s.width -= data.pageMargin[1];
        s.height -= data.pageMargin[0] + data.pageMargin[2];
      } else {
        if (2 == page) {
          if (element.hasClass("cover")) {
            /** @type {number} */
            s.left = -w;
          }
        }
      }
    } else {
      if (data.display == self.DISPLAY_DOUBLE) {
        /** @type {number} */
        var width = Math.floor(w / 2);
        var y = size;
        /** @type {number} */
        var l = page % 2;
        /** @type {number} */
        s.top = 0;
        if (element.hasClass("own-size")) {
          s.width = data.pageObjs[page].width();
          s.height = data.pageObjs[page].height();
        } else {
          /** @type {number} */
          s.width = width;
          s.height = y;
        }
        if (element.hasClass("page")) {
          s.top = data.pageMargin[0];
          s.width -= l ? data.pageMargin[1] : data.pageMargin[3];
          s.height -= data.pageMargin[0] + data.pageMargin[2];
        }
        if (data.direction != self.DIRECTION_LTR || data.options.showDoublePage) {
          /** @type {number} */
          s[l ? "left" : "right"] = width - s.width;
          /** @type {string} */
          s[l ? "right" : "left"] = "auto";
        } else {
          /** @type {number} */
          s[l ? "right" : "left"] = width - s.width;
          /** @type {string} */
          s[l ? "left" : "right"] = "auto";
        }
      }
    }
    return s;
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype._makeFlip = function(page) {
    var data = this._data;
    if (!data.pages[page]) {
      var state;
      /** @type {boolean} */
      var frameMasked = data.display == self.DISPLAY_SINGLE;
      /** @type {number} */
      var even = page % 2;
      state = frameMasked ? page + 1 : data.options.showDoublePage && !frameMasked ? even ? page - 1 : page + 1 : even ? page + 1 : page - 1;
      if (data.options.blocks > 0) {
        if (!data.pageBlocks[page]) {
          data.pageBlocks[page] = {
            first : 0,
            last : 0,
            status : fragStatus.assigned
          };
        }
      }
      var tmp = this._pageSize(page);
      data.pages[page] = data.pageObjs[page].css({
        width : tmp.width,
        height : tmp.height
      }).flip({
        page : page,
        next : state
      }, this);
      if (data.z) {
        data.pageWrap[page].css({
          display : self.isFirefoxOrIE ? "" : data.z.pageV[page] ? "none" : "",
          visibility : self.isFirefoxOrIE ? data.z.pageV[page] ? "hidden" : "" : "",
          zIndex : data.z.pageZ[page] || 0
        });
      }
    }
    return data.pages[page];
  };
  /**
   * @return {undefined}
   */
  that.prototype._makeRange = function() {
    var page;
    var data = this._data;
    if (data.totalPages > 0) {
      data.range = this.range();
      page = data.range[0];
      for (;page <= data.range[1];page++) {
        if (data.pageObjs[page]) {
          if (!data.pageWrap[page]) {
            this._addPage(page);
          }
        }
      }
    }
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype.range = function(page) {
    var numStyles;
    var index;
    var length;
    var parts;
    var data = this._data;
    var max = data.totalPages;
    if (data.options.blocks > 0) {
      var ms = this.getBlockPage(data.options.blocks);
      if (data.display == self.DISPLAY_DOUBLE) {
        if (data.options.showDoublePage) {
          ms += 1;
        }
      }
      if (ms > max) {
        max = ms;
        data.totalPages = max;
      }
    }
    return page = page || (data.tpage || (data.page || 1)), parts = this._view(page), parts[1] = parts[1] || parts[0], parts[0] >= 1 && parts[1] <= max ? (numStyles = Math.floor((data.options.cacheSize - 2) / 2), max - parts[1] > parts[0] ? (index = Math.min(parts[0] - 1, numStyles), length = 2 * numStyles - index) : (length = Math.min(max - parts[1], numStyles), index = 2 * numStyles - length)) : (index = data.options.cacheSize - 1, length = data.options.cacheSize - 1), [Math.max(1, parts[0] - index), 
    Math.min(max, parts[1] + length)];
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype._pageNeeded = function(page) {
    if (0 === page) {
      return true;
    }
    var data = this._data;
    var range = data.range || this.range();
    return data.pageObjs[page].hasClass("cover") || (~data.pageMv.indexOf(page) || (~data.front.indexOf(page) || page >= range[0] && page <= range[1]));
  };
  /**
   * @return {undefined}
   */
  that.prototype._removeFromDOM = function() {
    if (!this.isAnimating()) {
      var data = this._data;
      var page;
      for (page in data.pageWrap) {
        if (self.has(page, data.pageWrap)) {
          /** @type {number} */
          page = parseInt(page, 10);
          if (!this._pageNeeded(page)) {
            this._removePageFromDOM(page);
          }
        }
      }
    }
  };
  /**
   * @param {?} page
   * @param {number} dataName
   * @return {?}
   */
  that.prototype.pageData = function(page, dataName) {
    var data = this._data;
    return void 0 === dataName ? data.pageObjs[page].data("f") : (data.pageObjs[page].data("f", dataName), void 0);
  };
  /**
   * @param {number} page
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  that.prototype._removePageFromDOM = function(page, dataAndEvents) {
    var data = this._data;
    this.view(page);
    var options;
    var aliases = data.pageObjs;
    var pages = data.pages;
    if (page && this._trigger("removePage", page, aliases[page]) == self.EVENT_PREVENTED) {
      return false;
    }
    if (data.pages[page] && (data.pages[page].flip("_bringClipToFront", false), data.pages[page].flip("destroy"), data.pages[page].detach(), delete data.pages[page]), aliases[page] && aliases[page].detach(), data.pageWrap[page] && (data.pageWrap[page].detach(), delete data.pageWrap[page]), data.dynamicMode || dataAndEvents) {
      if (options = data.pageBlocks[page]) {
        var h = options.last || options.first;
        var i = options.first;
        for (;h >= i;i++) {
          if (data.blocks[i]) {
            if (data.blocks[i].start) {
              if (!pages[data.blocks[i].start]) {
                if (!pages[data.blocks[i].end]) {
                  delete data.blocks[i];
                }
              }
            } else {
              delete data.blocks[i];
            }
          }
        }
        delete data.pageBlocks[page];
      }
      if (aliases[page]) {
        aliases[page].removeData();
        delete aliases[page];
      }
    }
    return true;
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype.removePage = function(page) {
    var data = this._data;
    if ("*" == page) {
      var param = this.range();
      var value = param[0];
      for (;value <= param[1];value++) {
        this._removePageFromDOM(value, true);
      }
      /** @type {number} */
      data.options.blocks = 0;
      /** @type {number} */
      data.totalPages = 0;
    } else {
      if (1 > page || page > data.totalPages) {
        throw self.turnError("The page " + page + " doesn't exist");
      }
      if (data.pageObjs[page] && (this.stop(), !this._removePageFromDOM(page, true))) {
        return false;
      }
      this._movePages(page, -1);
      /** @type {number} */
      data.totalPages = data.totalPages - 1;
      if (data.page > data.totalPages) {
        /** @type {null} */
        data.page = null;
        this._fitPage(data.totalPages);
      } else {
        this._makeRange();
        this.update();
      }
    }
    return this;
  };
  /**
   * @param {number} newPage
   * @param {number} recurring
   * @return {undefined}
   */
  that.prototype._movePages = function(newPage, recurring) {
    var page;
    var that = this;
    var data = this._data;
    /** @type {boolean} */
    var d = data.display == self.DISPLAY_SINGLE;
    /**
     * @param {number} page
     * @return {undefined}
     */
    var move = function(page) {
      var i = page + recurring;
      /** @type {number} */
      var prev = i % 2;
      /** @type {string} */
      var idx = prev ? " page-odd " : " page-even ";
      if (data.pageObjs[page]) {
        data.pageObjs[i] = data.pageObjs[page].removeClass("page-" + page + " page-odd page-even").addClass("page-" + i + idx);
      }
      if (data.pageWrap[page]) {
        data.pageWrap[i] = data.pageObjs[i].hasClass("fixed") ? data.pageWrap[page].attr("page", i) : data.pageWrap[page].css(that._pageSize(i, true)).attr("page", i);
        if (data.pages[page]) {
          data.pages[i] = data.pages[page];
          data.pages[i].data("f").page = i;
          data.pages[i].data("f").next = d ? i + 1 : data.options.showDoublePage ? prev ? i - 1 : i + 1 : prev ? i + 1 : i - 1;
        }
        if (recurring) {
          delete data.pages[page];
          delete data.pageObjs[page];
          delete data.pageWrap[page];
        }
      }
    };
    if (recurring > 0) {
      page = data.totalPages;
      for (;page >= newPage;page--) {
        move(page);
      }
    } else {
      /** @type {number} */
      page = newPage;
      for (;page <= data.totalPages;page++) {
        move(page);
      }
    }
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype._view = function(page) {
    var data = this._data;
    return page = page || data.page, data.display == self.DISPLAY_DOUBLE ? data.options.showDoublePage ? page % 2 ? [page, page + 1] : [page - 1, page] : page % 2 ? [page - 1, page] : [page, page + 1] : 0 === page % 2 && (data.pages[page] && data.pages[page].hasClass("cover")) ? [page, page + 1] : [page];
  };
  /**
   * @param {number} page
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  that.prototype.view = function(page, dataAndEvents) {
    var data = this._data;
    var els = this._view(page);
    /** @type {Array} */
    var arr = [];
    return dataAndEvents ? (els[0] > 0 && arr.push(els[0]), els[1] <= data.totalPages && arr.push(els[1])) : (els[0] > 0 ? arr.push(els[0]) : arr.push(0), els[1] && (els[1] <= data.totalPages ? arr.push(els[1]) : arr.push(0))), arr;
  };
  /**
   * @param {number} pages
   * @return {?}
   */
  that.prototype.pages = function(pages) {
    var data = this._data;
    if (pages) {
      if (pages < data.totalPages) {
        var page = data.totalPages;
        for (;page > pages;page--) {
          this.removePage(page);
        }
      }
      return data.totalPages = pages, this._fitPage(data.page), this.$el;
    }
    return data.totalPages;
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype._missing = function(page) {
    var data = this._data;
    if (data.totalPages < 1) {
      return data.options.blocks > 0 && this.$el.trigger("missing", [1]), void 0;
    }
    var args = data.range || this.range(page);
    /** @type {Array} */
    var ret = [];
    var next = args[0];
    for (;next <= args[1];next++) {
      if (!data.pageObjs[next]) {
        ret.push(next);
      }
    }
    if (ret.length > 0) {
      this.$el.trigger("missing", [ret]);
    }
  };
  /**
   * @param {?} i
   * @return {?}
   */
  that.prototype.pageElement = function(i) {
    return this._data.pageObjs[i];
  };
  /**
   * @return {?}
   */
  that.prototype.next = function() {
    return this.page(this._view(this._data.page).pop() + 1);
  };
  /**
   * @return {?}
   */
  that.prototype.previous = function() {
    return this.page(this._view(this._data.page).shift() - 1);
  };
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  that.prototype._backPage = function(recurring) {
    var data = this._data;
    if (recurring) {
      if (!data.pageObjs[0]) {
        var curr = $("<div />");
        data.pageObjs[0] = $(curr).css({
          "float" : "left"
        }).addClass("page page-0");
        this._addPage(0);
      }
    } else {
      if (data.pageObjs[0]) {
        this._removePageFromDOM(0, true);
      }
    }
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype._isCoverPageVisible = function(page) {
    var data = this._data;
    var totalPages = data.tpage || data.page;
    return data.pageObjs[page].hasClass("cover") && (totalPages >= page && 0 === page % 2 || page >= totalPages && 1 === page % 2);
  };
  /**
   * @param {number} keepData
   * @return {?}
   */
  that.prototype.getBlockPage = function(keepData) {
    var data = this._data;
    if (1 > keepData || keepData > data.options.blocks) {
      return 0;
    }
    if (1 == keepData) {
      return data.options.pages + 1;
    }
    var pages = data.options.pages;
    var endPage = 0 === pages % 2 ? pages : Math.min(0, pages - 1);
    return data.display == self.DISPLAY_DOUBLE ? data.options.showDoublePage ? 2 * keepData - 1 + endPage : 2 * keepData - 2 + endPage : keepData + data.options.pages;
  };
  /**
   * @param {number} i
   * @param {Object} dataAndEvents
   * @return {?}
   */
  that.prototype.getPageBlock = function(i, dataAndEvents) {
    var data = this._data;
    if (data.options.blocks) {
      if (dataAndEvents && (i && (data.pageBlocks[i] && data.pageBlocks[i].first))) {
        return data.pageBlocks[i].first;
      }
      if (i == data.options.pages + 1) {
        return 1;
      }
      if (i > data.options.pages) {
        if (dataAndEvents) {
          var diff;
          var range = this.range();
          var breaks = this.view(data.page, true);
          /** @type {number} */
          var curr = 0;
          /** @type {number} */
          var label_ = 0;
          /** @type {number} */
          var fun = 0;
          /** @type {number} */
          var last = 0;
          /** @type {number} */
          var next = 0;
          var t = range[0];
          for (;t <= range[1];t++) {
            if (data.pageBlocks[t]) {
              if (!curr) {
                curr = data.pageBlocks[t].first;
                fun = t;
              }
              if (data.pageBlocks[t].last) {
                label_ = data.pageBlocks[t].last;
                last = t;
              }
              if (data.pageBlocks[t].first) {
                next = t;
              }
            }
          }
          if (0 === label_) {
            if (next) {
              label_ = data.pageBlocks[next].first;
              last = next;
            }
          }
          if (data.display == self.DISPLAY_DOUBLE) {
            if (data.options.showDoublePage) {
              if (1 === i % 2) {
                if (i > breaks[breaks.length - 1]) {
                  if (0 === last % 2) {
                    last -= 1;
                  }
                  diff = label_ + (i - last) / 2;
                } else {
                  if (i < breaks[0]) {
                    if (0 === fun % 2) {
                      fun -= 1;
                    }
                    /** @type {number} */
                    diff = curr - (fun - i) / 2;
                  } else {
                    /** @type {number} */
                    diff = (i + 1) / 2;
                  }
                }
              }
            } else {
              if (0 === i % 2) {
                if (i > range[1]) {
                  if (1 == last % 2) {
                    last -= 1;
                  }
                  diff = label_ + (i - last + 2) / 2;
                } else {
                  if (i < range[0]) {
                    if (1 == fun % 2) {
                      fun -= 1;
                    }
                    /** @type {number} */
                    diff = curr - (fun - i + 2) / 2;
                  } else {
                    /** @type {number} */
                    diff = (i + 2) / 2;
                  }
                }
              }
            }
          } else {
            diff = i > range[1] ? data.pageBlocks[range[1]].last + (i - range[1]) : i < range[0] ? data.pageBlocks[range[0]].first - (range[0] - i) : i - data.options.pages;
          }
        } else {
          if (data.display == self.DISPLAY_DOUBLE) {
            if (data.options.showDoublePage) {
              if (1 == i % 2) {
                /** @type {number} */
                diff = Math.ceil((i - data.options.pages + 1) / 2);
              }
            } else {
              if (0 === i % 2) {
                /** @type {number} */
                diff = Math.ceil((i - data.options.pages + 2) / 2);
              }
            }
          } else {
            /** @type {number} */
            diff = i - data.options.pages;
          }
        }
        return diff ? Math.max(2, diff) : 0;
      }
    }
    return 0;
  };
  /**
   * @param {?} id
   * @return {?}
   */
  that.prototype.getEndingBlockPage = function(id) {
    var data = this._data;
    return id && data.pageObjs[id] ? data.pageObjs[id].data("f").endingBlock || -1 : -1;
  };
  /**
   * @param {Object} spec
   * @return {?}
   */
  that.prototype.getBlockData = function(spec) {
    return spec = this._data.blocks[spec], spec ? spec.html : null;
  };
  /**
   * @param {number} type
   * @return {?}
   */
  that.prototype.block = function(type) {
    var data = this._data;
    if (void 0 === type) {
      var codeSegments = this.view(null, true);
      var dataType = codeSegments[0] > data.options.pages ? codeSegments[0] : 0;
      var success = codeSegments[codeSegments.length - 1] > data.options.pages ? codeSegments[codeSegments.length - 1] : 0;
      if (dataType = dataType || success) {
        var common = data.pageBlocks[dataType].first;
        var ret = data.pageBlocks[success].last || common;
        return[common, ret];
      }
      return null;
    }
    if (!(type >= 1 && type <= data.options.blocks)) {
      throw turnError('Block "' + type + '" cannot be loaded');
    }
    var id = this.getBlockPage(type);
    var _cleanPages = this.range();
    return this._cleanPages(_cleanPages[0], _cleanPages[1]), data.pageBlocks[id] = {
      first : type,
      last : 0,
      status : self.fragStatus.assigned
    }, this._fitPage(id), this.$el;
  };
  /**
   * @param {number} p
   * @return {undefined}
   */
  that.prototype._fetchBlocks = function(p) {
    var data = this._data;
    if (data.options.blocks && data.pageBlocks[p]) {
      var opts = data.pageBlocks[p];
      data.pageObjs[p];
      var view = this.view(data.page, true);
      if (opts.status == self.fragStatus.assigned) {
        if (!opts.first) {
          opts.first = this.getPageBlock(p, true);
        }
        /** @type {number} */
        opts.status = self.fragStatus.requested;
        this._pushBlocks(opts.first, p, data.page);
      } else {
        if (opts.status == self.fragStatus.waiting) {
          if (p > view[0]) {
            this._cleanPages(p + 1, this.range()[1]);
          }
          this._pushBlocks(opts.last, p, data.page);
        } else {
          if (opts.status == self.fragStatus.nsplit) {
            if (p > view[0] && (this._cleanPages(p + 1, this.range()[1]), opts.nextPageTmp)) {
              var child = data.pageObjs[p + 1];
              var options = data.pageBlocks[p + 1];
              var e = child.data("f");
              /** @type {number} */
              options.status = self.fragStatus.waiting;
              options.first = opts.last;
              options.last = opts.last;
              options.bp = opts.lbp;
              if (e.flowTo) {
                child.find(e.flowTo).html(opts.nextPageTmp.html());
              } else {
                child.html(opts.nextPageTmp.html());
              }
              delete opts.nextPageTmp;
              /** @type {number} */
              opts.status = self.fragStatus.full;
            }
            delete data.blocks[opts.last].cp;
          } else {
            if (opts.status == self.fragStatus.full) {
              if (view[0] == p) {
                if (view[1]) {
                  this._fetchBlocks(view[1]);
                }
              }
            }
          }
        }
      }
    }
  };
  /**
   * @param {number} type
   * @param {number} x
   * @param {Object} key
   * @return {undefined}
   */
  that.prototype._pushBlocks = function(type, x, key) {
    var data;
    var token;
    var self = this._data;
    if (type > 0 && type <= self.options.blocks) {
      if ((token = self.pageBlocks[x]) && (token.waiting = type), data = self.blocks[type]) {
        if (x && (-1 == data.queue.indexOf(x) && data.queue.push(x)), key && (data.cp = key), data.html) {
          /** @type {number} */
          var i = 0;
          for (;i < data.queue.length;i++) {
            this._flowContent(data.queue[i], type);
          }
          /** @type {Array} */
          data.queue = [];
        }
      } else {
        self.blocks[type] = {
          page : x,
          queue : [x],
          cp : key
        };
        this._reportLoading(x);
        this.$el.trigger("missingBlock", [type]);
      }
    }
  };
  /**
   * @param {number} index
   * @param {string} name
   * @return {undefined}
   */
  that.prototype.addBlock = function(index, name) {
    var self = this._data;
    if (index > 0) {
      if (index <= self.options.blocks) {
        name = name.replace(/\s+/g, " ");
        if (self.blocks[index]) {
          /** @type {string} */
          self.blocks[index].html = name;
          this._pushBlocks(index);
        } else {
          self.blocks[index] = {
            html : name,
            queue : []
          };
        }
      }
    }
  };
  /**
   * @param {number} page
   * @param {number} type
   * @return {?}
   */
  that.prototype._flowContent = function(page, type) {
    var data = this._data;
    var obj = data.blocks[type];
    var element = data.pageObjs[page];
    if (obj && element) {
      var $scope = data.pageBlocks[page];
      var env = element.data("f");
      var el = env.flowTo ? element.find(env.flowTo) : element;
      var camelKey = page < obj.cp ? obj.cp || data.page : data.page;
      var view = this.view(camelKey, true);
      var pages = this.view(page, true);
      var _cleanPages = this.range();
      if (type < $scope.first || type > $scope.last) {
        if (!element.is(":visible")) {
          return $scope.status = self.fragStatus.assigned, void 0;
        }
        var t = $("<div />", {
          "class" : "block block-" + type,
          css : {
            position : "relative"
          }
        }).html(obj.html);
        if (obj.start = page, type < $scope.first) {
          /** @type {number} */
          $scope.first = type;
          var ber = el.children();
          if (ber.length > 0) {
            /** @type {null} */
            $scope.bp = null;
            t.insertBefore(ber[0]);
            this._cleanPages(_cleanPages[0], page - 1);
          } else {
            t.appendTo(el);
          }
        } else {
          t.appendTo(el);
        }
        if (type > $scope.last) {
          /** @type {number} */
          $scope.last = type;
        }
        if ($scope.waiting == type) {
          /** @type {number} */
          $scope.waiting = 0;
        }
      } else {
        if (!element.is(":visible")) {
          return $scope.status = self.fragStatus.waiting, void 0;
        }
      }
      var result;
      var field;
      var next = page + 1;
      var options = data.pageBlocks[next];
      var grid = data.pageObjs[next];
      if (grid) {
        result = grid.data("f");
        field = result.flowTo ? grid.find(result.flowTo) : grid;
        if (options.first == $scope.last) {
          if (next < view[0]) {
            restore(el[0], field[0]);
            /** @type {number} */
            result.first = 0;
            /** @type {number} */
            result.last = 0;
            /** @type {number} */
            result.status = self.fragStatus.assigned;
          }
        }
      }
      var location = getBreakingPoint(el[0]);
      if (location) {
        if ($scope.loading && ($scope.loading = false, this.$el.trigger("endPageLoading", page)), next < view[0] || page >= view[0]) {
          if ($scope.status = self.fragStatus.full, grid) {
            if (next > view[view.length - 1]) {
              this._cleanPages(next, _cleanPages[1]);
            }
            breakPage(location, el[0], field[0]);
            var i = $scope.first;
            for (;i < $scope.last;i++) {
              if (data.blocks[i]) {
                /** @type {number} */
                data.blocks[i].end = page;
              }
            }
            $scope.last = location.path[0] + $scope.first;
            options.first = $scope.last;
            /** @type {number} */
            options.last = options.first + field.children("div").length - 1;
            i = options.first;
            for (;i <= options.last;i++) {
              if (data.blocks[i]) {
                if (i == options.first && i == $scope.last) {
                  data.blocks[i].end = next;
                } else {
                  data.blocks[i].start = next;
                  data.blocks[i].end = next;
                }
              }
            }
            options.bp = location;
            this._flowContent(next, options.last);
          } else {
            breakPage(location, el[0], null);
          }
        } else {
          /** @type {number} */
          $scope.status = self.fragStatus.nsplit;
          $scope.nextPageTmp = $("<div />");
          $scope.lbp = location;
          breakPage(location, el[0], $scope.nextPageTmp[0]);
        }
      } else {
        if (obj.end = page, $scope.status = self.fragStatus.waiting, page < view[0]) {
          var val = data.pageBlocks[pages[0]];
          if (!val.bp && (val.first > 2 || pages[0] == data.options.pages + 1)) {
            this._pushBlocks(val.first - 1, pages[0], camelKey);
          } else {
            var p = pages[pages.length - 1];
            if (data.pageBlocks[p].last) {
              this._pushBlocks(data.pageBlocks[p].last + 1, p, camelKey);
            } else {
              this._pushBlocks(data.pageBlocks[pages[0]].last + 1, pages[0], camelKey);
            }
          }
        } else {
          if (grid) {
            if (-1 == pages.indexOf(next)) {
              options.first = $scope.last + 1;
            }
          }
          this._pushBlocks($scope.last + 1, page, camelKey);
        }
      }
      if (page < view[0]) {
        if (pages[0] == page) {
          if (2 == type) {
            this.replaceView(page, data.options.pages + 2);
          }
        }
      }
    }
  };
  /**
   * @param {number} value
   * @return {undefined}
   */
  that.prototype._reportLoading = function(value) {
    var data = this._data;
    var codeSegments = this.view(value, true);
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      if (codeSegments[i] >= value) {
        if (!data.pageBlocks[codeSegments[i]].loading) {
          /** @type {boolean} */
          data.pageBlocks[codeSegments[i]].loading = true;
          this.$el.trigger("startPageLoading", [codeSegments[i]]);
        }
      }
    }
  };
  /**
   * @param {(boolean|number)} from
   * @param {number} dataAndEvents
   * @return {undefined}
   */
  that.prototype._cleanPages = function(from, dataAndEvents) {
    var c;
    var options;
    var nextPointIdx;
    var data = this._data;
    /** @type {(boolean|number)} */
    var i = from;
    for (;dataAndEvents >= i;i++) {
      if ((options = data.pageBlocks[i]) && options.first) {
        nextPointIdx = options.last || options.first;
        var idx = options.first;
        for (;nextPointIdx >= idx;idx++) {
          if (data.blocks[idx]) {
            if (!(idx == options.first && (data.pageBlocks[i - 1] && idx == data.pageBlocks[i - 1].last))) {
              /** @type {number} */
              data.blocks[idx].page = 0;
              if (data.blocks[idx].start) {
                /** @type {number} */
                data.blocks[idx].start = 0;
                /** @type {number} */
                data.blocks[idx].end = 0;
              }
            }
          }
        }
        /** @type {number} */
        options.first = 0;
        options.status = fragStatus.assigned;
        /** @type {number} */
        options.last = 0;
        /** @type {null} */
        options.bp = null;
        c = data.pageObjs[i].data("f");
        if (c.flowTo) {
          data.pageObjs[i].find(c.flowTo).html("");
        } else {
          data.pageObjs[i].html("");
        }
      }
    }
  };
  /**
   * @param {number} length
   * @param {number} i
   * @return {?}
   */
  that.prototype.replaceView = function(length, i) {
    var data = this._data;
    var param = this.range();
    if (length != i && (length >= param[0] && length <= param[1])) {
      var charCode;
      var $scope;
      var even;
      data.display == self.DISPLAY_SINGLE;
      /** @type {number} */
      var id = i;
      var classes = data.front.slice();
      var body = data.pageMv.slice();
      /** @type {number} */
      var start = i - length;
      var CommandProxyMap = {};
      var done = {};
      var replace = {};
      var pages = {};
      var files = {};
      var checked = {};
      var viewItems = {};
      var page;
      for (page in data.pageObjs) {
        if (self.has(page, data.pageObjs)) {
          if (page = parseInt(page, 10), length > page) {
            this._removePageFromDOM(page);
          } else {
            if (id = page + start, $scope = data.pageObjs[page].data("f"), even = id % 2, data.pageObjs[page].removeClass("even odd p" + page).addClass((even ? "odd" : "even") + " p" + id), data.pageWrap[page].attr("page", id), $scope = data.pageObjs[page].data("f"), $scope.page = id, ~(charCode = classes.indexOf(page)) && (data.front[charCode] = id), ~(charCode = body.indexOf(page)) && (data.pageMv[charCode] = id), data.z.pageV[page] && (CommandProxyMap[id] = true), data.z.pageZ[page] && (done[id] = 
            data.z.pageZ[page]), $scope.next += start, $scope.over && ($scope.over += start), data.pageBlocks[page]) {
              var index = data.pageBlocks[page].first;
              for (;index <= data.pageBlocks[page].last;index++) {
                if (data.blocks[index] && !viewItems[index]) {
                  data.blocks[index].start += start;
                  data.blocks[index].end += start;
                  /** @type {number} */
                  var j = 0;
                  for (;j < data.blocks[index].queue.length;j++) {
                    data.blocks[index].queue[j] += start;
                  }
                  /** @type {boolean} */
                  viewItems[index] = true;
                }
              }
              if ((index = data.pageBlocks[page].waiting) && data.blocks[index]) {
                /** @type {number} */
                j = 0;
                for (;j < data.blocks[index].queue.length;j++) {
                  data.blocks[index].queue[j] += start;
                }
                /** @type {boolean} */
                viewItems[index] = true;
              }
              checked[id] = data.pageBlocks[page];
            }
            replace[id] = data.pageObjs[page];
            pages[id] = data.pages[page];
            files[id] = data.pageWrap[page];
            files[id].css(this._pageSize(id, true));
          }
        }
      }
      data.pageObjs = replace;
      data.pages = pages;
      data.pageWrap = files;
      data.pageBlocks = checked;
      data.pageWrap = files;
      data.z.pageV = CommandProxyMap;
      data.z.pageZ = done;
      data.range = this.range(i);
      data.page = data.page - length + i;
      if (data.tpage) {
        data.tpage = data.tpage - length + i;
        data.page = data.tpage;
      }
      this._missing(i);
      this.update();
      if (data.options.autoCenter) {
        this.center();
      }
      console.log("replaced ", length, " now:", data.page, data.tpage);
    }
    return this.$el;
  };
  /**
   * @return {?}
   */
  that.prototype.flow = function() {
    var data = this._data;
    if (data.options.blocks && this.$el.is(":visible")) {
      var index;
      var _arg = this.view(data.page, true);
      if (_arg[0] > data.options.pages) {
        index = _arg[0];
      } else {
        if (!(_arg[1] > data.options.pages)) {
          return;
        }
        index = _arg[1];
      }
      var _cleanPages = this.range();
      var path = data.pageObjs[index];
      var o = data.pageBlocks[index];
      var env = path.data("f");
      var obj = env.flowTo ? path.find(env.flowTo) : path;
      var i = o.last || o.first;
      var fx = data.blocks[i];
      if (fx) {
        if (obj.children("div:last-child").html(data.blocks[i].html), i == o.first && o.bp) {
          var $location = $.extend({}, o.bp);
          /** @type {number} */
          $location.path[0] = 0;
          breakPage($location, obj[0], obj[0]);
        }
        data.pageBlocks[index].status = fragStatus.waiting;
        var start = fx.start;
        this._cleanPages(_cleanPages[0], index - 1);
        this._cleanPages(index + 1, _cleanPages[1]);
        fx.start = start;
        this._flowContent(index, data.pageBlocks[index].last);
      }
      return this.$el;
    }
  };
  /**
   * @param {number} page
   * @return {undefined}
   */
  that.prototype._fitPage = function(page) {
    var data = this._data;
    var elems = this.view(page);
    if (data.display == self.DISPLAY_SINGLE) {
      if (data.pages[page]) {
        if (data.pages[page].hasClass("cover")) {
          if (-1 != $.inArray(page + 1, elems)) {
            page += 1;
          }
        }
      }
    }
    data.range = this.range(page);
    this._missing();
    if (data.pageObjs[page]) {
      if (-1 != $.inArray(1, elems)) {
        this.$el.addClass("first-page");
      } else {
        this.$el.removeClass("first-page");
      }
      if (~$.inArray(data.totalPages, elems)) {
        this.$el.addClass("last-page");
      } else {
        this.$el.removeClass("last-page");
      }
      /** @type {string} */
      data.status = "";
      /** @type {null} */
      data.peel = null;
      /** @type {number} */
      data.page = page;
      if (data.display != self.DISPLAY_SINGLE) {
        this.stop();
      }
      this._removeFromDOM();
      this._makeRange();
      this._updateShadow();
      this._cloneView(false);
      this.$el.trigger("turned", [page, elems]);
      this.update();
      if (elems[0] > data.options.pages) {
        this._fetchBlocks(elems[0], "fixed");
      } else {
        if (elems[1] > data.options.pages) {
          this._fetchBlocks(elems[1], "fixed");
        }
      }
      if (data.options.autoCenter) {
        this.center();
      }
    }
  };
  /**
   * @param {number} page
   * @param {(number|string)} dir
   * @return {?}
   */
  that.prototype._turnPage = function(page, dir) {
    var current;
    var prevMsgId;
    var next;
    var data = this._data;
    var view = this.view();
    var values = this.view(page);
    /** @type {boolean} */
    var k = data.display == self.DISPLAY_SINGLE;
    if (k) {
      current = view[0];
      next = values[0];
    } else {
      if (view[1] && page > view[1]) {
        current = view[1];
        next = values[0];
      } else {
        if (!(view[0] && page < view[0])) {
          return false;
        }
        current = view[0];
        next = values[1];
      }
    }
    var coords = data.options.turnCorners.split(",");
    var e = data.pages[current].data("f");
    var change = e.dpoint;
    if (e.next, dir || (dir = "hard" == e.effect ? data.direction == self.DIRECTION_LTR ? page > current ? "r" : "l" : page > current ? "l" : "r" : data.direction == self.DIRECTION_LTR ? $.trim(coords[page > current ? 1 : 0]) : $.trim(coords[page > current ? 0 : 1])), k ? next > current && -1 == data.pageMv.indexOf(current) ? this.stop() : current > next && (-1 == data.pageMv.indexOf(next) && this.stop()) : data.display == self.DISPLAY_DOUBLE && (Math.abs((data.tpage || data.page) - page) > 2 && 
    this.stop()), data.page != page) {
      if (prevMsgId = data.page, this._trigger("turning", page, values, dir) == self.EVENT_PREVENTED) {
        return~$.inArray(current, data.pageMv) && data.pages[current].flip("hideFoldedPage", true), false;
      }
      if (~$.inArray(1, values)) {
        this.$el.addClass("first-page");
        this.$el.trigger("first");
      } else {
        this.$el.removeClass("first-page");
      }
      if (~$.inArray(data.totalPages, values)) {
        this.$el.addClass("last-page");
        this.$el.trigger("last");
      } else {
        this.$el.removeClass("last-page");
      }
    }
    return data.status = "turning", data.range = this.range(page), this._missing(page), data.pageObjs[page] && (this._cloneView(false), data.tpage = next, this._makeRange(), e.dpoint = e.next != next ? null : change, e.next = next, prevMsgId = data.page, -1 == data.pageMv.indexOf(next) ? data.pages[current].flip("turnPage", dir) : (data.options.autoCenter && this.center(next), data.status = "", data.pages[next].flip("hideFoldedPage", true)), prevMsgId == data.page && (data.page = page), this.update()), 
    true;
  };
  /**
   * @param {number} page
   * @return {?}
   */
  that.prototype.page = function(page) {
    var data = this._data;
    if (void 0 === page) {
      return data.page;
    }
    if (1 != this.zoom() && this.zoomOut({
      animate : false
    }), self.hasRotation && (!data.disabled && !data.destroying)) {
      if (page = parseInt(page, 10), !(data.options.blocks > 0 && page == data.totalPages + 1)) {
        if (page > 0 && page <= data.totalPages) {
          if (page != data.page) {
            if (!data.done || ~$.inArray(page, this.view())) {
              this._fitPage(page);
            } else {
              if (!this._turnPage(page)) {
                return false;
              }
            }
          }
          return this.$el;
        }
        return false;
      }
      this._fitPage(page);
    }
  };
  /**
   * @param {number} out
   * @return {?}
   */
  that.prototype.center = function(out) {
    var data = this._data;
    var size = this.size();
    /** @type {number} */
    var ml = 0;
    if (!data.noCenter) {
      if (data.display == self.DISPLAY_DOUBLE) {
        var view = this.view(out || (data.tpage || data.page));
        if (data.direction == self.DIRECTION_LTR) {
          if (view[0]) {
            if (!view[1]) {
              ml += size.width / 4;
            }
          } else {
            ml -= size.width / 4;
          }
        } else {
          if (view[0]) {
            if (!view[1]) {
              ml -= size.width / 4;
            }
          } else {
            ml += size.width / 4;
          }
        }
      }
      this.$el.css({
        marginLeft : ml
      });
    }
    return this.$el;
  };
  /**
   * @return {?}
   */
  that.prototype.destroy = function() {
    var that = this._data;
    return this._trigger("destroy") != self.EVENT_PREVENTED && (that.watchSizeChange = false, that.destroying = true, this.$el.undelegate(), this.$el.parent().off("start", this._eventPress), that.options.viewer.off("vmousemove", this._eventMove), $(document).off("vmouseup", this._eventRelease), this.removePage("*"), that.zoomer && that.zoomer.remove(), that.shadow && that.shadow.remove(), this._destroy()), this.$el;
  };
  /**
   * @return {?}
   */
  that.prototype.is = function() {
    return true;
  };
  /**
   * @param {number} i
   * @return {?}
   */
  that.prototype._getDisplayStr = function(i) {
    return i == self.DISPLAY_SINGLE ? "single" : i == self.DISPLAY_DOUBLE ? "double" : void 0;
  };
  /**
   * @param {number} idx
   * @return {?}
   */
  that.prototype._getDisplayConst = function(idx) {
    return idx == self.DISPLAY_SINGLE ? idx : idx == self.DISPLAY_DOUBLE ? idx : "single" == idx ? self.DISPLAY_SINGLE : "double" == idx ? self.DISPLAY_DOUBLE : void 0;
  };
  /**
   * @param {string} options
   * @param {boolean} display
   * @return {?}
   */
  that.prototype.display = function(options, display) {
    var data = this._data;
    var el = this._getDisplayStr(data.display);
    if (void 0 === options) {
      return el;
    }
    if (1 == data.zoom) {
      var type = this._getDisplayConst(options);
      if (!type) {
        throw self.turnError('"' + options + '" is not a value for display');
      }
      if (type != data.display) {
        var e = this._trigger("changeDisplay", options, el);
        if (!data.done || e != self.EVENT_PREVENTED) {
          switch(type) {
            case self.DISPLAY_SINGLE:
              this._backPage(true);
              this.$el.removeClass("display-double").addClass("display-single");
              break;
            case self.DISPLAY_DOUBLE:
              this._backPage(false);
              this.$el.removeClass("display-single").addClass("display-double");
          }
          if (data.display = type, el) {
            if (void 0 === display || display) {
              var size = this.size();
              this.size(size.width, size.height);
              this.update();
            }
            this._movePages(1, 0);
            this.$el.removeClass(el);
          }
        }
        this.$el.addClass(this._getDisplayStr());
        this._cloneView(false);
        this._makeRange();
      }
    }
    return this.$el;
  };
  /**
   * @return {?}
   */
  that.prototype.isAnimating = function() {
    var data = this._data;
    return data.pageMv.length > 0 || "turning" == data.status;
  };
  /**
   * @return {?}
   */
  that.prototype.isFlipping = function() {
    var data = this._data;
    return "turning" == data.status;
  };
  /**
   * @return {?}
   */
  that.prototype.corner = function() {
    return this._data.corner || null;
  };
  /**
   * @return {?}
   */
  that.prototype.data = function() {
    return this._data;
  };
  /**
   * @param {boolean} recurring
   * @return {?}
   */
  that.prototype.disable = function(recurring) {
    var i;
    var data = this._data;
    var elems = this.view();
    /** @type {boolean} */
    data.disabled = void 0 === recurring || recurring === true;
    for (i in data.pages) {
      if (self.has(i, data.pages)) {
        data.pages[i].flip("disable", data.disabled ? true : -1 == $.inArray(parseInt(i, 10), elems));
      }
    }
    return this.$el;
  };
  /**
   * @param {?} ratio
   * @param {boolean} dataAndEvents
   * @return {?}
   */
  that.prototype._size = function(ratio, dataAndEvents) {
    var canvas = this._defaultSize();
    return canvas.width = canvas.width * ratio, canvas.height = canvas.height * ratio, dataAndEvents && (this._halfWidth() && (canvas.width = Math.floor(canvas.width / 2))), canvas;
  };
  /**
   * @param {number} message
   * @param {?} funcToCall
   * @param {number} millis
   * @param {boolean} recurring
   * @return {?}
   */
  that.prototype.peel = function(message, funcToCall, millis, recurring) {
    var data = this._data;
    if (message) {
      if (1 == this.zoom()) {
        if (recurring = void 0 !== recurring ? recurring : true, data.display == self.DISPLAY_SINGLE) {
          data.peel = self.peelingPoint(message, funcToCall, millis);
          data.pages[data.page].flip("peel", self.peelingPoint(message, funcToCall, millis), recurring);
        } else {
          var view = this.view();
          var page = ~$.inArray(message, corners.backward) ? view[0] : view[1];
          if (data.pages[page]) {
            data.peel = self.peelingPoint(message, funcToCall, millis);
            data.pages[page].flip("peel", data.peel, recurring);
          }
        }
      }
    } else {
      /** @type {null} */
      data.peel = null;
      this.stop(true);
    }
    return this.$el;
  };
  /**
   * @return {undefined}
   */
  that.prototype._resizeObserver = function() {
    var data = this._data;
    if (data && data.watchSizeChange) {
      var $cont = data.options.viewer;
      /** @type {number} */
      var d = 10;
      if (data.viewerWidth != $cont.width() || data.viewerHeight != $cont.height()) {
        data.viewerWidth = $cont.width();
        data.viewerHeight = $cont.height();
        this._resize();
      }
      /** @type {number} */
      data.monitorTimer = setTimeout($.proxy(this._resizeObserver, this), d);
    }
  };
  /**
   * @param {Object} userid
   * @return {undefined}
   */
  that.prototype.watchForSizeChanges = function(userid) {
    var data = this._data;
    if (data.watchSizeChange != userid) {
      /** @type {Object} */
      data.watchSizeChange = userid;
      clearInterval(data.monitorTimer);
      this._resizeObserver();
    }
  };
  /**
   * @param {number} idx
   * @return {?}
   */
  that.prototype._defaultSize = function(idx) {
    var data = this._data;
    /** @type {number} */
    var width = data.viewerWidth - data.margin[1] - data.margin[3];
    /** @type {number} */
    var g = data.viewerHeight - data.margin[0] - data.margin[2];
    /** @type {(boolean|number)} */
    var f = "string" == typeof data.options.width && ~data.options.width.indexOf("%");
    var w = self.transformUnit(data.options.width, width);
    var r2 = self.transformUnit(data.options.height, g);
    var rect = self.calculateBounds({
      width : w,
      height : r2,
      boundWidth : Math.min(data.options.width, width),
      boundHeight : Math.min(data.options.height, g)
    });
    if (data.options.responsive) {
      if (f) {
        if (g > width) {
          return{
            width : self.transformUnit(data.options.width, width),
            height : r2,
            display : self.DISPLAY_SINGLE
          };
        }
      } else {
        var img = self.calculateBounds({
          width : w / 2,
          height : r2,
          boundWidth : Math.min(data.options.width / 2, width),
          boundHeight : Math.min(data.options.height, g)
        });
        /** @type {number} */
        var length = data.viewerWidth * data.viewerHeight;
        /** @type {number} */
        var l = length - rect.width * rect.height;
        /** @type {number} */
        var i = length - img.width * img.height;
        if (l > i && !idx || idx == self.DISPLAY_SINGLE) {
          return{
            width : img.width,
            height : img.height,
            display : self.DISPLAY_SINGLE
          };
        }
        if (0 !== rect.width % 2) {
          rect.width -= 1;
        }
      }
    }
    return{
      width : rect.width,
      height : rect.height,
      display : self.DISPLAY_DOUBLE
    };
  };
  /**
   * @return {undefined}
   */
  that.prototype._calculateMargin = function() {
    var selector;
    var matched;
    var data = this._data;
    /** @type {RegExp} */
    var rquickExpr = /^(\d+(?:px|%))(?:\s+(\d+(?:px|%))(?:\s+(\d+(?:px|%))\s+(\d+(?:px|%)))?)$/;
    if (selector = data.options.margin) {
      if (matched = rquickExpr.exec(selector)) {
        data.margin[0] = self.transformUnit(matched[1], data.viewerHeight);
        data.margin[1] = matched[2] ? self.transformUnit(matched[2], data.viewerWidth) : data.margin[0];
        data.margin[2] = matched[3] ? self.transformUnit(matched[3], data.viewerHeight) : data.margin[0];
        data.margin[3] = matched[4] ? self.transformUnit(matched[4], data.viewerWidth) : data.margin[1];
      }
    } else {
      /** @type {Array} */
      data.margin = [0, 0, 0, 0];
    }
    if (selector = data.options.pageMargin) {
      if (matched = rquickExpr.exec(selector)) {
        data.pageMargin[0] = self.transformUnit(matched[1], data.viewerHeight);
        data.pageMargin[1] = matched[2] ? self.transformUnit(matched[2], data.viewerWidth) : data.pageMargin[0];
        data.pageMargin[2] = matched[3] ? self.transformUnit(matched[3], data.viewerHeight) : data.pageMargin[0];
        data.pageMargin[3] = matched[4] ? self.transformUnit(matched[4], data.viewerWidth) : data.pageMargin[1];
      }
    } else {
      /** @type {Array} */
      data.pageMargin = [0, 0, 0, 0];
    }
  };
  /**
   * @return {undefined}
   */
  that.prototype._resize = function() {
    var i;
    var codeSegments;
    var options;
    var data = this._data;
    if (data.options.responsive) {
      var bbox = this.view();
      if (1 == data.zoom) {
        data.options.viewer;
        data.viewerWidth;
        data.viewerHeight;
        var location = data.slider;
        if (this._calculateMargin(), data.slider = null, options = this._defaultSize(), this.display(options.display, false), data.slider = location, options.display != data.display && (options = this._defaultSize(data.display)), this.size(options.width * data.zoom, options.height * data.zoom), this.update(), data.zoomer) {
          options = this._defaultSize(data.display);
          data.zoomer.css({
            width : options.width,
            height : options.height
          });
          codeSegments = data.zoomer.children();
          /** @type {number} */
          i = 0;
          for (;i < codeSegments.length;i++) {
            $(codeSegments[i]).css({
              width : options.width / bbox.length,
              height : options.height
            });
          }
        }
      } else {
        if (this.scroll(data.scroll.left, data.scroll.top), data.zoomer) {
          options = this._defaultSize(data.display);
          data.zoomer.css({
            width : options.width,
            height : options.height
          });
          codeSegments = data.zoomer.children();
          /** @type {number} */
          i = 0;
          for (;i < codeSegments.length;i++) {
            $(codeSegments[i]).css({
              width : options.width / bbox.length,
              height : options.height
            });
          }
        }
      }
      if (data.miniatures) {
        miniMethods._resize.call($(data.miniatures));
      }
    }
  };
  /**
   * @return {?}
   */
  that.prototype.calcVisiblePages = function() {
    var value = this;
    var data = this._data;
    if (!data.tpage) {
      data.page;
    }
    var i;
    var pageIndex;
    var pages;
    var r = {
      pageZ : {},
      pageV : {}
    };
    if (this.isAnimating() && 0 !== data.pageMv[0]) {
      var len = data.pageMv.length;
      var l = data.front.length;
      var end = data.display;
      if (end == self.DISPLAY_SINGLE) {
        /** @type {number} */
        i = 0;
        for (;len > i;i++) {
          nextPage = data.pages[data.pageMv[i]].data("f").next;
          /** @type {boolean} */
          r.pageV[data.pageMv[i]] = true;
          /** @type {number} */
          r.pageZ[data.pageMv[i]] = 3 + len - i;
          /** @type {boolean} */
          r.pageV[nextPage] = true;
          if (data.pageObjs[data.pageMv[i]].hasClass("cover")) {
            /** @type {boolean} */
            r.pageV[nextPage + 1] = true;
          } else {
            /** @type {boolean} */
            r.pageV[0] = true;
            r.pageZ[0] = 3 + len + 1;
          }
        }
      } else {
        if (data.display == self.DISPLAY_DOUBLE) {
          /** @type {number} */
          i = 0;
          for (;len > i;i++) {
            pages = value.view(data.pageMv[i]);
            /** @type {number} */
            pageIndex = 0;
            for (;pageIndex < pages.length;pageIndex++) {
              /** @type {boolean} */
              r.pageV[pages[pageIndex]] = true;
            }
            /** @type {number} */
            r.pageZ[data.pageMv[i]] = 3 + len - i;
          }
          /** @type {number} */
          i = 0;
          for (;l > i;i++) {
            pages = value.view(data.front[i]);
            r.pageZ[data.front[i]] = 5 + len + i;
            /** @type {number} */
            pageIndex = 0;
            for (;pageIndex < pages.length;pageIndex++) {
              /** @type {boolean} */
              r.pageV[pages[pageIndex]] = true;
            }
          }
        }
      }
    } else {
      pages = this.view(false, true);
      /** @type {number} */
      i = 0;
      for (;i < pages.length;i++) {
        /** @type {boolean} */
        r.pageV[pages[i]] = true;
        /** @type {number} */
        r.pageZ[pages[i]] = 2;
      }
      if (data.display == self.DISPLAY_SINGLE) {
        if (pages[0] < data.totalPages) {
          if (data.pages[pages[0]].hasClass("cover")) {
            if (data.pages[pages[0] + 1]) {
              if (!data.pages[pages[0] + 1].hasClass("cover")) {
                /** @type {boolean} */
                r.pageV[pages[0] + 1] = true;
                /** @type {number} */
                r.pageZ[pages[0] + 1] = 2;
              }
            }
          } else {
            /** @type {boolean} */
            r.pageV[pages[0] + 1] = true;
            /** @type {number} */
            r.pageZ[pages[0] + 1] = 1;
          }
        }
      } else {
        if (data.display == self.DISPLAY_DOUBLE) {
          if (pages[0] > 2) {
            /** @type {boolean} */
            r.pageV[pages[0] - 2] = true;
            /** @type {number} */
            r.pageZ[pages[0] - 2] = 1;
          }
          if (pages[1] < data.totalPages - 1) {
            /** @type {boolean} */
            r.pageV[pages[1] + 2] = true;
            /** @type {number} */
            r.pageZ[pages[1] + 2] = 1;
          }
        }
      }
    }
    var page;
    for (page in data.pageWrap) {
      if (self.has(page, data.pageWrap)) {
        if (void 0 === r.pageV[page]) {
          if (this._isCoverPageVisible(page)) {
            /** @type {boolean} */
            r.pageV[page] = true;
            /** @type {number} */
            r.pageZ[page] = -1;
          }
        }
      }
    }
    return r;
  };
  /**
   * @return {?}
   */
  that.prototype.update = function() {
    var page;
    var hover;
    var data = this._data;
    var pos = this.calcVisiblePages();
    if (this.isAnimating() && 0 !== data.pageMv[0]) {
      var view = this.view();
      var h = this.view(data.tpage);
      hover = "" === data.status ? data.options.hover : false;
      for (page in data.pageWrap) {
        if (self.has(page, data.pageWrap)) {
          data.pageWrap[page].css({
            display : self.isFirefoxOrIE ? "" : pos.pageV[page] ? "" : "none",
            visibility : self.isFirefoxOrIE ? pos.pageV[page] ? "" : "hidden" : "",
            zIndex : pos.pageZ[page] || 0
          });
          if (data.tpage) {
            data.pages[page].flip("hover", false).flip("disable", -1 == $.inArray(parseInt(page, 10), data.pageMv) && (page != h[0] && page != h[1]));
          } else {
            data.pages[page].flip("hover", hover).flip("disable", page != view[0] && page != view[1]);
          }
        }
      }
    } else {
      hover = data.options.hover;
      for (page in data.pageWrap) {
        if (self.has(page, data.pageWrap)) {
          data.pageWrap[page].css({
            display : self.isFirefoxOrIE ? "" : pos.pageV[page] ? "" : "none",
            visibility : self.isFirefoxOrIE ? pos.pageV[page] ? "" : "hidden" : "",
            zIndex : pos.pageZ[page] || 0
          });
          if (data.pages[page]) {
            data.pages[page].flip("disable", data.disabled || 2 != pos.pageZ[page]).flip("hover", hover);
            if (!pos.pageV[page]) {
              /** @type {boolean} */
              data.pages[page].data("f").visible = false;
            }
          }
        }
      }
    }
    return data.z = pos, this.$el;
  };
  /**
   * @return {undefined}
   */
  that.prototype._updateShadow = function() {
  };
  /**
   * @param {Object} options
   * @return {?}
   */
  that.prototype.options = function(options) {
    if (void 0 === options) {
      return this._data.options;
    }
    var data = this._data;
    var swipe = data.options.swipe;
    if ($.extend(data.options, options), options.pages && this.pages(options.pages), options.page && this.page(options.page), (options.margin || options.pageMargin) && (this._calculateMargin(), this._resize()), options.display && this.display(options.display), options.direction && this.direction(options.direction), options.width && (options.height && this.size(options.width, options.height)), options.swipe === true && swipe ? this.$el.on("swipe", $.proxy(this, "_eventSwipe")) : options.swipe === 
    false && this.$el.off("swipe", this._eventSwipe), options.cornerPosition) {
      var octalLiteral = options.cornerPosition.split(" ");
      data.options.cornerPosition = self.point2D(parseInt(octalLiteral[0], 10), parseInt(octalLiteral[1], 10));
    }
    if (options.margin && this._resize.call(this), options.animatedAutoCenter === true ? this.$el.css(self.addCssWithPrefix({
      "@transition" : "margin-left " + options.duration + "ms"
    })) : options.animatedAutoCenter === false && this.$el.css(self.addCssWithPrefix({
      "@transition" : ""
    })), options.delegate) {
      var eventName;
      for (eventName in options.delegate) {
        if (self.has(eventName, options.delegate)) {
          if ("tap" == eventName || "doubletap" == eventName) {
            this.$el.off(eventName, ".page");
            this.$el.on(eventName, ".page", options.delegate[eventName]);
          } else {
            this.$el.off(eventName).on(eventName, options.delegate[eventName]);
          }
        }
      }
    }
    return this.$el;
  };
  /**
   * @return {?}
   */
  that.prototype.version = function() {
    return version;
  };
  /**
   * @param {number} i
   * @return {?}
   */
  that.prototype._getDirectionStr = function(i) {
    return i == self.DIRECTION_LTR ? "ltr" : i == self.DIRECTION_RTL ? "rtl" : void 0;
  };
  /**
   * @param {string} fragment
   * @return {?}
   */
  that.prototype._getDirectionConst = function(fragment) {
    return "ltr" == fragment ? self.DIRECTION_LTR : "rtl" == fragment ? self.DIRECTION_RTL : void 0;
  };
  /**
   * @param {string} current
   * @return {?}
   */
  that.prototype.direction = function(current) {
    var data = this._data;
    var resultVec = this._getDirectionStr(data.direction);
    if (void 0 === current) {
      return resultVec;
    }
    current = current.toLowerCase();
    var key = this._getDirectionConst(current);
    if (!key) {
      throw self.turnError('"' + current + '" is not a value for direction');
    }
    return "rtl" == current && this.$el.attr("dir", "ltr").css({
      direction : "ltr"
    }), data.direction = key, data.done && this.size(this.$el.width(), this.$el.height()), this.$el;
  };
  /**
   * @param {Object} recurring
   * @return {?}
   */
  that.prototype.disabled = function(recurring) {
    return void 0 === recurring ? this._data.disabled === true : this.disable(recurring);
  };
  /**
   * @return {?}
   */
  that.prototype.viewSize = function() {
    var size = this.size();
    if (this.display() == self.DISPLAY_DOUBLE) {
      var data = this.view();
      if (!(data[0] && data[1])) {
        /** @type {number} */
        size.width = Math.floor(size.width / 2);
      }
    }
    return size;
  };
  /**
   * @param {number} w
   * @param {number} n
   * @param {boolean} obj
   * @return {?}
   */
  that.prototype.size = function(w, n, obj) {
    if (void 0 === w || void 0 === n) {
      return{
        width : this.$el.width(),
        height : this.$el.height()
      };
    }
    var page;
    var dimension;
    var testWindow;
    var data = this._data;
    var keys = this.view();
    if (data.display == self.DISPLAY_DOUBLE ? (w = Math.floor(w), n = Math.floor(n), 1 == w % 2 && (w -= 1), testWindow = Math.floor(w / 2)) : testWindow = w, this.stop(), this.$el.css({
      width : w,
      height : n
    }), data.zoom > 1) {
      var a = {};
      /** @type {number} */
      var i = 0;
      for (;i < keys.length;i++) {
        if (keys[i]) {
          /** @type {number} */
          a[keys[i]] = 1;
        }
      }
      for (page in data.pageWrap) {
        if (self.has(page, data.pageWrap)) {
          if (this._isCoverPageVisible(page)) {
            /** @type {number} */
            a[page] = 1;
          }
        }
      }
      for (page in a) {
        if (self.has(page, a)) {
          dimension = this._pageSize(page, true);
          if (!obj) {
            data.pageObjs[page].css({
              width : dimension.width,
              height : dimension.height
            });
          }
          data.pageWrap[page].css(dimension);
          if (data.pages[page]) {
            data.pages[page].flip("_restoreClip", false, true);
            data.pages[page].flip("resize", dimension.width, dimension.height);
          }
        }
      }
    } else {
      for (page in data.pageWrap) {
        if (self.has(page, data.pageWrap)) {
          dimension = this._pageSize(page, true);
          if (!(obj && -1 != $.inArray(parseInt(page, 10), keys))) {
            data.pageObjs[page].css({
              width : dimension.width,
              height : dimension.height
            });
          }
          data.pageWrap[page].css(dimension);
          if (data.pages[page]) {
            data.pages[page].flip("_restoreClip");
            data.pages[page].flip("resize", dimension.width, dimension.height);
          }
        }
      }
    }
    if (data.pages[0]) {
      data.pageWrap[0].css({
        left : -this.$el.width()
      });
      data.pages[0].flip("resize");
    }
    this._updateShadow();
    var _self = this;
    var options = data.options;
    return options.autoCenter && (options.animatedAutoCenter && data.done ? (this.$el.css(self.addCssWithPrefix({
      "@transition" : ""
    })), _self.center(), setTimeout(function() {
      _self.$el.css(self.addCssWithPrefix({
        "@transition" : "margin-left " + options.duration + "ms"
      }));
    }, 0)) : this.center()), this.$el.css(this._position()), data.pages[0] && (page = data.pages[0].data("f").tPage, page && data.pageObjs[0].children().eq(0).css({
      width : data.pageObjs[data.page].width(),
      height : data.pageObjs[data.page].height()
    })), data.peel && this.peel(data.peel.corner, data.peel.x, data.peel.y, false), this.flow(), this.$el;
  };
  /**
   * @return {?}
   */
  that.prototype.stop = function() {
    var c;
    var page;
    var data = this._data;
    if (this.isAnimating()) {
      /** @type {boolean} */
      var path = data.display == self.DISPLAY_SINGLE;
      if (data.tpage) {
        data.page = data.tpage;
        delete data.tpage;
      }
      for (;data.pageMv.length > 0;) {
        if (page = data.pages[data.pageMv[0]], c = page.data("f")) {
          var i = c.peel;
          /** @type {null} */
          c.peel = null;
          page.flip("hideFoldedPage");
          c.peel = i;
          c.next = path ? c.page + 1 : data.options.showDoublePage ? 0 === c.page % 2 ? c.page + 1 : c.page - 1 : 0 === c.page % 2 ? c.page - 1 : c.page + 1;
          page.flip("_bringClipToFront", false);
        }
      }
      /** @type {string} */
      data.status = "";
      this.update();
    } else {
      for (page in data.pages) {
        if (self.has(page, data.pages)) {
          data.pages[page].flip("_bringClipToFront", false);
        }
      }
    }
    return this.$el;
  };
  /**
   * @param {Event} evt
   * @param {?} dataAndEvents
   * @param {?} e
   * @return {?}
   */
  that.prototype._eventStart = function(evt, dataAndEvents, e) {
    var data = this._data;
    var opts = $(evt.target).data("f");
    return data.display == self.DISPLAY_SINGLE && (e && (opts.next = "l" == e.charAt(1) && data.direction == self.DIRECTION_LTR || "r" == e.charAt(1) && data.direction == self.DIRECTION_RTL ? opts.next < opts.page ? opts.next : opts.page - 1 : opts.next > opts.page ? opts.next : opts.page + 1)), evt.isDefaultPrevented() ? (this._updateShadow(), void 0) : (this._updateShadow(), void 0);
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  that.prototype._eventPress = function(event) {
    var data = this._data;
    data.finger = self.eventPoint(event);
    /** @type {boolean} */
    data.hasSelection = "" === self.getSelectedText();
    data.fingerZoom = data.zoom;
    var page;
    for (page in data.pages) {
      if (self.has(page, data.pages) && data.pages[page].flip("_pagePress", event)) {
        return data.tmpListeners || (data.tmpListeners = {}, data.tmpListeners.tap = self.getListeners(this.$el, "tap", true), data.tmpListeners.doubleTap = self.getListeners(this.$el, "doubleTap", true)), event.preventDefault(), data.statusHolding = true, void 0;
      }
    }
    if (data.options.smartFlip) {
      event.preventDefault();
    }
  };
  /**
   * @param {Event} e
   * @return {undefined}
   */
  that.prototype._eventMove = function(e) {
    var that = this._data;
    var page;
    for (page in that.pages) {
      if (self.has(page, that.pages)) {
        that.pages[page].flip("_pageMove", e);
      }
    }
    if (that.finger) {
      var prev = $.extend({}, that.finger);
      if (!that.tmpListeners) {
        that.tmpListeners = {};
        that.tmpListeners.tap = self.getListeners(this.$el, "tap", true);
        that.tmpListeners.doubleTap = self.getListeners(this.$el, "doubleTap", true);
      }
      that.finger = self.eventPoint(e);
      that.finger.prev = prev;
      if (that.zoom > 1) {
        if (!val || val && 1 == e.originalEvent.originalEvent.touches.length) {
          this.scroll(that.scroll.left + that.finger.x - prev.x, that.scroll.top + that.finger.y - prev.y);
        }
      }
    } else {
      if (!val && (that.zoom > 1 && that.options.autoScroll)) {
        if (!that.initScroll) {
          that.initScroll = this.scroll();
          that.initCursor = self.eventPoint(e);
          that.viewerOffset = that.options.viewer.offset();
        }
        var cur = self.eventPoint(e);
        var scroll = self.point2D(that.initScroll.x, that.initScroll.y);
        var borderBoxSize = this.scrollSize();
        if (cur.x < that.initCursor.x) {
          /** @type {number} */
          scroll.x = that.initScroll.left * Math.max(0, (cur.x - that.viewerOffset.left - 20) / that.initCursor.x);
        } else {
          if (cur.x > that.initCursor.x) {
            scroll.x = that.initScroll.left + (borderBoxSize.width - that.initScroll.left) * Math.min(1, (cur.x - that.initCursor.x + 20) / (that.viewerWidth - that.initCursor.x));
          }
        }
        if (cur.y < that.initCursor.y) {
          /** @type {number} */
          scroll.y = that.initScroll.top * Math.max(0, (cur.y - that.viewerOffset.top - 20) / that.initCursor.y);
        } else {
          if (cur.y > that.initCursor.y) {
            scroll.y = that.initScroll.top + (borderBoxSize.height - that.initScroll.top) * Math.min(1, (cur.y - that.initCursor.y + 20) / (that.viewerHeight - that.initCursor.y));
          }
        }
        this.scroll(scroll.x, scroll.y);
      }
    }
  };
  /**
   * @param {?} deepDataAndEvents
   * @return {undefined}
   */
  that.prototype._eventRelease = function(deepDataAndEvents) {
    var head = this;
    var data = this._data;
    if (setTimeout(function() {
      if (data.tmpListeners) {
        self.setListeners(head.$el, "tap", data.tmpListeners.tap);
        self.setListeners(head.$el, "doubleTap", data.tmpListeners.doubleTap);
        delete data.tmpListeners;
      }
    }, 1), data.finger) {
      var page;
      for (page in data.pages) {
        if (self.has(page, data.pages)) {
          data.pages[page].flip("_pageUnpress", deepDataAndEvents);
        }
      }
      delete data.finger;
      delete data.fingerZoom;
      if (data.statusHolding) {
        /** @type {boolean} */
        data.statusHolding = false;
        if (!data.statusHover) {
          this._hasMotionListener(false);
        }
      }
      if (data.zoomed) {
        this.zoom(data.zoomed[0], data.zoomed[1]);
        delete data.zoomed;
      }
    }
  };
  /**
   * @param {Object} a
   * @return {undefined}
   */
  that.prototype._eventSwipe = function(a) {
    var data = this._data;
    /** @type {boolean} */
    var ok = "" === self.getSelectedText();
    if ("turning" != data.status && (1 == data.zoom && data.hasSelection == ok)) {
      if (data.display == self.DISPLAY_SINGLE) {
        var i = data.page;
        if (a.speed < 0) {
          if (~$.inArray(data.corner, self.corners.forward)) {
            this.next();
          } else {
            if (data.status = "swiped", data.pages[i].flip("hideFoldedPage", true), i > 1) {
              var target = data.pages[i - 1].data("f").point;
              data.pages[i - 1].flip("turnPage", target ? target.corner : "");
            }
          }
        } else {
          if (a.speed > 0) {
            if (~$.inArray(data.corner, self.corners.backward)) {
              this.previous();
            } else {
              /** @type {string} */
              data.status = "swiped";
              data.pages[i].flip("hideFoldedPage", true);
            }
          }
        }
      } else {
        if (data.display == self.DISPLAY_DOUBLE) {
          if (a.speed < 0) {
            if (this.isAnimating()) {
              if (~$.inArray(data.corner, self.corners.forward)) {
                this.next();
              }
            } else {
              this.next();
            }
          } else {
            if (a.speed > 0) {
              if (this.isAnimating()) {
                if (~$.inArray(data.corner, self.corners.backward)) {
                  this.previous();
                }
              } else {
                this.previous();
              }
            }
          }
        }
      }
    }
  };
  /**
   * @return {undefined}
   */
  that.prototype._eventHover = function() {
    var data = this._data;
    clearInterval(data.noHoverTimer);
    /** @type {boolean} */
    data.statusHover = true;
    this._hasMotionListener(true);
  };
  /**
   * @param {Event} datum
   * @return {undefined}
   */
  that.prototype._eventNoHover = function(datum) {
    var that = this;
    var data = this._data;
    /** @type {number} */
    data.noHoverTimer = setTimeout(function() {
      if (!data.statusHolding) {
        that._eventMove(datum);
        that._hasMotionListener(false);
      }
      delete data.noHoverTimer;
      /** @type {boolean} */
      data.statusHover = false;
    }, 10);
  };
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  that.prototype._hasMotionListener = function(recurring) {
    var data = this._data;
    if (recurring) {
      if (!data.hasMoveListener) {
        $(document).on("vmousemove", $.proxy(this, "_eventMove")).on("vmouseup", $.proxy(this, "_eventRelease"));
        /** @type {boolean} */
        data.hasMoveListener = true;
      }
    } else {
      if (data.hasMoveListener) {
        $(document).off("vmousemove", this._eventMove).off("vmouseup", this._eventRelease);
        /** @type {boolean} */
        data.hasMoveListener = false;
      }
    }
  };
  /**
   * @return {?}
   */
  that.prototype.focusPoint = function() {
    var data = this._data;
    if (data.focusPoint) {
      return data.focusPoint;
    }
    var view = this.view();
    return view[0] ? view[1] ? self.point2D(this.width() / 2, this.height() / 2) : self.point2D(3 * this.width() / 4, this.height() / 2) : self.point2D(this.width() / 4, this.height() / 2);
  };
  /**
   * @return {?}
   */
  that.prototype.maxZoom = function() {
    var data = this._data;
    if (data.options.responsive) {
      if ("string" == typeof data.options.width && ~data.options.width.indexOf("%")) {
        return 1;
      }
      /** @type {number} */
      var olen = data.viewerWidth - data.margin[1] - data.margin[3];
      /** @type {number} */
      var one_vh = data.viewerHeight - data.margin[0] - data.margin[2];
      return data.options.width / self.calculateBounds({
        width : data.options.width,
        height : data.options.height,
        boundWidth : Math.min(data.options.width, olen),
        boundHeight : Math.min(data.options.height, one_vh)
      }).width;
    }
    return data.options.zoom;
  };
  /**
   * @param {Object} event
   * @return {?}
   */
  that.prototype.zoomIn = function(event) {
    return this._data, this.zoom(this.maxZoom(), event);
  };
  /**
   * @param {Object} xy
   * @return {?}
   */
  that.prototype.zoomOut = function(xy) {
    return this.zoom(1, xy);
  };
  /**
   * @return {?}
   */
  that.prototype._halfWidth = function() {
    var data = this._data;
    var view = this.view();
    return data.display == self.DISPLAY_DOUBLE && (data.options.autoCenter && (!view[0] || !view[1]));
  };
  /**
   * @return {?}
   */
  that.prototype.scrollSize = function() {
    var padding = this._data;
    var size = this.size();
    var width = this._halfWidth() ? size.width / 2 : size.width;
    return{
      width : Math.max(0, width - padding.viewerWidth),
      height : Math.max(0, size.height - padding.viewerHeight)
    };
  };
  /**
   * @param {number} x
   * @param {number} y
   * @return {?}
   */
  that.prototype.scroll = function(x, y) {
    var data = this._data;
    if (void 0 === y && void 0 === x) {
      return data.scroll;
    }
    if (data.zoom > 1 && !data.silentZoom) {
      var size = this.size();
      this.view();
      var viewSize = this.scrollSize();
      var result = self.point2D(data.viewerWidth / 2 - size.width / 2, data.viewerHeight / 2 - size.height / 2);
      /** @type {number} */
      y = Math.min(viewSize.height, Math.max(0, y));
      /** @type {number} */
      x = Math.min(viewSize.width, Math.max(0, x));
      if (this._trigger("scrolling", x, y) != self.EVENT_PREVENTED) {
        /** @type {number} */
        result.x = result.x + viewSize.width / 2 - x;
        /** @type {number} */
        result.y = result.y + viewSize.height / 2 - y;
        this.$el.css({
          left : result.x,
          top : result.y
        });
        data.scroll = {
          top : y,
          left : x
        };
      }
    }
    return this.$el;
  };
  /**
   * @param {Object} e
   * @return {?}
   */
  that.prototype._mouseRel = function(e) {
    var off = this.$el.offset();
    var data = this._data;
    var size = this.size();
    var b = self.point2D(e.pageX - off.left, e.pageY - off.top);
    if (data.display == self.DISPLAY_DOUBLE) {
      var view = this.view();
      if (view[0]) {
        if (view[1]) {
          if (b.x < 0 || b.x > size.width) {
            return null;
          }
        } else {
          if (b.x = b.x, b.x < 0 || b.x > size.width / 2) {
            return null;
          }
        }
      } else {
        if (b.x = b.x - size.width / 2, b.x < 0 || b.x > size.width / 2) {
          return null;
        }
      }
    } else {
      if (data.display == self.DISPLAY_SINGLE && (b.x < 0 || b.x > size.width)) {
        return null;
      }
    }
    return b;
  };
  /**
   * @param {Function} scale
   * @param {Object} xy
   * @return {?}
   */
  that.prototype.zoom = function(scale, xy) {
    var data = this._data;
    if (void 0 === scale) {
      return data.zoom;
    }
    xy = xy || {};
    var size = this.size();
    var _halfWidth = this._halfWidth();
    if ("pageX" in xy && "pageY" in xy) {
      var details = this._mouseRel(xy);
      if (null === details) {
        return this.$el;
      }
      xy = $.extend(xy, details);
      if ("factor" in xy) {
        /** @type {number} */
        scale = xy.factor * data.fingerZoom;
        /** @type {boolean} */
        xy.animate = false;
      }
    } else {
      if (!("x" in xy && "y" in xy)) {
        /** @type {number} */
        xy.x = _halfWidth ? size.width / 4 : size.width / 2;
        /** @type {number} */
        xy.y = size.height / 2;
      }
    }
    if (data.silentZoom || this._trigger("willZoom", scale, data.zoom) != self.EVENT_PREVENTED) {
      var page;
      var _ = this;
      var code = data.zoom;
      data.options.viewer;
      var view = this.view();
      /** @type {number} */
      var value = parseFloat(Math.min(this.maxZoom(), Math.max(0.1, scale)), 10);
      var cur = this._position(value);
      self.vendor + "transition";
      var o = void 0 === xy.animate ? true : xy.animate;
      var containerPos = this.$el.offset();
      var buttonPos = data.options.viewer.offset();
      var elem = this._size(value, true);
      /** @type {number} */
      var tX = 1 / data.zoom * value;
      var t = data.display == self.DISPLAY_DOUBLE && data.options.autoCenter;
      var lines = self.point2D(Math.max(0, elem.width - data.viewerWidth), Math.max(0, elem.height - data.viewerHeight));
      var e = self.point2D(xy.x * tX - containerPos.left - xy.x, xy.y * tX - containerPos.top - xy.y);
      if (t) {
        if (!view[0]) {
          /** @type {number} */
          e.x = e.x - size.width / 2;
        }
      }
      e = self.point2D(Math.min(lines.x, Math.max(0, e.x)), Math.min(lines.y, Math.max(0, e.y)));
      if (_halfWidth) {
        cur.left += elem.width / 2;
      }
      var pos = self.point2D(buttonPos.left - containerPos.left + Math.max(0, cur.left), buttonPos.top - containerPos.top + Math.max(0, cur.top));
      if (t) {
        if (!view[0]) {
          pos.x -= elem.width;
        }
      }
      var x = self.translate(pos.x - e.x, pos.y - e.y, true) + self.scale(value, value, true);
      if (this.stop(), this.disable(true), this._cloneView(true), o) {
        if (code > value) {
          for (page in data.pageWrap) {
            data.pageWrap[page].css({
              visibility : "hidden"
            });
          }
        }
        /** @type {boolean} */
        data.silentZoom = true;
        /** @type {number} */
        var drag = size.width / data.zoomer.width();
        data.zoomer.css(self.addCssWithPrefix({
          "@transform-origin" : "0% 0%",
          "@transform" : self.scale(drag, drag, true)
        }));
        setTimeout(function() {
          data.zoomer.css(self.addCssWithPrefix({
            "@transition" : "@transform 500ms ease-in-out",
            "@transform" : x
          }));
        }, 10);
        self.getTransitionEnd(data.zoomer, function() {
          if (!data.finger) {
            _.zoom(scale, {
              animate : false,
              x : xy.x,
              y : xy.y
            });
          }
        });
      } else {
        var target = data.peel;
        if (data.zoomer.css(self.addCssWithPrefix({
          "@transition" : "",
          "@transform-origin" : "0% 0%",
          "@transform" : x
        })), "factor" in xy) {
          if (code > value) {
            for (page in data.pageWrap) {
              data.pageWrap[page].css({
                visibility : "hidden"
              });
            }
          }
          /** @type {Array} */
          data.zoomed = [scale, {
            pageX : xy.pageX,
            pageY : xy.pageY,
            animate : false
          }];
        } else {
          for (page in data.pageWrap) {
            data.pageWrap[page].css({
              visibility : ""
            });
          }
          /** @type {Function} */
          data.zoom = scale;
          elem = this._defaultSize();
          /** @type {number} */
          elem.width = elem.width * value;
          /** @type {number} */
          elem.height = elem.height * value;
          /** @type {number} */
          data.zoom = value;
          /** @type {boolean} */
          data.silentZoom = false;
          delete data.initScroll;
          delete data.initCursor;
          /** @type {null} */
          data.peel = null;
          this.display(elem.display);
          this.size(elem.width, elem.height, data.options.autoScaleContent);
          this.scroll(e.x, e.y);
          if (1 == value) {
            this.disable(false);
            if (target) {
              this.peel(target.corner, target.x, target.y, true);
            }
          } else {
            data.peel = target;
          }
          if (data.options.autoScaleContent) {
            this.scaleContent(value);
          }
          data.zoomer.css(self.addCssWithPrefix({
            "@transform" : self.translate(-1E4, 0, true)
          }));
          this.$el.trigger("zoomed", [value, code]);
        }
      }
    }
    return this.$el;
  };
  /**
   * @param {number} putativeSpy
   * @return {undefined}
   */
  that.prototype.scaleContent = function(putativeSpy) {
    var data = this._data;
    var codeSegments = this.view();
    /** @type {number} */
    var i = 0;
    for (;i < codeSegments.length;i++) {
      if (codeSegments[i]) {
        data.pageObjs[codeSegments[i]].transform("scale(" + putativeSpy + ")", "0% 0%");
      }
    }
  };
  /**
   * @param {Function} value
   * @return {?}
   */
  that.prototype._position = function(value) {
    var self = this._data;
    var class2remove = value || self.zoom;
    var data = value ? this._size(value) : this.size();
    var pos = {
      top : 0,
      left : 0
    };
    if (self.options.responsive && (pos.top = self.viewerHeight / 2 - data.height / 2, pos.left = self.viewerWidth / 2 - data.width / 2, 1 == class2remove)) {
      var cursor = self.margin;
      if (pos.top < cursor[0] || pos.top + data.height > self.viewerHeight - cursor[2]) {
        pos.top = cursor[0];
      }
      if (pos.left < cursor[1] || pos.left + data.width > self.viewerWidth - cursor[3]) {
        pos.left = cursor[3];
      }
    }
    return pos;
  };
  /**
   * @param {Object} event
   * @return {undefined}
   */
  that.prototype.toggleZoom = function(event) {
    var d = this._data;
    if (1 == d.zoom) {
      this.zoomIn(event);
    } else {
      this.zoomOut(event);
    }
  };
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  that.prototype._cloneView = function(recurring) {
    var data = this._data;
    if (data.zoomer) {
      if (recurring) {
        data.zoomer.show();
      } else {
        data.zoomer.remove();
        delete data.zoomer;
      }
    } else {
      if (recurring) {
        var pos;
        var div;
        var page;
        var codeSegments = this.view();
        var r = {};
        var node = $("<div />");
        node.css(self.addCssWithPrefix({
          "@transform-origin" : "0% 0%"
        }));
        node.css({
          position : "absolute",
          top : 0,
          left : 0,
          "z-index" : 10,
          width : this.$el.width(),
          height : this.$el.height()
        });
        /** @type {number} */
        var i = 0;
        for (;i < codeSegments.length;i++) {
          if (codeSegments[i]) {
            /** @type {number} */
            r[codeSegments[i]] = 1;
          }
        }
        for (page in data.pageWrap) {
          if (self.has(page, data.pageWrap)) {
            if (this._isCoverPageVisible(page)) {
              /** @type {number} */
              r[page] = 1;
            }
          }
        }
        for (page in r) {
          if (self.has(page, r)) {
            pos = this._pageSize(page, true);
            /** @type {string} */
            pos.position = "absolute";
            pos.zIndex = data.pageWrap[page].css("z-index");
            div = data.pageObjs[page].clone();
            div.css(pos);
            div.appendTo(node);
          }
        }
        node.appendTo(this.$el);
        data.zoomer = node;
      }
    }
  };
  /**
   * @param {Object} node
   * @return {undefined}
   */
  results.prototype._pageCURL = function(node) {
    var options;
    var top;
    var left;
    var px;
    var size;
    var halfWidth;
    var index;
    var y;
    var tubeRadius;
    var radius;
    var dY;
    var dX;
    var angle;
    var e = this.$el.data("f");
    var data = e.turnData;
    var width = this.$el.width();
    var height = this.$el.height();
    var $ = this;
    /** @type {number} */
    var newTime = 0;
    var that = self.point2D(0, 0);
    var rCenter = self.point2D(0, 0);
    var pos = self.point2D(0, 0);
    var deepDataAndEvents = (this._foldingPage(), data.options.acceleration);
    var h = e.clip.height();
    /**
     * @return {?}
     */
    var compute = function() {
      options = $._startPoint(node.corner);
      var angleMid;
      /** @type {number} */
      var x = width - options.x - node.x;
      /** @type {number} */
      var y = options.y - node.y;
      /** @type {number} */
      var angle = Math.atan2(y, x);
      /** @type {number} */
      var i = Math.sqrt(x * x + y * y);
      var o = self.point2D(width - options.x - Math.cos(angle) * width, options.y - Math.sin(angle) * width);
      if (i > width) {
        node.x = o.x;
        node.y = o.y;
      }
      var delta = self.point2D(0, 0);
      var diff = self.point2D(0, 0);
      if (delta.x = options.x ? options.x - node.x : node.x, delta.y = self.hasRotation ? options.y ? options.y - node.y : node.y : 0, diff.x = left ? width - delta.x / 2 : node.x + delta.x / 2, diff.y = delta.y / 2, angle = lastAngle - Math.atan2(delta.y, delta.x), angleMid = angle - Math.atan2(diff.y, diff.x), i = Math.sin(angleMid) * Math.sqrt(diff.x * diff.x + diff.y * diff.y), pos = self.point2D(i * Math.sin(angle), i * Math.cos(angle)), angle > lastAngle) {
        if (pos.x = pos.x + Math.abs(pos.y * delta.y / delta.x), pos.y = 0, Math.round(pos.x * Math.tan(PI - angle)) < height) {
          return node.y = Math.sqrt(Math.pow(height, 2) + 2 * diff.x * delta.x), top && (node.y = height - node.y), compute();
        }
        /** @type {number} */
        var beta = PI - angle;
        /** @type {number} */
        var dd = h - height / Math.sin(beta);
        that = self.point2D(Math.round(dd * Math.cos(beta)), Math.round(dd * Math.sin(beta)));
        if (left) {
          /** @type {number} */
          that.x = -that.x;
        }
        if (top) {
          /** @type {number} */
          that.y = -that.y;
        }
      }
      /** @type {number} */
      newTime = Math.round(100 * self.deg(angle)) / 100;
      /** @type {number} */
      px = Math.round(pos.y / Math.tan(angle) + pos.x);
      /** @type {number} */
      var side = width - px;
      /** @type {number} */
      var windowHeight = Math.min(height, side * Math.tan(angle));
      if (0 > windowHeight) {
        windowHeight = height;
      }
      /** @type {number} */
      var sideX = side * Math.cos(2 * angle);
      /** @type {number} */
      var sideY = side * Math.sin(2 * angle);
      if (rCenter = self.point2D(Math.round(left ? side - sideX : px + sideX), Math.round(top ? sideY : height - sideY)), data.options.gradients) {
        var e = $._endPoint(node.corner);
        /** @type {number} */
        index = Math.sqrt(Math.pow(e.x - node.x, 2) + Math.pow(e.y - node.y, 2)) / width;
        /** @type {number} */
        size = Math.min(100, side * Math.sin(angle));
        /** @type {number} */
        halfWidth = 1.3 * Math.min(side, windowHeight);
      }
      return pos.x = Math.round(pos.x), pos.y = Math.round(pos.y), true;
    };
    /**
     * @param {?} pos
     * @param {Array} nodeLength
     * @param {Array} opt_attributes
     * @param {number} r
     * @return {undefined}
     */
    var init = function(pos, nodeLength, opt_attributes, r) {
      /** @type {Array} */
      var f = ["0", "auto"];
      /** @type {number} */
      var i = (width - h) * opt_attributes[0] / 100;
      /** @type {number} */
      var err = (height - h) * opt_attributes[1] / 100;
      var v = {
        left : f[nodeLength[0]],
        top : f[nodeLength[1]],
        right : f[nodeLength[2]],
        bottom : f[nodeLength[3]]
      };
      /** @type {number} */
      var offset = 90 != r && -90 != r ? left ? -1 : 1 : 0;
      /** @type {string} */
      var gg = opt_attributes[0] + "% " + opt_attributes[1] + "%";
      var g = data.pages[e.over].data("f");
      /** @type {number} */
      var x = e.clip.parent().position().left - data.pageWrap[e.over].position().left;
      if (e.ipage.css(v).transform(self.rotate(r) + self.translate(pos.x + offset, pos.y, deepDataAndEvents), gg), g.ipage.css(v).transform(self.rotate(r) + self.translate(pos.x + rCenter.x - that.x - width * opt_attributes[0] / 100, pos.y + rCenter.y - that.y - height * opt_attributes[1] / 100, deepDataAndEvents) + self.rotate(Math.round(100 * (180 / r - 2) * r) / 100), gg), e.clip.transform(self.translate(-pos.x + i - offset, -pos.y + err, deepDataAndEvents) + self.rotate(-r), gg), g.clip.transform(self.translate(x - 
      pos.x + that.x + i, -pos.y + that.y + err, deepDataAndEvents) + self.rotate(-r), gg), data.options.gradients) {
        var source;
        var a;
        var m;
        if (top) {
          if (left) {
            /** @type {number} */
            a = r - 90;
            /** @type {number} */
            m = px - 50;
            /** @type {number} */
            size = -size;
            /** @type {string} */
            source = "50% 25%";
          } else {
            /** @type {number} */
            a = r - 270;
            /** @type {number} */
            m = width - px - 50;
            /** @type {string} */
            source = "50% 25%";
          }
        } else {
          if (left) {
            /** @type {number} */
            m = px - 50;
            /** @type {number} */
            a = r - 270;
            /** @type {number} */
            size = -size;
            /** @type {string} */
            source = "50% 75%";
          } else {
            /** @type {number} */
            m = width - px - 50;
            /** @type {number} */
            a = r - 90;
            /** @type {string} */
            source = "50% 75%";
          }
        }
        /** @type {number} */
        var change = Math.max(0.5, 2 - index);
        if (change > 1) {
          /** @type {number} */
          change = change >= 1.7 ? (2 - change) / 0.3 : 1;
        }
        g.igradient.css({
          opacity : Math.round(100 * change) / 100
        }).transform(self.translate(m, 0, deepDataAndEvents) + self.rotate(a) + self.scale(size / 100, 1, deepDataAndEvents), source);
        if (top) {
          if (left) {
            /** @type {number} */
            a = -270 - r;
            /** @type {number} */
            halfWidth = -halfWidth;
            /** @type {number} */
            m = width - px - 20;
            /** @type {string} */
            source = "20% 25%";
          } else {
            /** @type {number} */
            a = -90 - r;
            /** @type {number} */
            m = px - 20;
            /** @type {string} */
            source = "20% 25%";
          }
        } else {
          if (left) {
            /** @type {number} */
            a = -90 - r;
            /** @type {number} */
            m = width - px - 20;
            /** @type {number} */
            halfWidth = -halfWidth;
            /** @type {string} */
            source = "20% 75%";
          } else {
            /** @type {number} */
            a = 90 - r;
            /** @type {number} */
            m = px - 20;
            /** @type {string} */
            source = "20% 75%";
          }
        }
        /** @type {number} */
        change = 0.3 > index ? index / 0.3 : 1;
        e.ogradient.css({
          opacity : Math.round(100 * change) / 100
        }).transform(self.translate(m, 0, deepDataAndEvents) + self.rotate(a) + self.scale(-halfWidth / 100, 1, deepDataAndEvents), source);
      }
    };
    switch(e.point = self.peelingPoint(node.corner, node.x, node.y), node.corner) {
      case "l":
        /** @type {number} */
        dY = node.y - e.startPoint.y;
        dX = node.x;
        /** @type {number} */
        angle = Math.atan2(dY, dX);
        if (angle > 0) {
          y = e.startPoint.y;
          /** @type {number} */
          tubeRadius = Math.sqrt(dX * dX + dY * dY);
          /** @type {number} */
          radius = 2 * y * Math.sin(angle) + tubeRadius;
          /** @type {number} */
          node.x = radius * Math.cos(angle);
          /** @type {number} */
          node.y = radius * Math.sin(angle);
          /** @type {string} */
          node.corner = "tl";
          /** @type {boolean} */
          left = true;
          /** @type {boolean} */
          top = true;
          compute();
          init(pos, [1, 0, 0, 1], [100, 0], newTime);
        } else {
          /** @type {number} */
          angle = -angle;
          /** @type {number} */
          y = height - e.startPoint.y;
          /** @type {number} */
          tubeRadius = Math.sqrt(dX * dX + dY * dY);
          /** @type {number} */
          radius = 2 * y * Math.cos(lastAngle - angle) + tubeRadius;
          /** @type {number} */
          node.x = radius * Math.cos(angle);
          /** @type {number} */
          node.y = height - radius * Math.sin(angle);
          /** @type {string} */
          node.corner = "bl";
          /** @type {boolean} */
          left = true;
          compute();
          init(self.point2D(pos.x, -pos.y), [1, 1, 0, 0], [100, 100], -newTime);
        }
        break;
      case "r":
        /** @type {number} */
        dY = e.startPoint.y - node.y;
        /** @type {number} */
        dX = width - node.x;
        /** @type {number} */
        angle = Math.atan2(dY, dX);
        if (0 > angle) {
          y = e.startPoint.y;
          /** @type {number} */
          angle = -angle;
          /** @type {number} */
          tubeRadius = Math.sqrt(dX * dX + dY * dY);
          /** @type {number} */
          radius = 2 * y * Math.sin(angle) + tubeRadius;
          /** @type {number} */
          node.x = width - radius * Math.cos(angle);
          /** @type {number} */
          node.y = radius * Math.sin(angle);
          /** @type {string} */
          node.corner = "tr";
          /** @type {boolean} */
          top = true;
          compute();
          init(self.point2D(-pos.x, pos.y), [0, 0, 0, 1], [0, 0], -newTime);
        } else {
          /** @type {number} */
          y = height - e.startPoint.y;
          /** @type {number} */
          tubeRadius = Math.sqrt(dX * dX + dY * dY);
          /** @type {number} */
          radius = 2 * y * Math.cos(lastAngle - angle) + tubeRadius;
          /** @type {number} */
          node.x = width - radius * Math.cos(angle);
          /** @type {number} */
          node.y = height - radius * Math.sin(angle);
          /** @type {string} */
          node.corner = "br";
          compute();
          init(self.point2D(-pos.x, -pos.y), [0, 1, 1, 0], [0, 100], newTime);
        }
        break;
      case "tl":
        /** @type {boolean} */
        top = true;
        /** @type {boolean} */
        left = true;
        /** @type {number} */
        node.x = Math.max(node.x, 1);
        /** @type {number} */
        e.point.x = node.x;
        options = this._startPoint("tl");
        compute();
        init(pos, [1, 0, 0, 1], [100, 0], newTime);
        break;
      case "tr":
        /** @type {boolean} */
        top = true;
        /** @type {number} */
        node.x = Math.min(node.x, width - 1);
        /** @type {number} */
        e.point.x = node.x;
        compute();
        init(self.point2D(-pos.x, pos.y), [0, 0, 0, 1], [0, 0], -newTime);
        break;
      case "bl":
        /** @type {boolean} */
        left = true;
        /** @type {number} */
        node.x = Math.max(node.x, 1);
        /** @type {number} */
        e.point.x = node.x;
        compute();
        init(self.point2D(pos.x, -pos.y), [1, 1, 0, 0], [100, 100], -newTime);
        break;
      case "br":
        /** @type {number} */
        node.x = Math.min(node.x, width - 1);
        /** @type {number} */
        e.point.x = node.x;
        compute();
        init(self.point2D(-pos.x, -pos.y), [0, 1, 1, 0], [0, 100], newTime);
    }
  };
  /**
   * @param {Object} data
   * @return {undefined}
   */
  results.prototype._hardSingle = function(data) {
    var page;
    var s = this.$el.data("f");
    var that = s.turnData;
    page = this.$el.hasClass("cover") ? s.next : 0;
    var id = s.page;
    var g = that.pages[page].data("f");
    var scale = this.$el.width();
    this.$el.height();
    var e = ("l" == data.corner, this._startPoint(data.corner));
    var element = that.totalPages;
    var zIndex = s["z-index"] || element;
    /** @type {number} */
    var yearsTo = e.x ? (e.x - data.x) / scale : data.x / scale;
    /** @type {number} */
    var value = 90 * -yearsTo;
    /** @type {number} */
    var tval = 180 + value;
    /** @type {boolean} */
    var reverse = 1 > yearsTo;
    console.log(data.corner);
    s.ipage.css(self.addCssWithPrefix({
      "@transform" : "rotateY(" + value + "deg) translate3d(0px, 0px, " + (this.$el.attr("depth") || 0) + "px)",
      "@transform-origin" : "0% 50%"
    }));
    that.pageWrap[id].css(self.addCssWithPrefix({
      overflow : "visible",
      "@perspective-origin" : "0% 50%"
    }));
    g.ipage.css(self.addCssWithPrefix({
      "@transform" : "rotateY(" + tval + "deg)",
      "@transform-origin" : "100% 50%"
    }));
    that.pageWrap[page].css(self.addCssWithPrefix({
      overflow : "visible",
      "@perspective-origin" : "100% 50%"
    }));
    if (reverse) {
      /** @type {number} */
      yearsTo = -yearsTo + 1;
      s.ipage.css({
        zIndex : zIndex + 1
      });
      g.ipage.css({
        zIndex : zIndex
      });
    } else {
      yearsTo -= 1;
      s.ipage.css({
        zIndex : zIndex
      });
      g.ipage.css({
        zIndex : zIndex + 1
      });
    }
    s.point = self.peelingPoint(data.corner, data.x, data.y);
  };
  /**
   * @param {Object} data
   * @return {undefined}
   */
  results.prototype._hardDouble = function(data) {
    var s = this.$el.data("f");
    var that = s.turnData;
    var y = this.$el.width();
    this.$el.height();
    var pickWinLeft;
    var test;
    var change;
    var source;
    var gg;
    var i;
    var index;
    /** @type {boolean} */
    var config = "l" == data.corner;
    var e = this._startPoint(data.corner);
    var l = that.totalPages;
    var zIndex = s["z-index"] || l;
    var CSS = {
      overflow : "visible"
    };
    /** @type {number} */
    data.x = config ? Math.min(Math.max(data.x, 0), 2 * y) : Math.max(Math.min(data.x, y), -y);
    /** @type {number} */
    var opacity = e.x ? (e.x - data.x) / y : data.x / y;
    /** @type {number} */
    var distance = 90 * opacity;
    /** @type {boolean} */
    var isRightSwipe = 90 > distance;
    var page = s.next;
    var body = that.pages[page].data("f");
    if (config ? (source = "0% 50%", gg = "100% 50%", isRightSwipe ? (pickWinLeft = 0, i = s.next - 1, test = i > 0, index = s.page, change = 1) : (pickWinLeft = "100%", i = s.page + 1, test = l > i, index = s.next, change = 0)) : (source = "100% 50%", gg = "0% 50%", distance = -distance, y = -y, isRightSwipe ? (pickWinLeft = 0, i = s.next + 1, index = s.page, test = l > i, change = 0) : (pickWinLeft = "-100%", i = s.page - 1, index = s.next, test = i > 0, change = 1)), CSS[self.vendor + "perspective-origin"] = 
    gg, that.pageWrap[s.page].css(CSS), s.ipage.transform("rotateY(" + distance + "deg)" + "translate3d(0px, 0px, " + (this.$el.attr("depth") || 0) + "px)", gg), that.pageWrap[page].css(self.addCssWithPrefix({
      overflow : "visible",
      "@perspective-origin" : source
    })), body.ipage.transform("rotateY(" + (180 + distance) + "deg)", source), isRightSwipe ? (opacity = -opacity + 1, s.ipage.css({
      zIndex : zIndex + 1
    }), body.ipage.css({
      zIndex : zIndex
    })) : (opacity -= 1, s.ipage.css({
      zIndex : zIndex
    }), body.ipage.css({
      zIndex : zIndex + 1
    })), that.options.gradients) {
      if (test) {
        var params = that.pages[i].data("f");
        if (s.ogradient.parent()[0] != params.ipage[0]) {
          s.ogradient.appendTo(params.ipage);
        }
        s.ogradient.css({
          left : pickWinLeft,
          backgroundColor : "black",
          opacity : 0.5 * opacity
        }).transform("rotateY(0deg)");
      } else {
        s.ogradient.css({
          opacity : 0
        });
      }
      var d = that.pages[index].data("f");
      if (s.igradient.parent()[0] != d.ipage[0]) {
        s.igradient.appendTo(d.ipage);
      }
      s.igradient.css({
        opacity : -opacity + 1
      });
      self.gradient(s.igradient, self.point2D(100 * change, 0), self.point2D(100 * (-change + 1), 0), [[0, "rgba(0,0,0,0.3)"], [1, "rgba(0,0,0,0)"]], 2);
    }
    s.point = self.peelingPoint(data.corner, data.x, data.y);
  };
  /**
   * @param {Object} inplace
   * @return {undefined}
   */
  results.prototype._hard = function(inplace) {
    if (this.$el.data("f").turnData.display == self.DISPLAY_SINGLE) {
      this._hardSingle(inplace);
    } else {
      this._hardDouble(inplace);
    }
  };
  self.widgetFactory("turn", that);
  self.widgetFactory("flip", results);
  var jQuery = self.UIComponent(function(options) {
    var data = this._data;
    data.options = $.extend({
      min : 0,
      max : 100,
      step : 1,
      value : 0,
      style : "horizontal"
    }, options);
    /** @type {boolean} */
    data.disabled = options.disabled === true;
    if ("vertical" == data.options.style) {
      /** @type {boolean} */
      data.verticalStyle = true;
    } else {
      if ("horizontal" == data.options.style) {
        /** @type {boolean} */
        data.verticalStyle = false;
      }
    }
    this.$el.on("vmousedown", $.proxy(this, "_eventPress"));
    this.value(this._data.options.value);
    self.addDelegateList(options.delegate, this.$el);
  });
  /**
   * @param {number} val
   * @param {boolean} type
   * @return {?}
   */
  jQuery.prototype.value = function(val, type) {
    var that = this._data;
    if (void 0 === val) {
      return that.value;
    }
    var layout_text_media;
    if (val = Math.min(that.options.max, Math.max(that.options.min, val)), val = Math.round(val / that.options.step), val *= that.options.step, that.pressed) {
      if (val != that.pvalue) {
        if (type || this._trigger("slide", val) != self.EVENT_PREVENTED) {
          /** @type {number} */
          layout_text_media = 100 * ((val - that.options.min) / (that.options.max - that.options.min));
          if (that.verticalStyle) {
            this.$el.find(".progress").height(layout_text_media + "%");
          } else {
            this.$el.find(".progress").width(layout_text_media + "%");
          }
          /** @type {number} */
          that.pvalue = val;
        }
      }
    } else {
      if (val != that.value) {
        /** @type {boolean} */
        var _args = type ? true : this._trigger("changeValue", val) != self.EVENT_PREVENTED;
        if (_args) {
          /** @type {number} */
          layout_text_media = 100 * ((val - that.options.min) / (that.options.max - that.options.min));
          /** @type {number} */
          that.value = val;
        } else {
          /** @type {number} */
          layout_text_media = 100 * ((that.value - that.options.min) / (that.options.max - that.options.min));
        }
        if (that.verticalStyle) {
          this.$el.find(".progress").height(layout_text_media + "%");
        } else {
          this.$el.find(".progress").width(layout_text_media + "%");
        }
      } else {
        if (!type) {
          this._trigger("valueUnchanged");
        }
      }
    }
    return this.$el;
  };
  /**
   * @param {number} i
   * @return {?}
   */
  jQuery.prototype._percentToValue = function(i) {
    var data = this._data;
    return i * (data.options.max - data.options.min) + data.options.min;
  };
  /**
   * @param {Event} ev
   * @return {undefined}
   */
  jQuery.prototype._eventPress = function(ev) {
    var a;
    var b;
    var data = this._data;
    var env = this.$el.find(".progress").parent();
    /** @type {boolean} */
    data.pressed = true;
    /** @type {null} */
    data.pvalue = null;
    if (data.verticalStyle) {
      /** @type {number} */
      a = self.eventPoint(ev).y - env.offset().top;
      this.$el.addClass("changing");
      b = env.height();
    } else {
      /** @type {number} */
      a = self.eventPoint(ev).x - env.offset().left;
      this.$el.addClass("changing");
      b = env.width();
    }
    this.value(this._percentToValue(a / b));
    $(document).on("vmousemove", $.proxy(this, "_eventMoving"));
    $(document).on("vmouseup", $.proxy(this, "_eventRelease"));
    ev.preventDefault();
  };
  /**
   * @param {Event} part
   * @return {undefined}
   */
  jQuery.prototype._eventMoving = function(part) {
    var chunkSize;
    var data = this._data;
    if (data.pressed && !data.disabled) {
      var env = this.$el.find(".progress").parent();
      if (data.verticalStyle ? (data.offset = self.eventPoint(part).y - env.offset().top, chunkSize = env.height()) : (data.offset = self.eventPoint(part).x - env.offset().left, chunkSize = env.width()), !data.animationScheduled) {
        var amount = this;
        /** @type {boolean} */
        data.animationScheduled = true;
        window.requestAnimationFrame(function() {
          /** @type {boolean} */
          data.animationScheduled = false;
          amount.value(amount._percentToValue(data.offset / chunkSize));
        });
      }
    }
  };
  /**
   * @return {undefined}
   */
  jQuery.prototype._eventRelease = function() {
    var value = this._data;
    /** @type {boolean} */
    value.pressed = false;
    this._trigger("released");
    if (value.pvalue) {
      this.value(value.pvalue);
    } else {
      this._trigger("valueUnchanged");
    }
    /** @type {null} */
    value.pvalue = null;
    this.$el.removeClass("changing");
    $(document).off("vmousemove", this._eventMoving);
    $(document).off("vmouseup", this._eventRelease);
  };
  /**
   * @param {number} options
   * @return {?}
   */
  jQuery.prototype.options = function(options) {
    var that = this._data;
    return void 0 === options ? that.options : (that.options = $.extend(that.options, options), void 0);
  };
  /**
   * @return {undefined}
   */
  jQuery.prototype.increase = function() {
    var _this = this._data;
    this.value(_this.value + _this.options.step);
  };
  /**
   * @return {undefined}
   */
  jQuery.prototype.decrease = function() {
    var a = this._data;
    this.value(a.value - a.options.step);
  };
  /**
   * @param {string} element
   * @return {undefined}
   */
  jQuery.prototype.style = function(element) {
    var data = this._data;
    var val = data.value;
    if ("vertical" == element) {
      this.$el.find(".progress").css({
        width : ""
      });
      /** @type {boolean} */
      data.verticalStyle = true;
    } else {
      if ("horizontal" == element) {
        this.$el.find(".progress").css({
          height : ""
        });
        /** @type {boolean} */
        data.verticalStyle = false;
      }
    }
    /** @type {null} */
    data.value = null;
    this.value(val, true);
  };
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  jQuery.prototype.disable = function(recurring) {
    /** @type {boolean} */
    this._data.disabled = recurring === true;
  };
  /**
   * @return {?}
   */
  jQuery.prototype.isUserInteracting = function() {
    return this._data.pressed === true;
  };
  self.widgetFactory("slider", jQuery);
  var editor = self.UIComponent(function(e) {
    if (!e.flipbook) {
      throw self.turnError("Miniatures: Flipbook required");
    }
    var data = this._data;
    /** @type {Array} */
    data.pages = [];
    /** @type {Array} */
    data.reusablePages = [];
    /** @type {boolean} */
    data.listenToFlipbook = true;
    /** @type {number} */
    data.focusedPage = 0;
    /** @type {number} */
    data.offsetX = 0;
    /** @type {boolean} */
    data.hasListeners = false;
    data.options = $.extend({
      pageMargin : 10,
      duration : 500
    }, e);
    data.$flipbook = $(e.flipbook);
    data.$container = $("<div />", {
      "class" : "container"
    });
    data.$pageNumber = $("<div />", {
      "class" : "page-number"
    });
    data.$container.appendTo(this.$el);
    data.$pageNumber.appendTo(this.$el);
    self.addDelegateList(e.delegate, this.$el);
    this._setValues();
    data.disabled = e.disabled;
    this._addMiniature();
    this._update(data.$flipbook.turn("page"));
    this._eventDelegation();
    data.$flipbook.on("turned", $.proxy(this, "_eventPageTurned"));
    data.$flipbook.on("changeDisplay", $.proxy(this, "_eventChangeDisplay"));
    /** @type {boolean} */
    data.done = true;
  });
  /**
   * @param {number} tx
   * @return {?}
   */
  editor.prototype._addMiniature = function(tx) {
    tx = tx || -1E3;
    var data = this._data;
    var $demoSloganizer = $("<div />", {
      css : {
        position : "absolute",
        left : "0px",
        top : "0px",
        width : data.pageWidth,
        height : data.pageHeight
      },
      "class" : "ui-page"
    }).html('<div class="page-img"></div>');
    var copies = {
      pageNum : null,
      x : tx,
      $el : $demoSloganizer
    };
    return data.$container.append($demoSloganizer), data.pages.push(copies), copies;
  };
  /**
   * @param {number} page
   * @return {?}
   */
  editor.prototype._findPage = function(page) {
    var data = this._data;
    /** @type {number} */
    var i = 0;
    for (;i < data.pages.length;i++) {
      if (data.pages[i].pageNum == page) {
        return data.pages[i];
      }
    }
    return null;
  };
  /**
   * @param {number} event
   * @param {boolean} dataAndEvents
   * @return {undefined}
   */
  editor.prototype._update = function(event, dataAndEvents) {
    var suiteView;
    var parts;
    var data = this._data;
    /** @type {number} */
    var page = event - 1;
    /** @type {boolean} */
    var g = true;
    if (!(data.focusedPage == event && (data.done && !dataAndEvents) || (1 > event || (event > data.$flipbook.turn("pages") || (data.prevFocusedPage = data.focusedPage, data.focusedPage = event, data.disabled))))) {
      data.focusedView = data.$flipbook.turn("view", data.focusedPage, true);
      this._updateQueueReusablePages();
      data.$pageNumber.html(data.focusedView.join("-"));
      for (;this._isPageVisible(page);) {
        suiteView = this._findPage(page) || this._reusablePage();
        if (null === suiteView) {
          suiteView = this._addMiniature();
        }
        this._updatePage(page, suiteView, true);
        page--;
        /** @type {boolean} */
        g = false;
      }
      /** @type {number} */
      page = event;
      for (;(parts = this._isPageVisible(page)) || g && page <= data.totalPages;) {
        if (parts) {
          suiteView = this._findPage(page) || this._reusablePage();
          if (null === suiteView) {
            suiteView = this._addMiniature();
          }
          this._updatePage(page, suiteView, true);
          /** @type {boolean} */
          g = false;
        }
        page++;
      }
    }
  };
  /**
   * @return {undefined}
   */
  editor.prototype._updateQueueReusablePages = function() {
    var existing;
    var data = this._data;
    /** @type {number} */
    var i = 0;
    for (;i < data.pages.length;i++) {
      existing = data.pages[i];
      if (!(null !== existing.pageNum && this._isPageVisible(existing.pageNum, data.focusedPage))) {
        this._updatePage(existing.pageNum, existing, true);
        if (!this._isReusablePage(existing)) {
          data.reusablePages.push(existing);
        }
      }
    }
  };
  /**
   * @param {?} obj
   * @return {?}
   */
  editor.prototype._isReusablePage = function(obj) {
    var data = this._data;
    /** @type {number} */
    var i = 0;
    for (;i < data.reusablePages.length;i++) {
      if (obj == data.reusablePages[i]) {
        return true;
      }
    }
    return false;
  };
  /**
   * @param {?} page
   * @param {Error} obj
   * @param {boolean} dataAndEvents
   * @return {undefined}
   */
  editor.prototype._updatePage = function(page, obj, dataAndEvents) {
    var jQuery = this;
    var data = this._data;
    var layer = obj.$el;
    if (null === page) {
      this._updatePageX(obj, -1E3);
    } else {
      var pdataOld = this._getPageOffsetLeft(page);
      if (dataAndEvents && page != obj.pageNum) {
        layer.removeClass("animated-page");
        this._updatePageX(obj, this._getPageOffsetLeft(page, data.prevFocusedPage));
        setTimeout(function() {
          layer.addClass("animated-page");
          jQuery._updatePageX(obj, pdataOld);
        }, 0);
      } else {
        if (dataAndEvents && data.done) {
          layer.addClass("animated-page");
        } else {
          layer.removeClass("animated-page");
        }
        this._updatePageX(obj, pdataOld);
      }
      if (-1 != $.inArray(page, data.focusedView)) {
        layer.addClass("focused-page");
      } else {
        layer.removeClass("focused-page");
      }
      var pages = data.$flipbook.turn("view", page, true);
      layer.removeClass("left-page right-page single-page");
      if (2 == pages.length) {
        if (pages[0] == page) {
          layer.addClass("left-page");
        } else {
          layer.addClass("right-page");
        }
      } else {
        layer.addClass("single-page");
      }
      if (page != obj.pageNum) {
        obj.pageNum = page;
        layer.attr("page", page);
        this._trigger("refreshPicture", page, layer.find(".page-img"));
      }
    }
  };
  /**
   * @param {Object} element
   * @param {number} value
   * @return {undefined}
   */
  editor.prototype._updatePageX = function(element, value) {
    /** @type {number} */
    element.x = value;
    element.$el.css(self.addCssWithPrefix({
      "@transform" : "translate3d(" + value + "px, 0px, 0px)"
    }));
  };
  /**
   * @param {number} page
   * @param {number} value
   * @return {?}
   */
  editor.prototype._getPageOffsetLeft = function(page, value) {
    var maxX;
    var factors;
    var data = this._data;
    /** @type {boolean} */
    var isArr = "single" == data.$flipbook.turn("display");
    if (value = value || data.focusedPage, isArr) {
      return data.scrollerWidth / 2 - data.pageWidth / 2 + (page - value) * (data.pageWidth + data.pageMargin) + data.offsetX;
    }
    var tmp;
    var x;
    var fn = data.$flipbook.turn("view", value, true);
    var xs = value == page ? fn : data.$flipbook.turn("view", page, true);
    /** @type {number} */
    var url = data.scrollerWidth / 2 - fn.length * data.pageWidth / 2;
    if (page >= value) {
      tmp = fn[fn.length - 1];
      /** @type {number} */
      x = xs[0] - 1;
      maxX = tmp;
      for (;x >= maxX;) {
        factors = data.$flipbook.turn("view", maxX, true);
        url += factors.length * data.pageWidth + data.pageMargin;
        maxX = factors[factors.length - 1] + 1;
      }
      return page == xs[0] ? url + data.offsetX : url + data.pageWidth + data.offsetX;
    }
    /** @type {number} */
    tmp = fn[0] - 1;
    x = xs[xs.length - 1];
    /** @type {number} */
    maxX = tmp;
    for (;maxX >= x;) {
      factors = data.$flipbook.turn("view", maxX, true);
      url -= factors.length * data.pageWidth + data.pageMargin;
      /** @type {number} */
      maxX = factors[0] - 1;
    }
    return page == xs[0] ? url + data.offsetX : url + data.pageWidth + data.offsetX;
  };
  /**
   * @param {number} page
   * @return {?}
   */
  editor.prototype._isPageVisible = function(page) {
    var data = this._data;
    if (null === page || (1 > page || page > data.totalPages)) {
      return false;
    }
    var method = data.focusedPage;
    var pages = this._getPageOffsetLeft(page);
    return page > method ? pages < data.scrollerWidth : pages + data.pageWidth > 0;
  };
  /**
   * @return {?}
   */
  editor.prototype._reusablePage = function() {
    return this._data.reusablePages.length > 2 ? this._data.reusablePages.shift() : null;
  };
  /**
   * @return {undefined}
   */
  editor.prototype._setValues = function() {
    var data = this._data;
    if (!data.disabled) {
      var screen = data.$flipbook.turn("size");
      /** @type {number} */
      screen.width = screen.width / data.$flipbook.turn("view").length;
      data.scrollerWidth = data.$container.width();
      data.pageHeight = data.$container.height();
      /** @type {number} */
      data.pageWidth = Math.round(data.pageHeight * (screen.width / screen.height));
      /** @type {number} */
      data.pageMargin = 50;
      data.totalPages = data.$flipbook.turn("pages");
    }
  };
  /**
   * @return {undefined}
   */
  editor.prototype._eventResize = function() {
    this.refresh();
  };
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  editor.prototype._eventDelegation = function(recurring) {
    var data = this._data;
    if (recurring) {
      if (!data.disabled) {
        if (!data.hasListeners) {
          /** @type {boolean} */
          data.hasListeners = true;
          $(window).on("resize", $.proxy(this, "_eventResize"));
          this.$el.on("tap", ".ui-page", $.proxy(this, "_eventTap"));
          this.$el.on("vmousedown", $.proxy(this, "_eventPress"));
        }
      }
    } else {
      /** @type {boolean} */
      data.hasListeners = false;
      $(window).off("resize", this._eventResize);
      this.$el.off("tap", this._eventTap);
      this.$el.off("vmousedown", this._eventPress);
    }
  };
  /**
   * @param {?} dataAndEvents
   * @param {number} elements
   * @return {undefined}
   */
  editor.prototype._eventPageTurned = function(dataAndEvents, elements) {
    var data = this._data;
    if (data.listenToFlipbook) {
      /** @type {number} */
      data.offsetX = 0;
      this._update(elements);
    }
  };
  /**
   * @return {undefined}
   */
  editor.prototype._eventChangeDisplay = function() {
    /** @type {boolean} */
    this._data.forceRefresh = true;
  };
  /**
   * @param {Event} ev
   * @return {undefined}
   */
  editor.prototype._eventTap = function(ev) {
    var page;
    var data = this._data;
    var $page = $(ev.currentTarget);
    if (!data.moving) {
      if (page = $page.attr("page")) {
        data.$flipbook.turn("page", page);
      }
    }
  };
  /**
   * @param {Event} e
   * @return {?}
   */
  editor.prototype._eventPress = function(e) {
    var out = this._data;
    return this.animation && this.animation.stop(), $(document).on("vmousemove", $.proxy(this, "_eventMove")).on("vmouseup", $.proxy(this, "_eventRelease")), out.x1 = e.pageX, out.x2 = out.x1, out.dxDistance = 0, out.timeStamp1 = e.timeStamp, out.timeStamp2 = e.timeStamp, false;
  };
  /**
   * @param {Event} e
   * @return {undefined}
   */
  editor.prototype._eventMove = function(e) {
    var data = this._data;
    /** @type {number} */
    data.offsetX = data.offsetX + data.x2 - data.x1;
    /** @type {boolean} */
    data.done = false;
    this._update(data.focusedPage, true);
    /** @type {boolean} */
    data.done = true;
    /** @type {boolean} */
    data.moving = true;
    data.x1 = data.x2;
    data.x2 = e.pageX;
    data.timeStamp1 = data.timeStamp2;
    data.timeStamp2 = e.timeStamp;
  };
  /**
   * @return {undefined}
   */
  editor.prototype._eventRelease = function() {
    var d = this._data;
    if ($(document).off("vmousemove", this._eventMove).off("vmouseup", this._eventRelease), d.moving) {
      var x = d.offsetX;
      /** @type {number} */
      d.offsetX = 0;
      var right = this._getPageOffsetLeft(1, 1);
      var top = this._getPageOffsetLeft(d.$flipbook.turn("pages"), 1);
      var dx1 = this._getPageOffsetLeft(d.focusedPage, 1);
      /** @type {number} */
      var dx0 = dx1 - x;
      if (right > dx0) {
        /** @type {number} */
        d.offsetX = dx1 - right;
        this._update(d.focusedPage, true);
      } else {
        if (dx0 > top) {
          /** @type {number} */
          d.offsetX = dx1 - top;
          this._update(d.focusedPage, true);
        } else {
          var that = this;
          /** @type {number} */
          var camelKey = d.timeStamp2 - d.timeStamp1;
          /** @type {number} */
          var myDistance = d.x2 - d.x1;
          var data = this._momentum(myDistance, camelKey, dx1 - right - x, dx1 - top - x, 1);
          d.offsetX = x;
          self.animate(this, {
            from : [0],
            to : [data.dist],
            duration : data.time,
            /**
             * @param {Array} opcode
             * @return {undefined}
             */
            frame : function(opcode) {
              d.offsetX = x + opcode[0];
              /** @type {boolean} */
              d.done = false;
              that._update(d.focusedPage, true);
              /** @type {boolean} */
              d.done = true;
            }
          });
        }
      }
    }
    setTimeout(function() {
      /** @type {boolean} */
      d.moving = false;
    }, 1);
  };
  /**
   * @param {number} t
   * @return {?}
   */
  editor.prototype.page = function(t) {
    if (this.animation) {
      this.animation.stop();
    }
    var data = this._data;
    return data.offsetX = 0, this._update(t), data.forceRefresh = false, this.$el;
  };
  /**
   * @return {?}
   */
  editor.prototype.refresh = function() {
    var data = this._data;
    return data.done = false, this._setValues(), this._update(data.focusedPage || data.$flipbook.turn("page"), true), data.done = true, data.forceRefresh = false, this.$el;
  };
  /**
   * @param {boolean} recurring
   * @return {?}
   */
  editor.prototype.disable = function(recurring) {
    var data = this._data;
    return data.disabled = recurring === true, data.disabled ? this._eventDelegation(false) : this._eventDelegation(true), this.$el;
  };
  /**
   * @param {string} value
   * @return {undefined}
   */
  editor.prototype.listenToFlipbook = function(value) {
    /** @type {string} */
    this._data.listenToFlipbook = value;
  };
  /**
   * @param {number} dist
   * @param {number} time
   * @param {number} maxDistUpper
   * @param {number} maxDistLower
   * @return {?}
   */
  editor.prototype._momentum = function(dist, time, maxDistUpper, maxDistLower) {
    /** @type {number} */
    var friction = 0.002;
    /** @type {number} */
    var speed = Math.min(Math.abs(dist) / time, 1.5);
    /** @type {number} */
    var newDist = speed * speed / (2 * friction);
    return newDist *= 0 > dist ? -1 : 1, dist > 0 && newDist > maxDistUpper ? (newDist = maxDistUpper, speed = speed * maxDistUpper / newDist) : 0 > dist && (maxDistLower > newDist && (newDist = maxDistLower, speed = speed * maxDistLower / newDist)), {
      dist : newDist,
      time : Math.round(speed / friction)
    };
  };
  self.widgetFactory("miniatures", editor);
  var a = self.UIComponent(function(options) {
    var that = this._data;
    return that.options = $.extend({
      selector : ".show-hint",
      className : "ui-tooltip",
      positions : "bottom,top,left,right"
    }, options), this._eventDelegation(true), self.addDelegateList(options.delegate, this.$el), this.$el;
  });
  /**
   * @param {boolean} recurring
   * @return {undefined}
   */
  a.prototype._eventDelegation = function(recurring) {
    if (recurring) {
      this.$el.on("vmouseover", this._data.options.selector, $.proxy(this, "_eventHover"));
      this.$el.on("vmouseout", this._data.options.selector, $.proxy(this, "_eventNoHover"));
    } else {
      this.$el.off("vmouseover", this._eventHover);
      this.$el.off("vmouseout", this._eventNoHover);
    }
  };
  /**
   * @param {Event} ev
   * @return {undefined}
   */
  a.prototype._eventHover = function(ev) {
    this._showHint($(ev.currentTarget));
  };
  /**
   * @param {Event} ev
   * @return {undefined}
   */
  a.prototype._eventNoHover = function(ev) {
    $cTarget = $(ev.currentTarget);
    if ($cTarget.hasClass("has-hint")) {
      this._hideHint($cTarget);
    }
  };
  /**
   * @param {Object} context
   * @return {undefined}
   */
  a.prototype._showHint = function(context) {
    var text = context.attr("title") || context.attr("v-title");
    if (text && "" !== text) {
      var that = this._data;
      var cls = that.options.className;
      if (this._trigger("willShowHint", context) == self.EVENT_PREVENTED) {
        return;
      }
      if (that.$currentTarget) {
        that.$currentTarget.removeClass("has-hint");
        /** @type {null} */
        that.$currentTarget = null;
      }
      if (!that.$tooltip) {
        that.$tooltip = $("<div />", {
          "class" : cls
        });
        that.$tooltip.hide();
        that.$tooltip.appendTo($("body"));
      }
      that.$tooltip.html(text);
      if (!that.isTooltipVisible) {
        that.$tooltip.css({
          visibility : "hidden",
          display : ""
        });
      }
      var dx = that.$tooltip.width() + parseInt(that.$tooltip.css("padding-left"), 10) + parseInt(that.$tooltip.css("padding-right"), 10);
      var padding = that.$tooltip.height() + parseInt(that.$tooltip.css("padding-top"), 10) + parseInt(that.$tooltip.css("padding-bottom"), 10);
      if (!that.isTooltipVisible) {
        that.$tooltip.css({
          display : "none",
          visibility : ""
        });
      }
      var imageData;
      var offset = context.offset();
      var width = context.width();
      var height = context.height();
      var x = $(window).width();
      var n = $(window).height();
      var pos = {
        x : 0,
        y : 0
      };
      var codeSegments = that.options.positions.split(",");
      /** @type {number} */
      var i = 0;
      for (;i < codeSegments.length;i++) {
        switch(codeSegments[i]) {
          case "top":
            /** @type {number} */
            pos.x = offset.left + width / 2 - dx / 2;
            /** @type {number} */
            pos.y = offset.top - padding;
            /** @type {string} */
            imageData = "ui-tooltip-top";
            break;
          case "bottom":
            /** @type {number} */
            pos.x = offset.left + width / 2 - dx / 2;
            pos.y = offset.top + height;
            /** @type {string} */
            imageData = "ui-tooltip-bottom";
            break;
          case "left":
            /** @type {number} */
            pos.x = offset.left - dx;
            /** @type {number} */
            pos.y = offset.top + height / 2 - padding / 2;
            /** @type {string} */
            imageData = "ui-tooltip-left";
            break;
          case "right":
            pos.x = offset.left + width;
            /** @type {number} */
            pos.y = offset.top + height / 2 - padding / 2;
            /** @type {string} */
            imageData = "ui-tooltip-right";
        }
        if (pos.x >= 0 && (pos.x + dx <= x && (pos.y >= 0 && pos.y + padding <= n))) {
          break;
        }
      }
      that.$tooltip.css({
        top : pos.y,
        left : pos.x
      });
      that.$tooltip.show();
      setTimeout(function() {
        that.$tooltip.attr("class", that.options.className + " ui-tooltip-visible " + imageData);
      }, 1);
      context.addClass("has-hint");
      /** @type {boolean} */
      that.isTooltipVisible = true;
      if ("" !== context.attr("title")) {
        context.attr("v-title", text);
        context.removeAttr("title");
      }
      /** @type {Object} */
      that.$currentTarget = context;
      if (that.hideTimeHandler) {
        clearInterval(that.hideTimeHandler);
      }
    }
  };
  /**
   * @param {HTMLElement} $animate
   * @return {undefined}
   */
  a.prototype._hideHint = function($animate) {
    var data = this._data;
    /** @type {number} */
    data.hideTimeHandler = setTimeout(function() {
      /** @type {boolean} */
      data.isTooltipVisible = false;
      /** @type {null} */
      data.$currentTarget = null;
      $animate.removeClass("has-hint");
      data.$tooltip.removeClass("ui-tooltip-visible");
      setTimeout(function() {
        if (!data.isTooltipVisible) {
          data.$tooltip.hide();
        }
      }, 200);
    }, 100);
  };
  /**
   * @return {undefined}
   */
  a.prototype.hide = function() {
    var data = this._data;
    if (data.isTooltipVisible) {
      /** @type {boolean} */
      data.isTooltipVisible = false;
      data.$currentTarget.removeClass("has-hint");
      data.$tooltip.removeClass("ui-tooltip-visible");
      data.$tooltip.hide();
      /** @type {null} */
      data.$currentTarget = null;
    }
  };
  /**
   * @param {number} options
   * @return {?}
   */
  a.prototype.options = function(options) {
    return void 0 === options ? this._data.options : (this._data.options = $.extend(this._data.options, options), this.$el);
  };
  self.widgetFactory("tooltips", a);
  var instance = self.UIComponent(function(options) {
    var data = this._data;
    /** @type {Array} */
    data.$items = [];
    /** @type {null} */
    data.selectedItem = null;
    data.options = $.extend({
      itemCount : 0
    }, options);
    self.addDelegateList(options.delegate, this.$el);
    this._createDom();
    this._eventDelegation();
    this._addItems();
  });
  /**
   * @return {undefined}
   */
  instance.prototype._createDom = function() {
    this.$el.addClass("ui-menu");
    this.$el.html('<div class="ui-menu-wrapper"></div>');
  };
  /**
   * @return {undefined}
   */
  instance.prototype._eventDelegation = function() {
    this.$el.on("vmousedown", $.proxy(this, "_vmousedown"));
    this.$el.on("vmouseover", ".ui-menu-item", $.proxy(this, "_vmouseoverItem"));
    this.$el.on("vmouseout", ".ui-menu-item", $.proxy(this, "_vmouseoutItem"));
    this.$el.on("tap", ".ui-menu-item", $.proxy(this, "_tapItem"));
  };
  /**
   * @return {undefined}
   */
  instance.prototype._addItems = function() {
    var data = this._data;
    /** @type {number} */
    var originalEvent = 0;
    for (;originalEvent < data.options.itemCount;originalEvent++) {
      this._trigger("itemRequested", originalEvent);
    }
  };
  /**
   * @param {?} value
   * @return {undefined}
   */
  instance.prototype.addTextItem = function(value) {
    var container = this.$el.find(".ui-menu-wrapper");
    $item = $("<div />", {
      "class" : "ui-menu-item",
      item : this._data.$items.length
    });
    $("<div />", {
      "class" : "ui-menu-item-desc"
    }).html(value).appendTo($item);
    $item.appendTo(container);
    this._data.$items.push($item);
  };
  /**
   * @param {?} event
   * @return {undefined}
   */
  instance.prototype._vmousedown = function(event) {
    event.stopPropagation();
  };
  /**
   * @param {Event} ev
   * @return {undefined}
   */
  instance.prototype._vmouseoverItem = function(ev) {
    $(ev.currentTarget).addClass("ui-menu-item-hover");
  };
  /**
   * @param {Event} ev
   * @return {undefined}
   */
  instance.prototype._vmouseoutItem = function(ev) {
    $(ev.currentTarget).removeClass("ui-menu-item-hover");
  };
  /**
   * @param {Event} ev
   * @return {undefined}
   */
  instance.prototype._tapItem = function(ev) {
    var cDigit = $(ev.currentTarget).attr("item");
    this.selectItem(parseInt(cDigit, 10));
  };
  /**
   * @param {(Object|boolean|number|string)} height
   * @return {?}
   */
  instance.prototype._getContentSize = function(height) {
    var $cont = this.$el.find(".ui-menu-wrapper");
    this.$el.css({
      top : "0px",
      left : "-10000px",
      display : "block"
    });
    var end = {
      width : $cont.width(),
      height : $cont.height()
    };
    return height || this.$el.hide(), end;
  };
  /**
   * @param {string} index
   * @param {boolean} itemNode
   * @return {?}
   */
  instance.prototype.selectItem = function(index, itemNode) {
    var data = this._data;
    return 0 > index || index >= data.$items.length ? false : itemNode || this._trigger("itemSelected", index) != self.EVENT_PREVENTED ? (null !== data.selectedItem && data.$items[data.selectedItem].removeClass("ui-selected-item"), data.selectedItem = index, data.$items[index].addClass("ui-selected-item"), this.$el) : false;
  };
  /**
   * @return {?}
   */
  instance.prototype.clearSelection = function() {
    var data = this._data;
    return null !== data.selectedItem && data.$items[data.selectedItem].removeClass("ui-selected-item"), data.selectedItem = null, this.$el;
  };
  /**
   * @param {Object} $slide
   * @return {?}
   */
  instance.prototype.showRelativeTo = function($slide) {
    var data = this._data;
    if (0 === data.$items.length) {
      this._addItems();
    }
    var wsize = this._getContentSize();
    var camera = $slide.offset();
    return this.show({
      left : camera.left + $slide.width() / 2 - wsize.width / 2,
      top : camera.top - wsize.height
    }), this.$el;
  };
  /**
   * @param {Object} options
   * @return {?}
   */
  instance.prototype.show = function(options) {
    var self = this;
    return this.$el.css({
      left : "left" in options ? options.left : "auto",
      top : "top" in options ? options.top : "auto",
      right : "right" in options ? options.right : "auto",
      bottom : "bottom" in options ? options.bottom : "auto",
      display : "block"
    }), setTimeout(function() {
      self.$el.addClass("ui-menu-visible");
    }, 1), $(document).one("vmousedown", $.proxy(this, "hide")), this.$el;
  };
  /**
   * @return {?}
   */
  instance.prototype.hide = function() {
    var field = this;
    return $(document).off("vmousedown", this.hide), this.$el.removeClass("ui-menu-visible"), setTimeout(function() {
      if (!field.$el.hasClass("ui-menu-visible")) {
        field.$el.hide();
      }
    }, 500), this.$el;
  };
  /**
   * @return {?}
   */
  instance.prototype.clear = function() {
    var data = this._data;
    return data.$items = [], data.selectedItem = null, this.$el.find(".ui-menu-wrapper").children().remove(), this.$el;
  };
  /**
   * @param {number} options
   * @return {?}
   */
  instance.prototype.options = function(options) {
    var that = this._data;
    return void 0 === options ? that.options : (that.options = $.extend(that.options, options), void 0);
  };
  self.widgetFactory("menu", instance);
}(jQuery);



(function(global) {
  /**
   * @param {Array} array
   * @param {number} item
   * @return {?}
   */
  function index(array, item) {
    var i = array.length;
    for (;i--;) {
      if (array[i] === item) {
        return i;
      }
    }
    return-1;
  }
  /**
   * @param {Array} a1
   * @param {Array} a2
   * @return {?}
   */
  function compareArray(a1, a2) {
    if (a1.length != a2.length) {
      return false;
    }
    /** @type {number} */
    var i = 0;
    for (;i < a1.length;i++) {
      if (a1[i] !== a2[i]) {
        return false;
      }
    }
    return true;
  }
  /**
   * @param {Event} event
   * @return {undefined}
   */
  function updateModifierKey(event) {
    for (k in _mods) {
      _mods[k] = event[modifierMap[k]];
    }
  }
  /**
   * @param {Event} event
   * @return {undefined}
   */
  function dispatch(event) {
    var key;
    var handler;
    var k;
    var i;
    var modifiersMatch;
    var scope;
    key = event.keyCode;
    if (index(_downKeys, key) == -1) {
      _downKeys.push(key);
    }
    if (key == 93 || key == 224) {
      /** @type {number} */
      key = 91;
    }
    if (key in _mods) {
      /** @type {boolean} */
      _mods[key] = true;
      for (k in _MODIFIERS) {
        if (_MODIFIERS[k] == key) {
          /** @type {boolean} */
          assignKey[k] = true;
        }
      }
      return;
    }
    updateModifierKey(event);
    if (!assignKey.filter.call(this, event)) {
      return;
    }
    if (!(key in _handlers)) {
      return;
    }
    scope = getScope();
    /** @type {number} */
    i = 0;
    for (;i < _handlers[key].length;i++) {
      handler = _handlers[key][i];
      if (handler.scope == scope || handler.scope == "all") {
        /** @type {boolean} */
        modifiersMatch = handler.mods.length > 0;
        for (k in _mods) {
          if (!_mods[k] && index(handler.mods, +k) > -1 || _mods[k] && index(handler.mods, +k) == -1) {
            /** @type {boolean} */
            modifiersMatch = false;
          }
        }
        if (handler.mods.length == 0 && (!_mods[16] && (!_mods[18] && (!_mods[17] && !_mods[91]))) || modifiersMatch) {
          if (handler.method(event, handler) === false) {
            if (event.preventDefault) {
              event.preventDefault();
            } else {
              /** @type {boolean} */
              event.returnValue = false;
            }
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            if (event.cancelBubble) {
              /** @type {boolean} */
              event.cancelBubble = true;
            }
          }
        }
      }
    }
  }
  /**
   * @param {?} event
   * @return {undefined}
   */
  function clearModifier(event) {
    var key = event.keyCode;
    var k;
    var i = index(_downKeys, key);
    if (i >= 0) {
      _downKeys.splice(i, 1);
    }
    if (key == 93 || key == 224) {
      /** @type {number} */
      key = 91;
    }
    if (key in _mods) {
      /** @type {boolean} */
      _mods[key] = false;
      for (k in _MODIFIERS) {
        if (_MODIFIERS[k] == key) {
          /** @type {boolean} */
          assignKey[k] = false;
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function resetModifiers() {
    for (k in _mods) {
      /** @type {boolean} */
      _mods[k] = false;
    }
    for (k in _MODIFIERS) {
      /** @type {boolean} */
      assignKey[k] = false;
    }
  }
  /**
   * @param {(Array|string)} key
   * @param {string} scope
   * @param {string} method
   * @return {undefined}
   */
  function assignKey(key, scope, method) {
    var keys;
    var mods;
    keys = getKeys(key);
    if (method === undefined) {
      /** @type {string} */
      method = scope;
      /** @type {string} */
      scope = "all";
    }
    /** @type {number} */
    var i = 0;
    for (;i < keys.length;i++) {
      /** @type {Array} */
      mods = [];
      key = keys[i].split("+");
      if (key.length > 1) {
        mods = getMods(key);
        /** @type {Array} */
        key = [key[key.length - 1]];
      }
      key = key[0];
      key = code(key);
      if (!(key in _handlers)) {
        /** @type {Array} */
        _handlers[key] = [];
      }
      _handlers[key].push({
        shortcut : keys[i],
        scope : scope,
        method : method,
        key : keys[i],
        mods : mods
      });
    }
  }
  /**
   * @param {string} key
   * @param {Function} scope
   * @return {undefined}
   */
  function unbindKey(key, scope) {
    var list;
    var keys;
    /** @type {Array} */
    var mods = [];
    var i;
    var j;
    var obj;
    list = getKeys(key);
    /** @type {number} */
    j = 0;
    for (;j < list.length;j++) {
      keys = list[j].split("+");
      if (keys.length > 1) {
        mods = getMods(keys);
        key = keys[keys.length - 1];
      }
      key = code(key);
      if (scope === undefined) {
        scope = getScope();
      }
      if (!_handlers[key]) {
        return;
      }
      /** @type {number} */
      i = 0;
      for (;i < _handlers[key].length;i++) {
        obj = _handlers[key][i];
        if (obj.scope === scope && compareArray(obj.mods, mods)) {
          _handlers[key][i] = {};
        }
      }
    }
  }
  /**
   * @param {(number|string)} keyCode
   * @return {?}
   */
  function isPressed(keyCode) {
    if (typeof keyCode == "string") {
      keyCode = code(keyCode);
    }
    return index(_downKeys, keyCode) != -1;
  }
  /**
   * @return {?}
   */
  function getPressedKeyCodes() {
    return _downKeys.slice(0);
  }
  /**
   * @param {Event} event
   * @return {?}
   */
  function filter(event) {
    var tagName = (event.target || event.srcElement).tagName;
    return!(tagName == "INPUT" || (tagName == "SELECT" || tagName == "TEXTAREA"));
  }
  /**
   * @param {string} scope
   * @return {undefined}
   */
  function setScope(scope) {
    _scope = scope || "all";
  }
  /**
   * @return {?}
   */
  function getScope() {
    return _scope || "all";
  }
  /**
   * @param {?} scope
   * @return {undefined}
   */
  function deleteScope(scope) {
    var key;
    var handlers;
    var i;
    for (key in _handlers) {
      handlers = _handlers[key];
      /** @type {number} */
      i = 0;
      for (;i < handlers.length;) {
        if (handlers[i].scope === scope) {
          handlers.splice(i, 1);
        } else {
          i++;
        }
      }
    }
  }
  /**
   * @param {string} o
   * @return {?}
   */
  function getKeys(o) {
    var keys;
    o = o.replace(/\s/g, "");
    keys = o.split(",");
    if (keys[keys.length - 1] == "") {
      keys[keys.length - 2] += ",";
    }
    return keys;
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function getMods(key) {
    var mods = key.slice(0, key.length - 1);
    /** @type {number} */
    var mi = 0;
    for (;mi < mods.length;mi++) {
      mods[mi] = _MODIFIERS[mods[mi]];
    }
    return mods;
  }
  /**
   * @param {HTMLElement} object
   * @param {string} event
   * @param {Function} method
   * @return {undefined}
   */
  function addEvent(object, event, method) {
    if (object.addEventListener) {
      object.addEventListener(event, method, false);
    } else {
      if (object.attachEvent) {
        object.attachEvent("on" + event, function() {
          method(window.event);
        });
      }
    }
  }
  /**
   * @return {?}
   */
  function noConflict() {
    var k = global.key;
    global.key = previousKey;
    return k;
  }
  var k;
  var _handlers = {};
  var _mods = {
    16 : false,
    18 : false,
    17 : false,
    91 : false
  };
  /** @type {string} */
  var _scope = "all";
  var _MODIFIERS = {
    "\u21e7" : 16,
    shift : 16,
    "\u2325" : 18,
    alt : 18,
    option : 18,
    "\u2303" : 17,
    ctrl : 17,
    control : 17,
    "\u2318" : 91,
    command : 91
  };
  var _MAP = {
    backspace : 8,
    tab : 9,
    clear : 12,
    enter : 13,
    "return" : 13,
    esc : 27,
    escape : 27,
    space : 32,
    left : 37,
    up : 38,
    right : 39,
    down : 40,
    del : 46,
    "delete" : 46,
    home : 36,
    end : 35,
    pageup : 33,
    pagedown : 34,
    "," : 188,
    "." : 190,
    "/" : 191,
    "`" : 192,
    "-" : 189,
    "=" : 187,
    ";" : 186,
    "'" : 222,
    "[" : 219,
    "]" : 221,
    "\\" : 220
  };
  /**
   * @param {string} key
   * @return {?}
   */
  var code = function(key) {
    return _MAP[key] || key.toUpperCase().charCodeAt(0);
  };
  /** @type {Array} */
  var _downKeys = [];
  /** @type {number} */
  k = 1;
  for (;k < 20;k++) {
    _MAP["f" + k] = 111 + k;
  }
  var modifierMap = {
    16 : "shiftKey",
    18 : "altKey",
    17 : "ctrlKey",
    91 : "metaKey"
  };
  for (k in _MODIFIERS) {
    /** @type {boolean} */
    assignKey[k] = false;
  }
  addEvent(document, "keydown", function(event) {
    dispatch(event);
  });
  addEvent(document, "keyup", clearModifier);
  addEvent(window, "focus", resetModifiers);
  var previousKey = global.key;
  /** @type {function ((Array|string), string, string): undefined} */
  global.key = assignKey;
  /** @type {function (string): undefined} */
  global.key.setScope = setScope;
  /** @type {function (): ?} */
  global.key.getScope = getScope;
  /** @type {function (?): undefined} */
  global.key.deleteScope = deleteScope;
  /** @type {function (Event): ?} */
  global.key.filter = filter;
  /** @type {function ((number|string)): ?} */
  global.key.isPressed = isPressed;
  /** @type {function (): ?} */
  global.key.getPressedKeyCodes = getPressedKeyCodes;
  /** @type {function (): ?} */
  global.key.noConflict = noConflict;
  /** @type {function (string, Function): undefined} */
  global.key.unbind = unbindKey;
  if (typeof module !== "undefined") {
    /** @type {function ((Array|string), string, string): undefined} */
    module.exports = assignKey;
  }
})(this);
/**
 * @param {Object} req
 * @param {number} page
 * @return {?}
 */
function getViewNumber(req, page) {
  return parseInt((page || req.turn("page")) / 2 + 1, 10);
}
/** @type {boolean} */
var isUserInteracting = false;
/**
 * @param {Object} $superbook
 * @return {undefined}
 */
function bookSlider($superbook) {
  /** @type {boolean} */
  var offset = $superbook.turn("display") == "double" ? true : false;
  var Infinity = $superbook.turn("pages");
  var maxY = offset ? Infinity / 2 + 1 : Infinity;
  $("#page-slider").slider({
    min : 1,
    max : maxY,
    value : offset ? getViewNumber($superbook) : $superbook.turn("page")
  });
  $("#page-slider").on("changeValue", function(types, dataAndEvents) {
    if (!isUserInteracting) {
      var isFunction = $(this).slider("value");
      /** @type {number} */
      var page = dataAndEvents;
      if (offset) {
        /** @type {number} */
        var _page = dataAndEvents * 2 - 2;
        /** @type {number} */
        var hash = dataAndEvents * 2 - 1;
        if (isFunction > dataAndEvents) {
          /** @type {number} */
          page = hash;
        } else {
          /** @type {number} */
          page = _page;
        }
      }
      $superbook.unbind("turning", handler);
      if ($.inArray(page, $("#superbook").turn("view")) != -1) {
        types.preventDefault();
        return;
      }
      if ($("#superbook").turn("page", page) === false) {
        types.preventDefault();
      }
      $superbook.bind("turning", handler);
    }
    /** @type {boolean} */
    isUserInteracting = false;
  });
  /**
   * @param {?} token
   * @param {number} round
   * @param {?} execAsap
   * @return {undefined}
   */
  var handler = function(token, round, execAsap) {
    /** @type {boolean} */
    isUserInteracting = true;
    var currenttime = offset ? parseInt((round || $superbook.turn("page")) / 2 + 1, 10) : round;
    $("#page-slider").slider("value", currenttime);
  };
  $superbook.bind("turning", handler);
}
/** @type {boolean} */
var pushToStateFlag = true;
$(document).ready(function() {
  /**
   * @param {Object} el
   * @return {undefined}
   */
  function click(el) {
    el.contents().unbind("tap doubletap mouseover vmouseover mouseout vmouseout pinch mouseup vmouseup mousemove vmousemove swipe mousedown vmousedown drag touchstart touchmove touchend dragstart dragend dragover");
    if (Turn.isTouchDevice) {
      el.contents().bind("vmousedown vmouseover vmouseout vmouseup vmousemove", function(item) {
        item.pageX += el.offset().left;
        item.pageY += el.offset().top;
        $superbook.trigger(item);
      });
    } else {
      el.contents().bind("mouseover vmouseover mouseout vmouseout mouseup vmouseup mousemove vmousemove", function(item) {
        item.pageX += el.offset().left;
        item.pageY += el.offset().top;
        $(document).trigger(item);
      });
      el.contents().bind("mousedown vmousedown", function(item) {
        item.pageX += el.offset().left;
        item.pageY += el.offset().top;
        $superbook.trigger(item);
      });
    }
    $(".turnoff", $("iframe").contents()).on("touchend doubletap mouseover vmouseover mouseout vmouseout pinch mouseup vmouseup mousemove vmousemove swipe mousedown vmousedown drag touchstart touchmove dragstart dragend dragover", function(event) {
      event.stopPropagation();
    });
    $("a", $("iframe").contents()).on("touchend doubletap mouseover vmouseover mouseout vmouseout pinch mouseup vmouseup mousemove vmousemove swipe mousedown vmousedown drag touchstart touchmove dragstart dragend dragover", function(dataAndEvents) {
      return false;
    });
    if (Turn.isTouchDevice) {
      $("a.page", $("iframe").contents()).off().on("tap", function(dataAndEvents) {
        var matches = $(this).attr("href");
        $superbook.turn("page", matches);
        return false;
      });
      $("a:not(.page)", $("iframe").contents()).off().on("tap", function(dataAndEvents) {
        var url = $(this).attr("href");
        window.open(url, "_blank");
        return false;
      });
    } else {
      $("a:not(.page)", $("iframe").contents()).off().on(" click", function(dataAndEvents) {
        var url = $(this).attr("href");
        window.open(url, "_blank");
        return false;
      });
      $("a.page", $("iframe").contents()).off().on("click", function(dataAndEvents) {
        var matches = $(this).attr("href");
        $superbook.turn("page", matches);
        return false;
      });
    }
  }
  var $superbook = $("#superbook");
  
  $superbook.turn({
    pageWidth : 1115,
    pageHeight : 1443,
    autoCenter : true,
    responsive : true,
    display : "single",
    animatedAutoCenter : true,
    smartFlip : true,
    autoScaleContent : true,
    swipe : true,
    iframeSupport : true
  });
  $("iframe").each(function(dataAndEvents) {
    /**
     * @return {undefined}
     */
    this.onload = function() {
      click($(this));
    };
  });
  /** @type {(Element|null)} */
  var target = document.querySelector("#superbook");
  /** @type {MutationObserver} */
  var mutationObserver = new MutationObserver(function(failures) {
    failures.forEach(function(record) {
      if (record.type === "childList") {
        if (record.addedNodes && (record.addedNodes.length > 0 && record.addedNodes[0].className === "page-wrapper")) {
          var images = $(record.addedNodes[0]).find("iframe");
          if (images.length > 0) {
            /**
             * @return {undefined}
             */
            images[0].onload = function() {
              click($(this));
            };
          }
        }
      }
    });
  });
  var mutationConfig = {
    attributes : true,
    childList : true,
    characterData : true
  };
  if ($("#superbook").length) {
    mutationObserver.observe(target, mutationConfig);
  }
  if ($superbook.length > 0) {
    document.body.addEventListener("touchmove", function(types) {
      types.preventDefault();
    });
  }
  $superbook.fadeIn("slow");
  var id = $("#bookname").val();
  var s = Cookies.get("" + id);
  var page = $superbook.turn("page");
  var views = $superbook.turn("view");
  $superbook.turn("page", s);
  $superbook.bind("turned", function(dataAndEvents, m1, deepDataAndEvents) {
    Cookies.remove("" + id);
    Cookies.set("" + id, parseInt(m1));
  });
  bookSlider($superbook);
  if (Turn.isTouchDevice) {
    $("body .ui-arrow-next-page").on("tap", function(dataAndEvents) {
      $superbook.turn("next");
    });
    $("body .ui-arrow-previous-page").on("tap", function(dataAndEvents) {
      $superbook.turn("previous");
    });
  } else {
    $(".ui-arrow-next-page").on("click", function(dataAndEvents) {
      $superbook.turn("next");
    });
    $(".ui-arrow-previous-page").on("click", function(dataAndEvents) {
      $superbook.turn("previous");
    });
  }
  key("left, pageup, up", function(e) {
    e.preventDefault(e);
    $superbook.turn("previous");
  });
  key("right, pagedown, down, space", function(e) {
    e.preventDefault(e);
    $superbook.turn("next");
  });
  key("\u2318 + left, \u2318 + pageup, \u2318 + up, ctrl + left, ctrl + pageup, ctrl + up", function(e) {
    e.preventDefault(e);
    $superbook.turn("page", 1);
  });
  key("\u2318 + right, \u2318 + pagedown, \u2318 + down, ctrl + right, ctrl + pagedown, ctrl + down", function(e) {
    e.preventDefault(e);
    $superbook.turn("page", $superbook.turn("pages"));
  });
  /** @type {string} */
  var path = window.location.hash;
  /** @type {boolean} */
  var historyApi = !!(window.history && history.replaceState);
  if (historyApi) {
    if (path === "") {
      if (typeof s !== "undefined") {
        /** @type {string} */
        path = "#" + s;
      } else {
        /** @type {string} */
        path = "#" + 1;
      }
    }
    history.replaceState(null, null, path);
    $superbook.turn("page", path.substring(1));
  }
  $superbook.bind("turning", function(dataAndEvents, stepid, deepDataAndEvents) {
    if (pushToStateFlag) {
      /** @type {string} */
      var shouldBeHash = "/#" + stepid;
      window.history.pushState("", "", shouldBeHash);
    }
    /** @type {boolean} */
    pushToStateFlag = true;
  });
  $(window).on("popstate", function(dataAndEvents) {
    /** @type {string} */
    var raw = window.location.hash;
    /** @type {string} */
    var num = "#" + parseInt($superbook.turn("page"));
    if (raw !== num) {
      /** @type {boolean} */
      pushToStateFlag = false;
      $superbook.turn("page", raw.substring(1));
    }
  });
});
