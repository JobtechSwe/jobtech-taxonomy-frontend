import React from 'react';
import Button from '../../control/button.jsx';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import App from '../../context/app.jsx';
import TreeView from '../../control/tree_view.jsx';
import ControlUtil from '../../control/util.jsx';
import Loader from '../../control/loader.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.TYPE_SSYK = "ssyk-level-4";
        this.TYPE_NAME = "occupation-name";
        this.TYPE_COMPETENCE = "skill-headline";
        this.TYPE_COMMON_NAME = "keyword"; 
        this.TYPE_FIELD = "occupation-field"; 
        this.state = {
            queryType: this.TYPE_SSYK,
            detailsData: [],
            resultData: [],
        };
        this.searchReference = null;
        this.expandedItem = null;
        this.queryTreeView = ControlUtil.createTreeView();
        this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
        this.boundMainItemSelected = this.onMainItemSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundMainItemSelected, Constants.EVENT_MAINPANEL_ITEM_SELECTED);
        this.search();
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundMainItemSelected);
    }

    formatLabel(label) {
        return label.replace(/\/(?! )/g, " / ");
    }

    getItemFormat(data) {
        return (
            <div className="ssyk_item">
                <div>{data.ssyk}</div>
                <div>{data.preferredLabel}</div>
            </div>
        );
    }

    setData(data) {
        for(var i=0; i<data.length; ++i) {
            var item = data[i];            
            if(item["ssyk-code-2012"]) {
                item.ssyk = item["ssyk-code-2012"];            
                while(item.ssyk.length < 4) {
                    item.ssyk = "0" + item.ssyk;
                }                
            }
            item.preferredLabel = this.formatLabel(item.preferredLabel);
        }

        data.sort((a, b) => {
            if(a.ssyk) {
                if(a.ssyk < b.ssyk) { 
                    return -1; 
                }
                return a.ssyk > b.ssyk ? 1 : 0;
            }
            if(a.preferredLabel < b.preferredLabel) { 
                return -1; 
            }
            return a.preferredLabel > b.preferredLabel ? 1 : 0;
        });
        this.queryTreeView.clear();
        for(var i=0; i<data.length; ++i) {
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, data[i]);
            item.setShowButton(false);
            item.setText(data[i].ssyk ? this.getItemFormat(data[i]) : data[i].preferredLabel);
            this.queryTreeView.addRoot(item);
        }
    }

    search(query) {
        this.queryTreeView.clear();
        this.showLoader();
        Rest.abort();
        if(query && query.length > 0) {
            Rest.searchConcepts(this.state.queryType, query, (data) => {
                this.setData(data);
            }, (status) => {
                // TODO: display error
            });
        } else {
            if(this.state.queryType == this.TYPE_SSYK) {                
                Rest.getConceptsSsyk("ssyk-level-1 ssyk-level-2 ssyk-level-3 ssyk-level-4", (data) => {
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
    }

    showLoader() {
        var waitingForItem = ControlUtil.createTreeViewItem(this.queryTreeView, null);
        waitingForItem.setText(<Loader/>);
        this.queryTreeView.addRoot(waitingForItem);
    }

    onMainItemSelected(item) {
        // TODO: check if item is in tree and select item
        var selected = this.queryTreeView.getSelected();
        if(selected) {
            this.queryTreeView.setSelected(selected, false);
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

    onSaveDialogResult(item, result) {
        if(result != Constants.DIALOG_OPTION_ABORT) {
            // user saved or discared changes and wants to continue
            EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item.data);
        }
    }

    onQueryItemSelected(item) {
        if(item.data) {
            if(App.hasUnsavedChanges()) {
                App.showSaveDialog(this.onSaveDialogResult.bind(this, item));
            } else {
                EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item.data);
            }
        }
    }

    renderOption(value, text) {
        return (
            <option value={value}>
                {Localization.get(text)}
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
                    <option value={this.TYPE_SSYK}>
                        {Localization.get("occupation-group")}
                    </option>
                    {this.renderOption(this.TYPE_NAME, "occupation-name")}
                    {this.renderOption(this.TYPE_COMPETENCE, "competense")}
                    {this.renderOption(this.TYPE_COMMON_NAME, "common-name")}
                    {this.renderOption(this.TYPE_FIELD, "occupation-field")}
                </select>
                <div className="sub_panel_search">
                    <input 
                        type="text"
                        className="rounded"
                        ref={(x) => this.searchReference = x}/>
                    <Button 
                        text={Localization.get("search")}
                        onClick={this.onSearchClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="side_content_1">
                {this.renderQueary()}
                <TreeView context={this.queryTreeView}/>
            </div>
        );
    }
	
}

export default Content1;