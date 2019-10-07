import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import TreeView from '../../control/tree_view.jsx';
import ControlUtil from '../../control/util.jsx';

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
        this.expandedItem = null;
        this.queryTreeView = ControlUtil.createTreeView();
        this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
    }

    componentDidMount() {
        this.search();
    }

    componentWillUnmount() {

    }

    formatLabel(label) {
        return label.replace(/\/(?! )/g, " / ");
    }

    setData(data) {
        data.sort((a, b) => {
            if(a.preferredLabel < b.preferredLabel) { 
                return -1; 
            }
            return a.preferredLabel > b.preferredLabel ? 1 : 0;
        });
        this.queryTreeView.clear();
        for(var i=0; i<data.length; ++i) {
            data[i].preferredLabel = this.formatLabel(data[i].preferredLabel);
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, data[i]);
            item.setShowButton(false);
            item.setText(data[i].preferredLabel);
            this.queryTreeView.addRoot(item);
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
        this.expandedItem = null;
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

    onQueryItemSelected(item) {
        console.log(item);
        if(this.expandedItem == item) {
            item.setExpanded(!item.expanded);
            return;
        }
        var restItem = item.data;
        if(restItem.type == "ssyk_level_4") {
            EventDispatcher.fire(Constants.EVENT_SSYK4_ITEM_SELECTED, restItem);
        } else {
            if(this.expandedItem) {
                this.expandedItem.clear();
            }
            this.expandedItem = item;
            Rest.abort();
            Rest.getConceptRelations(restItem.id, "ssyk_level_4", this.state.queryType == this.TYPE_FIELD ? Constants.RELATION_NARROWER : Constants.RELATION_BROADER, (data) => {
                item.clear();
                for(var i=0; i<data.length; ++i) {
                    data[i].preferredLabel = this.formatLabel(data[i].preferredLabel);
                    var child = ControlUtil.createTreeViewItem(this.queryTreeView, data[i]);
                    child.setText(data[i].preferredLabel);
                    item.addChild(child);
                }
                item.setExpanded(true);
            }, (status) => {
                // TODO: display error
            });
        }
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
                    className="sub_panel_select rounded"
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
                        className="rounded"
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
        var ssyk = 0;
        return (
            <div className="side_content_1_result_item">
                <div>{ssyk}</div>
                <div>{item.preferredLabel}</div>
            </div>
        );
    }

    renderResult() {
        return (
            <TreeView context={this.queryTreeView}/>
        );
        /*if(this.state.queryType != this.TYPE_LIST) {
            return (
                <div className="side_content_1_group">
                    <Label text={Localization.get(this.state.queryType)}/>
                    <List 
                        data={this.state.detailsData}
                        dataRender={this.renderDetailsItem.bind(this)}
                        onItemSelected={this.onDetailsItemSelected.bind(this)}/>
                </div>
            );
        }*/
    }

    /*renderResult() {
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
    }*/

    render() {
        return (
            <div className="side_content_1">
                {this.renderQueary()}
                {this.renderResult()}
            </div>
        );
    }
	
}

export default Content1;