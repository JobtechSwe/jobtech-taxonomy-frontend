
import Constants from './constants.jsx';

class Localization { 

    constructor() {
        // localization
        this.resources = {
            // swedish
            sv: {
                /* db types */
                db_continent: "Kontinent",
                db_country: "Land",
                db_driving_licence: "Körkort",
                db_driving_licence_combination: "Körkorts-kombination",
                db_employment_duration: "Anställningslängd",
                db_employment_type: "Anställningstyp",
                db_isco_level_1: "ISCO nivå 1",
                db_isco_level_4: "ISCO nivå 4",
                db_keyword: "Folkligsynonym",
                db_language: "Språk",
                db_language_level: "Språknivå",
                db_municipality: "Kommun",
                db_occupation_collection: "__occupation_collection__",
                db_occupation_field: "Yrkesområde",
                db_occupation_name: "Benämning",
                db_region: "Region",
                db_skill: "Kompetens",
                db_skill_headline: "Kompetens",
                db_sni_level_1: "SNI nivå 1",
                db_sni_level_2: "SNI nivå 2",
                db_ssyk_level_1: "Yrkesgrupp",
                db_ssyk_level_2: "Yrkesgrupp",
                db_ssyk_level_3: "Yrkesgrupp",
                db_ssyk_level_4: "Yrkesgrupp",
                db_wage_type: "Anställningsform",
                db_worktime_extent: "__worktime_extent__",
                /* Actions */
                CREATED: "Skapad",
                UPDATED: "Uppdaterad",
                DEPRECATED: "Deprecated",
                /* regular words */
                list: "Lista",
                common_name: "Folkligsynonym",
                occupation_name: "Benämning",
                occupation_field: "Yrkesområde",
                competense: "Kompetens",
                connections: "Kopplingar",
                name: "Namn",
                description: "Beskrivning",
                history: "Historia",
                versions: "Versioner",
                changes: "Förändringar",
                from: "Från",
                to: "Till",
            },
            // english
            en: {
                
            }
        }
        // find active language
        this.code = this.setLanguage();
    }
	
    setLanguage() {
        var lang = navigator.language || navigator.userLanguage;
        var langSimple = lang.split("-")[0];
        var key = null;
        console.log("local language: " + lang);
        if(Constants.lang) {
            console.log("override language: " + Constants.lang);
            lang = Constants.lang;
        }
        if(this.resources[lang] != null) {
            key = lang;
        } else if(this.resources[langSimple] != null) {
            key = langSimple;
        }
        if(key != null) {
            console.log("selecting localization: " + key);
            this.lang = this.resources[key];
        } else {
            console.log("localization not found: '" + key + "' defaulting to english");
            this.lang = this.resources["en"];
        }
        return lang;
    }

    get(key) {
        if(this.lang[key] == null) {
            var en = this.resources["en"];
            if(en == null || en[key] == null) {
                return key;
            }
            return en[key];
        }
        return this.lang[key];
    }

    getUpper(key) {
        return this.lang[key].toUpperCase();
    }
    
    getLower(key) {
        return this.lang[key].toLowerCase();
    }
}

export default new Localization;