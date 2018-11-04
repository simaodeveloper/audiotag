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

    duration() {
        return this.getDuration();
    }
    
    seekTo(time) {
        this.element.currentTime = time;
    }

    rewind(time) {
        this.element.currentTime -= time;
    }

    forward(time) {
        this.element.currentTime += time;
    }

    volume(volumeNumber) {
        const method = Utils.isNumber(volumeNumber) ? 'setVolume' : 'getVolume';
        return this[method](volumeNumber);
    }

    isMuted() {
        return this.element.muted;
    }
    
    toggleMute(bool) {
        this.element.muted = bool !== undefined 
            ? bool 
            : !this.element.muted;
    }
}
    