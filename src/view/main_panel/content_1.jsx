import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import OccupationInfo from './occupation_info.jsx';
import OccupationNames from './occupation_names.jsx';
import OccupationSkills from './occupation_skills.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.state = {
            item: null,
        };
        this.boundSsyk4ItemSelected = this.onSsyk4ItemSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSsyk4ItemSelected, Constants.EVENT_SSYK4_ITEM_SELECTED);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSsyk4ItemSelected);
    }

    onSsyk4ItemSelected(item) {
        this.setState({item: item});
    }

    render() {
        return (
            <div className="main_content_1">
                <OccupationInfo item={this.state.item}/>
                <div className="main_content_1_lower">
                    <OccupationNames item={this.state.item}/>
                    <OccupationSkills item={this.state.item}/>
                </div>
            </div>
        );
    }
	
}

export default Content1;