
import Constants from './constants.jsx';

class Localization { 

    constructor() {
        // localization
        this.resources = {
            // swedish
            sv: {
                locale: "sv-SE",
                /* db types */
                db_continent: "Världsdel",
                db_country: "Land",
                "db_driving-licence": "Körkort",
                "db_driving-licence-combination": "Körkorts-kombination",
                "db_employment-duration": "Anställningsvaraktighet",
                "db_employment-type": "Anställningstyp",
                "db_isco-level-1": "ISCO nivå 1",
                "db_isco-level-4": "ISCO nivå 4",
                db_keyword: "Folkligsynonym",
                db_language: "Språk",
                "db_language-level": "Språknivå",
                db_municipality: "Kommun",
                "db_occupation-collection": "Yrkessamling",
                "db_occupation-field": "Yrkesområde",
                "db_occupation-name": "Yrkesbenämning",
                db_region: "EU-Region",
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
                "db_sun-education-field-1": "Utbildningsinriktning nivå 1",
                "db_sun-education-field-2": "Utbildningsinriktning nivå 2",
                "db_sun-education-field-3": "Utbildningsinriktning nivå 3",
                "db_sun-education-field-4": "Utbildningsinriktning nivå 4",
                "db_sun-education-level": "Utbildningsnivå",
                "db_sun-education-level-1": "Utbildningsnivå nivå 1",
                "db_sun-education-level-2": "Utbildningsnivå nivå 2",
                "db_sun-education-level-3": "Utbildningsnivå nivå 3",
                "db_wage-type": "Löneform",
                "db_worktime-extent": "Arbetstid",
                "concept/definition": "Beskrivning",
                "concept/id": "Id",
                "concept/preferredLabel": "Namn",
                "concept/type": "Värdeförråd",
                "concept/sort-order": "Sorteringsordning",
                "concept.external-database.ams-taxonomy-67/id": "Externt id",
                "concept.external-standard/ssyk-code-2012": "SSYK 2012",
                "concept.external-standard/nuts-level-3-code-2013": "NUTS nivå 3",
                "concept.external-standard/isco-code-08": "ISCO 08",
                "concept.external-standard/lau-2-code-2015": "LAU 2 2015",
                "concept.external-standard/driving-licence-code-2013": "Körkortskod 2013", 
                "concept.external-standard/implicit-driving-licences": "Implicit körkort",
                "concept.external-standard/iso-3166-1-alpha-3-2013": "ISO-3166-1 alpha 3",
                "concept.external-standard/iso-3166-1-alpha-2-2013": "ISO-3166-1 alpha 2",
                "concept.external-standard/sni-level-code-2007": "SNI nivå 2007",
                "concept.external-standard/iso-639-3-alpha-2-2007": "ISO-639-3 alpha 2",
                "concept.external-standard/iso-639-3-alpha-3-2007": "ISO-639-3 alpha 3",
                "concept.external-standard/sun-education-field-code-2020": "Utbildningsinriktningskod",
                "concept.external-standard/sun-education-level-code-2020": "Utbildningsnivå",                
                /* Actions */
                CREATED: "Skapad",
                UPDATED: "Uppdaterad",
                DEPRECATED: "Avaktualiserat",
                /* regular words */
                "occupation-group": "Yrkesgrupp",
                "common-name": "Folkligsynonym",
                "occupation-name": "Yrkesbenämning",
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
                new_value: "Skapa nytt värde",
                save: "Spara",
                abort: "Avbryt",
                yes: "Ja",
                no: "Nej",
                next: "Nästa",
                previous: "Föregående",
                ignore: "Ignorera",
                reset: "Återställ",
                size: "Storlek",
                clear: "Rensa",
                settings: "Inställningar",
                saving: "Sparar",
                change_log: "Förändringslogg",
                value_storage: "Värdeförråd",
                event: "Händelse",
                message: "Meddelande",
                visit: "Gå till",
                title_filter: "Filter",
                skill_headline: "Kompetens grupp",
                filter: "Filtrera",
                search: "Sök",
                loading: "laddar",
                deprecated: "Avaktualiserad",
                deprecate: "Avaktualisera",
                dialog_deprecate: "Är du säker på att du vill avaktualisera",
                dialog_unsaved_changes: "Du har osparade förändringar, vill du spara?",
                close: "Stäng",
                show: "Visa",
                change_note: "Anteckning",
                add_connection: "Lägg till koppling",
                of: "av",
                to: "till",
                are_missing_connections: "saknar kopplingar",
                no_items_connected: "Inga kopplingar funna",
                all_items_connected: "Alla element är kopplade",
                statistics: "Statistik",     
                relation_type: "Relationstyp",  
                value_type: "Värde typ",
                note: "Antekning",
                default_option: "-- välj",
                error_add_connection_1: "Antekning kan inte vara blank, vänligen ange förklaring till koppling",
                error_add_connection_2: "Ingen koppling är markerad",
                error_add_connection_3: "Ogilltig koppling, rötter kan inte väljas som koppling",
                horizontal_connections: "Horisontella kopplingar",
                vertical_connections: "Vertikala kopplingar",
                type: "Typ",
                types: "Typer",
                editable: "Editerbar",
                visible: "Synlig",
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