import React from 'react';
import EventDispatcher from './event_dispatcher.jsx';
import Constants from './constants.jsx';
import Localization from './localization.jsx';
import Button from './../control/button.jsx';
import Save from './../view/dialog/save.jsx';

class App { 

    constructor() {
        this.editRequests = [];
        this.editNote = "";
        this.pendingSaveRequests = 0;
    }

    createEditRequest(id) {
        return {
            text: null,
            timestamp: new Date().getTime(),
            id: id,
            objectId: null,
            groupId: null,
            newValue: null,
            oldValue: null,
            // callbacks triggered by user interface
            saveCallback: null,
            undoCallback: null,
        };
    }

    addEditRequest(request) {
        var count = this.editRequests.length;
        var item = this.editRequests.find((x) => {
            return x.id == request.id;
        });
        if(item) {
            item.timestamp = new Date().getTime();
            item.newValue = request.newValue;
            if((item.compare && item.compare(item.newValue, item.oldValue)) || (item.newValue == item.oldValue)) {
                // when the new and old value are the same, the request is no longer valid
                var index = this.editRequests.indexOf(item);
                this.editRequests.splice(index, 1);
            }
        } else {
            this.editRequests.push(request);
        }
        if(count > 0 && this.editRequests.length == 0) {
            // no more changes
            EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_BUTTON);
        } else if(count == 0 && this.editRequests.length > 0) {
            // new changes
            EventDispatcher.fire(Constants.EVENT_SHOW_SAVE_BUTTON);
        }
    }

    commitEditRequests() {
        if(this.editRequests.length) {
            // show save popup since we are about to save changes
            EventDispatcher.fire(Constants.EVENT_SHOW_SAVE_INDICATOR);
        }
        // merge requests if possible
        var objectGroups = [];
        for(var i=0; i<this.editRequests.length; ++i) {
            var request = this.editRequests[i];
            var group = objectGroups.find((x) => {
                return x.id == request.objectId && x.groupId == request.groupId;
            });
            if(group) {
                group.changes[request.id] = request.newValue;
            } else {
                group = {
                    id: request.objectId,
                    groupId: request.groupId,
                    callback: request.saveCallback,
                    changes: {},
                };
                group.changes[request.id] = request.newValue;
                objectGroups.push(group);
            }
        }
        // save each group
        for(var i=0; i<objectGroups.length; ++i) {
            if(objectGroups[i].callback) {
                objectGroups[i].callback(objectGroups[i].changes);
            }
        }
        this.editRequests = [];
        this.editNote = "";
    }

    undoEditRequests() {
        for(var i=0; i<this.editRequests.length; ++i) {
            var request = this.editRequests[i];
            if(request.undoCallback) {
                request.undoCallback(request.oldValue);
            }
        }
        this.editRequests = [];
        this.editNote = "";
        this.pendingSaveRequests = 0;
    }

    discardEditRequest() {
        this.editRequests = [];
        this.editNote = "";
        this.pendingSaveRequests = 0;
    }

    addSaveRequest() {
        this.pendingSaveRequests++;
    }

    removeSaveRequest() {
        if(--this.pendingSaveRequests == 0) {
            EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_INDICATOR);
        }
    }

    hasUnsavedChanges() {
        return this.editRequests.length > 0;
    }

    hasPendingSaveRequests() {
        return this.pendingSaveRequests > 0;
    }

    showError(message) {
        EventDispatcher.fire(Constants.EVENT_SHOW_ERROR, message);
    }

    showSaveDialog(callback) {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("save"),
            content: <Save 
                callback={callback}
                changes={this.editRequests}/>,
        });
    }
	
}

export default new App;