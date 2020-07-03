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
import ConceptWrapper from '../../control/concept_wrapper.jsx';
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

    hideLoader() {
        if(this.waitingForItem) {
            this.relationTreeView.removeRoot(this.waitingForItem);
            this.waitingForItem = null;
        }
    }

    async setupRelationsFor(item) {      
        this.relationTreeView.clear();
        this.waitingFor = 0;
        this.waitingForItem = null;
        if(item) {
            this.relationTreeView.shouldUpdateState = false;
            if(item.narrower) {
                for(var i=0; i<item.narrower.length; ++i) {
                    await this.addRelationToTree(item.narrower[i]);
                }
            }
            if(item.broader) {
                for(var i=0; i<item.broader.length; ++i) {
                    await this.addRelationToTree(item.broader[i]);
                }
            }
            if(item.related) {
                for(var i=0; i<item.related.length; ++i) {
                    await this.addRelationToTree(item.related[i]);
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

    async addRelationToTree(element) {
        var root = this.findRootFor(element.type);
        if(!root) {
            root = ControlUtil.createTreeViewItem(this.relationTreeView, element);
            root.setText(Localization.get("db_" + element.type));
            this.relationTreeView.addRoot(root);
            root.setExpanded(true);
        } 
        if(element.type == Constants.CONCEPT_SKILL) {
            // check children of root for actuall root
            for(var i=0; i<root.children.length; ++i) {
                var child = root.children[i];
                if(child.data.narrower) {
                    var result = child.data.narrower.find((e) => {
                        return e.id == element.id;
                    });
                    if(result) {
                        root = child;
                        break;
                    }
                }
            }
            if(root.data.type == Constants.CONCEPT_SKILL) {
                // invalid root found, fetch real root
                var query = 
                    "concepts(id: \"" + element.id + "\", version: \"next\") { " + 
                        "broader(type: \"skill-headline\") { " + 
                            "id type preferredLabel:preferred_label " + 
                            "narrower(type: \"skill\") { "+
                                "id " +
                            "} " +
                        "} " +
                    "}";
                var data = await Rest.getGraphQlPromise(query);
                if(data.data.concepts.length > 0) {
                    data = data.data.concepts[0].broader[0];
                    var headline = ControlUtil.createTreeViewItem(this.relationTreeView, data);
                    headline.setText(<ConceptWrapper concept={data}>{data.preferredLabel}</ConceptWrapper>);
                    headline.setExpanded(true);
                    root.addChild(headline);
                    root = headline;
                }
            }
        }
        var child = ControlUtil.createTreeViewItem(this.relationTreeView, element);
        var text = element.preferredLabel;
        if(element.isco) {
            text = element.isco + " - " + text;
        } else if(element.ssyk) {
            text = element.ssyk + " - " + text;
        }
        child.setText(<ConceptWrapper concept={element}>{text}</ConceptWrapper>);
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