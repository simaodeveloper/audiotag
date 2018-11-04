class Events {

    constructor() {
        Events.addEventModifier = Events.addEventModifier.bind(this);
    }

    static addEventModifier(eventName, modifier) {
        if (!Events._customEvents) {
            Events._customEvents = {};
        }

        Events._customEvents[eventName] = modifier;
    }

    handleArgsByEvent(eventName, $event) {
        if (eventName in Events._customEvents) {
            return Events._customEvents[eventName].call(this, $event);
        } else {
            return {
                event: $event
            };
        }
    }

    on(eventName, listener) {
        if (`on${eventName}` in this.element) {
            this.element.addEventListener(eventName, ($event) => {
                const { event, ...args } = this.handleArgsByEvent(eventName, $event);
                this.events.dispatch(eventName, event, args);
            });
        }

        this.events.on(eventName, listener);
    }

    off(eventName, listener) {
        this.events.off(eventName, listener);
    }
}