import React from 'react';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Description from './description.jsx';
import Connections from './connections.jsx';
import ItemHistory from './item_history.jsx';

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
        components.push(
            <Label 
                css="main_content_title" 
                text={Localization.get("db_" + item.type)} 
                key={key++}/>
        );
        components.push(
            <Group 
                text="Info"
                key={key++}>
                <Description item={item}/>
            </Group>
        );
        components.push(
            <Group 
                text={Localization.get("connections")}
                key={key++}>
                <Connections item={item}/>
            </Group>
        );
        components.push(
            <Group 
                text={Localization.get("history")}
                key={key++}>
                <ItemHistory item={item}/>
            </Group>
        );
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