import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import TreeView from './../../control/tree_view.jsx';
import ControlUtil from './../../control/util.jsx';
import Loader from './../../control/loader.jsx';
import Util from './../../context/util.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptRemoveRelation extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.item.preferredLabel,
            isChanged: false,
        };
		this.props.editContext.onSave = this.onSave.bind(this);
		this.selected = [];
        this.relationTreeView = ControlUtil.createTreeView();
    }

    componentDidMount() {
        var item = this.props.item;
        this.waitingFor = 0;
        this.waitingForItem = null;
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

    onSave(message, quality, callback) {
        // TODO: handle message and quality
        var item = this.props.item;
		var conceptId = item.id;
		var relationCounter = {};
		relationCounter[Constants.RELATION_BROADER] = 0;
		relationCounter[Constants.RELATION_NARROWER] = 0;
		relationCounter[Constants.RELATION_RELATED] = 0;
		for(var i=0; i<this.selected.length; ++i) {
			var element = this.selected[i];
			App.addSaveRequest();
			var targetId = element.id;
			var type = element.relationType;
			relationCounter[type]++;
			if(type == Constants.RELATION_NARROWER) {
				var tmp = conceptId;
				conceptId = targetId;
				targetId = tmp;
				type = Constants.RELATION_BROADER;
			}
			Rest.deleteRelation(type, conceptId, targetId, (response) => {
				if(App.removeSaveRequest()) {
					item.relations.broader -= relationCounter[Constants.RELATION_BROADER];
					item.relations.narrower -= relationCounter[Constants.RELATION_NARROWER];
					item.relations.related -= relationCounter[Constants.RELATION_RELATED];
					callback();
				}
			}, (status) => {
				App.showError(Util.getHttpMessage(status) + " : " + data.preferredLabel);
				App.removeSaveRequest();
			});
		}

    }

    onValueChanged(element, e) {
		element.checked = e.target.checked;
		if(element.checked) {
			this.selected.push(element);
		} else {
			var index = this.selected.indexOf(element);
			this.selected.splice(index, 1);
		}
		this.props.editContext.setEnableSave(this.selected.length > 0);
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
					child.showingSelection = false;
					// TODO: setup item correctly
					child.setText(data[i].preferredLabel);
                    child.addChild(item);
                    if(data[i].relations.broader == 0) {
                        var root = this.findRootFor(data[i].type);
                        if(!root) {
                            root = ControlUtil.createTreeViewItem(this.relationTreeView, data[i]);
							root.showingSelection = false;
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
					data[i].relationType = type;
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

    addRelationToTree(element) {
        var root = this.findRootFor(element.type);
        if(!root) {
            root = ControlUtil.createTreeViewItem(this.relationTreeView, element);
			root.showingSelection = false;
            root.setText(Localization.get("db_" + element.type));
            this.relationTreeView.addRoot(root);
            root.setExpanded(true);
		}
		element.checked = false;
		var child = ControlUtil.createTreeViewItem(this.relationTreeView, element);
		child.showingSelection = false;
        child.setText(this.renderElement(element));
        root.addChild(child);
    }

    hideLoader() {
        if(this.waitingForItem) {
            this.relationTreeView.removeRoot(this.waitingForItem);
            this.waitingForItem = null;
        }
	}
	
	renderElement(element) {
		return (
			<div className="edit_concept_tree_view_checkbox_item">
				<input
					type="checkbox"
					id={element.preferredLabel}
                    value={element.checked}
                    onChange={this.onValueChanged.bind(this, element)}/>
				<label htmlFor={element.preferredLabel}>{element.preferredLabel}</label>
			</div>
		);
	}

    render() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text="Kryssa i de relationer som ska tas bort"/>
				<TreeView 
					css="edit_concept_tree_view"
					context={this.relationTreeView}/>
            </div>
        );
    }
}

export default EditConceptRemoveRelation;