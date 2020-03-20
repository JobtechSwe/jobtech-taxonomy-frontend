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
            substitutability: "0",
            type: "broader",
            loadingRoots: true,
        };
        this.props.editContext.onSave = this.onSave.bind(this);
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
            "region",
            "skill-headline",
            "sni-level-1",
            "wage-type",
            "worktime-extent",
        ];
        //"skill"
        this.fetchRoot(0, 6);
        this.fetchRoot(7, 12);
        this.fetchRoot(13, this.roots.length - 1);
    }

    onSave(message, callback) {
        // TODO: handle message
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
        this.setState({selected: item.data});
    }

    onTypeSelected(e) {
        this.props.editContext.setEnableSave(this.state.selected != null);
        this.setState({type: e.target.value});
    }

    onSubstituabilityChanged(e) {
        this.setState({substitutability: e.target.value});
    }

    createNode(element, showChildren) {
        var node = ControlUtil.createTreeViewItem(this.queryTreeView, element);
        node.data.loaded = false;
        node.setText(element.preferredLabel);
        if(showChildren) {
            node.setForceShowButton(false);
        } else {
            node.setForceShowButton(element.relations.narrower > 0);
            node.onExpandClicked = (item, show) => {
                if(!item.data.loaded) {
                    var loader = ControlUtil.createTreeViewItem(this.queryTreeView);
                    loader.setText(<Loader/>);
                    item.addChild(loader);
                    this.fetchItem(item, item.data.id);
                }
            };
        }
        return node;
    }
    
    fetchRoot(offset, index) {
        Rest.getConcepts(this.roots[index], (data) => {
            // setup root
            var root = ControlUtil.createTreeViewItem(this.queryTreeView, {type: this.roots[index]});
            root.data.loaded = true;
            root.setText(Localization.get("db_" + this.roots[index]));
            // add initial children
            for(var i=0; i<data.length; ++i) {
                if(data[i].deprecated == null || !data[i].deprecated) {
                    root.addChild(this.createNode(data[i], this.roots[index].startsWith("ssyk")));
                }
            }
            root.sortChildren();
            this.queryTreeView.addRoot(root);
            ContextUtil.sortByKey(this.queryTreeView.roots, "text", true);
            this.rootIndex++;
            if(--index - offset >= 0) {
                this.fetchRoot(offset, index);
            } else if(this.rootIndex == this.roots.length) {
                this.setState({loadingRoots: false});
            }
        }, () => {
            App.showError(ContextUtil.getHttpMessage(status) + " : misslyckades hämta concept");
        });
    }

    fetchItem(item, id) {
        Rest.getAllConceptRelations(id, "narrower", (data) => {
            item.data.loaded = true;
            for(var i=0; i<data.length; ++i) {
                if(data[i].deprecated == null || !data[i].deprecated) {
                    item.addChild(this.createNode(data[i], false));
                }
            }
            item.removeChild(item.children[0]);
            item.sortChildren();
        }, () => {
            App.showError(ContextUtil.getHttpMessage(status) + " : misslyckades hämta relationer");
        });
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
                    text="Markera det begrepp som den nya relationen ska gå till"/>
                <TreeView 
                    css="add_connection_tree"
                    context={this.queryTreeView}>
                    {this.renderLoader()}
                </TreeView>
            </div>
        );
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
                    <option value="substitutability">Substitutability</option>
                </select>
            </div>
        );
    }

    renderSubsitutability() {
        if(this.state.type == "substitutability") {
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text="Ange utbyttbarhets sannolikhet"/>
                    <input 
                        className="rounded"
                        value={this.state.substitutability}
                        onChange={this.onSubstituabilityChanged.bind(this)}/>
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