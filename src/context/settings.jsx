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
            visibleTypes: [
                "ssyk-level-1",
                "ssyk-level-2",
                "ssyk-level-3",
                "ssyk-level-4",
                "isco-level-4",
                "continent",
                "country",
                "driving-licence",
                "employment-duration",
                "employment-type",
                "keyword",
                "language",
                "language-level",
                "municipality",
                "occupation-collection",
                "occupation-field",
                "occupation-name",
                "occupation-experience-year",
                "region",
                "skill",
                "skill-headline",
                "sni-level-1",
                "sni-level-2",
                "wage-type",
                "worktime-extent",
                "sun-education-field-1",
                "sun-education-field-2",
                "sun-education-field-3",
                "sun-education-field-4",
                "sun-education-level-1",
                "sun-education-level-2",
                "sun-education-level-3",
                "unemployment-fund",
                "unemployment-type",
            ]
        };
    }

    getKey(name) {
        return this.user + "_" + name;
    }

    isEditable(type) {
        return this.data.editableTypes.indexOf(type) != -1;
    }

    isVisible(type) {
        return this.data.visibleTypes.indexOf(type) != -1;
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