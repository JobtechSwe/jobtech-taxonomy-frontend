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
import CacheManager from '../../context/cache_manager.jsx';

class Connections extends React.Component { 

    constructor() {
        super();
        this.state = {
            isLocked: true,
            hasSelection: false,
        };
        this.relations = [];
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
        this.selectedItem = null;
        this.setupRelationsFor(props.item);
        this.setState({hasSelection: false});
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

    onItemSelected(item) {
        this.selectedItem = item;
        this.setState({hasSelection: this.selectedItem.parent ? true : false});
    }

    findRootFor(type) {
        return this.relationTreeView.roots.find((root) => {
            return root.data ? type == root.data.type : false;
        });
    }

    findSkillHeadline(root, id) {
        if(root) {
            return root.children.find((e) => {
                return e.data.id == id;
            });
        }
        return null;
    }

    fetchSkillHeadline(item) {
        var root = this.findRootFor("skill-headline");
        if(!root) {
            root = ControlUtil.createTreeViewItem(this.relationTreeView, {type: "skill-headline"});
            root.setText(Localization.get("db_skill-headline"));
            root.setExpanded(true);
            this.relationTreeView.addRoot(root);
        }
        this.waitingFor++;
        Rest.getAllConceptRelations(item.data.id, Constants.RELATION_BROADER, (data) => {
            for(var i=0; i<data.length; ++i) {
                if(data[i].type != "skill-headline") {
                    continue;
                }
                var headline = this.findSkillHeadline(root, data[i].id);
                if(headline == null) {
                    headline = ControlUtil.createTreeViewItem(this.relationTreeView, data[i]);
                    headline.setText(data[i].preferredLabel);
                    root.addChild(headline);
                }
                headline.addChild(item);
                Util.sortByKey(headline.children, "text", true);
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

    /*fetch(item, type) {
        this.waitingFor++;
        Rest.getAllConceptRelations(item.id, type, (data) => {
            var container = this.relations.find((e) => {
                return e.type == type;
            });
            if(container == null) {
                container = {
                    type: type,
                    ids: [],
                };
                this.relations.push(container);
            }
            for(var i=0; i<data.length; ++i) {
                if(data[i].type == "skill" && item.type != "skill-headline") {
                    var child = ControlUtil.createTreeViewItem(this.relationTreeView, data[i]);
                    child.setText(data[i].preferredLabel);
                    this.fetchSkillHeadline(child);
                } else {
                    this.addRelationToTree(data[i]);  
                }
                container.ids.push(data[i].id);
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
    }*/

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
            this.relationTreeView.shouldUpdateState = false;

            if(item.narrower) {
                for(var i=0; i<item.narrower.length; ++i) {
                    this.addRelationToTree(item.narrower[i]);
                }
            }
            if(item.broader) {
                for(var i=0; i<item.broader.length; ++i) {
                    this.addRelationToTree(item.broader[i]);
                }
            }
            if(item.related) {
                for(var i=0; i<item.related.length; ++i) {
                    this.addRelationToTree(item.related[i]);
                }
            }

            //sort
            for(var i=0; i<this.relationTreeView.roots.length; ++i) {
                var root = this.relationTreeView.roots[i];
                Util.sortByKey(root.children, "text", true);
            }
            Util.sortByKey(this.relationTreeView.roots, "text", true);
            this.relationTreeView.shouldUpdateState = true;
            this.relationTreeView.invalidate();
        }
    }

    addRelationToTree(element) {
        var root = this.findRootFor(element.type);
        if(!root) {
            root = ControlUtil.createTreeViewItem(this.relationTreeView, element);
            root.setText(Localization.get("db_" + element.type));
            this.relationTreeView.addRoot(root);
            root.setExpanded(true);
        }
        var child = ControlUtil.createTreeViewItem(this.relationTreeView, element);
        var text = element.preferredLabel;
        if(element.isco) {
            text = element.isco + " - " + text;
        }
        else if(element.ssyk) {
            text = element.ssyk + " - " + text;
        }
        child.setText(text);
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
                </div>
            </div>
        );
    }
	
}

export default Connections;