import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.TYPE_LIST = "ssyk_level_4";
        this.TYPE_NAME = "occupation_name"; // benämning
        this.TYPE_COMPETENCE = "skill";
        this.TYPE_CASUAL_NAME = "keyword"; // folklig synonym
        this.TYPE_FIELD = "occupation_field"; // yrkesområde
        this.state = {
            queryType: this.TYPE_LIST,
            detailsData: [],
            resultData: [],
        };
        this.searchReference = null;
    }

    componentDidMount() {
        this.search();
    }

    componentWillUnmount() {

    }

    setData(data) {
        data.sort((a, b) => {
            if(a.preferredLabel < b.preferredLabel) { 
                return -1; 
            }
            return a.preferredLabel > b.preferredLabel ? 1 : 0;
        });
        if(this.state.queryType == this.TYPE_LIST) {
            this.setState({resultData: data});
        } else {
            this.setState({detailsData: data});
        }
    }

    search(query) {
        Rest.abort();
        if(query && query.length > 0) {
            Rest.searchConcepts(this.state.queryType, query, (data) => {
                this.setData(data);
            }, (status) => {
                // TODO: display error
            });
        } else {
            Rest.getConcepts(this.state.queryType, (data) => {
                this.setData(data);
            }, (status) => {
                // TODO: display error
            });
        }
    }

    onTypeChanged(e) {
        this.searchReference.value = "";
        this.setState({
            queryType: e.target.value,
            resultData: [],
        }, () => {
            this.search();
        });
    }

    onSearchClicked() {
        this.search(this.searchReference.value);        
    }

    onDetailsItemSelected(item) {
        console.log(item);
        Rest.abort();
        Rest.searchRelations(item.id, (data) => {
            this.setState({resultData: data});
        }, (status) => {
            // TODO: display error
        });
    }

    onResultItemSelected(item) {
        // TODO: send notification
        console.log(item);
        EventDispatcher.fire(Constants.EVENT_SSYK4_ITEM_SELECTED, item);
    }

    renderOption(value) {
        return (
            <option value={value}>
                {Localization.get(value)}
            </option>
        );
    }

    renderQueary() {
        return(
            <div className="sub_panel">
                <select 
                    className="sub_panel_select"
                    value={this.state.queryType}
                    onChange={this.onTypeChanged.bind(this)}>
                    <option value={this.TYPE_LIST}>
                        {Localization.get("list")}
                    </option>
                    {this.renderOption(this.TYPE_NAME)}
                    {this.renderOption(this.TYPE_COMPETENCE)}
                    {this.renderOption(this.TYPE_CASUAL_NAME)}
                    {this.renderOption(this.TYPE_FIELD)}
                </select>
                <div className="sub_panel_search">
                    <input 
                        type="text"
                        ref={(x) => this.searchReference = x}/>
                    <Button 
                        text="Sök"
                        onClick={this.onSearchClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderDetailsItem(item) {
        return (
            <div>
                {item.preferredLabel}
            </div>
        );
    }

    renderResultItem(item) {
        return (
            <div className="side_content_1_result_item">
                <div>{0}</div>
                <div>{item.preferredLabel}</div>
            </div>
        );
    }

    renderDetails() {
        if(this.state.queryType != this.TYPE_LIST) {
            return (
                <div className="side_content_1_group">
                    <Label text={Localization.get(this.state.queryType)}/>
                    <List 
                        data={this.state.detailsData}
                        dataRender={this.renderDetailsItem.bind(this)}
                        onItemSelected={this.onDetailsItemSelected.bind(this)}/>
                </div>
            );
        }
    }

    renderResult() {
        return (
            <div className="side_content_1_group">
                <Label text="Resultat"/>
                <List 
                    data={this.state.resultData}
                    dataRender={this.renderResultItem.bind(this)}
                    onItemSelected={this.onResultItemSelected.bind(this)}>
                    <div className="side_content_1_result_header">
                        <div>SSYK</div>
                        <div>Yrkesgrupp</div>
                    </div>
                </List>
            </div>
        );
    }

    render() {
        return (
            <div className="side_content_1">
                {this.renderQueary()}
                {this.renderDetails()}
                {this.renderResult()}
            </div>
        );
    }
	
}

export default Content1;