
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
        // concept types
        this.CONCEPT_COUNTRY = "country";
        this.CONCEPT_DRIVING_LICENCE = "driving-licence";
        this.CONCEPT_EMPLOYMENT_DURATION = "employment-duration";
        this.CONCEPT_ISCO_LEVEL_1 = "isco-level-1";
        this.CONCEPT_ISCO_LEVEL_4 = "isco-level-4";
        this.CONCEPT_LANGUAGE = "language";
        this.CONCEPT_OCCUPATION_NAME = "occupation-name";
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

        // settings
        this.REST_IP = "http://jobtech-taxonomy-api-for-frontend-route-jobtech-taxonomy-api.test.services.jtech.se/v1/taxonomy";
        //this.REST_IP = "http://jobtech-taxonomy-sidecar-taxonomy-frontend.test.services.jtech.se/v1/taxonomy";
        this.REST_API_KEY = "";
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

        var apikey = this.getArg("apikey");
        if(apikey) {
            this.REST_API_KEY = apikey;
        }
		this.lang = this.getArg("lang");
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
}

export default new Constants;