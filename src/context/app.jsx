import React from 'react';

class App { 

    constructor() {
        this.editRequests = [];
    }

    createEditRequest(id) {
        return {
            text: null,
            timestamp: new Date().getTime(),
            id: id,
            objectId: null,
            newValue: null,
            oldValue: null,
            // callbacks triggered by user interface
            saveCallback: null,
            undoCallback: null,
        };
    }

    addEditRequest(request) {
        var item = this.editRequests.find((x) => {
            return x.id == request.id;
        });
        if(item) {
            item.timestamp = new Date().getTime();
            item.newValue = request.newValue;
        } else {
            this.editRequests.push(request);
        }
    }

    commitEditRequests() {
        // merge requests if possible
        var objectGroups = [];
        for(var i=0; i<this.editRequests.length; ++i) {
            var request = this.editRequests[i];
            var group = objectGroups.find((x) => {
                return x.id == request.objectId;
            });
            if(group) {
                group.changes[request.id] = request.newValue;
            } else {
                group = {
                    id: request.objectId,
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
    }

    undoEditRequests() {
        for(var i=0; i<this.editRequests.length; ++i) {
            var request = this.editRequests[i];
            if(request.undoCallback) {
                request.undoCallback(request.oldValue);
            }
        }
        this.editRequests = [];
    }

    hasUnsavedChanges() {
        return false;
        //return this.editRequests.length > 0;
    }

    showSaveDialog(callback) {
        
    }
	
}

export default new App;