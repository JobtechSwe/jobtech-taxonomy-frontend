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

    post(func, onSuccess, onError) {
        var http = new XMLHttpRequest();
        this.setupCallbacks(http, onSuccess, onError);
        http.open("POST", Constants.REST_IP + func, true);
        http.setRequestHeader("api-key", Constants.REST_API_KEY);
        http.setRequestHeader("Accept", "application/json");
        http.send();
    }

    patch(func, onSuccess, onError) {
        var http = new XMLHttpRequest();
        this.setupCallbacks(http, onSuccess, onError);
        http.open("PATCH", Constants.REST_IP + func, true);
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

    getPromise(func) {
		return new Promise((resolve, reject) => {
			var http = new XMLHttpRequest();
			http.onerror = () => {
				reject(http.status);
			}
			http.onload = () => {
				if(http.status >= 200 && http.status < 300) {
					try {
						var response = http.response.split("\"taxonomy/").join("\"");
						response = response.split("preferred-label").join("preferredLabel");
						response = JSON.parse(response);
						resolve(response);
					} catch(err) {
						console.log("Exception", err);
					}
				} else {
					reject(http.status);
				}
			}
			http.open("GET", Constants.REST_IP + func, true);
			http.setRequestHeader("api-key", Constants.REST_API_KEY);
			http.setRequestHeader("Accept", "application/json");
			http.send();
		});
	}

    getVersionsPromis() {
		return this.getPromise("/main/versions");
    }
    
    getGraphQlPromise(query) {
		return this.getPromise("/graphql?query=" + encodeURIComponent("query MyQuery { " + query + " }"));
    }

    getGraphQL(query, onSuccess, onError) {
        var encodedQuery = encodeURIComponent("query MyQuery { " + query + " }");      
        this.get("/graphql?query=" + encodedQuery, onSuccess, onError);
    }

    getConcept(id, onSuccess, onError) {
        this.get("/private/concepts?id=" + id, onSuccess, onError);
    }

    getConceptByTypeAndName(type, name, onSuccess, onError) {
        this.get("/private/concepts?type=" + type + "&preferred-label=" + encodeURIComponent(name), onSuccess, onError);
    }

    getConceptDayNotes(id, from, to, onSuccess, onError) {
        var query = "";
        if(id == null) {
            query = "from-timestamp=" + from.toISOString() + "&to-timestamp=" + to.toISOString();            
        } else {
            query = "id=" + id;
            if(from) {
                query += "&from-timestamp=" + from.toISOString();            
            }
            if(to) {
                query += "&to-timestamp=" + to.toISOString();            
            }
        }
        this.get("/private/concept/automatic-daynotes/?" + query, onSuccess, onError);
    }

    getRelationDayNotes(id, from, to , onSuccess, onError) {
        var query = "";
        if(id == null) {
            query = "from-timestamp=" + from.toISOString() + "&to-timestamp=" + to.toISOString();            
        } else {
            query = "id=" + id;
            if(from) {
                query += "&from-timestamp=" + from.toISOString();            
            }
            if(to) {
                query += "&to-timestamp=" + to.toISOString();            
            }
        }
        this.get("/private/relation/automatic-daynotes/?" + query, onSuccess, onError);
    }

    getConcepts(type, onSuccessCallback, onError) {
        /*if(CacheManager.hasCachedTypeList(type)) {
            var item = CacheManager.getTypeList(type);
            if(item) {
                onSuccessCallback(item);
                return;
            }
        }*/
        var onSuccess = (data) => {
            //CacheManager.cacheTypeList(type, data);            
            //onSuccessCallback(data);
            onSuccessCallback(data.data.concepts);
        };
        var query = "concepts(type: \"" + type + "\", include_deprecated: true, version: \"next\") " 
            + "{ id type preferredLabel:preferred_label deprecated }";
        this.getGraphQL(query, onSuccess, onError);
        //this.get("/private/concepts?type=" + type, onSuccess, onError);
    }

    getConceptsExtraField(type, extraField, onSuccessCallback, onError) {
        var onSuccess = (data) => {
            onSuccessCallback(data.data.concepts);
        };
        var query = "concepts(type: \"" + type + "\", include_deprecated: true, version: \"next\")"
            + " { id type preferredLabel:preferred_label deprecated " + extraField + " }"; 
        this.getGraphQL(query, onSuccess, onError);
    }

    getConceptExtraField(id, extraField, onSuccessCallback, onError) {
        var onSuccess = (data) => {
            onSuccessCallback(data.data.concepts);
        };
        var query = "concepts(id: \"" + id + "\", include_deprecated: true, version: \"next\")"
            + " { id type preferredLabel:preferred_label definition deprecated quality_level last_changed " + extraField
                + " broader(include_deprecated: true) { id type preferredLabel:preferred_label isco:isco_code_08 ssyk:ssyk_code_2012 }"
                + " narrower(include_deprecated: true) { id type preferredLabel:preferred_label isco:isco_code_08 ssyk:ssyk_code_2012 }"
                + " related(include_deprecated: true) { id type preferredLabel:preferred_label isco:isco_code_08 ssyk:ssyk_code_2012 }"
                + " replaced_by(include_deprecated: true) { id type preferredLabel:preferred_label isco:isco_code_08 ssyk:ssyk_code_2012 }"
            + " }";
        this.getGraphQL(query, onSuccess, onError);
    }

    getConceptsSkillsAndHedlines(onSuccessCallback, onError) {
        var onSuccess = (data) => {
            onSuccessCallback(data.data.concepts);
        };
        var query = "concepts(type: \"skill-headline\", include_deprecated: true, version: \"next\")"
            + " { id type preferredLabel:preferred_label"
                + " skills:narrower(type: \"skill\", include_deprecated: true) { id type preferredLabel:preferred_label deprecated }"
            + " }";
        this.getGraphQL(query, onSuccess, onError);
    }

    getOccupationNamesWithBroaderTypes(onSuccessCallback, onError) {
        var onSuccess = (data) => {
            onSuccessCallback(data.data.concepts);
        };
        var query = "concepts(type: \"occupation-name\", include_deprecated: true)"
            + " { broader(include_deprecated: true) { type } id type preferredLabel:preferred_label }";
        this.getGraphQL(query, onSuccess, onError);
    }

    getSkillsWithBroaderHedlinesRelatedSsyks(onSuccessCallback, onError) {
        var onSuccess = (data) => {
            onSuccessCallback(data.data.concepts);
        };
        var query = "concepts(type: \"skill\", include_deprecated: true)"
            + " { broader(type: \"skill-headline\") { type } id type preferredLabel:preferred_label related(type: \"ssyk-level-4\") { type } }";
        this.getGraphQL(query, onSuccess, onError);
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

    getConceptIsco08(id, onSuccess, onError) {
        this.get("/specific/concepts/isco?id=" + id, onSuccess, onError);
    }

    getConceptCountry(id, onSuccess, onError) {
        this.get("/specific/concepts/country?id=" + id, onSuccess, onError);
    }

    getConceptDrivingLicence(id, onSuccess, onError) {
        this.get("/specific/concepts/driving-licence?id=" + id, onSuccess, onError);
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

    getConceptRelations(id, type, relationType, onSuccessCallback, onError) {
        if(CacheManager.hasCachedRelation(id)) {
            var item = CacheManager.getConceptRelationsByType(id, relationType, type);
            if(item) {
                onSuccessCallback(item);
                return;
            }
        }
        var onSuccess = (data) => {
            CacheManager.cacheRelations(id, relationType, data);
            onSuccessCallback(data);
        };
        this.get("/private/concepts?related-ids=" + id + "&relation=" + relationType + "&type=" + type, onSuccess, onError);
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
        this.get("/private/concepts?related-ids=" + id + "&relation=" + relationType, onSuccess, onError);
    }

    getDepricatedConcepts(onSuccess, onError) {
        this.get("/private/concepts?deprecated=true", onSuccess, onError);
    }

    searchConcepts(query, onSuccess, onError) {
        // NOTE: this wont hold, we will need a new private version for this
        this.get("/suggesters/autocomplete?query-string=" + encodeURIComponent(query), onSuccess, onError);
    }

    getVersions(onSuccess, onError) {
        this.get("/main/versions", onSuccess, onError);
    }

    getChanges(fromVersion, toVersion, onSuccess, onError) {
        this.get("/main/changes?after-version=" + fromVersion + "&to-version-inclusive=" + toVersion, onSuccess, onError);
    }

    getUnpublishedChanges(fromVersion, onSuccess, onError) {
        this.get("/private/changes?after-version=" + fromVersion, onSuccess, onError);
    }

    deleteConcept(id, comment, onSuccess, onError) {
        this.delete("/private/delete-concept?id=" + id + "&comment=" + encodeURIComponent(comment), onSuccess, onError);
    }

    getGraph(relationType, sourceType, targetType, onSuccess, onError) {
        var removeDuplicateNodes = (data) => {
            return data.filter((item, i) => {
                var p = data.find((e) => {
                    return e.id == item.id;
                });
                return data.indexOf(p) == i;
            });
        }
        var removeDuplicateEdges = (data) => {
            return data.filter((item, i) => {
                var p = data.find((e) => {
                    return e.target == item.target && e.source == item.source;
                });
                return data.indexOf(p) == i;
            });
        };
        var onSuccessCallback = (data) => {
            data.graph.nodes = removeDuplicateNodes(data.graph.nodes);
            data.graph.edges = removeDuplicateEdges(data.graph.edges);
            onSuccess(data);
        };
        this.get("/private/graph?edge-relation-type=" + relationType + "&source-concept-type=" + sourceType + "&target-concept-type=" + targetType, onSuccessCallback, onError)
    }

    patchConcept(id, comment, args, onSuccess, onError) {
        this.patch("/private/accumulate-concept?id=" + id + "&comment=" + encodeURIComponent(comment) + args, onSuccess, onError);
    }

    postConcept(type, comment, preferredLabel, definition, qualityLevel, onSuccess, onError) {
        this.post("/private/concept?type=" + type + "&comment=" + encodeURIComponent(comment) + "&definition=" + definition + "&preferred-label=" + preferredLabel + "&quality-level=" + qualityLevel, onSuccess, onError);
    }

    postReplaceConcept(oldId, newId, comment, onSuccess, onError) {
        this.post("/private/replace-concept?old-concept-id=" + oldId + "&new-concept-id=" + newId + "&comment=" + encodeURIComponent(comment), onSuccess, onError);
    }

    postAddRelation(conceptId, relationId, relationType, substitutability, comment, onSuccess, onError) {
        var query = "concept-1=" + conceptId + "&concept-2=" + relationId + "&relation-type=" + relationType + "&comment=" + encodeURIComponent(comment);
        if(substitutability) {
            query += "&substitutability-percentage=" + substitutability;
        }
        this.post("/private/relation?" + query, onSuccess, onError);
    }

    deleteRelation(relationType, sourceId, targetId, comment, onSuccess, onError) {
        this.delete("/private/delete-relation?relation-type=" + relationType + "&concept-1=" + sourceId + "&concept-2=" + targetId + "&comment=" + encodeURIComponent(comment), onSuccess, onError);
    }

    postDayNote(conceptId, comment, onSuccess, onError) {
        this.post("/private/concept/automatic-daynotes/?id=" + conceptId + "&comment=" + encodeURIComponent(comment), onSuccess, onError);
    }
}

export default new Rest;