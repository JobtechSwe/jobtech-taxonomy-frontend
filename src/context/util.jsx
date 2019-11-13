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
    
    sortValue(direction, a, b) {
        if(direction) {
            if(a < b) return 1;
            if(a > b) return -1;
        } else {
            if(a < b) return -1;
            if(a > b) return 1;
        }
        return 0;
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