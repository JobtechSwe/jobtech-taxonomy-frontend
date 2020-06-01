import React from 'react';

class Constants { 

    constructor() {
        // work modes
        this.WORK_MODE_1 = 0;
        this.WORK_MODE_2 = 1;
        this.WORK_MODE_3 = 2;
        this.WORK_MODE_4 = 3;
        this.WORK_MODE_5 = 4;
        // dialog options
        this.DIALOG_OPTION_OK       = 1;
        this.DIALOG_OPTION_CANCEL   = 2;
        this.DIALOG_OPTION_SAVE     = 4;
        this.DIALOG_OPTION_ABORT    = 8;
        this.DIALOG_OPTION_YES      = 16;
        this.DIALOG_OPTION_NO       = 32;
        // relation types
        this.RELATION_NARROWER = "narrower";
        this.RELATION_BROADER = "broader";
        this.RELATION_RELATED = "related";
        this.RELATION_AFFINITY = "----";
        this.RELATION_SUBSTITUTABILITY = "substitutability";
        // concept types
        this.CONCEPT_COUNTRY = "country";
        this.CONCEPT_DRIVING_LICENCE = "driving-licence";
        this.CONCEPT_EMPLOYMENT_DURATION = "employment-duration";
        this.CONCEPT_ISCO_LEVEL_1 = "isco-level-1";
        this.CONCEPT_ISCO_LEVEL_4 = "isco-level-4";
        this.CONCEPT_LANGUAGE = "language";
        this.CONCEPT_MUNICIPALITY = "municipality";
        this.CONCEPT_OCCUPATION_NAME = "occupation-name";
        this.CONCEPT_OCCUPATION_EXPERIENCE_YEAR = "occupation-experience-year";
        this.CONCEPT_OCCUPATION_COLLECTION = "occupation-collection",
        this.CONCEPT_OCCUPATION_FIELD = "occupation-field",
        this.CONCEPT_REGION = "region";
        this.CONCEPT_SNI_LEVEL_1 = "sni-level-1";
        this.CONCEPT_SNI_LEVEL_2 = "sni-level-2";
        this.CONCEPT_SSYK_LEVEL_1 = "ssyk-level-1";
        this.CONCEPT_SSYK_LEVEL_2 = "ssyk-level-2";
        this.CONCEPT_SSYK_LEVEL_3 = "ssyk-level-3";
        this.CONCEPT_SSYK_LEVEL_4 = "ssyk-level-4";        
        this.CONCEPT_SKILL = "skill";
        this.CONCEPT_SKILL_HEADLINE = "skill-headline"
        this.CONCEPT_SUN_EDUCATION_FIELD_1 = "sun-education-field-1";
        this.CONCEPT_SUN_EDUCATION_FIELD_2 = "sun-education-field-2";
        this.CONCEPT_SUN_EDUCATION_FIELD_3 = "sun-education-field-3";
        this.CONCEPT_SUN_EDUCATION_FIELD_4 = "sun-education-field-4";
        this.CONCEPT_SUN_EDUCATION_LEVEL_1 = "sun-education-level-1";
        this.CONCEPT_SUN_EDUCATION_LEVEL_2 = "sun-education-level-2";
        this.CONCEPT_SUN_EDUCATION_LEVEL_3 = "sun-education-level-3";
        // events
        this.EVENT_SET_WORKMODE = "EVENT_SET_WORKMODE";
        this.EVENT_SHOW_OVERLAY = "EVENT_SHOW_OVERLAY";
        this.EVENT_HIDE_OVERLAY = "EVENT_HIDE_OVERLAY";
        this.EVENT_SHOW_SAVE_INDICATOR = "EVENT_SHOW_SAVE_INDICATOR";
        this.EVENT_HIDE_SAVE_INDICATOR = "EVENT_HIDE_SAVE_INDICATOR";
        this.EVENT_SHOW_POPUP_INDICATOR = "EVENT_SHOW_POPUP_INDICATOR";
        this.EVENT_HIDE_POPUP_INDICATOR = "EVENT_HIDE_POPUP_INDICATOR";
        this.EVENT_SHOW_SAVE_BUTTON = "EVENT_SHOW_SAVE_BUTTON";
        this.EVENT_HIDE_SAVE_BUTTON = "EVENT_HIDE_SAVE_BUTTON";
        this.EVENT_HIDE_SAVE_PANEL = "EVENT_HIDE_SAVE_PANEL";
        this.EVENT_SHOW_ERROR = "EVENT_SHOW_ERROR";
        this.EVENT_SIDEPANEL_ITEM_SELECTED = "EVENT_SIDEPANEL_ITEM_SELECTED";
        this.EVENT_MAINPANEL_ITEM_SELECTED = "EVENT_MAINPANEL_ITEM_SELECTED";
        this.EVENT_SIDEPANEL_TIME_PERIOD_SELECTED = "EVENT_SIDEPANEL_TIME_PERIOD_SELECTED";
        this.EVENT_SIDEPANEL_STATISTICS_SELECTED = "EVENT_SIDEPANEL_STATISTICS_SELECTED";
        this.EVENT_SIDEPANEL_CONNECTIONS_SELECTED = "EVENT_SIDEPANEL_CONNECTIONS_SELECTED";
        this.EVENT_SIDEPANEL_REFERRED_SELECTED = "EVENT_SIDEPANEL_REFERRED_SELECTED";
        this.EVENT_GRAPH_MODE_SELECTED = "EVENT_GRAPH_MODE_SELECTED";
        this.EVENT_VISIBLE_TYPES_SELECTED = "EVENT_VISIBLE_TYPES_SELECTED";
        this.EVENT_VERSION_ITEM_SELECTED = "EVENT_VERSION_ITEM_SELECTED";
        this.EVENT_VERSION_ITEM_CONTENT_INFO = "EVENT_VERSION_ITEM_CONTENT_INFO";
        this.EVENT_NEW_CONCEPT = "EVENT_NEW_CONCEPT";
        this.EVENT_SEACH_CHANGES = "EVENT_SEACH_CHANGES";
        // id's
        this.ID_NAVBAR = "ID_NAVBAR";
        this.ID_SIDEPANEL_CONTAINER = "ID_SIDEPANEL_CONTAINER";
        this.ID_MAINPANEL_CONTAINER = "ID_MAINPANEL_CONTAINER";

        this.URL_SEARCH_MODEMAP = {
            "default": this.WORK_MODE_1,
            "list": this.WORK_MODE_1,
            "version": this.WORK_MODE_2,
            "changelog": this.WORK_MODE_3,
            "relations": this.WORK_MODE_4,
            "stats": this.WORK_MODE_5,
        };
        this.URL_MODE_SEARCHMAP = {
            "0": "list",
            "1": "version",
            "2": "changelog",
            "3": "relations",
            "4": "stats",
        },
        this.DB_TYPES = [
            "ssyk-level-1",
            "ssyk-level-2",
            "ssyk-level-3",
            "ssyk-level-4",
            "isco-level-4",
            "continent",
            "country",
            "driving-licence",
            "employment-duration",
            "employment-type",
            "keyword",
            "language",
            "language-level",
            "municipality",
            "occupation-collection",
            "occupation-field",
            "occupation-name",
            "region",
            "skill",
            "skill-headline",
            "sni-level-1",
            "sni-level-2",
            "wage-type",
            "worktime-extent",
            "sun-education-field-1",
            "sun-education-field-2",
            "sun-education-field-3",
            "sun-education-field-4",
            "sun-education-level-1",
            "sun-education-level-2",
            "sun-education-level-3",
        ];
        this.CONCEPT_RELATION_TYPES = {
            "ssyk-level-4": {
                "ssyk-level-3": this.RELATION_BROADER,
                "isco-level-4": this.RELATION_RELATED,
                "occupation-field": this.RELATION_BROADER,
            },
            "ssyk-level-3": {
                "ssyk-level-2": this.RELATION_BROADER,
            },
            "ssyk-level-2": {
                "ssyk-level-1": this.RELATION_BROADER,
            },
            "isco-level-4": {
                "ssyk-level-4": this.RELATION_RELATED,
            },
            "occupation-name": {
                "ssyk-level-4": this.RELATION_BROADER,
                "isco-level-4": this.RELATION_BROADER,
                "occupation-field": this.RELATION_BROADER,
                "occupation-name": this.RELATION_SUBSTITUTABILITY,
                "keyword": this.RELATION_RELATED,
            },
            "occupation-collection": {

            },
            "skill": {
                "skill-headline": this.RELATION_BROADER,
                "ssyk-level-4": this.RELATION_RELATED,
                "keyword": this.RELATION_RELATED,
            },
            "municipality": {
                "region": this.RELATION_BROADER,
            },
            "region": {
                "country": this.RELATION_BROADER,
            },
            "country": {
                "continent": this.RELATION_BROADER,
            },
        };

        // settings
        this.REST_IP = window.g_app_api_path;
        this.REST_API_KEY = window.g_app_api_key;
        // resources
        this.ICON_TMP_1 = "./resource/icon_tmp_1.png";
        this.ICON_TMP_2 = "./resource/icon_tmp_2.png";
        this.ICON_TMP_3 = "./resource/icon_tmp_3.png";
        this.ICON_TMP_4 = "./resource/icon_tmp_4.png";
        this.ICON_TMP_5 = "./resource/icon_tmp_5.png";
        this.ICON_EXPAND_UP = "./resource/icon_expand_up.png";
        this.ICON_EXPAND_DOWN = "./resource/icon_expand_down.png";
        this.ICON_LOCKED = "./resource/icon_locked.png";
        this.ICON_UNLOCKED = "./resource/icon_unlocked.png";
        this.ICON_HARD_LOCKED = "./resource/icon_hard_locked.png";
        this.ICON_AF_EXPORT = "./resource/av_logo.png";
        this.ICON_AF_EXPORT_B64 = null;

        //this.ICON_AF_EXPORT = "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";
        this.ICON_SVG_EXCEL = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>Excel_64x</title><path d="M38,8H19.3335A2.33373,2.33373,0,0,0,17,10.3335V20H38Z" fill="#21a366"/><path d="M56.6665,8H38V20H59V10.3335A2.33373,2.33373,0,0,0,56.6665,8Z" fill="#33c481"/><rect x="38" y="32" width="21" height="12" fill="#107c41"/><path d="M38,44V32H17V53.6665A2.33373,2.33373,0,0,0,19.3335,56h37.333A2.33373,2.33373,0,0,0,59,53.6665V44Z" fill="#185c37"/><rect x="17" y="20" width="21" height="12" fill="#107c41"/><rect x="38" y="20" width="21" height="12" fill="#21a366"/><path d="M33,20.33008V46.66992a1.73444,1.73444,0,0,1-.04.3999A2.31378,2.31378,0,0,1,30.66992,49H17V18H30.66992A2.326,2.326,0,0,1,33,20.33008Z" opacity="0.2"/><path d="M34,20.33008V44.66992A3.36171,3.36171,0,0,1,30.66992,48H17V17H30.66992A3.34177,3.34177,0,0,1,34,20.33008Z" opacity="0.1"/><path d="M33,20.33008V44.66992A2.326,2.326,0,0,1,30.66992,47H17V18H30.66992A2.326,2.326,0,0,1,33,20.33008Z" opacity="0.2"/><path d="M32,20.33008V44.66992A2.326,2.326,0,0,1,29.66992,47H17V18H29.66992A2.326,2.326,0,0,1,32,20.33008Z" opacity="0.1"/><rect x="4" y="18.00002" width="27.99996" height="27.99996" rx="2.33333" fill="#107c41"/><path d="M11.2256,39.5835l4.90759-7.60465-4.4951-7.56235h3.61724l2.45379,4.83356q.33839.68763.46538,1.02594h.03173q.24318-.54984.50768-1.06825l2.623-4.79125H24.658l-4.61145,7.52,4.72779,7.647H21.24174L18.40718,34.274a4.43255,4.43255,0,0,1-.33845-.70864h-.04231a3.345,3.345,0,0,1-.32788.68749L14.77937,39.5835Z" fill="#fff"/></svg>

        var apikey = this.getArg("apikey");
        if(apikey) {
            this.REST_API_KEY = apikey;
        }
		this.lang = this.getArg("lang");
        this.initEncodedImages();
    }

    async initEncodedImages() {
		const toBase64 = (file) => new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = () => {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL("image/png");
                resolve(dataURL)
            };
            img.src = file;
        });
        this.ICON_AF_EXPORT_B64 = await toBase64(this.ICON_AF_EXPORT);
    }
    
    getArg(key) {
		var raw = window.location.hash.split('#');
		if(raw.length == 2) {
			var cmd = raw[1];
			var args = cmd.split('&');
			for(var i=0; i<args.length; ++i) {
				if(args[i].indexOf(key + "=") !== -1) {
					return args[i].split('=')[1]; 
				}
			}
		}
		return null;
    }
    
    getRelationType(from, to) {
        if(this.CONCEPT_RELATION_TYPES[from] && this.CONCEPT_RELATION_TYPES[from][to]) {
            return this.CONCEPT_RELATION_TYPES[from][to];
        } else if(this.CONCEPT_RELATION_TYPES[to]) {
            var type = this.CONCEPT_RELATION_TYPES[to][from];
            if(type == this.RELATION_NARROWER) {
                return this.RELATION_BROADER;
            } else if(type == this.RELATION_BROADER) {
                return this.RELATION_NARROWER;
            }
        }
        return null;
    }
}

export default new Constants;