import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import TreeView from './../../control/tree_view.jsx';
import Loader from './../../control/loader.jsx';
import ControlUtil from './../../control/util.jsx';
import ContextUtil from './../../context/util.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptAddRelation extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            substitutability: "25",
            type: "broader",
            loadingRoots: true,
            filter: "",
        };
        this.props.editContext.onSave = this.onSave.bind(this);
        this.items = [];
        // variables
        this.queryTreeView = ControlUtil.createTreeView();
        this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
    }

    componentDidMount() {
        // setup treeview roots
        this.rootIndex = 0;
        this.roots = [
            "ssyk-level-1",
            "ssyk-level-2",
            "ssyk-level-3",
            "ssyk-level-4",
            "isco-level-4",
            "continent",
            "country",
            "driving-licence",
            "employment-duration",
            "employment-type",
            "keyword",
            "language",
            "language-level",
            "municipality",
            "occupation-collection",
            "occupation-field",
            "occupation-name",
            "occupation-experience-year",
            "region",
            "skill-headline",
            "sni-level-1",
            "wage-type",
            "worktime-extent",
            "unemployment-fund",
            "unemployment-type",
        ];
        this.fetchData();
    }

    async fetchConcepts(type) {
        var query = 
            "concepts(type: \"" + type + "\", version: \"next\") { " + 
                "id type preferredLabel:preferred_label label:preferred_label ssyk_code_2012 isco_code_08 " + 
            "}";
        if(type == "skill-headline") {
            query = 
                "concepts(type: \"" + type + "\", version: \"next\") { " + 
                    "id type preferredLabel:preferred_label label:preferred_label " + 
                    "skills:narrower(type: \"skill\") { " +
                        "id type preferredLabel:preferred_label label:preferred_label " + 
                    "} " +
                "}";
        }
        return Rest.getGraphQlPromise(query);
    }

    async fetchData() {
        var data = [];
        for(var i=0; i<this.roots.length; ++i) {
            data.push(this.fetchConcepts(this.roots[i]));
        }
        for(var i=0; i<data.length; ++i) {
            data[i] = await data[i];
            data[i] = {
                visible: true,
                type: this.roots[i],
                preferredLabel: Localization.get("db_" + (this.roots[i] == "skill-headline" ? "skill" : this.roots[i])),
                children: data[i].data.concepts,
            };
            // setup children
            var key = null;
            if(data[i].type.startsWith("ssyk")) {
                key = "ssyk_code_2012";
            } else if(data[i].type.startsWith("isco")) {
                key = "isco_code_08";
            }
            for(var k=0; k<data[i].children.length; ++k) {
                var child = data[i].children[k];
                child.visible = true;
                if(key) {
                    child.label = child[key] + " - " + child.label;
                }
                if(child.skills) {
                    for(var j=0; j<child.skills.length; ++j) {
                        child.skills[j].visible = true;
                    }
                    ContextUtil.sortByKey(child.skills, "label", true);
                }
            }
            ContextUtil.sortByKey(data[i].children, "label", true);
        }
        ContextUtil.sortByKey(data, "preferredLabel", true);
        this.items = data;
        this.setupTreeView(this.items, false);
        this.setState({loadingRoots: false});
    }

    setupTreeView(data, shouldExpand) {
        // clear previous content
        this.queryTreeView.clear();
        this.queryTreeView.shouldUpdateState = false;
        // add roots
        for(var i=0; i<data.length; ++i) {
            var root = data[i];
            if(!root.visible) {
                continue;
            }
            var rootNode = ControlUtil.createTreeViewItem(this.queryTreeView, root);
            rootNode.setText(root.preferredLabel);
            rootNode.setExpanded(shouldExpand);
            // setup children
            for(var k=0; k<root.children.length; ++k) {
                if(!root.children[k].visible) {
                    continue;
                }
                var childNode = ControlUtil.createTreeViewItem(this.queryTreeView, root.children[k]);
                childNode.setText(root.children[k].label);
                childNode.setExpanded(shouldExpand);

                if(root.children[k].skills) {
                    var headline = root.children[k];
                    for(var j=0; j<headline.skills.length; ++j) {
                        if(!headline.skills[j].visible) {
                            continue;
                        }
                        var skillNode = ControlUtil.createTreeViewItem(this.queryTreeView, headline.skills[j]);
                        skillNode.setText(headline.skills[j].label);
                        skillNode.setExpanded(shouldExpand);
                        childNode.addChild(skillNode);
                    }
                }

                rootNode.addChild(childNode);
            }
            // add node to tree
            this.queryTreeView.addRoot(rootNode);
        }
        this.queryTreeView.shouldUpdateState = true;
        this.queryTreeView.invalidate();
    }

    onSave(message, callback) {
        var state = this.state;
        var sub = state.substitutability.trim();
        if(sub.length == 0) {
            sub = "0";
        }
        App.addSaveRequest();
        Rest.postAddRelation(this.props.item.id, 
                             state.selected.id, 
                             state.type,
                             state.type == "substitutability" ? sub : null,
                             message,
                             () => {
            App.removeSaveRequest();
            callback();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades lägga till relation");
            App.removeSaveRequest();
        });
    }

    onQueryItemSelected(item) {
        this.props.editContext.setEnableSave(true);
        var type = Constants.getRelationType(this.props.item.type, item.data.type);
        this.setState({
            selected: item.data,
            type: type == null ? this.state.type : type,
        });
    }

    onTypeSelected(e) {
        this.props.editContext.setEnableSave(this.state.selected != null);
        this.setState({type: e.target.value});
    }

    onSubstituabilityChanged(e) {
        this.setState({substitutability: e.target.value});
    }

    onFilterChanged(e) {
        var filter = e.target.value.trim().toLowerCase();
        var filterChildren = (children) => {
            var found = false;
            for(var i=0; i<children.length; ++i) {
                var child = children[i];
                child.visible = false;
                if(child.label.toLowerCase().indexOf(filter) != -1) {
                    child.visible = true;
                    found = true;
                }
                if(child.skills) {
                    for(var k=0; k<child.skills.length; ++k) {
                        var skill = child.skills[k];
                        skill.visible = false;
                        if(skill.label.toLowerCase().indexOf(filter) != -1) {
                            child.visible = true;
                            skill.visible = true;
                            found = true;
                        }
                    }
                }
            }
            return found;
        };
        for(var i=0; i<this.items.length; ++i) {
            this.items[i].visible = filterChildren(this.items[i].children);
        }
        this.setupTreeView(this.items, filter.length > 1);
        this.setState({filter: e.target.value});
    }

    renderLoader() {
        if(this.state.loadingRoots) {
            return(
                <Loader/>
            );
        }
    }

    renderConceptTree() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text={Localization.get("edit_concept_relation_text")}/>
                <div className="edit_concept_row">
                    <input 
                        type="text"
                        className="rounded"
                        value={this.state.filter}
                        placeholder={Localization.get("filter")}
                        onChange={this.onFilterChanged.bind(this)}/>
                </div>
                <TreeView 
                    css="add_connection_tree"
                    context={this.queryTreeView}>
                    {this.renderLoader()}
                </TreeView>
            </div>
        );
    }

    renderTypeHint() {
        if(this.state.selected) {
            var type = Constants.getRelationType(this.props.item.type, this.state.selected.type);
            if(type && type != this.state.type) {
                return (
                    <div className="edit_concept_error_text font">
                        {Localization.get("edit_concept_recommended_relation")} "{type}"
                    </div>
                );
                
            }
        }
    }

    renderTypeList() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text="Ange relationstyp till begreppet"/>
                <select 
                    className="rounded"
                    value={this.state.type}
                    onChange={this.onTypeSelected.bind(this)}>
                    <option value="broader">Broader</option>
                    <option value="related">Related</option>
                    <option value="narrower">Narrower</option>
                    <option value="substitutability">Substitutability</option>
                </select>
                {this.renderTypeHint()}
            </div>
        );
    }

    renderSubsitutability() {
        if(this.state.type == "substitutability") {
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text="Ange värde"/>
                    <select 
                        className="rounded"
                        value={this.state.substitutability}
                        onChange={this.onSubstituabilityChanged.bind(this)}>
                        <option value="25">25 - Lägre släktskap</option>
                        <option value="75">75 - Högt släktskap</option>
                    </select>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="edit_concept_group_collection">
                {this.renderConceptTree()}
                {this.renderTypeList()}
                {this.renderSubsitutability()}
            </div>
        );
    }
}

export default EditConceptAddRelation;