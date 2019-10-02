
class Constants { 

    constructor() {
        // side panel query map (untill backend supports display name etc...)
        /*this.SIDEPANEL_QUERY_MAP = {
            continent: "Continent",
            country: "Country",
            driving_licence: "Driving licence",
            employment_duration: "Employment duration",
            employment_type: "Employment type",
            isco_level_1: "ISCO level 1",
            isco_level_4: "ISCO level 4",
            keyword: "Keyword",
            language: "Language",
            language_level: "Language level",
            municipality: "Municipality",
            occupation_collection: "Occupation collection",
            occupation_field: "Occupation field",
            occupation_name: "Occupation name",
            region: "Region",
            skill: "Skill",
            skill_headline: "Skill headline",
            sni_level_1: "SNI level 1",
            sni_level_2: "SNI level 2",
            ssyk_level_1: "SSYK level 1",
            ssyk_level_2: "SSYK level 2",
            ssyk_level_3: "SSYK level 3",
            ssyk_level_4: "SSYK level 4",
            sun_education_field_1: "SUN education field 1",
            sun_education_field_2: "SUN education field 2",
            sun_education_field_3: "SUN education field 3",
            sun_education_field_4: "SUN education field 4",
            sun_education_level_1: "SUN education level 1",
            sun_education_level_2: "SUN education level 2",
            sun_education_level_3: "SUN education level 3",
            wage_type: "Wage type",
            worktime_extent: "Worktime extent"      
        };*/
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
        this.RELATION_AFFINITY = "----";
        // events
        this.EVENT_SET_WORKMODE = "EVENT_SET_WORKMODE";
        this.EVENT_SSYK4_ITEM_SELECTED = "EVENT_SSYK4_ITEM_SELECTED";
        // id's
        this.ID_SIDEPANEL_CONTAINER = "ID_SIDEPANEL_CONTAINER";
        this.ID_MAINPANEL_CONTAINER = "ID_MAINPANEL_CONTAINER";
        // settings
        this.REST_IP = "https://cors-anywhere.herokuapp.com/http://jobtech-taxonomy-api-develop.dev.services.jtech.se/v0/taxonomy/";
        this.REST_API_KEY = "";
        // resources
        this.ICON_TMP_1 = "./resource/icon_tmp_1.png";
        this.ICON_TMP_2 = "./resource/icon_tmp_2.png";
        this.ICON_TMP_3 = "./resource/icon_tmp_3.png";
        this.ICON_TMP_4 = "./resource/icon_tmp_4.png";
        this.ICON_TMP_5 = "./resource/icon_tmp_5.png";

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