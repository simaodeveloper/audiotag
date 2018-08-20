class Utils {
    static isNumber(n) {
        return Number(n) === n;
    }

    static isInt(n) {
        return Utils.isNumber(n) && n % 1 === 0;
    }

    static isFloat(n) {
        return Utils.isNumber(n) && n % 1 !== 0;
    }

    static convertNumberToFloat(n) {
        return Utils.isInt(n) && (n / 100);
    }

    static str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }
}

class Emmiter {
    constructor() {
        this.store = {};
    }

    on(event, listener) {
        // If event Store don't exists, create it!
        if (!this.store[event]) {
            this.store[event] = new Set([listener]);
        } else {
            this.store[event].add(listener);
        }
    }

    off(event, listener) {
        // Verify if Event Store was created
        if (!this.store[event]) {
            throw new Error('Please verify if this listener was created before!');
        }

        // Erase all listener from event informed
        if (!listener) {
            this.store[event].clear();
        }

        // Verify if listener exists in Event Store
        if (!this.store[event].has(listener)) {
            throw new Error('Please verify if this listener was created before!');
        }

        return this.store[event].delete(listener);
    }

    once(event, listener) {
        // Wrapper listener to be called once
        const setListenerOnce = () => {
            const callListener = (...args) => {
                listener.call(null, ...args);
                this.off(event, callListener);
            };

            return callListener;
        }

        this.on(event, setListenerOnce());
    }

    dispatch(event, ...args) {
        if (event in this.store) {
            this.store[event].forEach(listener => listener.call(null, ...args));
        } else {
            throw new Error('Please insert a valid event!');
        }

    }
}

class AudioTag {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.isMuted = false;

    this.addMultipleExtension([
        { 
            name: 'events',
            extension: new Emmiter,
        }
    ]);

    this.addEventsModifiers('timeupdate', ($event) => {
        const currentTime = this.element.currentTime;
        const seconds = Math.floor(currentTime % 60);
        const minutes = Math.floor(currentTime / 60);
        const hours = Math.floor(currentTime / 3600);

        return {
            $event,
            seconds,
            minutes,
            hours,
            formated(format) {
                let time;
                switch (format) {
                    case 'HH:MM':
                        time = Utils.str_pad_left(hours, "0", 2) + ":" + Utils.str_pad_left(minutes, "0", 2);
                        break;
                    case 'MM:SS':
                        time = Utils.str_pad_left(minutes, "0", 2) + ":" + Utils.str_pad_left(seconds.toFixed(0), "0", 2);
                        break;
                    default:
                        time = Utils.str_pad_left(hours, "0", 2) + ":" + Utils.str_pad_left(minutes, "0", 2) + ":" + Utils.str_pad_left(seconds.toFixed(0), "0", 2);
                }

                return time;
            },
        };
    });

    console.dir(this.element);

    this._preload();
  }

  _preload() {
    new Audio(this.element.src);
  }

  addExtension(name, extension) {
    this[name] = extension;
  }

  addMultipleExtension(extensions) {
      extensions.forEach(({ name, extension }) => this.addExtension(name, extension));
  }

  play() {
    this.element.play();
  }

  pause() {
    this.element.pause();
  }

  seekTo() {}

  getVolume() {
    return Math.floor(this.element.volume * 100);
  }

  setVolume(volumeNumber) {
    if (!Utils.isNumber(volumeNumber)) {
      return false;
    }

    if (Utils.isInt(volumeNumber)) {
      volumeNumber =
        volumeNumber > 100
          ? 1.0
          : volumeNumber < 0
            ? 0.0
            : Utils.convertNumberToFloat(volumeNumber);
    } else if (Utils.isFloat(volumeNumber)) {
      volumeNumber =
        volumeNumber > 1.0 ? 1.0 : volumeNumber < 0.0 ? 0.0 : volumeNumber;
    }

    this.element.volume = volumeNumber;
  }

  toggleMute() {
    if (this.isMuted) {
    }
  }

  addEventsModifiers(eventName, eventModifier) {

    if (!this.customEventsModifiers) {
        this.customEventsModifiers = {};
    }

    this.customEventsModifiers[eventName] = eventModifier;
  }

  handleArgsByEvent(eventName, $event) {
      if (eventName in this.customEventsModifiers) {
          return this.customEventsModifiers[eventName]($event);
      } else {
          return $event;
      }
  }

  on(event, listener) {
    if(`on${event}` in this.element) {
        this.element.addEventListener(event, ($event) => {
            const args = this.handleArgsByEvent(event, $event);
            this.events.dispatch(event, args);
        });
    }

    this.events.on(event, listener);
  }
}
