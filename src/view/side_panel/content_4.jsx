import React from 'react';
import ConceptsSearch from './concepts_search.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';

class Content4 extends React.Component { 

    constructor() {
        super();
        this.state = {
            mode: 0
        };
    }

    componentDidMount() {        
    }

    onModeChanged(e) {
        EventDispatcher.fire(Constants.EVENT_GRAPH_MODE_SELECTED, e.target.value);
        this.setState({mode: e.target.value});
    }

    render() {
        return (
            <div className="side_content_4">
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
                </div>                
                <ConceptsSearch lockToType="ssyk-level-1 ssyk-level-2 ssyk-level-3 ssyk-level-4"/>
            </div>
        );
    }
	
}

export default Content4;