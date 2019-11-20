import React from 'react';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Button from '../../control/button.jsx';

class Content5 extends React.Component { 

    constructor() {
        super();
        this.TYPE_CONTINENT = "continent";
        this.TYPE_COUNTRY = "country";
        this.TYPE_DRIVING_LICENCE = "driving-licence";
        this.TYPE_EMPLOYMENT_DURATION = "employment-duration";
        this.TYPE_EMPLOYMENT_TYPE = "employment-type";
        this.TYPE_ISCO_LEVEL_4 = "isco-level-4";
        this.TYPE_KEYWORD = "keyword";
        this.TYPE_LANGUAGE = "language";
        this.TYPE_LANGUAGE_LEVEL = "language-level";
        this.TYPE_MUNICIPALITY = "municipality";
        this.TYPE_OCCUPATION_COLLECTION = "occupation-collection";
        this.TYPE_OCCUPATION_FIELD = "occupation-field";
        this.TYPE_OCCUPATION_NAME = "occupation-name";
        this.TYPE_REGION = "region";
        this.TYPE_SKILL = "skill";
        this.TYPE_SNI_1 = "sni-level-1";
        this.TYPE_SNI_2 = "sni-level-2";
        this.TYPE_SSYK = "ssyk-level-4";
        this.TYPE_SUN_EDUCATION_FIELD_1 = "sun-ecucation-field-1";
        this.TYPE_SUN_EDUCATION_FIELD_2 = "sun-ecucation-field-2";
        this.TYPE_SUN_EDUCATION_FIELD_3 = "sun-ecucation-field-3";
        this.TYPE_SUN_EDUCATION_FIELD_4 = "sun-ecucation-field-4";
        this.TYPE_SUN_EDUCATION_LEVEL_1 = "sun-ecucation-level-1";
        this.TYPE_SUN_EDUCATION_LEVEL_2 = "sun-ecucation-level-2";
        this.TYPE_SUN_EDUCATION_LEVEL_3 = "sun-ecucation-level-3";
        this.TYPE_WAGE_TYPE = "wage-type";
        this.TYPE_WORKTIME_EXTENT = "worktime-extent";
        this.options = this.populateOptions();        
        this.state = {
            queryType1: this.TYPE_SSYK,
            queryType2: this.TYPE_SKILL,
        };
    }

    populateOptions() {
        var options = [];
        options.push({value: this.TYPE_CONTINENT, text: Localization.get("db_continent")});
        options.push({value: this.TYPE_COUNTRY, text: Localization.get("db_country")});
        options.push({value: this.TYPE_DRIVING_LICENCE, text: Localization.get("db_driving-licence")});
        options.push({value: this.TYPE_EMPLOYMENT_DURATION, text: Localization.get("db_employment-duration")});
        options.push({value: this.TYPE_EMPLOYMENT_TYPE, text: Localization.get("db_employment-type")});
        options.push({value: this.TYPE_ISCO_LEVEL_4, text: Localization.get("db_isco-level-4")});
        options.push({value: this.TYPE_KEYWORD, text: Localization.get("db_keyword")});
        options.push({value: this.TYPE_LANGUAGE, text: Localization.get("db_language")});
        options.push({value: this.TYPE_LANGUAGE_LEVEL, text: Localization.get("db_language-level")});
        options.push({value: this.TYPE_MUNICIPALITY, text: Localization.get("db_municipality")});
        options.push({value: this.TYPE_OCCUPATION_COLLECTION, text: Localization.get("db_occupation-collection")});
        options.push({value: this.TYPE_OCCUPATION_FIELD, text: Localization.get("db_occupation-field")});
        options.push({value: this.TYPE_OCCUPATION_NAME, text: Localization.get("db_occupation-name")});
        options.push({value: this.TYPE_REGION, text: Localization.get("db_region")});
        options.push({value: this.TYPE_SKILL, text: Localization.get("db_skill")});
        options.push({value: this.TYPE_SNI_1, text: Localization.get("db_sni_1")});
        options.push({value: this.TYPE_SNI_2, text: Localization.get("db_sni_2")});
        options.push({value: this.TYPE_SSYK, text: Localization.get("db_ssyk")});
        options.push({value: this.TYPE_SUN_EDUCATION_FIELD_1, text: Localization.get("db_sun-education-field_1")});
        options.push({value: this.TYPE_SUN_EDUCATION_FIELD_2, text: Localization.get("db_sun-education-field_2")});
        options.push({value: this.TYPE_SUN_EDUCATION_FIELD_3, text: Localization.get("db_sun-education-field_3")});
        options.push({value: this.TYPE_SUN_EDUCATION_FIELD_4, text: Localization.get("db_sun-education-field_4")});
        options.push({value: this.TYPE_SUN_EDUCATION_LEVEL_1, text: Localization.get("db_sun-education-level_1")});
        options.push({value: this.TYPE_SUN_EDUCATION_LEVEL_2, text: Localization.get("db_sun-education-level_2")});
        options.push({value: this.TYPE_SUN_EDUCATION_LEVEL_3, text: Localization.get("db_sun-education-level_3")});
        options.push({value: this.TYPE_WAGE_TYPE, text: Localization.get("db_wage-type")});
        options.push({value: this.TYPE_WORKTIME_EXTENT, text: Localization.get("db_worktime-extent")});
        options.sort((a, b) => {
            if(a.text < b.text) {
                return -1;
            }
            if(a.text > b.text) {
                return 1;
            }
            return 0;
        });
        return options;
    }

    onStatisticsClicked() {
        EventDispatcher.fire(Constants.EVENT_SIDEPANEL_STATISTICS_SELECTED);
    }

    onConnectionsClicked() {
        EventDispatcher.fire(Constants.EVENT_SIDEPANEL_CONNECTIONS_SELECTED, {
            type1: this.state.queryType1, 
            type2: this.state.queryType2,
        });
    }

    onTypeChanged(id, e) {
        if(id == 1) {
            this.setState({
                queryType1: e.target.value,
            });
        } else {
            this.setState({
                queryType2: e.target.value,
            });
        }
    }

    renderOptions() {
        var options = this.options.map(o => this.renderOption(o.value, o.text));
        return options;
    }

    renderOption(value, text) {
        return (
            <option value={value}>
                {Localization.get(text)}
            </option>
        );
    }

    renderTypeSelect(value, onChange) {
        return (
        <select 
            className="sub_panel_select rounded"
            value={value}
            onChange={onChange}>
            {this.renderOptions()}            
        </select>
        );
    }

    render() {
        return (
            <div className="side_content_5">
                <div className="sub_panel">
                    <Button 
                        text={Localization.get("statistics")} 
                        onClick={this.onStatisticsClicked.bind(this)}
                    />
                </div>
                <div className="sub_panel">
                    {this.renderTypeSelect(this.state.queryType1, this.onTypeChanged.bind(this, 1))}
                    {this.renderTypeSelect(this.state.queryType2, this.onTypeChanged.bind(this, 2))}
                    <Button 
                        text={Localization.get("connections")}
                        onClick={this.onConnectionsClicked.bind(this)}
                    />
                </div>
            </div>
        );
    }
	
}

export default Content5;