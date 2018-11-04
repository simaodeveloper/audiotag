class Events extends Emmiter {

    constructor() {
        super();
        this._customEvents = {};
    }

    static addEventModifier(eventName, modifier) {

        if (!this._customEvents) {
            this._customEvents = {};
        }

        this._customEvents[eventName] = modifier;
    }

    handleArgsByEvent(eventName, $event) {
        if (eventName in this._customEvents) {
            return this._customEvents[eventName].call(this, $event);
        } else {
            return $event;
        }
    }

    on(eventName, listener) {
        if (`on${eventName}` in this.element) {
            this.element.addEventListener(eventName, ($event) => {
                const { $event, ...args } = this.handleArgsByEvent(eventName, $event);
                this.events.dispatch(eventName, $event, args);
            });
        }

        this.events.on(eventName, listener);
    }

    off(eventName, listener) {
        this.events.off(eventName, listener);
    }
}

window.Events = Events;