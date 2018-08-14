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

class AudioTag extends Emmiter {
  constructor(element, options) {
    super();
    this.element = element;
    this.options = options;
    this.isMuted = false;

    console.dir(this.element);

    this._preload();

    this.loadDOMEvents();
  }

  _preload() {
    new Audio(this.element.src);
  }

  play() {
    this.element.play();
  }

  pause() {
    this.element.pause();
  }

  skipTo() {}

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

  loadDOMEvents() {
    this.element.addEventListener("seeking", () => {
      console.log("seeking");
    });

    this.element.addEventListener("seeked", () => {
      console.log("seeked");
    });

    this.element.addEventListener("volumechange", () => {
      console.log("volumeChange");
    });

    this.element.addEventListener("ended", () => {
      console.log("ended");
    });

    this.element.addEventListener("waiting", () => {
      console.log("waiting ");
    });

    this.element.addEventListener("playing", () => {
      console.log("playing");
    });

    this.element.addEventListener("progress", () => {
      console.log("progress");
    });

    this.element.addEventListener("timeupdate", () => {
        const seconds = this.element.currentTime;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);

        this.dispatch("timeupdate", {
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
        });
    });
  }
}
