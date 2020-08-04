import React from 'react';
import Button from '../../control/button.jsx';
import Loader from '../../control/loader.jsx';
import TreeView from '../../control/tree_view.jsx';
import ControlUtil from '../../control/util.jsx';
import Rest from '../../context/rest.jsx';
import Util from '../../context/util.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import Settings from '../../context/settings.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import App from '../../context/app.jsx';
import Label from '../../control/label.jsx';
import CacheManager from '../../context/cache_manager.jsx';
import ConceptWrapper from '../../control/concept_wrapper.jsx';

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
        this.TYPE_OCCUPATION_EXPERIENCE_YEAR = "occupation-experience-year";
        this.TYPE_REGION = "region";
        this.TYPE_SKILL = "skill";
        this.TYPE_SKILL_HEADLINE = "skill-headline";
        this.TYPE_SNI_1 = "sni-level-1";
        this.TYPE_SNI_2 = "sni-level-2";
        this.TYPE_SSYK_LEVEL_1 = "ssyk-level-1";
        this.TYPE_SSYK_LEVEL_2 = "ssyk-level-2";
        this.TYPE_SSYK_LEVEL_3 = "ssyk-level-3";
        this.TYPE_SSYK_LEVEL_4 = "ssyk-level-4";
        this.TYPE_SUN_EDUCATION_FIELD_1 = "sun-education-field-1";
        this.TYPE_SUN_EDUCATION_FIELD_2 = "sun-education-field-2";
        this.TYPE_SUN_EDUCATION_FIELD_3 = "sun-education-field-3";
        this.TYPE_SUN_EDUCATION_FIELD_4 = "sun-education-field-4";
        this.TYPE_SUN_EDUCATION_LEVEL_1 = "sun-education-level-1";
        this.TYPE_SUN_EDUCATION_LEVEL_2 = "sun-education-level-2";
        this.TYPE_SUN_EDUCATION_LEVEL_3 = "sun-education-level-3";
        this.TYPE_WAGE_TYPE = "wage-type";
        this.TYPE_WORKTIME_EXTENT = "worktime-extent";
        this.TYPE_UNEMPLOYMENT_FUND = "unemployment-fund";
        this.TYPE_UNEMPLOYMENT_TYPE = "unemployment-type";

        this.state = {
            data: [],
            queryType: this.TYPE_SSYK_LEVEL_4,
            selectableType: true,
            loadingData: false,
            showDeprecated: false,
            scrollTarget: null,
            filter: "",
        };

        this.autoselectFirst = true;
        this.options = this.populateOptions();
        this.queryTreeView = ControlUtil.createTreeView();
        this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
        this.queryTreeView.onAllowItemSelection = this.onAllowItemSelection.bind(this);
        this.boundMainItemSelected = this.onMainItemSelected.bind(this);
        this.boundNewConcept = this.onNewConcept.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundMainItemSelected, Constants.EVENT_MAINPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundNewConcept, Constants.EVENT_NEW_CONCEPT);
        if(this.props.lockToType) {
            this.state.selectableType = false;
            this.queryType = this.props.lockToType;
        } else {
            this.state.selectableType = true;
        }
        this.search();
    }

    componentDidUpdate() {
        if(this.state.scrollTarget) {
            var element = document.getElementById("" + this.state.scrollTarget.uniqueId);
            element.scrollIntoView({
                behavior: "auto", 
                block: "center", 
                inline: "start"
            });
            this.state.scrollTarget = null;
        }
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
        EventDispatcher.remove(this.boundNewConcept);
    }

    addOption(options, type){
        if(Settings.isVisible(type)) {
            options.push({value: type, text: Localization.get("db_" + type)});    
        }
    }

    populateOptions() {
        var options = [];        
        this.addOption(options, this.TYPE_CONTINENT);
        this.addOption(options, this.TYPE_COUNTRY);
        this.addOption(options, this.TYPE_DRIVING_LICENCE);
        this.addOption(options, this.TYPE_EMPLOYMENT_DURATION);
        this.addOption(options, this.TYPE_EMPLOYMENT_TYPE);
        this.addOption(options, this.TYPE_ISCO_LEVEL_4);
        this.addOption(options, this.TYPE_KEYWORD);
        this.addOption(options, this.TYPE_LANGUAGE);
        this.addOption(options, this.TYPE_LANGUAGE_LEVEL);
        this.addOption(options, this.TYPE_MUNICIPALITY);
        this.addOption(options, this.TYPE_OCCUPATION_COLLECTION);
        this.addOption(options, this.TYPE_OCCUPATION_FIELD);
        this.addOption(options, this.TYPE_OCCUPATION_NAME);
        this.addOption(options, this.TYPE_OCCUPATION_EXPERIENCE_YEAR);
        this.addOption(options, this.TYPE_REGION);
        this.addOption(options, this.TYPE_SKILL);
        this.addOption(options, this.TYPE_SNI_1);
        this.addOption(options, this.TYPE_SNI_2);
        this.addOption(options, this.TYPE_SSYK_LEVEL_1);
        this.addOption(options, this.TYPE_SSYK_LEVEL_2);
        this.addOption(options, this.TYPE_SSYK_LEVEL_3);
        this.addOption(options, this.TYPE_SSYK_LEVEL_4);
        this.addOption(options, this.TYPE_SUN_EDUCATION_FIELD_1);
        this.addOption(options, this.TYPE_SUN_EDUCATION_FIELD_2);
        this.addOption(options, this.TYPE_SUN_EDUCATION_FIELD_3);
        this.addOption(options, this.TYPE_SUN_EDUCATION_FIELD_4);
        this.addOption(options, this.TYPE_SUN_EDUCATION_LEVEL_1);
        this.addOption(options, this.TYPE_SUN_EDUCATION_LEVEL_2);
        this.addOption(options, this.TYPE_SUN_EDUCATION_LEVEL_3);
        this.addOption(options, this.TYPE_WAGE_TYPE);
        this.addOption(options, this.TYPE_WORKTIME_EXTENT);
        this.addOption(options, this.TYPE_UNEMPLOYMENT_FUND);
        this.addOption(options, this.TYPE_UNEMPLOYMENT_TYPE);
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
                //root.setExpanded(true);                
                roots.push(root);
            }
            var child = ControlUtil.createTreeViewItem(this.queryTreeView, element);
            child.setShowButton(false);
            child.setText(<ConceptWrapper concept={element}>{element.label}</ConceptWrapper>);
            root.addChild(child);
        }
        for(var i=0; i<roots.length; ++i) {
            this.queryTreeView.addRoot(roots[i]);
        }
    }

    populateTreeSkill(data) {
        var query = this.state.filter.toLowerCase();
        this.queryTreeView.shouldUpdateState = false;
        for(var i=0; i<data.length; ++i) {
            var element = data[i];
            var root = ControlUtil.createTreeViewItem(this.queryTreeView, element);
            root.setText(<ConceptWrapper concept={element}>{element.label}</ConceptWrapper>);
            root.setExpanded(query.length > 1);
            this.queryTreeView.addRoot(root);
            if(element.skills) {
                for(var j=0; j<element.skills.length; ++j) {
                    var skill = element.skills[j];
                    if(skill.label.toLowerCase().indexOf(query) == -1) {
                        continue;
                    }
                    if(skill.deprecated != this.state.showDeprecated) {
                        continue;
                    }
                    var child = ControlUtil.createTreeViewItem(this.queryTreeView, skill);
                    child.setText(<ConceptWrapper concept={skill}>{skill.label}</ConceptWrapper>);
                    child.setExpanded(query.length > 1);
                    root.addChild(child);
                }
            }
        }        
        //sort
        for(var i=0; i<this.queryTreeView.roots.length; ++i) {
            var root = this.queryTreeView.roots[i];
            Util.sortByKey(root.children, "text", true);
        }
        Util.sortByKey(this.queryTreeView.roots, "text", true);
        this.queryTreeView.shouldUpdateState = true;
        this.queryTreeView.invalidate();
    }

    populateTree(data) {
        this.queryTreeView.shouldUpdateState = false;
        for(var i=0; i<data.length; ++i) {
            var element = data[i];
            var item = ControlUtil.createTreeViewItem(this.queryTreeView, element);
            item.setShowButton(false);
            item.setText(<ConceptWrapper concept={element}>{element.label}</ConceptWrapper>);
            this.queryTreeView.addRoot(item);
        }
        this.queryTreeView.shouldUpdateState = true;
        this.queryTreeView.invalidate();
    }

    onFilterChanged(e) {
        this.setState({filter: e.target.value}, () => {
            if(this.state.queryType != this.TYPE_SEARCH) {
                this.filterAndPopulate(this.state.filter);
            }
        });
    }

    onFetchComplete(isFetchingSkill) {
        if(this.preSelectId) {
            var item = this.queryTreeView.findChild((item) => {
                return item.data.id == this.preSelectId;
            });            
            if(item) {
                this.preSelectId = null;
                this.queryTreeView.setSelected(item, true);
                if(isFetchingSkill && item.parent) {
                    item.parent.setExpanded(true);
                }
                this.setState({scrollTarget: item});
            } else if(this.queryTreeView.roots.length == 0) {
                //Try again when we have data
            } else {
                this.preSelectId = null;
            }
        } else if(this.autoselectFirst) {
            if(this.queryTreeView.roots.length > 0) {
                this.queryTreeView.setSelected(this.queryTreeView.roots[0], true);
            }
        }
        this.autoselectFirst = false;
    }

    fetchSkills() {
        this.state.data = {
            nodes: [],
            edges: [],
            skills: [],
        };
        Rest.getConceptsSkillsAndHedlines((data) => {
            this.state.data.skills = data;            
            this.prepareData(this.state.data.skills);
            this.filterAndPopulate(this.state.filter);
            this.onFetchComplete(true);
            this.setState({loadingData: false});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
    }

    fetch() {
        Util.getConcepts(this.state.queryType, (data) => {
            this.state.data.push(...data);
            this.prepareData(this.state.data);
            this.sortData(this.state.data);
            this.filterAndPopulate(this.state.filter);
            this.onFetchComplete(false);
            this.setState({loadingData: false});
            //console.log("load time: " + (new Date().getTime() - this.loadStartTime) + " ms");
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
    }

    prepareData(data) {
        for(var i=0; i< data.length; ++i) {
            var concept = data[i];
            concept.label = concept.preferredLabel;
            if(concept.type === Constants.CONCEPT_ISCO_LEVEL_4) {
                concept.label = concept.isco + " - " + concept.label;
            } else if(concept.type === Constants.CONCEPT_SSYK_LEVEL_4 ||
                concept.type === Constants.CONCEPT_SSYK_LEVEL_3 ||
                concept.type === Constants.CONCEPT_SSYK_LEVEL_2 ||
                concept.type === Constants.CONCEPT_SSYK_LEVEL_1) {
                concept.label = concept.ssyk + " - " + concept.label;
            }
            if(concept.skills) {
                this.prepareData(concept.skills);
            }
        }
    }

    sortData(data) {
        Util.sortByKey(data, "label", true);
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
                    this.sortData(data);
                    this.buildTree(data);
                    this.setState({loadingData: false});
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : sökning misslyckades");
                });
            }
        } else {
            this.setState({loadingData: true});
            if(this.state.queryType == this.TYPE_SKILL) {
                this.fetchSkills();
            } else {
                //this.loadStartTime = new Date().getTime();
                this.fetch();
            }
        }
    }

    filterAndPopulate(query) {
        this.queryTreeView.clear();
        if(query.length > 0) {
            var q = query.toLowerCase();
            if(this.state.queryType == this.TYPE_SKILL) {
                var data = this.state.data.skills.filter((item) => {
                    var isDeprecated = item.deprecated ? item.deprecated : false;
                    var hasValidChild = item.skills.find((child) => {
                        return this.state.showDeprecated == child.deprecated && child.label.toLowerCase().indexOf(q) >= 0;
                    });
                    if(hasValidChild) {
                        return true;
                    }
                    if(this.state.showDeprecated != isDeprecated) {
                        return false;
                    }
                    return item.label.toLowerCase().indexOf(q) >= 0;
                });
                this.sortData(data);
                this.populateTreeSkill(data);
            } else {
                var data = this.state.data.filter((item) => {
                    var isDeprecated = item.deprecated ? item.deprecated : false;
                    if(this.state.showDeprecated != isDeprecated) {
                        return false;
                    }
                    return item.label.toLowerCase().indexOf(q) >= 0;
                });
                this.sortData(data);
                this.populateTree(data);                
            }
        } else {            
            if(this.state.queryType == this.TYPE_SKILL) { 
                var data = this.state.data.skills.filter((item, i) => {
                    var isDeprecated = item.deprecated ? item.deprecated : false;
                    var hasValidChild = item.skills.find((child) => {
                        return this.state.showDeprecated == child.deprecated;
                    });
                    return hasValidChild || this.state.showDeprecated == isDeprecated;
                });
                this.sortData(data);
                this.populateTreeSkill(data);
            } else {
                var data = this.state.data.filter((item) => { 
                    var isDeprecated = item.deprecated ? item.deprecated : false;
                    return this.state.showDeprecated == isDeprecated;
                });
                this.sortData(data);
                this.populateTree(data);
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
            Util.getConcept(item.data.id, item.data.type, (data) => {
                // merge item
                for(var member in data[0]) {
                    if(item.data[member] == null) {
                        item.data[member] = data[0][member];
                    }
                }                
                EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item.data);
            }, (status) => {
                App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
            });
        }
    }

    onMainItemSelected(item) {
        if(item && item.id) {
            this.setState({
                showDeprecated: item.deprecated ? true : false,
            }, () => {
                this.state.filter = "";
                this.expandedItem = null;
                this.preSelectId = item.id;
                var type = item.type == this.TYPE_SKILL_HEADLINE ? this.TYPE_SKILL : item.type;
                if(type == this.state.queryType) {
                    this.filterAndPopulate(this.state.filter);
                    this.onFetchComplete(type == this.TYPE_SKILL);
                } else {
                    this.setState({
                        scrollTarget: null,
                        queryType: type,
                    }, () => {
                        this.search();
                    });
                }    
            });
        }
    }
    
    onNewConcept(data) {
        if(data.concept) {
            var type = data.concept.type == Constants.CONCEPT_SKILL_HEADLINE ? Constants.CONCEPT_SKILL : data.concept.type;
            if(type == this.state.queryType) {
                // create tree node for item
                var node = ControlUtil.createTreeViewItem(this.queryTreeView, data.concept);
                node.setText(<ConceptWrapper concept={data.concept}>{data.concept.label}</ConceptWrapper>);
                // update structure correctly
                if(type == Constants.CONCEPT_SKILL) {
                    if(data.parent) {
                        var parent = this.state.data.find((a) => {
                            return a.id === data.parent.id;
                        });
                        if(parent) {
                            parent.skills.push(data.concept);
                        }
                    }
                } else {
                    this.state.data.push(data.concept);
                }
                // update tree
                this.queryTreeView.shouldUpdateState = false;
                if(data.parent) {
                    var root = this.queryTreeView.roots.find((d) => {
                        return d.data.id === data.parent.id;
                    });
                    if(root) {
                        // update data item
                        root.data.relations.narrower += 1;
                        // update tree item
                        root.setForceShowButton(true);
                        root.setShowButton(true);
                        root.addChild(node);
                        Util.sortByKey(root.children, "text", true);
                        // update cache
                        CacheManager.updateTypeListItem(root.data);
                    }
                } else {
                    this.queryTreeView.addRoot(node);
                    Util.sortByKey(this.queryTreeView.roots, "text", true);
                }
                this.queryTreeView.shouldUpdateState = true;
                this.queryTreeView.invalidate();
            } else {
                // update cache
                CacheManager.updateTypeListItem(data.concept);
                if(data.concept.type == Constants.CONCEPT_SKILL) {
                    CacheManager.invalidateCachedTypeList(Constants.CONCEPT_SKILL_HEADLINE);
                }
            }
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
        this.expandedItem = null;
        this.setState({
            queryType: e.target.value,
            filter: "",
        }, () => {
            this.search();
        });
        if(this.props.onTypeChangedCallback) {
            this.props.onTypeChangedCallback(e.target.value);
        }
    }

    onSearchClicked() {
        if(this.state.queryType == this.TYPE_SEARCH) {
            this.search(this.state.filter);
        } else {
            this.filterAndPopulate(this.state.filter);
        }
    }

    onShowDeprecatedChanged(e) {
        this.setState({showDeprecated: e.target.checked}, () => {
            this.filterAndPopulate(this.state.filter);
        });
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
        var element = 
            this.state.queryType == this.TYPE_SEARCH ? 
                <Button text={Localization.get("search")} onClick={this.onSearchClicked.bind(this)}/> :
                <div/>;
        return(
            <div className="sub_panel_search">
                <input 
                    type="text"
                    className="rounded"
                    value={this.state.filter}
                    placeholder={this.state.queryType == this.TYPE_SEARCH ? "" : Localization.get("filter")}
                    onChange={this.onFilterChanged.bind(this)}/>
                {element}
            </div>
        );
    }

    renderShowDeprecated() {
        return(
            <div className="sub_panel_show_deprecated">
                <input 
                    type="checkbox"                        
                    onChange={this.onShowDeprecatedChanged.bind(this)}
                    checked={this.state.showDeprecated}/>
                <Label text={Localization.get("show_deprecated")}/>
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
                    {this.renderShowDeprecated()}
                </div>
                <TreeView context={this.queryTreeView}>
                    {this.renderLoader()}
                </TreeView>
            </div>
        );
    }
}

export default ConceptsSearch;