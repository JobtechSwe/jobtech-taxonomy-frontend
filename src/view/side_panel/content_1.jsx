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
        this.options = this.populateOptions();
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

    populateOptions() {
        var options = [];
        options.push({value: this.TYPE_CONTINENT, text: Localization.get("db_continent")});
        options.push({value: this.TYPE_COUNTRY, text: Localization.get("db_country")});
        options.push({value: this.TYPE_DRIVING_LICENCE, text: Localization.get("db_driving-licence")});
        options.push({value: this.TYPE_EMPLOYMENT_DURATION, text: Localization.get("db_employment-duration")});
        options.push({value: this.TYPE_EMPLOYMENT_TYPE, text: Localization.get("db_employment-type")});
        options.push({value: this.TYPE_ISCO_LEVEL_4, text: Localization.get("db_isco-level-4")});
        options.push({value: this.TYPE_KEYWORD, text: Localization.get("db_keyword")});
        options.push({value: this.TYPE_LANGUAGE, text: Localization.get("db_language")});
        options.push({value: this.TYPE_LANGUAGE_LEVEL, text: Localization.get("db_language-level")});
        options.push({value: this.TYPE_MUNICIPALITY, text: Localization.get("db_municipality")});
        options.push({value: this.TYPE_OCCUPATION_COLLECTION, text: Localization.get("db_occupation-collection")});
        options.push({value: this.TYPE_OCCUPATION_FIELD, text: Localization.get("db_occupation-field")});
        options.push({value: this.TYPE_OCCUPATION_NAME, text: Localization.get("db_occupation-name")});
        options.push({value: this.TYPE_REGION, text: Localization.get("db_region")});
        options.push({value: this.TYPE_SKILL, text: Localization.get("db_skill")});
        options.push({value: this.TYPE_SNI, text: Localization.get("db_sni")});
        options.push({value: this.TYPE_SSYK, text: Localization.get("db_ssyk")});
        options.push({value: this.TYPE_SUN_EDUCATION_FIELD, text: Localization.get("db_sun-education-field")});
        options.push({value: this.TYPE_SUN_EDUCATION_LEVEL, text: Localization.get("db_sun-education-level")});
        options.push({value: this.TYPE_WAGE_TYPE, text: Localization.get("db_wage-type")});
        options.push({value: this.TYPE_WORKTIME_EXTENT, text: Localization.get("db_worktime-extent")});
        options.sort((a, b) => {
            if(a.text < b.text) {
                return -1;
            }
            if(a.text > b.text) {
                return 1;
            }
            return 0;
        });
        return options;
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

    findParent(element) {
        var getItem = (length, expanded) => {
            var tmp = this.state.data.find((d) => {
                return d.ssyk.length == length && element.ssyk.startsWith(d.ssyk);
            });
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, tmp);
            item.setText(/*this.getItemFormat(tmp)*/tmp.preferredLabel);
            item.setExpanded(expanded);
            return item;
        }
        var lambda = (root, depth, func) => {
            var tmp = root.children.find((c) => {
                return element.ssyk.startsWith(c.data.ssyk);
            });
            if(tmp == null) {
                tmp = getItem(depth, true);
                root.addChild(tmp);
            }
            if(element.ssyk.length - 1 == tmp.data.ssyk.length) {
                return tmp;
            } else {
                return func(tmp, depth + 1, func);
            }
        };
        if(element.ssyk.length == 1) {
            return null;
        }
        var root = this.queryTreeView.roots.find((d) => {
            return element.ssyk.startsWith(d.data.ssyk);
        });
        if(root == null) {
            root = getItem(1, true);            
            this.queryTreeView.addRoot(root);
        }
        if(element.ssyk.length == 2) {
            return root;
        }
        return lambda(root, 2, lambda);
    }
    
    populateTreeSsyk(data) {
        this.queryTreeView.shouldUpdateState = false;
        for(var i=0; i<data.length; ++i) {
            var element = data[i];
            var parent = this.findParent(element);
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, element);
            item.setText(/*element.ssyk ? this.getItemFormat(element) : */element.preferredLabel);
            item.setExpanded(true);
            if(parent) {
                parent.addChild(item);
            } else {
                this.queryTreeView.addRoot(item);
            }
        }
        this.queryTreeView.shouldUpdateState = true;
        this.queryTreeView.invalidate();
    }

    populateTree(data) {
        this.queryTreeView.shouldUpdateState = false;
        for(var i=0; i<data.length; ++i) {
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, data[i]);
            item.setShowButton(false);
            item.setText(data[i].ssyk ? this.getItemFormat(data[i]) : data[i].preferredLabel);
            this.queryTreeView.addRoot(item);
        }
        this.queryTreeView.shouldUpdateState = true;
        this.queryTreeView.invalidate();
    }

    onFetchSsykResult(data, from, count) {
        this.state.data.push(...data);
        if(data.length == count) {
            this.fetchRecursive(from + count, count);
        } else {
            this.setData(this.state.data);
            this.sortData(this.state.data);
            this.queryTreeView.clear();
            this.populateTreeSsyk(this.state.data);
            this.setState({loadingData: false});
        }
    }

    onFetchResult(data, from, count) {
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
    }

    fetchRecursive(from, count) {
        if(this.state.queryType == this.TYPE_SSYK) {
            Rest.getConceptsSsykRange(this.state.queryType, from, count, (data) => {
                this.onFetchSsykResult(data, from, count);
            }, (status) => {
                // TODO: display error
            });
        } else if(this.state.queryType == this.TYPE_ISCO_LEVEL_4) {
            Rest.getConceptsIsco08Range(this.state.queryType, from, count, (data) => {
                this.onFetchResult(data, from, count);
            }, (status) => {
                // TODO: display error
            });
        } else {
            Rest.getConceptsRange(this.state.queryType, from, count, (data) => {
                this.onFetchResult(data, from, count);
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
            if(this.state.queryType == this.TYPE_SSYK) {
                this.populateTreeSsyk(data);
            } else {
                this.populateTree(data);
            }
        } else {
            if(this.state.queryType == this.TYPE_SSYK) {
                this.populateTreeSsyk(this.state.data);
            } else {
                this.populateTree(this.state.data);
            }
        }
    }

    showLoader() {
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

    renderOptions() {
        var options = this.options.map((o, i) => {
            return this.renderOption(o.value, o.text, i);
        });
        return options;
    }

    renderOption(value, text, key) {
        return (
            <option value={value} key={key}>
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
                    {this.renderOptions()}
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