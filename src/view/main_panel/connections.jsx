import React from 'react';
import Label from '../../control/label.jsx';
import TreeView from '../../control/tree_view.jsx';
import ControlUtil from '../../control/util.jsx';
import Constants from '../../context/constants.jsx';
import Rest from '../../context/rest.jsx';
import Localization from '../../context/localization.jsx';

class Connections extends React.Component { 

    constructor() {
        super();
        this.relationTreeView = ControlUtil.createTreeView();
        this.relationTreeView.onItemSelected = this.onItemSelected.bind(this);
    }

    componentDidMount() {
        this.getRelationsFor(this.props.item);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.getRelationsFor(props.item);
    }

    findRootFor(type) {
        return this.relationTreeView.roots.find((root) => {
            return type == root.data.type
        });
    }

    fetch(item, type) {
        Rest.getAllConceptRelations(item.id, type, (data) => {
            for(var i=0; i<data.length; ++i) {         
                this.addRelationToTree(data[i]);
            }
        }, () => {
            // TODO: Handle error
        }); 
    }

    getRelationsFor(item) {
        this.relationTreeView.clear();
        if(item) {   
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

    onItemSelected(item) {
        // TODO: 
    }

    render() {
        return (
            <div className="connections">
                <Label text={Localization.get("connections")}/>
                <TreeView context={this.relationTreeView}/>
            </div>
        );
    }
	
}

export default Connections;