(function() {
  var Aura, Ball, Core, auraOpacity, auraSize, ballOpacity, ballSizeRange, ballSpeedRange, colorPalettes, coreSize, h, h2, isSameRgb, n, rgbToStr, sizeRatio, speed, stepSize, w, w2;
  colorPalettes = [{
    bg: [100, 160, 255],
    core: [253, 150, 27],
    aura: [255, 255, 200],
    flames: [
      [237, 196, 4],
      [242, 201, 119],
      [232, 191, 160]
    ]
  }, {
    bg: [64, 105, 176],
    core: [255, 255, 255],
    aura: [255, 255, 153],
    flames: [
      [250, 205, 40],
      [252, 200, 43],
      [254, 205, 40]
    ]
  }, {
    bg: [93, 65, 87],
    core: [255, 255, 255],
    aura: [20, 146, 196],
    flames: [
      [131, 215, 247],
      [136, 218, 252],
      [141, 220, 255]
    ]
  }];
  n = 1000;
  speed = 0.9;
  coreSize = 60;
  auraSize = 80;
  auraOpacity = 0.8;
  ballSizeRange = [3, 18];
  ballSpeedRange = [0.8, 3.2];
  ballOpacity = 0.2;
  stepSize = 0.0005;
  sizeRatio = coreSize / auraSize;
  w = 2.7 * coreSize;
  h = 2.7 * coreSize;
  w2 = ~~(0.5 * w);
  h2 = ~~(0.5 * h);
  rgbToStr = function(rgb) {
    switch (rgb.length) {
      case 3:
        return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
      case 4:
        return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + rgb[3] + ")";
    }
  };
  isSameRgb = function(rgb1, rgb2) {
    return rgb1[0] === rgb2[0] && rgb1[1] === rgb2[1] && rgb1[2] === rgb2[2];
  };
  Ball = (function() {
    function Ball(palette) {
      var angle, rgba, scale;
      this.stepSize = stepSize;
      this.opacityMax = ballOpacity;
      this.rMax = random(ballSizeRange[0], ballSizeRange[1]);
      this.r = this.rMax;
      this.bounds = {
        x: [this.r, w - this.r],
        y: [this.r, h - this.r]
      };
      this.x = random(this.bounds.x[0], this.bounds.x[1]);
      this.y = random(this.bounds.y[0], this.bounds.y[1]);
      this.c = random();
      scale = random(ballSpeedRange[0], ballSpeedRange[1]);
      angle = random(0, 2 * PI);
      this.vx = cos(angle) * speed * scale;
      this.vy = sin(angle) * speed * scale;
      this.step = this.stepSize;
      this.palette = palette;
      rgba = [palette.bg[0], palette.bg[1], palette.bg[2], this.opacityMax];
      this.rgba = rgba.slice();
      this.rgbaStart = rgba.slice();
      this.color = rgbToStr(rgba);
      this.inds = (function(_this) {
        return function() {
          var i, l, _i, _results;
          l = _this.palette.flames.length;
          _results = [];
          for (i = _i = 1; 1 <= l ? _i <= l : _i >= l; i = 1 <= l ? ++_i : --_i) {
            _results.push((l - i) / l);
          }
          return _results;
        };
      })(this)();
    }
    Ball.prototype.update = function() {
      if (this.step > 0) {
        if (this.rgba[3] < this.opacityMax) {
          this.rgba[3] += this.step;
          if (this.rgba[3] > this.opacityMax) {
            this.rgba[3] = this.opacityMax;
            this.step = 0;
          }
          this.updateColor();
        }
      } else if (this.step < 0) {
        if (this.rgba[3] > 0) {
          this.rgba[3] += this.step;
          if (this.rgba[3] <= 0) {
            this.rgba = this.rgbaStart.slice();
            this.step = 0;
          }
        }
        this.updateColor();
      }
      if (this.x < this.bounds.x[0] || this.x > this.bounds.x[1]) {
        this.vx *= -1;
      }
      if (this.y < this.bounds.y[0] || this.y > this.bounds.y[1]) {
        this.vy *= -1;
      }
      this.x += this.vx;
      return this.y += this.vy;
    };
    Ball.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, TWO_PI);
      ctx.fillStyle = this.color;
      return ctx.fill();
    };
    Ball.prototype.renderBackground = function() {
      if (isSameRgb(this.rgba, this.rgbaStart)) {
        return;
      }
      return this.step = -abs(this.stepSize);
    };
    Ball.prototype.renderFlame = function() {
      var i, rgb, _i, _len, _ref;
      _ref = this.palette.flames;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        rgb = _ref[i];
        if (this.c > this.inds[i]) {
          if (!isSameRgb(this.rgba, rgb)) {
            this.step = +abs(this.stepSize);
            this.rgba = rgb.slice(0, 3).concat(0);
            this.updateColor();
          }
          return;
        }
      }
    };
    Ball.prototype.updateColor = function() {
      return this.color = rgbToStr(this.rgba);
    };
    return Ball;
  })();
  Core = (function() {
    function Core(palette) {
      this.palette = palette;
      this.colors = {
        core: rgbToStr(palette.core),
        edge: rgbToStr(palette.flames[0])
      };
      this.r = coreSize;
      this.x = w2;
      this.y = h2;
    }
    Core.prototype.draw = function() {
      var grd;
      grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grd.addColorStop(0, this.colors.core);
      grd.addColorStop(1, this.colors.edge);
      ctx.beginPath();
      ctx.arc(w2, h2, coreSize, 0, TWO_PI);
      ctx.fillStyle = grd;
      return ctx.fill();
    };
    return Core;
  })();
  Aura = (function() {
    function Aura(palette) {
      this.palette = palette;
      this.colors = {
        core: rgbToStr(palette.core.slice(0, 3).concat(auraOpacity)),
        auraInner: rgbToStr(palette.aura.slice(0, 3).concat(auraOpacity)),
        auraOuter: rgbToStr(palette.aura.slice(0, 3).concat(0))
      };
      this.r = coreSize;
      this.x = w2;
      this.y = h2;
      this.gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, auraSize);
      this.gradient.addColorStop(0, rgbToStr(palette.core.slice(0, 3).concat(0)));
      this.gradient.addColorStop(0.2, rgbToStr(palette.core.slice(0, 3).concat(0)));
      this.gradient.addColorStop(sizeRatio, this.colors.auraInner);
      this.gradient.addColorStop(1, this.colors.auraOuter);
    }
    Aura.prototype.draw = function() {
      if (auraOpacity === 0) {
        return;
      }
      ctx.beginPath();
      ctx.arc(w2, h2, auraSize, 0, TWO_PI);
      ctx.fillStyle = this.gradient;
      return ctx.fill();
    };
    return Aura;
  })();
  this.ctx = Sketch.create({
    autoresize: false,
    autopause: false,
    setup: function() {
      var changeColor, nextPalette;
      this.canvas.width = w;
      this.canvas.height = h;
      this.canvas.style['margin'] = "-" + h2 + "px 0 0 -" + w2 + "px";
      nextPalette = (function() {
        var i, l;
        i = 0;
        l = colorPalettes.length;
        return function() {
          return colorPalettes[i++ % l];
        };
      })();
      changeColor = (function(_this) {
        return function() {
          var bgColor, i, palette;
          _this.clear();
          palette = nextPalette();
          bgColor = rgbToStr(palette.bg);
          document.body.style['background'] = bgColor;
          _this.canvas.style['background'] = bgColor;
          _this.core = new Core(palette);
          _this.aura = new Aura(palette);
          return _this.balls = (function() {
            var _i, _results;
            _results = [];
            for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
              _results.push(new Ball(palette));
            }
            return _results;
          })();
        };
      })(this);
      document.onclick = changeColor;
      return changeColor();
    },
    update: function() {
      var ball, _i, _len, _ref, _results;
      _ref = this.balls;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ball = _ref[_i];
        ball.update();
        if (pow(this.core.x - ball.x, 2) + pow(this.core.y - ball.y, 2) <= pow(this.core.r + ball.r, 2)) {
          _results.push(ball.renderFlame());
        } else {
          _results.push(ball.renderBackground());
        }
      }
      return _results;
    },
    draw: function() {
      var b, _i, _len, _ref;
      this.core.draw();
      _ref = this.balls;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        b.draw();
      }
      return this.aura.draw();
    }
  });
}).call(this);