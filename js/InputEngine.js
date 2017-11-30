InputEngine = Class.extend({
    /**
     * A dictionary mapping ASCII key codes to string values describing
     * the action we want to take when that key is pressed.
     */
    bindings: {},

    /**
     * A dictionary mapping actions that might be taken in our game
     * to a boolean value indicating whether that action is currently being performed.
     */
    actions: {},

    listeners: [],

    init: function() {
    },

    setup: function() {
        this.bind(38, 'up');
        this.bind(37, 'left');
        this.bind(40, 'down');
        this.bind(39, 'right');
        this.bind(32, 'bomb');
        this.bind(18, 'bomb');

        this.bind(90, 'up2');
        this.bind(81, 'left2');
        this.bind(83, 'down2');
        this.bind(68, 'right2');
        this.bind(16, 'bomb2');

        this.bind(13, 'restart');
        this.bind(27, 'escape');
        this.bind(77, 'mute');

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        var arrows = document.getElementById('control-arrows');
        arrows.addEventListener('mousedown', this.onTouchStart);
        arrows.addEventListener('mouseup', this.onTouchEnd);
        arrows.addEventListener('touchstart', this.onTouchStart);
        arrows.addEventListener('touchmove', this.onTouchStart);
        arrows.addEventListener('touchcancel', this.onTouchEnd);
        arrows.addEventListener('touchend', this.onTouchEnd);
        var button = document.getElementById('control-button');
        button.addEventListener('mousedown', this.onTouchStart);
        button.addEventListener('mouseup', this.onTouchEnd);
        button.addEventListener('touchstart', this.onTouchStart);
        button.addEventListener('touchmove', this.onTouchStart);
        button.addEventListener('touchcancel', this.onTouchEnd);
        button.addEventListener('touchend', this.onTouchEnd);
    },

    onTouchStart: function(event) {
      var action;
      if (event.target.id === 'control-arrows') {
        var arrows = event.target;
        var cx = arrows.offsetWidth / 2;
        var cy = arrows.offsetHeight / 2;
        var offsetY = arrows.offsetHeight / 4;

        if (event.layerY < cy - offsetY ) {
          action = 'up';
        } else if (event.layerY > cy + offsetY) {
          action = 'down';
        } else if (event.layerX < cx) {
          action = 'left';
        } else {
          action = 'right';
        }

        if (action) {
            if (this.currentAction !== action) {
              gInputEngine.actions[this.currentAction] = false;
            }
            gInputEngine.actions[action] = true;
            event.preventDefault();
            this.currentAction = action;
        }
      } else if (event.target.id === 'control-button') {
        console.log('Here');
        action = 'bomb';
        gInputEngine.actions[action] = true;
        event.preventDefault();
      }
      return false;
    },

    onTouchEnd: function(event) {
        var action;
        if (event.target.id === 'control-arrows') {
          var arrows = event.target;
          action = this.currentAction;
          if (action) {
              gInputEngine.actions[action] = false;
              var listeners = gInputEngine.listeners[action];
              if (listeners) {
                  for (var i = 0; i < listeners.length; i++) {
                      var listener = listeners[i];
                      listener();
                  }
              }
              event.preventDefault();
          }
        } else if (event.target.id === 'control-button') {
          action = 'bomb';
          gInputEngine.actions[action] = false;
          var listeners = gInputEngine.listeners[action];
          if (listeners) {
              for (var i = 0; i < listeners.length; i++) {
                  var listener = listeners[i];
                  listener();
              }
          }
          event.preventDefault();
        }

        return false;
    },

    onKeyDown: function(event) {
        var action = gInputEngine.bindings[event.keyCode];
        if (action) {
            gInputEngine.actions[action] = true;
            event.preventDefault();
        }
        return false;
    },

    onKeyUp: function(event) {
        var action = gInputEngine.bindings[event.keyCode];
        if (action) {
            gInputEngine.actions[action] = false;

            var listeners = gInputEngine.listeners[action];
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    var listener = listeners[i];
                    listener();
                }
            }
            event.preventDefault();
        }
        return false;
    },

    /**
     * The bind function takes an ASCII keycode and a string representing
     * the action to take when that key is pressed.
     */
    bind: function(key, action) {
        this.bindings[key] = action;
    },

    addListener: function(action, listener) {
        this.listeners[action] = this.listeners[action] || new Array();
        this.listeners[action].push(listener);
    },

    removeAllListeners: function() {
        this.listeners = [];
    }
});

gInputEngine = new InputEngine();
