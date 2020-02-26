
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
                "db_employment-type": "Anställningsform",
                "db_isco-level-1": "ISCO nivå 1",
                "db_isco-level-4": "ISCO nivå 4",
                db_keyword: "Folkliga synonymer och sökbegrepp",
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
                "db_ssyk": "SSYK",
                "db_ssyk-level-1": "SSYK nivå 1",
                "db_ssyk-level-2": "SSYK nivå 2",
                "db_ssyk-level-3": "SSYK nivå 3",
                "db_ssyk-level-4": "SSYK nivå 4",
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
                "concept/definition": "Definition",
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
                "concept.external-standard/sun-education-field-code-2020": "Utbildningsinriktning",
                "concept.external-standard/sun-education-level-code-2020": "Utbildningsnivå",                
                /* Actions */
                CREATED: "Skapad",
                UPDATED: "Uppdaterad",
                DEPRECATED: "Avaktualiserat",
                /* regular words */          
                "occupation-name": "Yrkesbenämning",
                "occupation-field": "Yrkesområde",
                competense: "Kompetens",
                connections: "Relationer",
                connection: "Relation",
                add_connection: "Lägg till relation",
                remove_connection: "Ta bort relation",
                edit_type: "Välj typ av ändring",
                name: "Namn",
                description: "Definition",
                history: "Historik",
                version: "Version",
                content: "Innehåll",
                changes: "Förändringar",
                back: "Tillbaka",
                from: "Från",
                to: "Till",
                add: "Lägg till",
                remove: "Ta bort",
                new_value: "Nytt begrepp",
                quality_classification: "Kvalitetssäkring",
                save: "Spara",
                abort: "Avbryt",
                yes: "Ja",
                no: "Nej",
                create: "Skapa",
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
                visit_concept: "Gå till begrepp",
                visit_replaced_by: "Gå till hänvisat begrepp",
                title_filter: "Filter",
                skill_headline: "Kompetens grupp",
                filter: "Filtrera",
                search: "Sök",
                loading: "Laddar",
                select: "Välj",
                referred_to: "Hänvisas till",
                set_reference: "Hänvisa",
                referred: "Hänvisningar",
                deprecated: "Avaktualiserad",
                deprecate: "Avaktualisera",
                dialog_deprecate: "Är du säker på att du vill avaktualisera",
                dialog_unsaved_changes: "Du har osparade förändringar, vill du spara?",
                close: "Stäng",
                show: "Visa",
                change_note: "Anteckning",
                add_connection: "Ny relation",
                of: "Av",
                to: "Till",
                are_missing_connections: "saknar relation",
                no_items_connected: "Ingen relation existerar",
                all_items_connected: "Alla element har befintlig relation",
                statistics: "Statistik",     
                relation_type: "Relationstyp",
                relation: "Relation",
                value_type: "Värde typ",
                note: "Anteckning",
                default_option: "-- välj",
                error_add_connection_1: "Anteckning kan inte vara blank, vänligen ange förklaring till relation",
                error_add_connection_2: "Ingen relation är markerad",
                error_add_connection_3: "Ogilltig relation, rötter kan inte väljas som relation",
                horizontal_connections: "Horisontella relationer",
                vertical_connections: "Vertikala relationer",
                type: "Typ",
                types: "Typer",
                editable: "Redigerbar",
                edit: "Redigera",
                visible: "Synlig",
                show_deprecated: "Visa avaktualiserade",
                concept: "Begrepp",
                replaced_by_concept: "Hänvisat begrepp",
                select_date: "Datumintervall",
                select_actions: "Typ av åtgärd",
                select_relations: "Sök relationer",
                select_types: "Välj ett eller flera värdeförråd",
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