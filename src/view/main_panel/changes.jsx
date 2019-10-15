import React from 'react';
import List from '../../control/list.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';

class Changes extends React.Component { 

    constructor() {
        super();
        this.LIST_EVENT_ID = "CHANGES_LIST_ID";
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.getChanges(this.props.item);
    }

    UNSAFE_componentWillReceiveProps(props) {
        EventDispatcher.fire(this.LIST_EVENT_ID);
        this.getChanges(props.item);
    }

    getChanges(item) {
        if(item) {
            Rest.abort();
            Rest.getChanges(item.version - 1, item.version, 0, 50, (data) => {
                this.setState({data: data});
            }, (status) => {
                // TODO: handle error
            });
        }
    }

    renderItem(item) {
        return(
            <div className="changes_item">
                <div>
                    {item.version}
                </div>
                <div>
                    {Localization.get(item.eventType)}
                </div>
                <div>
                    {Localization.get("db_" + item.concept.type)}
                </div>
                <div>
                    {item.concept.preferredLabel}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="changes">
                <List 
                    eventId={this.LIST_EVENT_ID}
                    data={this.state.data} 
                    dataRender={this.renderItem.bind(this)}/>
            </div>
        );
    }
	
}

export default Changes;