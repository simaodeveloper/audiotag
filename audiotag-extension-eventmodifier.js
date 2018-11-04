AudioTag.addEventModifier("timeupdate", function($event) {
    const currentTime   = this.element.currentTime;

    const time = {
        seconds: Utils.normalizeSeconds(currentTime),
        minutes: Utils.convertSecondsToMinutes(currentTime),
        hours: Utils.convertSecondsToHours(currentTime)
    };

    const timeFormat = (time, char = "0", leftpad = 2) => {
        return Utils.leftpad(time.toFixed(0), char, leftpad);
    };

    Object.keys(time).forEach(propName => {
        time[propName] = this.options.formatTime 
            ? timeFormat(time[propName]) 
            : time[propName];
    });

    const { seconds, minutes, hours } = time;
    
    return {
        event: $event,
        seconds,
        minutes,
        hours
    };
});
