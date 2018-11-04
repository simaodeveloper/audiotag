class Core extends Events {
    constructor(audio, options) {
        super();
        this.audio      = this.setAudio(audio);
        this.options    = this.setOptions(options);
        this.addExtension("events", new Emmiter);
        this.setUp();
    }

    setOptions(options) {
        const defaultOptions = {
            formatTime: true,
            volume: 0.5,
            mute: false,
            currentTime: 0
        };

        Object.assign(
            defaultOptions, 
            options
        );
    }

    setUp() {
        const {
            currentTime,
            mute,
            volume
        } = this.options;

        this.seekTo(currentTime);
        this.toggleMute(mute);
        this.volume(volume);
    }

    setAudio(audio) {
        if (typeof audio === "string") {
            this.createAudio(audio);
        } else if (audio.nodeType === Node.ELEMENT_NODE) {
            this.defineAudio(audio);
        }
    }

    defineAudio(audioElement) {
        this.element = audioElement;
    }

    createAudio(audioURL) {
        this.defineAudio(document.createElement('audio'));
        this.setURL(audioURL);
    }

    setURL(url) {
        this.element.src = url;
    }
    
    addExtension(name, extension) {
        this[name] = extension;
    }
    
    addMultipleExtension(extensions) {
        extensions.forEach(({ name, extension }) =>
            this.addExtension(name, extension)
        );
    }

    getDuration() {
        const { duration } = this.element;

        const time = {
            hours: Utils.convertSecondsToHours(duration),
            minutes: Utils.convertSecondsToMinutes(duration),
            seconds: Utils.normalizeSeconds(duration)
        };

        Object.keys(time).forEach(propName => {
            time[propName] = this.options.formatTime
                ? Utils.timeFormat(time[propName])
                : time[propName];
        });

        return { duration, ...time };
    }

    getVolume() {
        return Math.floor(this.element.volume * 100);
    }

    setVolume(volumeNumber) {
        if (!Utils.isNumber(volumeNumber)) {
            return false;
        }

        if (Utils.isInt(volumeNumber)) {
            volumeNumber = volumeNumber > 100
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
    
    _preload() {
        new Audio(this.element.src);
    }
}