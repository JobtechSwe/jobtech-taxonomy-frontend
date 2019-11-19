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
import localization from '../../context/localization.jsx';

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
        request.undoCallback = this.onUndoConnections.bind(this);
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

    onAddConnectionClicked() {

    }

    onRemoveConnectionClicked() {
        if(this.selectedItem && this.selectedItem.parent) {
            this.removeConnection(this.selectedItem);
        } else {
            // TODO: allow user to remove all connections by removing root?
        }
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

    fetch(item, type) {
        this.waitingFor++;
        Rest.getAllConceptRelations(item.id, type, (data) => {
            this.waitingFor--;
            if(this.waitingFor <= 0) {
                this.hideLoader();
            }
            for(var i=0; i<data.length; ++i) {         
                this.addRelationToTree(data[i]);
            }
            for(var i=0; i<this.relationTreeView.roots; ++i) {
                this.relationTreeView.roots[i].sortChildren();
            }
        }, () => {
            // TODO: Handle error
            this.waitingFor--;
            if(this.waitingFor <= 0) {
                this.hideLoader();
            }
        }); 
    }

    hideLoader() {
        if(this.waitingForItem) {
            this.relationTreeView.removeRoot(this.waitingForItem);
            this.waitingForItem = null;
        }
    }

    getIsco08CodeFor(item) {
        item.setText(<Loader css="loader_child" text={item.data.preferredLabel}/>);
        Rest.getConceptIsco08(item.data.id, (data) => {
            if(data && data.length == 1) {
                item.data = data[0];
                if(item.data["isco-code-08"]) {
                    item.data.isco = item.data["isco-code-08"];            
                    while(item.data.isco.length < 4) {
                        item.data.isco = "0" + item.data.isco;
                    }                
                }
                item.setText(item.data.isco + "-" + item.data.preferredLabel);
            }
        }, () => {
            // TODO: Handle error
        });
    }

    getSsykCodeFor(item) {
        item.setText(<Loader css="loader_child" text={item.data.preferredLabel}/>);
        Rest.getConceptSsyk(item.data.id, (data) => {
            if(data && data.length == 1) {
                item.data = data[0];
                if(item.data["ssyk-code-2012"]) {
                    item.data.ssyk = item.data["ssyk-code-2012"];            
                    while(item.data.ssyk.length < 4) {
                        item.data.ssyk = "0" + item.data.ssyk;
                    }                
                }
                item.setText(item.data.ssyk + "-" + item.data.preferredLabel);
            }
        }, () => {
            // TODO: Handle error
        });
    }

    setupRelationsFor(item) {        
        this.relationTreeView.clear();
        this.waitingFor = 0;
        this.waitingForItem = null;
        if(item) {
            this.waitingForItem = ControlUtil.createTreeViewItem(this.relationTreeView, null);
            this.waitingForItem.setText(<Loader/>);
            this.relationTreeView.addRoot(this.waitingForItem);
            this.fetch(item, Constants.RELATION_RELATED);        
            this.fetch(item, Constants.RELATION_NARROWER);        
            this.fetch(item, Constants.RELATION_BROADER);
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
        if(element.type === Constants.CONCEPT_ISCO_LEVEL_1 || 
            element.type === Constants.CONCEPT_ISCO_LEVEL_4) {
            this.getIsco08CodeFor(child);
        } else if(element.type === Constants.CONCEPT_SSYK_LEVEL_1 || 
            element.type === Constants.CONCEPT_SSYK_LEVEL_2 || 
            element.type === Constants.CONCEPT_SSYK_LEVEL_3 || 
            element.type === Constants.CONCEPT_SSYK_LEVEL_4) {
            this.getSsykCodeFor(child);
        }
    }

    render() {
        return (
            <div className="connections">
                <TreeView context={this.relationTreeView}/>
                <div>
                    <Button 
                        isEnabled={this.state.hasSelection}
                        text={localization.get("visit")} 
                        onClick={this.onVisitClicked.bind(this)}/>
                    <Button 
                        isEnabled={!this.state.isLocked}
                        text={localization.get("add")}
                        onClick={this.onAddConnectionClicked.bind(this)}/>
                    <Button 
                        isEnabled={!this.state.isLocked}
                        text={localization.get("remove")}
                        onClick={this.onRemoveConnectionClicked.bind(this)}/>
                </div>
            </div>
        );
    }
	
}

export default Connections;