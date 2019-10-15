import React from 'react';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';

class Content3 extends React.Component { 

    constructor() {
        super();
        this.state = {
            components: [],
        };
        this.boundSideTimePeriodSelected = this.onSideTimePeriodSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideTimePeriodSelected, Constants.EVENT_SIDEPANEL_TIME_PERIOD_SELECTED);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideTimePeriodSelected);
    }

    onSideTimePeriodSelected(period) {
        var components = [];
        var key = 0;
        components.push(
            <Label 
                css="main_content_title" 
                text={Localization.get("change_log")} 
                key={key++}/>
        );
        components.push(
            <Group 
                css="changes_group"
                text={Localization.get("changes")}
                key={key++}>
                
            </Group>
        );
        this.setState({components: components});
    }

    render() {
        return (
            <div className="main_content_3">
                {this.state.components}      
            </div>
        );
    }
	
}

export default Content3;