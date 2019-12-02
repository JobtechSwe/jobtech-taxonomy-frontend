import React from 'react';
import Button from '../../control/button.jsx';
import Loader from '../../control/loader.jsx';
import TreeView from '../../control/tree_view.jsx';
import ControlUtil from '../../control/util.jsx';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import App from '../../context/app.jsx';

class ConceptsSearch extends React.Component { 

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
        this.TYPE_SKILL = "skill-headline skill";
        this.TYPE_SNI = "sni-level-1 sni-level-2";
        this.TYPE_SSYK = "ssyk-level-1 ssyk-level-2 ssyk-level-3 ssyk-level-4";
        this.TYPE_SUN_EDUCATION_FIELD = "sun-ecucation-field-1 sun-ecucation-field-2 sun-ecucation-field-3 sun-ecucation-field-4";
        this.TYPE_SUN_EDUCATION_LEVEL = "sun-ecucation-level-1 sun-ecucation-level-2 sun-ecucation-level-3";
        this.TYPE_WAGE_TYPE = "wage-type";
        this.TYPE_WORKTIME_EXTENT = "worktime-extent";

        this.state = {
            data: [],
            queryType: this.TYPE_SSYK,
            selectableType: true,
            loadingData: false,
        };

        this.options = this.populateOptions();
        this.queryTreeView = ControlUtil.createTreeView();
        this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
        this.queryTreeView.onAllowItemSelection = this.onAllowItemSelection.bind(this);
        this.boundMainItemSelected = this.onMainItemSelected.bind(this);
    }    

    componentDidMount() {
        EventDispatcher.add(this.boundMainItemSelected, Constants.EVENT_MAINPANEL_ITEM_SELECTED);
        if(this.props.lockToType) {
            this.state.selectableType = false;
            this.queryType = this.props.lockToType;
        } else {
            this.state.selectableType = true;
        }
        this.search();
    }

    UNSAFE_componentWillReceiveProps(props) {
        if(props.lockToType) {
            this.state.selectableType = false;
            this.queryType = props.lockToType;
        } else {
            this.state.selectableType = true;
        }
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
        var getItem = (type, expanded) => {
            var tmp = this.state.data.find((d) => {
                return d.type === type && element["ssyk-code-2012"].startsWith(d["ssyk-code-2012"]);
            });
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, tmp);
            item.setText(tmp.ssyk ? this.getItemFormat(tmp) : tmp.preferredLabel);
            item.setExpanded(expanded);
            return item;
        }
        var lambda = (root, type, func) => {
            var tmp = root.children.find((c) => {
                return element["ssyk-code-2012"].startsWith(c.data["ssyk-code-2012"]);
            });
            if(tmp == null) {
                tmp = getItem(type, false);
                root.addChild(tmp);
            }
            var nextType = null;
            if(type == Constants.CONCEPT_SSYK_LEVEL_2) {
                nextType = Constants.CONCEPT_SSYK_LEVEL_3;
            } else if(type == Constants.CONCEPT_SSYK_LEVEL_3) {
                nextType = Constants.CONCEPT_SSYK_LEVEL_4;
            }
            if(element.type == nextType) {
                return tmp;
            } else if(nextType) {
                return func(tmp, nextType, func);
            }
        };
        if(element.type == Constants.CONCEPT_SSYK_LEVEL_1) {
            return null;
        }
        var root = this.queryTreeView.roots.find((d) => {
            return element["ssyk-code-2012"].startsWith(d.data["ssyk-code-2012"]);
        });
        if(root == null) {
            root = getItem(Constants.CONCEPT_SSYK_LEVEL_1, true);            
            root.setExpanded(true);
            this.queryTreeView.addRoot(root);
        }
        if(element.type == Constants.CONCEPT_SSYK_LEVEL_2) {
            return root;
        }
        return lambda(root, Constants.CONCEPT_SSYK_LEVEL_2, lambda);
    }
    
    populateTreeSsykLevel(data, level) {
        for(var i=0; i<data.length; ++i) {
            var element = data[i];
            if(element.type === level) {
                var parent = this.findParent(element);
                var item = ControlUtil.createTreeViewItem(this.queryTreeView, element);
                item.setText(element.ssyk ? this.getItemFormat(element) : element.preferredLabel);
                if(parent) {
                    parent.addChild(item);
                } else {
                    item.setExpanded(true);
                    this.queryTreeView.addRoot(item);
                }
            }
        }
    }

    populateTreeSsyk(data) {
        this.queryTreeView.shouldUpdateState = false;
        this.populateTreeSsykLevel(data, Constants.CONCEPT_SSYK_LEVEL_1);
        this.populateTreeSsykLevel(data, Constants.CONCEPT_SSYK_LEVEL_2);
        this.populateTreeSsykLevel(data, Constants.CONCEPT_SSYK_LEVEL_3);
        this.populateTreeSsykLevel(data, Constants.CONCEPT_SSYK_LEVEL_4);
        this.queryTreeView.shouldUpdateState = true;
        this.queryTreeView.invalidate();
    }

    populateTreeSkill(data) {
        this.queryTreeView.shouldUpdateState = false;
        if(data == null) {
            for(var i=0; i<this.state.data.nodes.length; ++i) {
                var element = this.state.data.nodes[i];                                
                if(element.type === Constants.CONCEPT_SKILL_HEADLINE) {
                    var root = this.queryTreeView.roots.find((d) => {
                        return d.data.id === element.id;
                    });
                    if(root == null) {
                        root = ControlUtil.createTreeViewItem(this.queryTreeView, element);
                        root.setText(element.preferredLabel);
                        this.queryTreeView.addRoot(root);
                    }
                }
            }            
            for(var i=0; i<this.state.data.edges.length; ++i) {
                var edge = this.state.data.edges[i];
                var root = this.queryTreeView.roots.find((d) => {
                    return d.data.id === edge.target;
                });
                if(root) {
                    var item = this.state.data.nodes.find((d) => {
                        return d.id === edge.source;
                    });
                    var child = ControlUtil.createTreeViewItem(this.queryTreeView, item);
                    child.setText(item.preferredLabel);
                    root.addChild(child);
                }
            }
        } else {
            for(var i=0; i<this.state.data.edges.length; ++i) {
                var edge = this.state.data.edges[i];
                var target = data.find((d) => {
                    return d.id === edge.target;
                });
                var source = data.find((d) => {
                    return d.id === edge.source;
                });
                if(source) {
                    var root = this.queryTreeView.roots.find((d) => {
                        return d.data.id === edge.target;
                    });
                    if(root == null) {
                        if(target == null) {
                            var target = this.state.data.nodes.find((d) => {
                                return d.id === edge.target;
                            });
                        }
                        root = ControlUtil.createTreeViewItem(this.queryTreeView, target);
                        root.setText(target.preferredLabel);
                        root.setExpanded(true);
                        this.queryTreeView.addRoot(root);
                    }
                    var child = ControlUtil.createTreeViewItem(this.queryTreeView, source);
                    child.setText(source.preferredLabel);
                    root.addChild(child);
                } else if(target) {
                    var root = this.queryTreeView.roots.find((d) => {
                        return d.data.id === edge.target;
                    });
                    if(root == null) {
                        root = ControlUtil.createTreeViewItem(this.queryTreeView, target);
                        root.setText(target.preferredLabel);
                        root.setExpanded(true);
                        this.queryTreeView.addRoot(root);
                    }                    
                }
            }            
        }
        //sort
        for(var i=0; i<this.queryTreeView.roots.length; ++i) {
            var root = this.queryTreeView.roots[i];
            root.children.sort((a, b) => {
                if(a.text < b.text) { 
                    return -1; 
                }
                return a.text > b.text ? 1 : 0;
            });
        }
        this.queryTreeView.shouldUpdateState = true;
        this.queryTreeView.invalidate();
    }

    populateTree(data) {
        this.queryTreeView.shouldUpdateState = false;
        for(var i=0; i<data.length; ++i) {
            var element = data[i];
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, element);
            item.setShowButton(false);
            item.setText(element.ssyk ? this.getItemFormat(element) : element.preferredLabel);
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

    fetchSkills() {
        Rest.getGraph(Constants.RELATION_NARROWER, Constants.CONCEPT_SKILL_HEADLINE, Constants.CONCEPT_SKILL, (data) => {            
            this.state.data = data.graph;
            this.sortData(this.state.data.nodes);
            this.populateTreeSkill(null);
            this.setState({loadingData: false});
        }, (status) => {
            // TODO: display error
        });
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
            /*if(item["ssyk-code-2012"]) {
                item.ssyk = item["ssyk-code-2012"];               
            }*/           
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
                this.setState({loadingData: true});
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
            this.setState({loadingData: true});
            if(this.state.queryType == this.TYPE_SKILL) {
                this.fetchSkills();
            } else {
                this.fetchRecursive(0, 400);
            }
        }
    }

    filterAndPopulate(query) {
        this.queryTreeView.clear();
        if(query.length > 0) {
            var q = query.toLowerCase();
            if(this.state.queryType == this.TYPE_SKILL) {
                var data = this.state.data.nodes.filter((item) => {
                    return item.preferredLabel.toLowerCase().indexOf(q) >= 0;
                });
                this.sortData(data);
                this.populateTreeSkill(data);
            } else {
                var data = this.state.data.filter((item) => {
                    return item.preferredLabel.toLowerCase().indexOf(q) >= 0;
                });
                this.sortData(data);
                if(this.state.queryType == this.TYPE_SSYK) {
                    this.populateTreeSsyk(data);
                } else {
                    this.populateTree(data);
                }
            }
        } else {
            if(this.state.queryType == this.TYPE_SSYK) {
                this.populateTreeSsyk(this.state.data);
            } else if(this.state.queryType == this.TYPE_SKILL) {
                this.populateTreeSkill(null);
            } else {
                this.populateTree(this.state.data);
            }
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
            if(item.data.definition && item.data.relations) {
                EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item.data);
            } else {
                Rest.getConcept(item.data.id, (data) => {                    
                    EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, data[0]);
                }, (status) => {
                    //TODO: error handling
                });
            }
        }
    }

    onMainItemSelected(item) {
        // TODO: check if item is in tree and select item
        var selected = this.queryTreeView.getSelected();
        if(selected) {
            this.queryTreeView.setSelected(selected, false);
        }
    }

    onAllowItemSelection(item) {
        if(App.hasUnsavedChanges()) {
            App.showSaveDialog(this.onSaveDialogResult.bind(this, item));
            return false;
        }
        return true;
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

    renderOptions() {
        var options = this.options.map((o, i) => {
            return this.renderOption(o.value, o.text, i);
        });
        return options;
    }

    renderOption(value, text, key) {
        return (
            <option 
                value={value} 
                key={key}>
                {Localization.get(text)}
            </option>
        );
    }

    renderDropDown() {
        if(this.state.selectableType) {
            return(
                <select 
                    className="sub_panel_select rounded"
                    value={this.state.queryType}
                    onChange={this.onTypeChanged.bind(this)}>
                    {this.renderOption(this.TYPE_SEARCH, "search")}
                    {this.renderOptions()}
                </select>
            );
        }
    }

    renderSearch() {
        return(
            <div className="sub_panel_search">
                <input 
                    type="text"
                    className="rounded"
                    ref={(x) => this.searchReference = x}/>
                <Button 
                    text={Localization.get(this.state.queryType == this.TYPE_SEARCH ? "search" : "filter")}
                    onClick={this.onSearchClicked.bind(this)}/>
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
            <div className="concepts_search">
                <div className="sub_panel">
                    {this.renderDropDown()}
                    {this.renderSearch()}
                </div>
                <TreeView context={this.queryTreeView}>
                    {this.renderLoader()}
                </TreeView>
            </div>
    );
    }
}

export default ConceptsSearch;