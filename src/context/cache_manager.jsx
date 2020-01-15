import React from 'react';
import EventDispatcher from './event_dispatcher.jsx';
import Constants from './constants.jsx';
import LZString from 'lz-string';

class CacheManager { 

    constructor() {
        // detailed information about concepts, relation ids not included
        this.cachedConcepts = [];
        // relation information for concepts
        this.cachedRelations = [];
        // lists of types
        this.cachedTypeLists = [];
        // load cache maps
        var cc = localStorage.getItem("concepts");
        if(cc) {
            this.cachedConcepts = JSON.parse(cc);
        }
        var cr = localStorage.getItem("relations");
        if(cr) {
            this.cachedRelations = JSON.parse(cr);
        }
        var tl = localStorage.getItem("typeLists");
        if(tl) {
            this.cachedTypeLists = JSON.parse(tl);
        }
    }

    isValid(handle) {
        if(handle == null) {
            return false;
        }
        // NOTE: super hacky way of refreshing objects, this will be reworked
        return (new Date().getTime() - handle.time) < 1000 * 60 * 60;
    }

    getCompressedValue(key) {
        var item = localStorage.getItem(key);
        if(item == null) {
            return null;
        }
        try {
            var v = LZString.decompress(item);
            v = v.split("_r_").join("\"relations\"");
            v = v.split("_t_").join("\"type\"");
            v = v.split("_d_").join("\"definition\"");
            v = v.split("_pl_").join("\"preferredLabel\"");
            return JSON.parse(v);
        } catch(e) {
            console.log("----------------------");
            console.log("Quickfix: clear 'local storage' in browser");
            console.log("CacheManager: ERROR");
            console.log(e);
            console.log("Stored item: ");
            console.log(item);
        }
    }

    setCompressedValue(key, value) {
        // TODO: rename more variable names?
        value = value.split("\"relations\"").join("_r_");
        value = value.split("\"type\"").join("_t_");
        value = value.split("\"definition\"").join("_d_");
        value = value.split("\"preferredLabel\"").join("_pl_");
        localStorage.setItem(key, LZString.compress(value));
    }
    
    hasCachedConcept(id) {
        var handle = this.cachedConcepts.find((x) => {
            return x.id == id;
        });
        return this.isValid(handle);
    }
    
    hasCachedRelation(id) {
        var handle = this.cachedRelations.find((x) => {
            return x.id == id;
        });
        return this.isValid(handle);
    }

    hasCachedTypeList(type) {
        var handle = this.cachedTypeLists.find((x) => {
            return x.type == type;
        });
        return this.isValid(handle);
    }

    cacheConcept(concept) {
        var cached = this.cachedConcepts.find((x) => {
            return x.id == concept.id;
        });
        if(cached == null) {
            var element = {
                id: concept.id,
                time: new Date().getTime(),
            };
            this.cachedConcepts.push(element);
        } else {
            cached.time = new Date().getTime();
        }
        localStorage.setItem("concepts", JSON.stringify(this.cachedConcepts));
        this.setCompressedValue("concept_" + concept.id, JSON.stringify(concept));
    }

    cacheRelations(id, relationType, relations) {
        var cached = this.cachedRelations.find((x) => {
            return x.id == id;
        });
        var data = {};
        if(cached == null) {
            var element = {
                id: id,
                time: new Date().getTime(),
            };
            this.cachedRelations.push(element);
        } else {
            cached.time = new Date().getTime();
            var previous = this.getCompressedValue("relation_" + id);
            if(previous) {
                data = previous;
            }
        }
        localStorage.setItem("relations", JSON.stringify(this.cachedRelations));
        if(data[relationType] == null) {
            data[relationType] = [];
        }
        // merge
        for(var i=0; i<relations.length; ++i) {
            var e = data[relationType].find((x) => {
                return x.id == relations[i].id;
            });
            if(e == null) {
                data[relationType].push(relations[i]);
            }
        }
        this.setCompressedValue("relation_" + id, JSON.stringify(data));
    }

    cacheTypeList(type, list) {
        var cached = this.cachedTypeLists.find((x) => {
            return x.type == type;
        });
        if(cached == null) {
            var element = {
                type: type,
                time: new Date().getTime(),
            };
            this.cachedTypeLists.push(element);
        } else {
            cached.time = new Date().getTime();
        }
        localStorage.setItem("typeLists", JSON.stringify(this.cachedTypeLists));
        // remove definition
        for(var i=0; i<list.length; ++i) {
            list[i].definition = undefined;
        }
        this.setCompressedValue("typeList_" + type, JSON.stringify(list));
    }

    getConcept(id) {
        return this.getCompressedValue("concept_" + id);
    }

    getConceptRelations(id, relationType) {
        var item = this.getCompressedValue("relation_" + id);
        if(item) {
            return item[relationType];
        }
        return null;
    }
    
    getConceptRelationsByType(id, relationType, type) {
        var item = this.getCompressedValue("relation_" + id);
        if(item) {
            var list = item[relationType];
            if(list) {
                var result = [];
                for(var i=0; i<list.length; ++i) {
                    if(list[i].type == type) {
                        result.push(list[i]);
                    }
                }
                return result;
            }
        }
        return null;
    }
    
    getTypeList(type) {
        return this.getCompressedValue("typeList_" + type);
    }

    getCacheSize() {
        var total = 0;
        for(var x in localStorage) {
            // only count our values 
            if(localStorage.hasOwnProperty(x)) {
                if(x.startsWith("typeList_") || 
                   x.startsWith("concept_") || 
                   x.startsWith("relation_") || 
                   x.startsWith("concepts") || 
                   x.startsWith("relations") || 
                   x.startsWith("typeLists")) {
                    total += (localStorage[x].length + x.length) * 2;
                }
            }
        };
        return total;
    }

    clear() {
        for(var x in localStorage) { 
            // only clear our values
            if(localStorage.hasOwnProperty(x)) {
                if(x.startsWith("typeList_") || 
                   x.startsWith("concept_") || 
                   x.startsWith("relation_") || 
                   x.startsWith("concepts") || 
                   x.startsWith("relations") || 
                   x.startsWith("typeLists")) {
                    localStorage.removeItem(x);
                }
            }
        };
    }
}

export default new CacheManager;