import React from 'react';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import List from '../../control/list.jsx';

class Content4 extends React.Component { 

    constructor() {
        super();

        this.state = {
            data: []
        };
    }

    componentDidMount() {
        Rest.getConceptsSsyk("ssyk-level-1 ssyk-level-2 ssyk-level-3 ssyk-level-4", (data) => {
            this.setState({data: data});
        }, (status) => {
            // TODO: error handling
        });
    }

    onItemSelected(item) {
        EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item);
    }

    renderItem(item) {
        return(
            <div>
                {item.preferredLabel}
            </div>
        );
    }

    render() {
        return (
            <div className="side_content_4">
                <List 
                    data={this.state.data}
                    dataRender={this.renderItem.bind(this)}
                    onItemSelected={this.onItemSelected.bind(this)}
                />
            </div>
        );
    }
	
}

export default Content4;