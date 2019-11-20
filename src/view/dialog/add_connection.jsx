import React from 'react';
import Button from './../../control/button.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Rest from './../../context/rest.jsx';
import Constants from './../../context/constants.jsx';
import TreeView from './../../control/tree_view.jsx';
import ControlUtil from './../../control/util.jsx';
import Loader from './../../control/loader.jsx';

class AddConnection extends React.Component { 

    constructor(props) {
        super(props);
        // state
        this.state = {
            loadingRoots: true,
        }
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

    onQueryItemSelected(item) {
        this.selectedItem = item;
    }

    onAddClicked() {
        if(this.selectedItem) {
            if(this.selectedItem.parent) {
                this.props.callback(this.selectedItem.data);
                EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
            } else {
                // TODO: show warning
            }
        } else {
            // TODO: show warning
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
                <TreeView context={this.queryTreeView}>
                    {this.renderLoader()}
                </TreeView>
                <div className="dialog_content_buttons">
                    <Button 
                        onClick={this.onAddClicked.bind(this)}
                        text={Localization.get("add")}/>
                    <Button 
                        onClick={() => EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY)}
                        text={Localization.get("abort")}/>
                </div>
            </div>
        );
    }
}

export default AddConnection;