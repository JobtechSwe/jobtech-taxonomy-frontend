import React from 'react';
import EventDispatcher from './event_dispatcher.jsx';
import Constants from './constants.jsx';

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
        // NOTE: super hacky way of refreshing objects
        //       this will be reworked
        return (new Date().getTime() - handle.time) < 1000 * 60 * 60;
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
        localStorage.setItem("concept_" + concept.id, JSON.stringify(concept));
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
        localStorage.setItem("relation_" + id + "_" + relationType, JSON.stringify(data));
    }
    
    getCachedData(key) {
        var item = localStorage.getItem(key);
        if(item) {
            return JSON.parse(item);
        }
        return null;
    }

    getConcept(id) {
        return this.getCachedData("concept_" + id);
    }

    getConceptRelations(id, relationType) {
        return this.getCachedData("relation_" + id + "_" + relationType);
    }
}

export default new CacheManager;