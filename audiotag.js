class AudioTag extends Core {
    constructor(audio, options) {
        super(audio, options);
        this.isMuted = false;
        this._preload();
    }

    play() {
        this.element.play();
    }
    
    pause() {
        this.element.pause();
    }
    
    seekTo() {}
    rewind() {}
    forward() {}

    volume(volumeNumber) {
        const method = Utils.isNumber(volumeNumber) ? 'setVolume' : 'getVolume';
        this[method](volumeNumber);
    }
    
    toggleMute() {
        if (this.isMuted) {
        }
    }
}
    