import React from 'react';
import Constants from './constants.jsx';
import Localization from './localization.jsx';
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

    getExtraFieldForType(type) {
        switch(type) {
            case Constants.CONCEPT_COUNTRY:
                return "iso_3166_1_alpha_2_2013 iso_3166_1_alpha_3_2013";
            case Constants.CONCEPT_DRIVING_LICENCE:
                return "driving_licence_code_2013";
            case Constants.CONCEPT_EMPLOYMENT_DURATION:
                return "eures_code_2014";
            case Constants.CONCEPT_ISCO_LEVEL_4:                
                return "isco:isco_code_08";
            case Constants.CONCEPT_LANGUAGE:
                return "iso_639_3_alpha_2_2007 iso_639_3_alpha_3_2007";
            case Constants.CONCEPT_MUNICIPALITY:
                return "lau_2_code_2015";
            case Constants.CONCEPT_REGION:
                return "nuts_level_3_code_2013 national_nuts_level_3_code_2019";
            case Constants.CONCEPT_SNI_LEVEL_1:
            case Constants.CONCEPT_SNI_LEVEL_2:
                return"sni_level_code_2007"
            case Constants.CONCEPT_SSYK_LEVEL_1:
            case Constants.CONCEPT_SSYK_LEVEL_2:
            case Constants.CONCEPT_SSYK_LEVEL_3:
            case Constants.CONCEPT_SSYK_LEVEL_4:
                return "ssyk:ssyk_code_2012";
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_1:
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_2:
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_3:
            case Constants.CONCEPT_SUN_EDUCATION_FIELD_4:
                return "sun_education_field_code_2020";
            case Constants.CONCEPT_SUN_EDUCATION_LEVEL_1:
            case Constants.CONCEPT_SUN_EDUCATION_LEVEL_2:
            case Constants.CONCEPT_SUN_EDUCATION_LEVEL_3:
                return "sun_education_level_code_2020";
            default:
                return "";
        }
    }

    getConcepts(type, onSuccess, onError) {
        Rest.getConceptsExtraField(type, this.getExtraFieldForType(type), onSuccess, onError);
    }

    getConcept(id, type, onSuccess, onError) {
        // fetch fresh object
        Rest.getConceptExtraField(id, this.getExtraFieldForType(type), onSuccess, onError);        
    }

    getFullyPopulatedConceptParameterized(id, type, includeRelations, includeHistory, onSuccess, onError) {
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
            var fetchSkillHeadlines = async (context) => {
                var headlines = [];
                for(var i=0; i<context.concept.related.length; ++i) {
                    var related = context.concept.related[i];
                    if(related.type == Constants.CONCEPT_SKILL) {
                        var query = 
                            "concepts(id: \"" + related.id + "\", version: \"next\") { " + 
                                "broader(type:\"skill-headline\") { " + 
                                    "id type preferredLabel:preferred_label " +
                                "} " +
                            "}";
                        var data = await Rest.getGraphQlPromise(query);
                        data = data.data.concepts[0].broader[0];
                        var current = headlines.find((x) => {
                            return x.id == data.id;
                        });
                        if(current == null) {
                            headlines.push(data);
                            current = data;
                        }
                        if(current.children == null) {
                            current.children = [];
                        }
                        current.children.push(related);
                    }
                }
                for(var i=0; i<headlines.length; ++i) {
                    context.concept.related.push(headlines[i]);
                }
                onFetchComplete(context);
            };
            // context to keep track of where we are
            var context = {
                concept: concepts[0],
                depth: 0,
            };
            context.depth++;
            context.depth++;
            fetchSkillHeadlines(context);
            if(includeHistory) {
                fetchLocalHistory(context);
            }
            onFetchComplete(context);
        }
        this.getConcept(id, type, success, onError);
    }

    getFullyPopulatedConcept(id, type, onSuccess, onError) {
        return this.getFullyPopulatedConceptParameterized(id, type, true, true, onSuccess, onError);
    }

    renderExportButtonText() {
        return (
            <div className="export_button_content">
                <div>{Constants.ICON_SVG_EXCEL}</div>
                <div>{Localization.get("export")}</div>
            </div>
        );
    }

}

export default new Util;