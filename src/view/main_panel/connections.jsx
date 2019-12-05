import React from 'react';
import Button from '../../control/button.jsx';
import TreeView from '../../control/tree_view.jsx';
import ControlUtil from '../../control/util.jsx';
import Loader from '../../control/loader.jsx';
import Constants from '../../context/constants.jsx';
import App from '../../context/app.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Util from '../../context/util.jsx';
import AddConnection from './../dialog/add_connection.jsx';
import CreateConcept from './../dialog/create_concept.jsx';

class Connections extends React.Component { 

    constructor() {
        super();
        this.state = {
            isLocked: true,
            hasSelection: false,
        };
        this.relationTreeView = ControlUtil.createTreeView();
        this.relationTreeView.onItemSelected = this.onItemSelected.bind(this);
        this.selectedItem = null;
        this.waitingFor = 0;
        this.waitingForItem = null;
    }

    componentDidMount() {
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.init(props);
    }

    init(props) {
        if(props.groupContext) {
            props.groupContext.onLockChanged = this.onGroupLockedChanged.bind(this);
        }
        this.selectedItem = null;
        this.setupRelationsFor(props.item);
        this.setState({hasSelection: false});
    }

    createEditRequest(parent, item, isRemoved) {
        var request = App.createEditRequest(item.data.id);
        request.newValue = {
            parent: parent,
            item: item,
            isRemoved: isRemoved,
        };
        request.oldValue = {
            parent: parent,
            item: item,
            isRemoved: !isRemoved,
        };
        request.compare = (newValue, oldValue) => {
            return oldValue.isRemoved == newValue.isRemoved && oldValue.parent.id == newValue.parent.id;
        };
        request.objectId = this.props.item.id;
        request.groupId = "connections";
        request.undoCallback = this.onUndoConnections.bind(this);
        request.saveCallback = this.onSave.bind(this);
        request.text = Localization.get("connections");
        return request;
    }

    onUndoConnections(value) {
        if(value.parent && !value.parent.attached && !value.parent.parent) {
            this.relationTreeView.addRoot(value.parent, () => {
                if(value.isRemoved) {
                    value.parent.removeChild(value.item);
                } else {
                    value.parent.addChild(value.item);
                }
            });
        } else {
            // NOTE: potentially a problem, if parents parent is not bound this will give a error
            if(value.isRemoved) {
                value.parent.removeChild(value.item);
            } else {
                value.parent.addChild(value.item);
            }
        }
        if(value.parent.children.length == 0) {
            this.relationTreeView.removeRoot(value.parent);
        }
    }
    
    onSave(changes) {
        // TODO: we need to apply changes localy is some nice way
        var targetId = this.props.item.id;
        for (var prop in changes) {
            var item = changes[prop].item;
            var data = item.data;
            var id = data.id;
            if(item.isRemoved) {
                
            } else {
                App.addSaveRequest();
                Rest.postAddRelation(targetId, id, data.relationType, data.note, data.substitutability, (response) => {
                    App.removeSaveRequest();
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : " + data.preferredLabel);
                    App.removeSaveRequest();
                });
            }
        }
    }
    
    removeConnection(item) {
        var parent = item.parent;
        App.addEditRequest(this.createEditRequest(parent, item, true));
        parent.removeChild(item);
        if(parent.children.length == 0) {
            this.relationTreeView.removeRoot(parent);
        }
        if(item == this.selectedItem) {
            this.selectedItem = null;
            this.setState({hasSelection: false});
        }
    }

    onSaveDialogResult(item, result) {
        if(result != Constants.DIALOG_OPTION_ABORT) {
            // user saved or discared changes and wants to continue
            EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item);
        }
    }

    onGroupLockedChanged(isLocked) {
        this.setState({isLocked: isLocked});
    }

    onVisitClicked() {
        if(this.selectedItem && this.selectedItem.parent) {
            if(App.hasUnsavedChanges()) {
                App.showSaveDialog(this.onSaveDialogResult.bind(this, this.selectedItem.data));
            } else {
                EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.selectedItem.data);
            }
        }
    }

    onConnectionAdded(item, ignoreEditRequest) {
        // TODO: need to handle skill (display parent chain as tree)
        // check for parent
        var parent = null;
        for(var i=0; i<this.relationTreeView.roots.length; ++i) {
            var root = this.relationTreeView.roots[i];
            if(root.data.type == item.type) {
                parent = root;
                break;
            }
        }
        if(parent == null) {
            // setup new parent
            parent = ControlUtil.createTreeViewItem(this.relationTreeView, {type: item.type});
            parent.setText(Localization.get("db_" + item.type));
            this.relationTreeView.addRoot(parent);
        }
        // setup item
        var child = ControlUtil.createTreeViewItem(this.relationTreeView, item);
        child.setText(item.preferredLabel);
        parent.addChild(child);
        if(!ignoreEditRequest) {
            // setup change request item
            App.addEditRequest(this.createEditRequest(parent, child, false));
        }
    }

    onConnectionCreated(concept) {
        this.onConnectionAdded(concept, true);
    }

    onAddConnectionClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("add_connection") + " " + Localization.getLower("from") + " " + this.props.item.preferredLabel,
            content: <AddConnection callback={this.onConnectionAdded.bind(this)}/>
        });
    }

    onRemoveConnectionClicked() {
        if(this.selectedItem && this.selectedItem.parent && this.selectedItem.children.length == 0) {
            this.removeConnection(this.selectedItem);
        } else {
            // TODO: allow user to remove all connections by removing root?
        }
    }

    onCreateValueClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("new_value"),
            content: <CreateConcept 
                        callback={this.onConnectionCreated.bind(this)}
                        conceptId={this.props.item.id}/>
        });
    }

    onItemSelected(item) {
        this.selectedItem = item;
        this.setState({hasSelection: true});
    }

    findRootFor(type) {
        return this.relationTreeView.roots.find((root) => {
            return root.data ? type == root.data.type : false;
        });
    }

    fetchSkill(item) {
        this.waitingFor++;
        Rest.getAllConceptRelations(item.data.id, Constants.RELATION_BROADER, (data) => {
            for(var i=0; i<data.length; ++i) {
                if(data[i].type == "skill" || data[i].type == "skill-headline") {
                    var child = ControlUtil.createTreeViewItem(this.relationTreeView, data[i]);
                    child.setText(data[i].preferredLabel);
                    child.addChild(item);
                    if(data[i].relations.broader == 0) {
                        var root = this.findRootFor(data[i].type);
                        if(!root) {
                            root = ControlUtil.createTreeViewItem(this.relationTreeView, data[i]);
                            root.setText(Localization.get("db_" + data[i].type));
                            this.relationTreeView.addRoot(root);
                        }
                        root.addChild(child);
                    } else {
                        this.fetchSkill(child);
                    }
                }
            }
            if(--this.waitingFor <= 0) {
                Util.sortByKey(this.relationTreeView.roots, "text", true);
                this.hideLoader();
            }
        }, () => {
            if(--this.waitingFor <= 0) {
                this.hideLoader();
            }
            App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta concept av typ '" + type + "'");
        }); 
    }

    fetch(item, type) {
        this.waitingFor++;
        Rest.getAllConceptRelations(item.id, type, (data) => {
            for(var i=0; i<data.length; ++i) {
                if(data[i].type == "skill") {
                    var child = ControlUtil.createTreeViewItem(this.relationTreeView, data[i]);
                    child.setText(data[i].preferredLabel);
                    this.fetchSkill(child);
                } else {
                    this.addRelationToTree(data[i]);  
                }
            }
            for(var i=0; i<this.relationTreeView.roots.length; ++i) {
                this.relationTreeView.roots[i].sortChildren();
            }
            if(--this.waitingFor <= 0) {
                Util.sortByKey(this.relationTreeView.roots, "text", true);
                this.hideLoader();
            }
        }, (status) => {
            if(--this.waitingFor <= 0) {
                this.hideLoader();
            }
            App.showError(Util.getHttpMessage(status) + " : misslyckades att hämta concept av typ '" + type + "'");
        }); 
    }

    hideLoader() {
        if(this.waitingForItem) {
            this.relationTreeView.removeRoot(this.waitingForItem);
            this.waitingForItem = null;
        }
    }

    setupRelationsFor(item) {      
        this.relationTreeView.clear();
        this.waitingFor = 0;
        this.waitingForItem = null;
        if(item) {
            if(item.relations.broader + item.relations.narrower + item.relations.related) {
                this.waitingForItem = ControlUtil.createTreeViewItem(this.relationTreeView, null);
                this.waitingForItem.setText(<Loader/>);
                this.relationTreeView.addRoot(this.waitingForItem);
            }
            if(item.relations.broader) {
                this.fetch(item, Constants.RELATION_BROADER);
            }
            if(item.relations.narrower) {
                this.fetch(item, Constants.RELATION_NARROWER);
            }
            if(item.relations.related) {
                this.fetch(item, Constants.RELATION_RELATED);
            }
        }
    }

    addRelationToTree(element) {
        var root = this.findRootFor(element.type);
        if(!root) {
            root = ControlUtil.createTreeViewItem(this.relationTreeView, element);
            root.setText(Localization.get("db_" + element.type));
            this.relationTreeView.addRoot(root);
        }
        var child = ControlUtil.createTreeViewItem(this.relationTreeView, element);
        child.setText(element.preferredLabel);
        root.addChild(child);
    }

    render() {
        return (
            <div className="connections">
                <TreeView context={this.relationTreeView}/>
                <div>
                    <Button 
                        isEnabled={this.state.hasSelection}
                        text={Localization.get("visit")} 
                        onClick={this.onVisitClicked.bind(this)}/>
                    <Button 
                        isEnabled={!this.state.isLocked}
                        text={Localization.get("add")}
                        onClick={this.onAddConnectionClicked.bind(this)}/>
                    <Button 
                        isEnabled={!this.state.isLocked && this.state.hasSelection}
                        text={Localization.get("remove")}
                        onClick={this.onRemoveConnectionClicked.bind(this)}/>
                    <Button 
                        isEnabled={!this.state.isLocked}
                        text={Localization.get("new_value")}
                        onClick={this.onCreateValueClicked.bind(this)}/>
                </div>
            </div>
        );
    }
	
}

export default Connections;