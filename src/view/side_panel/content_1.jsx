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
        this.TYPE_SEARCH = "search";
        this.TYPE_CONTINENT = "continent";
        this.TYPE_COUNTRY = "country";
        this.TYPE_DRIVING_LICENCE = "driving-licence";
        this.TYPE_EMPLOYMENT_DURATION = "employment-duration";
        this.TYPE_EMPLOYMENT_TYPE = "employment-type";
        this.TYPE_ISCO_LEVEL_4 = "isco-level-4";
        this.TYPE_KEYWORD = "keyword";
        this.TYPE_LANGUAGE = "language";
        this.TYPE_LANGUAGE_LEVEL = "language-level";
        this.TYPE_MUNICIPALITY = "municipality";
        this.TYPE_OCCUPATION_COLLECTION = "occupation-collection";
        this.TYPE_OCCUPATION_FIELD = "occupation-field";
        this.TYPE_OCCUPATION_NAME = "occupation-name";
        this.TYPE_REGION = "region";
        //this.TYPE_SKILL = "skill-headline skill";
        this.TYPE_SKILL = "skill-headline";
        this.TYPE_SNI = "sni-level-1 sni-level-2";
        this.TYPE_SSYK = "ssyk-level-1 ssyk-level-2 ssyk-level-3 ssyk-level-4";
        this.TYPE_SUN_EDUCATION_FIELD = "sun-ecucation-field-1 sun-ecucation-field-2 sun-ecucation-field-3 sun-ecucation-field-4";
        this.TYPE_SUN_EDUCATION_LEVEL = "sun-ecucation-level-1 sun-ecucation-level-2 sun-ecucation-level-3";
        this.TYPE_WAGE_TYPE = "wage-type";
        this.TYPE_WORKTIME_EXTENT = "worktime-extent";

        this.state = {
            data: [],
            queryType: this.TYPE_SSYK,
            loadingData: false,
        };
        this.searchReference = null;
        this.expandedItem = null;
        this.queryTreeView = ControlUtil.createTreeView();
        this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
        this.queryTreeView.onAllowItemSelection = this.onAllowItemSelection.bind(this);
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

    buildTree(data) {
        this.queryTreeView.clear();
        var roots = [];
        for(var i=0; i<data.length; ++i) {
            var element = data[i];
            var root = roots.find((r) => {
                return r.data ? element.type == r.data.type : false;
            });
            if(!root) {
                root = ControlUtil.createTreeViewItem(this.queryTreeView, {type: element.type});
                root.setText(Localization.get("db_" + element.type));
                root.setExpanded(true);                
                roots.push(root);
            }
            var child = ControlUtil.createTreeViewItem(this.queryTreeView, element);
            child.setShowButton(false);
            child.setText(data[i].ssyk ? this.getItemFormat(data[i]) : element.preferredLabel);
            root.addChild(child);
        }
        for(var i=0; i<roots.length; ++i) {
            this.queryTreeView.addRoot(roots[i]);
        }
    }
    
    populateTree(data) {        
        for(var i=0; i<data.length; ++i) {
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, data[i]);
            item.setShowButton(false);
            item.setText(data[i].ssyk ? this.getItemFormat(data[i]) : data[i].preferredLabel);
            this.queryTreeView.addRoot(item);
        }
    }

    fetchRecursive(from, count) {
        if(this.state.queryType == this.TYPE_SSYK) {
            Rest.getConceptsSsykRange(this.state.queryType, from, count, (data) => {
                if(data.length > 2) {
                    console.log(data[0], data[data.length-1]);
                }
                this.state.data.push(...data);
                this.setData(data);                
                this.sortData(this.state.data);
                this.queryTreeView.clear();
                this.populateTree(this.state.data);
                if(data.length == count) {
                    this.fetchRecursive(from + count, count);
                } else {
                    this.setState({loadingData: false});
                }
            }, (status) => {
                // TODO: display error
            });
        } else if(this.state.queryType == this.TYPE_ISCO_LEVEL_4) {
            Rest.getConceptsIsco08Range(this.state.queryType, from, count, (data) => {
                if(data.length > 2) {
                    console.log(data[0], data[data.length-1]);
                }
                this.state.data.push(...data);
                this.setData(data);
                this.sortData(this.state.data);
                this.queryTreeView.clear();
                this.populateTree(this.state.data);
                if(data.length == count) {
                    this.fetchRecursive(from + count, count);
                } else {                                        
                    this.setState({loadingData: false});
                }
            }, (status) => {
                // TODO: display error
            });
        } else {
            Rest.getConceptsRange(this.state.queryType, from, count, (data) => {
                if(data.length > 2) {
                    console.log(data[0], data[data.length-1]);
                }
                this.state.data.push(...data);
                this.setData(data);                
                this.sortData(this.state.data);
                this.queryTreeView.clear();
                this.populateTree(this.state.data);
                if(data.length == count) {
                    this.fetchRecursive(from + count, count);
                } else {
                    this.setState({loadingData: false});
                }
            }, (status) => {
                // TODO: display error
            });
        }
    }

    setData(data) {
        if(data.length <= 0) {
            return;
        }
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
    }

    sortData(data) {
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
    }

    search(query) {
        this.queryTreeView.clear();
        this.state.data = [];
        Rest.abort();
        if(this.state.queryType == this.TYPE_SEARCH) {
            if(query && query.length > 0) {
                this.showLoader();
                Rest.searchConcepts(query, (data) => {
                    this.state.data = data;
                    this.setData(data);
                    this.sortData(data);
                    this.buildTree(data);
                    this.setState({loadingData: false});
                }, (status) => {
                    // TODO: display error
                });
            }
        } else {
            this.showLoader();
            this.fetchRecursive(0, 400);
        }
    }

    filterAndPopulate(query) {
        this.queryTreeView.clear();
        if(query.length > 0) {
            var q = query.toLowerCase();
            var data = this.state.data.filter((item) => {
                return item.preferredLabel.toLowerCase().indexOf(q) >= 0;
            });
            this.sortData(data);
            this.populateTree(data);
        } else {
            this.populateTree(this.state.data);
        }
    }

    showLoader() {
        //var waitingForItem = ControlUtil.createTreeViewItem(this.queryTreeView, null);
        //waitingForItem.setText(<Loader/>);
        //this.queryTreeView.addRoot(waitingForItem);
        
        this.setState({loadingData: true});
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
        }, () => {
            this.search();
        });
    }

    onSearchClicked() {
        if(this.state.queryType == this.TYPE_SEARCH) {
            this.search(this.searchReference.value);
        } else {
            this.filterAndPopulate(this.searchReference.value);
        }
    }

    onSaveDialogResult(item, result) {
        if(result != Constants.DIALOG_OPTION_ABORT) {
            item.setSelected(true);
            // user saved or discared changes and wants to continue
            EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item.data);
        }
    }

    onQueryItemSelected(item) {
        if(item.data && item.data.id) {
            EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item.data);
        }
    }

    onAllowItemSelection(item) {
        if(App.hasUnsavedChanges()) {
            App.showSaveDialog(this.onSaveDialogResult.bind(this, item));
            return false;
        }
        return true;
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
                    {this.renderOption(this.TYPE_SEARCH, "search")}
                    {this.renderOption(this.TYPE_CONTINENT, "db_continent")}
                    {this.renderOption(this.TYPE_COUNTRY, "db_country")}
                    {this.renderOption(this.TYPE_DRIVING_LICENCE, "db_driving-licence")}
                    {this.renderOption(this.TYPE_EMPLOYMENT_DURATION, "db_employment-duration")}
                    {this.renderOption(this.TYPE_EMPLOYMENT_TYPE, "db_employment-type")}
                    {this.renderOption(this.TYPE_ISCO_LEVEL_4, "db_isco-level-4")}
                    {this.renderOption(this.TYPE_KEYWORD, "db_keyword")}
                    {this.renderOption(this.TYPE_LANGUAGE, "db_language")}
                    {this.renderOption(this.TYPE_LANGUAGE_LEVEL, "db_language-level")}
                    {this.renderOption(this.TYPE_MUNICIPALITY, "db_municipality")}
                    {this.renderOption(this.TYPE_OCCUPATION_COLLECTION, "db_occupation-collection")}
                    {this.renderOption(this.TYPE_OCCUPATION_FIELD, "db_occupation-field")}
                    {this.renderOption(this.TYPE_OCCUPATION_NAME, "db_occupation-name")}
                    {this.renderOption(this.TYPE_REGION, "db_region")}
                    {this.renderOption(this.TYPE_SKILL, "db_skill")}
                    {this.renderOption(this.TYPE_SNI, "db_sni")}
                    {this.renderOption(this.TYPE_SSYK, "db_ssyk")}
                    {this.renderOption(this.TYPE_SUN_EDUCATION_FIELD, "db_sun-education-field")}
                    {this.renderOption(this.TYPE_SUN_EDUCATION_LEVEL, "db_sun-education-level")}
                    {this.renderOption(this.TYPE_WAGE_TYPE, "db_wage-type")}
                    {this.renderOption(this.TYPE_WORKTIME_EXTENT, "db_worktime-extent")}                    
                </select>
                <div className="sub_panel_search">
                    <input 
                        type="text"
                        className="rounded"
                        ref={(x) => this.searchReference = x}/>
                    <Button 
                        text={Localization.get(this.state.queryType == this.TYPE_SEARCH ? "search" : "filter")}
                        onClick={this.onSearchClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderLoader() {
        if(this.state.loadingData) {
            return(
                <Loader/>
            );
        }
    }

    render() {
        return (
            <div className="side_content_1">
                {this.renderQueary()}
                <TreeView context={this.queryTreeView}>
                    {this.renderLoader()}
                </TreeView>
            </div>
        );
    }
	
}

export default Content1;