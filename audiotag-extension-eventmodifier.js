AudioTag.addEventModifier("timeupdate", function($event) {
    const currentTime   = this.element.currentTime; 
    const seconds       = Utils.normalizeSeconds(currentTime);
    const minutes       = Utils.convertSecondsToMinutes(currentTime);
    const hours         = Utils.convertSecondsToHours(currentTime);

    const timeFormat = {
        display(time, char = "0", leftpad = 2) {
            return Utils.leftpad(time.toFixed(0), char, leftpad);
        },
        ["HH:MM"](hours, minutes) {
            const { display } = timeFormat;
            return `${display(hours)}:${display(minutes)}`;
        },
        ["MM:SS"](hours, minutes, seconds) {
            const { display } = timeFormat;
            return `${display(minutes)}:${display(seconds)}`;
        },
        ["HH:MM:SS"](hours, minutes, seconds) {
            const { display } = timeFormat;
            return `${display(hours)}:${display(minutes)}:${display(seconds)}`;
        }
    };
    
    const args = {
        event: $event,
        seconds,
        minutes,
        hours,
        formated(format) {
            return timeFormat[format](hours, minutes, seconds);
        }
    };
    
    return args;
});
