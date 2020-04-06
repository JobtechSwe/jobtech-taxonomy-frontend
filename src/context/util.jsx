import React from 'react';
import Constants from './constants.jsx';
import Rest from './rest.jsx';
import CacheManager from './cache_manager.jsx';

class Util {
    sortByKey(items, key, direction) {
        items.sort((a, b) => {
            return this.sortValue(direction, a[key], b[key]);
        });
        return items;
    }

    sortByCmp(items, cmp, direction) {
        items.sort((a, b) => {
            return this.sortValue(direction, cmp(a), cmp(b));
        });
        return items;
    }

    sortTreeViewItemsBySsyk(items) {
        items.sort((a, b) => {
            if(a.data.ssyk) {
                if(a.data.ssyk < b.data.ssyk) { 
                    return -1; 
                }
                return a.data.ssyk > b.data.ssyk ? 1 : 0;
            }
            if(a.data.preferredLabel < b.data.preferredLabel) { 
                return -1; 
            }
            return a.data.preferredLabel > b.data.preferredLabel ? 1 : 0;
        });
    }

    sortTreeViewItemsByIsco(items) {
        items.sort((a, b) => {
            if(a.data.isco) {
                if(a.data.isco < b.data.isco) { 
                    return -1; 
                }
                return a.data.isco > b.data.isco ? 1 : 0;
            }
            if(a.data.preferredLabel < b.data.preferredLabel) { 
                return -1; 
            }
            return a.data.preferredLabel > b.data.preferredLabel ? 1 : 0;
        });
    }
    
    sortValue(direction, aa, bb) {
        var a = aa;
        var b = bb;
        if(typeof(a) === "string" && typeof(b) === "string") {
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        if(direction) {
            if(a < b) return -1;
            if(a > b) return 1;
        } else {
            if(a < b) return 1;
            if(a > b) return -1;
        }
        return 0;
    }

    getHttpMessage(status) {
        switch(status) {
            // standard codes
            case 400: return "" + status + " (bad request)";
            case 401: return "" + status + " (unauthorized)";
            case 403: return "" + status + " (forbidden)";
            case 404: return "" + status + " (not found)";
            case 408: return "" + status + " (request timeout)";
            case 409: return "" + status + " (conflict)";
            case 500: return "" + status + " (internal server error)";
            case 501: return "" + status + " (not implemented)";
            case 502: return "" + status + " (bad gateway)";
            case 503: return "" + status + " (service unavailable)";
            case 504: return "" + status + " (gateway timeout)";
            case 511: return "" + status + " (network authentication required)";
            // nginx specific
            case 444: return "" + status + " (no response)";
            case 495: return "" + status + " (ssl certificate error)";
            case 496: return "" + status + " (ssl certificate required)";
            case 497: return "" + status + " (http request sent to https port)";
            case 499: return "" + status + " (client closed request)";
            // cloudflare specific
            case 520: return "" + status + " (web server returned an unknwon error)";
            case 521: return "" + status + " (web server is down)";
            case 522: return "" + status + " (connection timed out)";
            case 523: return "" + status + " (origin is unreachable)";
            case 524: return "" + status + " (a timeout occurred)";
            case 525: return "" + status + " (ssl handshake failed)";
            case 526: return "" + status + " (invalid ssl certificate)";
            case 527: return "" + status + " (railgun error)";
            // unofficial
            case 598: return "" + status + " (network read timeout error)";
        }
        return "" + status;
    }

    getObjectValue(object, value, defaultValue) {
        if(object && object[value] != null) {
            return object[value];
        }
        return defaultValue;
    }

    getDefaultWorkMode() {
        var mode = Constants.URL_SEARCH_MODEMAP[this.getSearchUrlValue("tab")];
        return mode == null ? Constants.WORK_MODE_1 : mode;
    }

    getSearchUrlValue(name) {
        /*var p = new URLSearchParams(window.location.search);
        if(p.has(name)) {
            return p.get(name);
        }*/
        return null;
    }

    setSearchUrlValue(name, value) {
        /*var p = new URLSearchParams(window.location.search);
        if(p.has(name)) {
            p.set(name, value);
            window.location.search = p.toString();
        }*/
    }

    initSearchUrl(page) {
        /*var p = new URLSearchParams(window.location.search);
        if(!p.has("tab")) {
            p.append("tab", page);
            window.location.search = p.toString();
        }*/
    }

    getConcept(id, type, onSuccess, onError) {
        // fetch fresh object
        switch(type) {
            case Constants.CONCEPT_COUNTRY:
                Rest.getConceptCountry(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_DRIVING_LICENCE:
                Rest.getConceptDrivingLicence(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_ISCO_LEVEL_4:                
                Rest.getConceptIsco08(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_LANGUAGE:
                Rest.getConceptLanguage(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_REGION:
                Rest.getConceptRegion(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_SNI_LEVEL_1:
            case Constants.CONCEPT_SNI_LEVEL_2:
                Rest.getConceptSniLevel(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_SSYK_LEVEL_1:
            case Constants.CONCEPT_SSYK_LEVEL_2:
            case Constants.CONCEPT_SSYK_LEVEL_3:
            case Constants.CONCEPT_SSYK_LEVEL_4:
                Rest.getConceptSsyk(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_1:
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_2:
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_3:
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_4:
                Rest.getConceptSunEducationField(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_SUN_EDUCATION_LEVEL_1:
            case Constants.CONCEPT_SUN_EDUCATION_LEVEL_2:
            case Constants.CONCEPT_SUN_EDUCATION_LEVEL_3:
                Rest.getConceptSunEducationLevel(id, onSuccess, onError);
                break;
            default:
                Rest.getConcept(id, onSuccess, onError);
                break;
        }
    }

    getFullyPopulatedConceptParameterized(id, type, includeRelations, includeHistory, includeFields, onSuccess, onError) {
        var success = (concepts) => {
            var onFetchComplete = (context) => {
                if(--context.depth == 0) {
                    onSuccess(context.concept);
                }
            };
            var onFetchError = (context, status) => {
                if(--context.depth == 0) {
                    onError(status);
                }
            };
            var fetchRelations = (context, type) => {
                context.depth++;
                Rest.getAllConceptRelations(context.concept.id, type, (data) => {
                    var result = [];
                    var findConcept = (id) => {
                        return result.find((e) => {
                            return e.concept.id == id;
                        });
                    };
                    var fetchParent = async (child, parentType) => {
                        context.depth++;
                        Rest.getAllConceptRelations(child.id, Constants.RELATION_BROADER, (parents) => {
                            for(var i=0; i<parents.length; ++i) {
                                if(parentType && parents[i].type != parentType) {
                                    continue;
                                }
                                var p = findConcept(parents[i]);
                                if(p == null) {
                                    p = {
                                        concept: parents[i],
                                        children: [],
                                    };
                                    result.push(p);
                                } 
                                p.children.push(child);
                            }
                            onFetchComplete(context);
                        }, (status) => {
                            onFetchError(context, status);
                        });
                    };
                    for(var i=0; i<data.length; ++i) {
                        var connection = {
                            concept: data[i],
                            children: [],
                        };
                        if(data[i].type == "skill" && context.concept.type != "skill-headline") {
                            fetchParent(data[i], "skill-headline");
                        } else {
                            result.push(connection);
                        }
                    }
                    context.concept[type + "_list"] = result;
                    onFetchComplete(context);
                }, (status) => { 
                    onFetchError(context, status);
                });
            };
            var fetchLocalHistory = (context) => {
                var processData = (data) => {
                    data = data.filter(Boolean);
                    for(var i=0; i<data.length; ++i) {
                        var item = data[i];
                        item.date = new Date(item.timestamp);
                        item.event = item["event-type"];
                    }
                    return data;
                };
                context.depth++;
                Rest.getConceptDayNotes(context.concept.id, null, null, (conceptData) => {
                    context.depth++;
                    context.concept.local_history = processData(conceptData);
                    context.concept.local_history = this.sortByKey(context.concept.local_history, "date", false);
                    Rest.getRelationDayNotes(context.concept.id, null, null, (relationData) => {
                        context.concept.local_history = context.concept.local_history.concat(processData(relationData));
                        context.concept.local_history = this.sortByKey(context.concept.local_history, "date", false);
                        onFetchComplete(context);
                    }, (status) => {
                        onFetchError(context, status);
                    });
                    onFetchComplete(context);
                }, (status) => { 
                    onFetchError(context, status);
                });
            };
            // context to keep track of where we are
            var context = {
                concept: concepts[0],
                depth: 0,
            };
            context.depth++;
            if(includeRelations) {
                // get all relations
                if(context.concept.relations.broader) {
                    fetchRelations(context, Constants.RELATION_BROADER);
                }
                if(context.concept.relations.narrower) {
                    fetchRelations(context, Constants.RELATION_NARROWER);
                }
                if(context.concept.relations.related) {
                    fetchRelations(context, Constants.RELATION_RELATED);
                }
            }
            // get local history
            if(includeHistory) {
                fetchLocalHistory(context);
            }
            // get special fields
            if(includeFields) {
                if(context.concept["ssyk-code-2012"] && context.concept["ssyk-code-2012"].length > 3) {
                    // TODO: get all isco4 codes
                }
            }
            onFetchComplete(context);
        }
        this.getConcept(id, type, success, onError);
    }

    getFullyPopulatedConcept(id, type, onSuccess, onError) {
        return this.getFullyPopulatedConceptParameterized(id, type, true, true, true, onSuccess, onError);
    }

}

export default new Util;