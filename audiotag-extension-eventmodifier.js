AudioTag.addEventModifier("timeupdate", function($event) {
    const currentTime = this.element.currentTime;

    const time = {
        seconds: Utils.normalizeSeconds(currentTime),
        minutes: Utils.convertSecondsToMinutes(currentTime),
        hours: Utils.convertSecondsToHours(currentTime)
    };

    Object.keys(time).forEach(propName => {
        time[propName] = this.options.formatTime 
            ? Utils.timeFormat(time[propName]) 
            : time[propName];
    });

    return { event: $event, currentTime, ...time };
});
