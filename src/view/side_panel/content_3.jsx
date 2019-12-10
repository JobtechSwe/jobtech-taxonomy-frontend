import React from 'react';
import ConceptsSearch from './concepts_search.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import settings from '../../context/settings.jsx';

class Content3 extends React.Component { 

    constructor() {
        super();
        this.state = {
            mode: 0,
            types: JSON.parse(JSON.stringify(Constants.DB_TYPES))
        };
    }

    componentDidMount() {        
    }

    onModeChanged(e) {
        EventDispatcher.fire(Constants.EVENT_GRAPH_MODE_SELECTED, e.target.value);
        this.setState({mode: e.target.value});
    }

    isEnabled(type) {
        return this.state.types.indexOf(type) != -1;
    }

    onTypeChanged(type) {
        var types = this.state.types;
        var index = this.state.types.indexOf(type);
        if(index == -1) {
            types.push(type);
        } else {
            types.splice(index, 1);
        }
        EventDispatcher.fire(Constants.EVENT_VISIBLE_TYPES_SELECTED, types);
        this.setState({types: types});
    }

    renderShowTypeList() {
        var list = JSON.parse(JSON.stringify(Constants.DB_TYPES));
        list.sort((a, b) => {
            var p1 = Localization.get("db_" + a);
            var p2 = Localization.get("db_" + b);
            if(p1 < p2) return -1;
            if(p1 > p2) return 1;
            return 0;
        });
        var types = list.map((type, index) => {
            return (
                <div 
                    key={index}>
                    <Label 
                        css=""
                        text={Localization.get("db_" + type)}/>
                    <input 
                        type="checkbox"
                        onChange={this.onTypeChanged.bind(this, type)}
                        checked={this.isEnabled(type)}/>
                </div>
            );
        });
        return (
            <List css="side_content_3_types_list">
                {types}
            </List>
        );
    }

    render() {
        return (
            <div className="side_content_3">
                <div className="sub_panel">
                    <select 
                        className="sub_panel_select rounded"
                        value={this.state.mode}
                        onChange={this.onModeChanged.bind(this)}>
                        <option 
                            value="1" 
                            key="1">
                            {Localization.get("horizontal_connections")}
                        </option>
                        <option 
                            value="0" 
                            key="0">
                            {Localization.get("vertical_connections")}
                        </option>
                    </select>
                    {this.renderShowTypeList()}                    
                </div>                
                <ConceptsSearch />
            </div>
        );
    }
	
}

export default Content3;