import React from 'react';
import Constants from './constants.jsx';
import CacheManager from './cache_manager.jsx';

class Rest {

    setupCallbacks(http, onSuccess, onError) {
        this.currentRequest = http;
        http.onerror = () => {
            if(this.onError != null) {
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
    }

    abort() {
        if(this.currentRequest) {
            this.currentRequest.abort();
        }
        if(this.currentErrorCallback) {
            this.currentErrorCallback(499); //Client Closed Request
        }
        this.currentRequest = null;
    }

    get(func, onSuccess, onError) {
        var http = new XMLHttpRequest();
        this.setupCallbacks(http, onSuccess, onError);
        http.open("GET", Constants.REST_IP + func, true);
        http.setRequestHeader("api-key", Constants.REST_API_KEY);
        http.setRequestHeader("Accept", "application/json");
        http.send();
    }

    post(func, key, onSuccess, onError) {
        var http = new XMLHttpRequest();
        this.setupCallbacks(http, onSuccess, onError);
        http.open("POST", Constants.REST_IP + func, true);
        http.setRequestHeader("api-key", key);
        http.setRequestHeader("Accept", "application/json");
        http.send();
    }

    patch(func, key, onSuccess, onError) {
        var http = new XMLHttpRequest();
        this.setupCallbacks(http, onSuccess, onError);
        http.open("PATCH", Constants.REST_IP + func, true);
        http.setRequestHeader("api-key", key);
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
    
    getConcepts(type, onSuccessCallback, onError) {
        if(CacheManager.hasCachedTypeList(type)) {
            var item = CacheManager.getTypeList(type);
            if(item) {
                onSuccessCallback(item);
                return;
            }
        }
        var onSuccess = (data) => {
            CacheManager.cacheTypeList(type, data);
            onSuccessCallback(data);
        };
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

    getConceptCountry(id, onSuccess, onError) {
        this.get("/specific/concepts/country?id=" + id, onSuccess, onError);
    }

    getConceptDrivingLicence(id, onSuccess, onError) {
        this.get("/specific/concepts/driving-licence?id=" + id, onSuccess, onError);
    }

    getConceptEmploymentDuration(id, onSuccess, onError) {
        this.get("/specific/concepts/employment-duration?id=" + id, onSuccess, onError);
    }

    getConceptLanguage(id, onSuccess, onError) {
        this.get("/specific/concepts/language?id=" + id, onSuccess, onError);
    }

    getConceptRegion(id, onSuccess, onError) {
        this.get("/specific/concepts/region?id=" + id, onSuccess, onError);
    }

    getConceptSniLevel(id, onSuccess, onError) {
        this.get("/specific/concepts/sni-level?id=" + id, onSuccess, onError);
    }

    getConceptSunEducationField(id, onSuccess, onError) {
        this.get("/specific/concepts/sun-education-field?id=" + id, onSuccess, onError);
    }

    getConceptSunEducationLevel(id, onSuccess, onError) {
        this.get("/specific/concepts/sun-education-level?id=" + id, onSuccess, onError);
    }

    getConceptRelations(id, type, relationType, onSuccess, onError) {
        this.get("/main/concepts?related-ids=" + id + "&relation=" + relationType + "&type=" + type, onSuccess, onError);
    }

    getAllConceptRelations(id, relationType, onSuccessCallback, onError) {
        if(CacheManager.hasCachedRelation(id)) {
            var item = CacheManager.getConceptRelations(id, relationType);
            if(item) {
                onSuccessCallback(item);
                return;
            }
        }
        var onSuccess = (data) => {
            CacheManager.cacheRelations(id, relationType, data);
            onSuccessCallback(data);
        };
        this.get("/main/concepts?related-ids=" + id + "&relation=" + relationType, onSuccess, onError);
    }

    searchConcepts(query, onSuccess, onError) {
        this.get("/suggesters/autocomplete?query-string=" + encodeURIComponent(query), onSuccess, onError);
    }

    getVersions(onSuccess, onError) {
        this.get("/main/versions", onSuccess, onError);
    }

    getChanges(fromVersion, toVersion, onSuccess, onError) {
        this.get("/main/changes?after-version=" + fromVersion + "&to-version-inclusive=" + toVersion, onSuccess, onError);
    }

    deleteConcept(id, onSuccess, onError) {
        this.get("/private/delete-concept", id, onSuccess, onError);
    }

    getGraph(relationType, sourceType, targetType, onSuccess, onError) {
        this.get("/main/graph?edge-relation-type=" + relationType + "&source-concept-type=" + sourceType + "&target-concept-type=" + targetType, onSuccess, onError)
    }

    patchConcept(id, args, onSuccess, onError) {
        this.patch("/private/accumulate-concept?id=" + id + args, Constants.REST_API_KEY_PRIV, onSuccess, onError);
    }

    postConcept(type, preferredLabel, definition, onSuccess, onError) {
        this.post("/private/concept?type=" + type + "&definition=" + definition + "&preferred-label=" + preferredLabel, Constants.REST_API_KEY_PRIV, onSuccess, onError);
    }

    postAddRelation(conceptId, relationId, relationType, definition, substitutability, onSuccess, onError) {
        this.post("/private/relation?concept-1=" + conceptId + "&concept-2=" + relationId + "&relation=" + relationType + "&definition=" + definition + "&substitutability-percentage=" + substitutability, Constants.REST_API_KEY_PRIV, onSuccess, onError);
    }
}

export default new Rest;