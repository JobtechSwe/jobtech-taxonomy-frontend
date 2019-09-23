import React from 'react';

class EventDispatcher { 

    constructor() {
        this.listeners = [];
    }

    add(callback, event) {
        var o = this.listeners.find((e) => {
            return e.callback == callback;
        });
        if(!o) {
            this.listeners.push({
                event: event,
                callback: callback
            });
        }
    }

    remove(callback) {
        var o = this.listeners.find((e) => {
            return e.callback == callback;
        });
        if(o) {
            this.listeners.splice(this.listeners.indexOf(o), 1);
        }
    }

    fire(event, data) {
        for(var i=0; i<this.listeners.length; ++i) {
            var o = this.listeners[i];
            if(o.event == event) {
                o.callback(data);
            }
        }
    }
	
}

export default new EventDispatcher;