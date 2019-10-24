
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
        // events
        this.EVENT_SET_WORKMODE = "EVENT_SET_WORKMODE";
        this.EVENT_SIDEPANEL_ITEM_SELECTED = "EVENT_SIDEPANEL_ITEM_SELECTED";
        this.EVENT_MAINPANEL_ITEM_SELECTED = "EVENT_MAINPANEL_ITEM_SELECTED";
        this.EVENT_SIDEPANEL_TIME_PERIOD_SELECTED = "EVENT_SIDEPANEL_TIME_PERIOD_SELECTED";
        // id's
        this.ID_SIDEPANEL_CONTAINER = "ID_SIDEPANEL_CONTAINER";
        this.ID_MAINPANEL_CONTAINER = "ID_MAINPANEL_CONTAINER";
        // settings
        this.REST_IP = "http://jobtech-taxonomy-sidecar-taxonomy-frontend.test.services.jtech.se/v1/taxonomy";
        this.REST_API_KEY = "";
        // resources
        this.ICON_TMP_1 = "./resource/icon_tmp_1.png";
        this.ICON_TMP_2 = "./resource/icon_tmp_2.png";
        this.ICON_TMP_3 = "./resource/icon_tmp_3.png";
        this.ICON_TMP_4 = "./resource/icon_tmp_4.png";
        this.ICON_TMP_5 = "./resource/icon_tmp_5.png";
        this.ICON_EXPAND_UP = "./resource/icon_expand_up.png";
        this.ICON_EXPAND_DOWN = "./resource/icon_expand_down.png";

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