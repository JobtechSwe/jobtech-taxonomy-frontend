
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
                "db_employment-duration": "Anställningsvaraktighet",
                "db_employment-type": "Anställningsform",
                "db_isco": "ISCO",
                "db_isco-level-4": "ISCO nivå 4",
                db_keyword: "Sökbegrepp",
                db_language: "Språk",
                "db_language-level": "Språknivå",
                db_municipality: "Kommun",
                "db_occupation-collection": "Yrkessamling",
                "db_occupation-experience-year": "Tid i yrke",
                "db_occupation-field": "Yrkesområde",
                "db_occupation-name": "Yrkesbenämning",
                db_region: "EU-Region",
                db_skill: "Kompetensbegrepp",
                "db_skill-headline": "Kompetensgrupp",
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
                "db_unemployment-fund": "A-kassa",
                "db_unemployment-type": "Sökandekategorier (SKAT)",
                "db_wage-type": "Löneform",
                "db_worktime-extent": "Arbetstid",
                "concept/definition": "Definition",
                "concept/id": "Concept-ID",
                "concept/preferredLabel": "Namn",
                "concept/type": "Värdeförråd",
                "concept/sort-order": "Sorteringsordning",
                "concept/quality-level": "Kvalitetsnivå",
                "concept.external-database.ams-taxonomy-67/id": "Externt id",
                "concept.external-standard/ssyk-code-2012": "SSYK-kod",
                "concept.external-standard/eures": "EURES",
                "concept.external-standard/nnuts": "NNUTS",
                "concept.external-standard/nuts-level-3-code-2013": "NUTS nivå 3",
                "concept.external-standard/isco-code-08": "ISCO-kod",
                "concept.external-standard/lau-2-code-2015": "LAU 2 2015",
                "concept.external-standard/driving-licence-code-2013": "Körkortskod 2013", 
                "concept.external-standard/implicit-driving-licences": "Implicit körkort",
                "concept.external-standard/iso-3166-1-alpha-2-2013": "ISO-3166-1 alpha 2",
                "concept.external-standard/iso-3166-1-alpha-3-2013": "ISO-3166-1 alpha 3",
                "concept.external-standard/sni-level-code-2007": "SNI nivå 2007",
                "concept.external-standard/iso-639-3-alpha-2-2007": "ISO-639-3 alpha 2",
                "concept.external-standard/iso-639-3-alpha-3-2007": "ISO-639-3 alpha 3",
                "concept.external-standard/sun-education-field-code-2020": "Utbildningsinriktning",
                "concept.external-standard/sun-education-level-code-2020": "Utbildningsnivå",                
                /* Actions */
                CREATED: "Skapad",
                UPDATED: "Uppdaterad",
                DEPRECATED: "Avaktualiserad",
                COMMENTED: "Anteckning",
                /* regular words */          
                "occupation-name": "Yrkesbenämning",
                "occupation-field": "Yrkesområde",

                info: "Info",
                database_id: "Databas-ID",
                competense: "Kompetens",
                connections: "Relationer",
                connection: "Relation",
                undefined: "Ej definierad",
                quality_control: "Kvalitetsnivå",
                add_connection: "Lägg till relation",
                remove_connection: "Ta bort relation",
                add_comment: "Manuell anteckning",
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
                quality_classification: "Kvalitetsnivå",
                quality_level_short: "KN",
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
                relations: "Relationer",
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
                action: "Händelse",
                actions: "Händelser",
                select_search: "Typ av sökning",
                select_date: "Datumintervall",
                select_actions: "Välj typ av händelse",
                select_relations: "Välj relationer",
                select_types: "Välj ett eller flera värdeförråd",
                search_result: "Sökresultat",
                not_published: "Ej publiserad",
                export_headline: "Exporterings inställningar",
                export_pdf: "PDF",
                export_excel: "Excel",
                export: "Exportera",
                exporting: "Exporterar",
                code: "Kod",
                date: "Datum",
                new_version: "Ny version",
                error: "Fel",
                publish_error_0: "Relation till SSYK-4 saknas",
                publish_error_1: "Relation till ISCO-4 saknas",
                publish_error_2: "Relation till kompetensgrupp saknas",
                publish_error_3: "Relation till SSYK-4 saknas",
                publish: "Publicera",
                from_name: "Från namn",
                from_type: "Från typ",
                from_id: "Från id",
                to_name: "Till namn",
                to_type: "Till typ",
                to_id: "Till id",
                graph: "Graf",
                tools: "Verktyg",
                created_short: "S",
                deprecated_short: "A",
                against: "till",
                changed: "Uppdaterat",
                relation_created: "Relation skapad",
                relation_removed: "Relation borttagen",
                relation_updated: "Relation uppdaterad",
                relation_weight: "Relationsvikt",
                last_changed: "Senast uppdaterad",
                weight: "Vikt",
                edit_concept_relation_text: "Markera det begrepp som den nya relationen ska gå till",
                edit_concept_recommended_relation: "Den rekommenderade relationstypen är",
                visit_latest_search: "Visa senaste sökresultat",
                remember: "Kom ihåg",
                app_name: "Taxonomieditor",
                set_user_id: "Ange användar-id",
                user_id: "Användar-id",
                use: "Använd",
                forget: "Glöm",
                invalid_user_id: "Ogiltig inloggning",
            },
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
            console.log("localization not found: '" + key + "' selecting default");
            this.lang = this.resources["sv"];
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