import React from 'react';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Util from '../../context/util.jsx';

class VersionList extends React.Component { 

    constructor() {
        super();
        this.VERSION_LIST_EVENT_ID = "VERSION_LIST_EVENT_ID";
        this.SORT_EVENT_TYPE = 0;
        this.SORT_CONCEPT_TYPE = 1;
        this.SORT_CONCEPT_LABEL = 2;
        this.state = {
            data: [],
            filter: "",
            loadingData: false,
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

    sortData(data) {
        var cmp;
        switch(this.sortBy) {
            default:
            case this.SORT_EVENT_TYPE:
                cmp = (a) => {return Localization.get(a["event-type"]);};
                break;
            case this.SORT_CONCEPT_TYPE:
                cmp = (a) => {return Localization.get("db_" + a["changed-concept"].type);};
                break;
            case this.SORT_CONCEPT_LABEL:
                cmp = (a) => {return a["changed-concept"].preferredLabel;};
                break;
        }
        return Util.sortByCmp(data, cmp, this.sortDesc);
    }

    filterData() {
        // check if empty
        if(/^\s*$/.test(this.state.filter)) {
            return this.state.data;
        }
        var lowerCaseFilter = this.state.filter.toLowerCase();
        return this.state.data.filter((e) => {
            return e["changed-concept"].preferredLabel.toLowerCase().indexOf(lowerCaseFilter) >= 0;
        });
    }

    getChanges(item) {
        this.setState({
            data: [], 
            loadingData: true,
        });        
        if(item) {
            Rest.abort();
            Rest.getChanges(item.version - 1, item.version, (data) => {
                console.log(data);
                this.setState({
                    data: this.sortData(data), 
                    loadingData: false,
                });
            }, (status) => {
                // TODO: handle error
                this.setState({loadingData: false});
            });
        }
    }

    onFilterChange(value) {        
        this.setState({filter: value});
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

    renderLoader() {
        if(this.state.loadingData) {
            return (
                <Loader/>
            );
        }
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
                    {Localization.get(item["event-type"])}
                </div>
                <div>
                    {Localization.get("db_" + item["changed-concept"].type)}
                </div>
                <div>
                    {item["changed-concept"].preferredLabel}
                </div>
            </div>
        );
    }

    render() {
        console.log(this.state.loadingData);
        return (
            <div className="version_list">
                <Label text={Localization.get("title_filter")}/>
                <input 
                    type="text" 
                    className="rounded" 
                    value={this.state.filter} 
                    onChange={(e) => this.onFilterChange(e.target.value)}/>
                {this.renderHeader()}
                <List 
                    eventId={this.VERSION_LIST_EVENT_ID}
                    data={this.filterData()} 
                    dataRender={this.renderItem.bind(this)}>
                    {this.renderLoader()}
                </List>                                   
            </div>
        );
    }
	
}

export default VersionList;