
import Constants from './constants.jsx';

class Localization { 

    constructor() {
        // localization
        this.resources = {
            // swedish
            sv: {
                locale: "sv-SE",
                /* db types */
                db_continent: "Kontinent",
                db_country: "Land",
                "db_driving-licence": "Körkort",
                "db_driving-licence-combination": "Körkorts-kombination",
                "db_employment-duration": "Varaktighet",
                "db_employment-type": "Anställningstyp",
                "db_isco-level-1": "ISCO nivå 1",
                "db_isco-level-4": "ISCO nivå 4",
                db_keyword: "Folkligsynonym",
                db_language: "Språk",
                "db_language-level": "Språknivå",
                db_municipality: "Kommun",
                "db_occupation-collection": "Yrkessamling",
                "db_occupation-field": "Yrkesområde",
                "db_occupation-name": "Benämning",
                db_region: "Region",
                db_skill: "Kompetens",
                "db_skill-headline": "Kompetens",
                "db_sni": "SNI",
                "db_sni-level-1": "SNI nivå 1",
                "db_sni-level-2": "SNI nivå 2",
                "db_ssyk": "Yrkesgrupp",
                "db_ssyk-level-1": "Yrkesgrupp nivå 1",
                "db_ssyk-level-2": "Yrkesgrupp nivå 2",
                "db_ssyk-level-3": "Yrkesgrupp nivå 3",
                "db_ssyk-level-4": "Yrkesgrupp nivå 4",
                "db_sun-education-field": "Utbildningsriktning",
                "db_sun-education-field-1": "Utbildningsinriktning",
                "db_sun-education-field-2": "Utbildningsinriktning",
                "db_sun-education-field-3": "Utbildningsinriktning",
                "db_sun-education-field-4": "Utbildningsinriktning",
                "db_sun-education-level": "Utbildningsnivå",
                "db_sun-education-level-1": "Utbildningsnivå",
                "db_sun-education-level-2": "Utbildningsnivå",
                "db_sun-education-level-3": "Utbildningsnivå",
                "db_wage-type": "Löneform",
                "db_worktime-extent": "Arbetstidsomfattning",
                /* Actions */
                CREATED: "Skapad",
                UPDATED: "Uppdaterad",
                DEPRECATED: "Avaktualiserat",
                /* regular words */
                "occupation-group": "Yrkesgrupp",
                "common-name": "Folkligsynonym",
                "occupation-name": "Benämning",
                "occupation-field": "Yrkesområde",
                competense: "Kompetens",
                connections: "Kopplingar",
                name: "Namn",
                description: "Beskrivning",
                history: "Historia",
                version: "Version",
                content: "Innehåll",
                changes: "Förändringar",
                from: "Från",
                to: "Till",
                add: "Lägg till",
                remove: "Ta bort",
                save: "Spara",
                abort: "Avbryt",
                yes: "Ja",
                no: "Nej",
                ignore: "Ignorera",
                reset: "Återställ",
                change_log: "Förändringslogg",
                value_storage: "Värdeförråd",
                event: "Händelse",
                message: "Meddelande",
                visit: "Gå till",
                title_filter: "Filter",
                filter: "Filtrera",
                search: "Sök",
                loading: "laddar...",
                deprecated: "Avaktualiserad",
                deprecate: "Avaktualisera",
                dialog_deprecate: "Är du säker på att du vill avaktualisera",
                dialog_unsaved_changes: "Du har osparade förändringar, vill du spara?",
                close: "Stäng",
                show: "Visa",
                change_note: "Anteckning",
                add_connection: "Lägg till koppling",
            },
            // english
            en: {
                locale: "en-GB"
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