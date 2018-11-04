class Core extends Events {
    constructor(audio, options) {
        super();
        this.audio = this.setAudio(audio);
        this.options = this.setOptions(options);
        this.addExtension("events", new Emmiter);
    }

    setOptions(options) {
        const defaultOptions = {
            formatTime: true,
        };

        return Object.assign(
            defaultOptions, 
            options
        );
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