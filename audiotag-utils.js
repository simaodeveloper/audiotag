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
        return Utils.isInt(n) && n / 100;
    }
    
    static leftpad(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }
    
    static convertSecondsToMinutes(seconds) {
        return Math.floor(seconds / 60);
    }
    
    static convertSecondsToHours(seconds) {
        return Math.floor(seconds / 3600);
    }
}

window.Utils = Utils;
