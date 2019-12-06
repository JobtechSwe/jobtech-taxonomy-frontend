import React from 'react';
import EventDispatcher from './event_dispatcher.jsx';
import Constants from './constants.jsx';
import Localization from './localization.jsx';
import { timingSafeEqual } from 'crypto';

class Settings { 

    constructor() {
        this.user = "default"; // when user accounts are available, set this with user id
        this.data = {
            editableTypes: [
                "ssyk-level-4",
                "keyword",
                "occupation-collection",
                "occupation-field",
                "occupation-name",
                "skill",
            ],
        };
    }

    getKey(name) {
        return this.user + "_" + name;
    }

    isEditable(type) {
        return this.data.editableTypes.indexOf(type) != -1;
    }

    load() {
        var data = localStorage.getItem(this.getKey("data"));
        if(data) {
            this.data = JSON.parse(data);
        };
    }

    save() {
        localStorage.setItem(this.getKey("data"), JSON.stringify(this.data));
    }

}

export default new Settings;