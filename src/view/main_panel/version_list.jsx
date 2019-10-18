import React from 'react';
import List from '../../control/list.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';

class VersionList extends React.Component { 

    constructor() {
        super();
        this.VERSION_LIST_EVENT_ID = "VERSION_LIST_EVENT_ID";
        this.SORT_EVENT_TYPE = 0;
        this.SORT_CONCEPT_TYPE = 1;
        this.SORT_CONCEPT_LABEL = 2;
        this.state = {
            data: [],
        }
        this.sortBy= this.SORT_EVENT_TYPE;
        this.sortDesc= false;
    }

    componentDidMount() {
        this.getChanges(this.props.item);
    }

    UNSAFE_componentWillReceiveProps(props) {
        EventDispatcher.fire(this.VERSION_LIST_EVENT_ID);
        this.getChanges(props.item);
    }
    
    sortByKey(items, lambda, direction) {
        items.sort((a, b) => {
            return this.sortValue(direction, lambda(a), lambda(b));
        });
        return items;
    }
    
    sortValue(direction, a, b) {
        if(direction) {
            if(a < b) return 1;
            if(a > b) return -1;
        } else {
            if(a < b) return -1;
            if(a > b) return 1;
        }
        return 0;
    }

    sortData(data) {
        var lambda;
        switch(this.sortBy) {
            default:
            case this.SORT_EVENT_TYPE:
                lambda = (a) => {return Localization.get(a.eventType);};
                break;
            case this.SORT_CONCEPT_TYPE:
                lambda = (a) => {return Localization.get("db_" + a.concept.type);};
                break;
            case this.SORT_CONCEPT_LABEL:
                lambda = (a) => {return a.concept.preferredLabel;};
                break;
        }
        return this.sortByKey(data, lambda, this.sortDesc);
    }

    getChanges(item) {
        this.setState({data: []});
        if(item) {
            Rest.abort();
            Rest.getChanges(item.version - 1, item.version, 0, 50, (data) => {
                this.setState({data: this.sortData(data)});
            }, (status) => {
                // TODO: handle error
            });
        }
    }

    onSortClicked(sortBy) {
        if(this.sortBy == sortBy) {
            this.sortDesc = !this.sortDesc;
        } else {
            this.sortBy = sortBy;
            this.sortDesc = false;
        }
        this.setState({ data: this.sortData(this.state.data) });
    }

    renderHeader() {
        return(
            <div className="version_list_header no_select font">               
                <div onClick={this.onSortClicked.bind(this, this.SORT_EVENT_TYPE)}>
                    {Localization.get("event")}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_TYPE)}>
                    {Localization.get("value_storage")}
                </div>
                <div onClick={this.onSortClicked.bind(this, this.SORT_CONCEPT_LABEL)}>
                    {Localization.get("message")}
                </div>
            </div>
        );
    }

    renderItem(item) {
        return(
            <div className="version_list_item">               
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
            <div className="version_list">
                 {this.renderHeader()}
                <List 
                    eventId={this.VERSION_LIST_EVENT_ID}
                    data={this.state.data} 
                    dataRender={this.renderItem.bind(this)}>                   
                </List>
            </div>
        );
    }
	
}

export default VersionList;