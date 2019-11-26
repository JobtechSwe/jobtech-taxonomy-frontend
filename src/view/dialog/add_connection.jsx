import React from 'react';
import Button from './../../control/button.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Rest from './../../context/rest.jsx';
import Constants from './../../context/constants.jsx';
import TreeView from './../../control/tree_view.jsx';
import Label from './../../control/label.jsx';
import ControlUtil from './../../control/util.jsx';
import Loader from './../../control/loader.jsx';

class AddConnection extends React.Component { 

    constructor(props) {
        super(props);
        // constants
        this.ERROR_NONE = 0;
        this.ERROR_NOTE = 1; // user must provide a note
        this.ERROR_NODE = 2; // user must select a node
        this.ERROR_ROOT = 3; // user cant select the root as node
        this.ERROR_MESSAGE = [
            "",
            Localization.get("error_add_connection_1"),
            Localization.get("error_add_connection_2"),
            Localization.get("error_add_connection_3"),
        ];
        // state
        this.state = {
            loadingRoots: true,
            relationType: "narrower",
            substitutability: "0",
            note: "",
            error: this.ERROR_NONE,
        };
        // variables
        this.queryTreeView = ControlUtil.createTreeView();
        this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
    }

    componentDidMount() {
        // setup treeview roots
        this.rootIndex = 0;
        this.roots = [
            "ssyk-level-1",
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
        this.fetchRoot(this.roots[0]);
    }

    onRelationTypeChanged(e) {
        this.setState({relationType: e.target.value});
    }

    onSubstitutabilityChanged(e) {
        this.setState({substitutability: e.target.value});
    }

    onNoteChanged(e) {
        this.setState({note: e.target.value});
    }

    onQueryItemSelected(item) {
        this.selectedItem = item;
    }

    onAddClicked() {
        if(this.selectedItem) {
            if(this.selectedItem.parent) {
                if(this.state.note.trim() == "") {
                    this.setState({error: this.ERROR_NOTE});
                    return;
                }
                var item = this.selectedItem.data;
                // update item to include other values
                item.relationType = this.state.relationType;
                item.substitutability = this.state.substitutability.trim();
                if(item.substitutability == "") {
                    item.substitutability = "0";
                }
                item.note = this.state.note.trim();
                if(item.note == "") {
                    item.note = " ";
                }
                // show item in connections list
                this.props.callback(item);
                Rest.abort();
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            } else {
                this.setState({error: this.ERROR_ROOT});
            }
        } else {
            this.setState({error: this.ERROR_NODE});
        }
    }

    createNode(element) {
        var node = ControlUtil.createTreeViewItem(this.queryTreeView, element);
        node.data.loaded = false;
        node.setText(element.preferredLabel);
        node.setForceShowButton(element.relations.narrower > 0);
        node.onExpandClicked = (item, show) => {
            if(!item.data.loaded) {
                var loader = ControlUtil.createTreeViewItem(this.queryTreeView);
                loader.setText(<Loader/>);
                item.addChild(loader);
                this.fetchItem(item, item.data.id);
            }
        };
        return node;
    }
    
    fetchRoot(type) {
        Rest.getConcepts(type, (data) => {
            // setup root
            var root = ControlUtil.createTreeViewItem(this.queryTreeView, {type: type});
            root.data.loaded = true;
            root.setText(Localization.get("db_" + type));
            // add initial children
            for(var i=0; i<data.length; ++i) {
                root.addChild(this.createNode(data[i]));
            }
            this.queryTreeView.addRoot(root);
            if(++this.rootIndex < this.roots.length) {
                this.fetchRoot(this.roots[this.rootIndex]);
            } else {
                // TODO: sort?
                this.setState({loadingRoots: false});
            }
        }, () => {
            // TODO: show error
        });
    }

    fetchItem(item, id) {
        Rest.getAllConceptRelations(id, "narrower", (data) => {
            item.data.loaded = true;
            for(var i=0; i<data.length; ++i) {
                item.addChild(this.createNode(data[i]));
            }
            item.removeChild(item.children[0]);
        }, () => {
            // TODO: show error
        });
    }

    renderRelationTypeDropdown() {
        return (
            <select
                className="rounded"
                value={this.state.relationType}
                onChange={this.onRelationTypeChanged.bind(this)}>
                <option value="narrower">Narrower</option>
                <option value="broader">Broader</option>
                <option value="related">Related</option>
            </select>
        );
        /*<option value="substitutability-from">Substitutability-from</option>
        <option value="substitutability-to">Substitutability-to</option>*/
    }
    
    renderError() {
        if(this.state.error != this.ERROR_NONE) {
            return (
                <div className="add_connection_error">
                    <Label text={this.ERROR_MESSAGE[this.state.error]}/>
                </div>
            );
        }
        return ( <div/> );
    }

    renderLoader() {
        if(this.state.loadingRoots) {
            return(
                <Loader/>
            );
        }
    }

    render() {
        return (
            <div className="dialog_content add_connection_content">
                <TreeView 
                    css="add_connection_tree"
                    context={this.queryTreeView}>
                    {this.renderLoader()}
                </TreeView>
                <div className="add_connection_row">
                    <Label text={Localization.get("relation_type") + ":"}/>
                    {this.renderRelationTypeDropdown()}
                    <Label text="Substitutability:"/>
                    <input 
                        className="rounded"
                        type="text"
                        value={this.state.substitutability}
                        onChange={this.onSubstitutabilityChanged.bind(this)}/>
                </div>
                <Label text={Localization.get("note")}/>
                <textarea 
                    rows="5" 
                    className="rounded"
                    value={this.state.note}
                    onChange={this.onNoteChanged.bind(this)}/>
                <div className="add_connection_bottom">    
                    {this.renderError()}
                    <div className="dialog_content_buttons">
                        <Button 
                            onClick={this.onAddClicked.bind(this)}
                            text={Localization.get("add")}/>
                        <Button 
                            onClick={() => {
                                Rest.abort();
                                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
                            }}
                            text={Localization.get("abort")}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddConnection;