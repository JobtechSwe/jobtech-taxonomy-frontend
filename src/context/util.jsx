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
    
    sortValue(direction, a, b) {
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
        /*if(CacheManager.hasCachedConcept(id)) {
            var item = CacheManager.getConcept(id);
            if(item) {
                onSuccessCallback([item]);
                return;
            }
        }
        var onSuccess = (data) => {
            CacheManager.cacheConcept(data[0]);
            onSuccessCallback(data);
        };*/
        // fetch fresh object
        switch(type) {
            case Constants.CONCEPT_COUNTRY:
                Rest.getConceptCountry(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_DRIVING_LICENCE:
                Rest.getConceptDrivingLicence(id, onSuccess, onError);
                break;
            case Constants.CONCEPT_EMPLOYMENT_DURATION:
                Rest.getConceptEmploymentDuration(id, onSuccess, onError);
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
}

export default new Util;