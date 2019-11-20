import React from 'react';
import Constants from './constants.jsx';

class Rest { 

    setupCallbacks(http, onSuccess, onError) {
        this.currentRequest = http;
        this.currentSuccessCallback = onSuccess;
        this.currentErrorCallback = onError;
        http.onerror = () => {
            if(this.currentErrorCallback != null) {
                this.currentErrorCallback(http.status);
            }
        }
        http.onload = () => {
            if(http.status >= 200 && http.status < 300) {
                if(this.currentSuccessCallback != null) {
                    try {
                        var response = http.response.split("\"taxonomy/").join("\"");
                        response = response.split("preferred-label").join("preferredLabel");
                        this.currentSuccessCallback(JSON.parse(response));
                    } catch(err) {
                        console.log("Exception", err);
                    }
                }
            } else {
                if(this.currentErrorCallback != null) {
                    this.currentErrorCallback(http.status);
                }
            }
        }
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

    delete(func, onSuccess, onError) {
        var http = new XMLHttpRequest();
        this.setupCallbacks(http, onSuccess, onError);
        http.open("DELETE", Constants.REST_IP + func, true);
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

    getConceptsRange(type, offset, limit, onSuccess, onError) {
        this.get("/main/concepts?type=" + type + "&offset=" + offset + "&limit=" + limit, onSuccess, onError);
    }

    getConceptsSsyk(type, onSuccess, onError) {
        this.get("/specific/concepts/ssyk?type=" + type, onSuccess, onError);
    }

    getConceptsSsykRange(type, offset, limit, onSuccess, onError) {
        this.get("/specific/concepts/ssyk?type=" + type + "&offset=" + offset + "&limit=" + limit, onSuccess, onError);
    }

    getConceptSsyk(id, onSuccess, onError) {
        this.get("/specific/concepts/ssyk?id=" + id, onSuccess, onError);
    }

    getConceptsIsco08(type, onSuccess, onError) {
        this.get("/specific/concepts/isco?type=" + type, onSuccess, onError);
    }

    getConceptsIsco08Range(type, offset, limit, onSuccess, onError) {
        this.get("/specific/concepts/isco?type=" + type + "&offset=" + offset + "&limit=" + limit, onSuccess, onError);
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

    searchConcepts(query, onSuccess, onError) {
        this.get("/suggesters/autocomplete?query-string=" + encodeURIComponent(query), onSuccess, onError);
    }

    getVersions(onSuccess, onError) {
        this.get("/main/versions", onSuccess, onError);
    }

    getChanges(fromVersion, toVersion, onSuccess, onError) {
        this.get("/main/changes?from-version=" + fromVersion + "&to-version=" + toVersion, onSuccess, onError);
    }

    deleteConcept(id, onSuccess, onError) {
        this.get("/private/delete-concept", id, onSuccess, onError);
    }

}

export default new Rest;