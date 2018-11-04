class Core extends Events {
    constructor() {
        super();
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

window.Core = Core;