import React from 'react';
import Button from '../../control/button.jsx';
import TreeView from '../../control/tree_view.jsx';
import ControlUtil from '../../control/util.jsx';
import Loader from '../../control/loader.jsx';
import Constants from '../../context/constants.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import localization from '../../context/localization.jsx';

class Connections extends React.Component { 

    constructor() {
        super();
        this.relationTreeView = ControlUtil.createTreeView();
        this.relationTreeView.onItemSelected = this.onItemSelected.bind(this);
        this.selectedItem = null;
        this.waitingFor = 0;
        this.waitingForItem = null;
    }

    componentDidMount() {
        this.getRelationsFor(this.props.item);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.getRelationsFor(props.item);
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

    getRelationsFor(item) {        
        this.relationTreeView.clear();
        this.waitingFor = 0;
        this.waitingForItem = null;
        if(item) {
            this.waitingForItem = ControlUtil.createTreeViewItem(this.relationTreeView, null);
            this.waitingForItem.setText(<Loader text={Localization.get("loading")}/>);
            this.relationTreeView.addRoot(this.waitingForItem);
            this.fetch(item, Constants.RELATION_RELATED);        
            this.fetch(item, Constants.RELATION_NARROWER);        
            this.fetch(item, Constants.RELATION_BROADER);
        }
    }

    addRelationToTree(element) {
        var root = this.findRootFor(element.type);
        if(!root) {
            root = ControlUtil.createTreeViewItem(this.relationTreeView, {type: element.type});
            root.setText(Localization.get("db_" + element.type));
            this.relationTreeView.addRoot(root);
        }
        var child = ControlUtil.createTreeViewItem(this.relationTreeView, element);
        child.setText(element.preferredLabel);
        root.addChild(child);
    }

    onVisitClicked() {
        if(this.selectedItem && this.selectedItem.parent) {
            EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.selectedItem.data);
        }
    }

    onItemSelected(item) {
        this.selectedItem = item;
    }

    render() {
        return (
            <div className="connections">
                <TreeView context={this.relationTreeView}/>
                <Button 
                    text={localization.get("visit")} 
                    onClick={this.onVisitClicked.bind(this)}/>
            </div>
        );
    }
	
}

export default Connections;