import React from 'react';
import Constants from './constants.jsx';

class Rest { 

    setupCallbacks(http, onSuccess, onError) {
        http.onerror = () => {
            if(onError != null) {
                onError(http.status);
            }
        }
        http.onload = () => {
            if(http.status >= 200 && http.status < 300) {
                if(onSuccess != null) {
                    try {
                        onSuccess(JSON.parse(http.response));
                    } catch(err) {
                        console.log("Exception", err);
                    }
                }
            } else {
                if(onError != null) {
                    onError(http.status);
                }
            }
        }
        this.currentRequest = http;
        this.currentSuccessCallback = onSuccess;
        this.currentErrorCallback = onError;
    }

    abort() {
        if(this.currentRequest) {
            this.currentRequest.abort();
        }
        if(this.currentErrorCallback) {
            this.currentErrorCallback(499); //Client Closed Request
        }
        this.currentRequest = null;
        this.currentSuccessCallback = null;
        this.currentErrorCallback = null;
    }

    get(func, onSuccess, onError) {
        var http = new XMLHttpRequest();
        this.setupCallbacks(http, onSuccess, onError);
        http.open("GET", Constants.REST_IP + func, true);
        http.setRequestHeader("api-key", Constants.REST_API_KEY);
        http.setRequestHeader("Accept", "application/json");
        http.send();
    }
    
    getConcepts(type, onSuccess, onError) {
        this.get("/public/concepts?type=" + type, onSuccess, onError);
    }
    
    getConceptRelations(id, type, relationType, onSuccess, onError) {
        this.get("/public/concepts?relatedIds=" + id + "&relationType=" + relationType + "&type=" + type, onSuccess, onError);
    }

    getAllConceptRelations(id, relationType, onSuccess, onError) {
        this.get("/public/concepts?relatedIds=" + id + "&relationType=" + relationType, onSuccess, onError);
    }

    searchConcepts(type, query, onSuccess, onError) {
        this.get("/public/search?type=" + type + "&q=" + encodeURIComponent(query), onSuccess, onError);
    }

    getVersions(onSuccess, onError) {
        this.get("/public/versions", onSuccess, onError);
    }

    getChanges(fromVersion, toVersion, onSuccess, onError) {
        this.get("public/changes?fromVersion=" + fromVersion + "&toVersion=" + toVersion, onSuccess, onError);
    }
}

export default new Rest;