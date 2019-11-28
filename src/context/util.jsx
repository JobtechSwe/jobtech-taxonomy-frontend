import React from 'react';
import Constants from './constants.jsx';

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
            case 400:
                return "" + status + " (bad request)";
            case 401:
                return "" + status + " (unauthorized)";
            case 403:
                return "" + status + " (forbidden)";
            case 404:
                return "" + status + " (not found)";
            case 408:
                return "" + status + " (request timeout)";
            case 409:
                return "" + status + " (conflict)";
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
}

export default new Util;