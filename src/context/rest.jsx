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
                        var response = http.response.split("\"taxonomy/").join("\"");
                        response = response.split("preferred-label").join("preferredLabel");
                        onSuccess(JSON.parse(response));
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
        this.currentRequest = null;
        this.currentSuccessCallback = null;
        this.currentErrorCallback = null;
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

    getConcept(id, onSuccess, onError) {
        this.get("/main/concepts?id=" + id, onSuccess, onError);
    }
    
    getConcepts(type, onSuccess, onError) {
        this.get("/main/concepts?type=" + type, onSuccess, onError);
    }

    getConceptsSsyk(type, onSuccess, onError) {
        this.get("/specific/concepts/ssyk?type=" + type, onSuccess, onError);
    }

    getConceptSsyk(id, onSuccess, onError) {
        this.get("/specific/concepts/ssyk?id=" + id, onSuccess, onError);
    }

    getConceptIsco08(id, onSuccess, onError) {
        this.get("/specific/concepts/isco?id=" + id, onSuccess, onError);
    }

    getConceptRelations(id, type, relationType, onSuccess, onError) {
        this.get("/main/concepts?related-ids=" + id + "&relation=" + relationType + "&type=" + type, onSuccess, onError);
    }

    getAllConceptRelations(id, relationType, onSuccess, onError) {
        this.get("/main/concepts?related-ids=" + id + "&relation=" + relationType, onSuccess, onError);
    }

    searchConcepts(type, query, onSuccess, onError) {
        this.get("/search?type=" + type + "&q=" + encodeURIComponent(query), onSuccess, onError);
    }

    getVersions(onSuccess, onError) {
        this.get("/main/versions", onSuccess, onError);
    }

    getChanges(fromVersion, toVersion, onSuccess, onError) {
        this.get("/main/changes?fromVersion=" + fromVersion + "&toVersion=" + toVersion, onSuccess, onError);
    }

}

export default new Rest;