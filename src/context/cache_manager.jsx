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
        // load cache maps
        var cc = localStorage.getItem("concepts");
        if(cc) {
            this.cachedConcepts = JSON.parse(cc);
        }
        var cr = localStorage.getItem("relations");
        if(cr) {
            this.cachedRelations = JSON.parse(cr);
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
            return JSON.parse(item);
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
            localStorage.setItem("concepts", JSON.stringify(this.cachedConcepts));
        } else {
            cached.time = new Date().getTime();
        }
        this.setCompressedValue("concept_" + concept.id, JSON.stringify(concept));
    }

    cacheRelations(id, relationType, relations) {
        var cached = this.cachedRelations.find((x) => {
            return x.id == id && x.type == relationType;
        });
        var data = [];
        if(cached == null) {
            var element = {
                id: id,
                type: relationType,
                time: new Date().getTime(),
            };
            this.cachedRelations.push(element);
            localStorage.setItem("relations", JSON.stringify(this.cachedRelations));
        } else {
            cached.time = new Date().getTime();
            var previous = localStorage.getItem("relation_" + id);
            if(previous) {
                data = JSON.parse(previous);
            }
        }
        for(var i=0; i<relations.length; ++i) {
            data.push(relations[i]);
        }
        this.setCompressedValue("relation_" + id + "_" + relationType, JSON.stringify(data));
    }

    getConcept(id) {
        return this.getCompressedValue("concept_" + id);
    }

    getConceptRelations(id, relationType) {
        return this.getCompressedValue("relation_" + id + "_" + relationType);
    }
}

export default new CacheManager;