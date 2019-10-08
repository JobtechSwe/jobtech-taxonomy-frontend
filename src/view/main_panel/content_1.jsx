import React from 'react';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Description from './description.jsx';
import Connections from './connections.jsx';

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
        components.push(
            <div className="main_content_1_lower" key={key++}>                    
                <Connections item={item}/>
            </div>
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