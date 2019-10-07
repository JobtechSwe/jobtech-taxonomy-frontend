import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Description from './description.jsx';
import OccupationNames from './occupation_names.jsx';
import OccupationSkills from './occupation_skills.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.state = {
            components: [],
        };
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
    }

    onSideItemSelected(item) {
        var components = [];
        var key = 0;
        components.push(<Label text={item.type} key={key++}/>);
        components.push(<Description item={item} key={key++}/>);
        if(item.type == "ssyk_level_4") {
            components.push(
                <div className="main_content_1_lower" key={key++}>
                    <OccupationNames item={item}/>
                    <OccupationSkills item={item}/>
                </div>
            );
        }
        this.setState({components: components});
    }

    render() {
        return (
            <div className="main_content_1">                
                {this.state.components}
            </div>
        );
    }
	
}

export default Content1;