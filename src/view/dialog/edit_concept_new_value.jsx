import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import List from './../../control/list.jsx';
import ControlUtil from './../../control/util.jsx';
import ContextUtil from './../../context/util.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import CacheManager from './../../context/cache_manager';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import Rest from './../../context/rest.jsx';
import EditConceptQuality from './edit_concept_quality.jsx';

class EditConceptNewValue extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            type: "--",
            relationType: "broader",
            substitutability: "",
            parentType: null,
            parent: null,
            parentConcepts: [],
            name: "",
            definition: "",
            isNameInvalid: false,
		};
        this.props.editContext.onSave = this.onSave.bind(this);
        this.qualityContext = {
            setEnableSave: (enabled) => {},
            onSave: null,
            quality: "",
        };
    }

    onSaveRelation(callback, from, to, type, substitutability, message) {
        if(type != "substitutability" || (substitutability && substitutability.trim().length == 0)) {
            substitutability = null;
        }
        App.addSaveRequest();
        Rest.postAddRelation(from.id, to.id, type, substitutability, message, (data) => {
            if(App.removeSaveRequest()) {
                EventDispatcher.fire(Constants.EVENT_NEW_CONCEPT, {
                    concept: this.concept,
                    parent: this.state.parent,
                });
                callback();
            }
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades skapa ny relation");
            App.removeSaveRequest();
        });
    }

    onSave(message, callback) {
        // TODO: handle quality
        // this.qualityContext.quality
        var state = this.state;
        App.addSaveRequest();
        Rest.postConcept(state.type, message, state.name.trim(), encodeURIComponent(state.definition), this.qualityContext.quality, (data) => {
            CacheManager.invalidateCachedTypeList(data.concept.type);
            this.concept = data.concept;
            if(state.parent) {
                // add relation between new concept and its selected parent
                this.onSaveRelation(callback, data.concept, state.parent, "broader", null, message);
            }
            if(this.props.item) {
                // add relation between new concept and source concept
                this.onSaveRelation(callback, data.concept, this.props.item, state.relationType, state.substitutability, message);
            }
            if(App.removeSaveRequest()) {
                EventDispatcher.fire(Constants.EVENT_NEW_CONCEPT, {
                    concept: this.concept,
                    parent: this.state.parent,
                });
                callback();
            }
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades skapa nytt begrepp");
            App.removeSaveRequest();
        });
    }

    onTypeSelected(e) {
        var parentType = this.getParentType(e.target.value);
        var parentConcepts = parentType == this.state.parentType ? this.state.parentConcepts : [];
        var relationType = this.props.item == null ? null : Constants.getRelationType(this.props.item.type, e.target.value);
        this.setState({
            name: "",
            definition: "",
            type: e.target.value,
            parent: null,
            parentType: parentType,
            parentConcepts: parentConcepts,
            relationType: relationType == null ? this.state.relationType : relationType,
        }, () => {
            this.updateSaveStatus();
        });
        if(parentType != null && parentConcepts.length == 0) {
            Rest.getConcepts(parentType, (data) => {
                if(parentType === "skill-headline") {
                    data = ContextUtil.sortByKey(data, "preferredLabel", true);
                }
                this.setState({parentConcepts: data});
            }, (status) => {

            });
        }
    }

    onRelationTypeSelected(e) {
        this.setState({relationType: e.target.value}, () => {
            this.updateSaveStatus();
        });
    }

    onSubstituabilityChanged(e) {
        this.setState({substitutability: e.target.value}, () => {
            this.updateSaveStatus();
        });
    }

    onParentSelected(parent) {
        this.setState({parent: parent}, () => {
            this.updateSaveStatus();
        });
    }

    onNameChanged(e) {
        var name = e.target.value.trim();
        this.setState({name: e.target.value});
        if(name.length > 0) {
            Rest.abort();
            Rest.getConceptByTypeAndName(this.state.type, name, (data) => {
                this.setState({isNameInvalid: data.length != 0}, () => {
                    this.updateSaveStatus();
                });
            }, () => {
    
            }); 
        } else {
            this.updateSaveStatus();
        }
    }
    
    onDefinitionChanged(e) {
        this.setState({definition: e.target.value}, () => {
            this.updateSaveStatus();
        });
    }

    updateSaveStatus() {
        var enabled = true;
        var state = this.state;
        if(state.type == "--") {
            enabled = false;
        } else if(state.parentType != null && state.parent == null) {
            enabled = false;
        }
        var name = state.name.trim();
        var definition = state.definition.trim();
        if(name.length == 0 || definition.length == 0 || state.isNameInvalid) {
            enabled = false;
        }
        this.props.editContext.setEnableSave(enabled);
    }

    getRootParent(type) {
        var parent = this.getParentType(type);
        while(parent) {
            var next = this.getParentType(parent);
            if(next) {
                parent = next;
            } else {
                return parent;
            }
        }
        return type;
    }

    getParentType(type) {
        if(type == "skill") {
            return "skill-headline";
        }
        return null;
    }

    renderParentSelector() {
        if(this.state.parentType) {
            var parentText = Localization.getLower("db_" + this.state.parentType);
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text={"Välj vilken " + parentText + " begreppet ska hamna under"}/>
                    <List 
                        css="edit_concept_list"
                        onItemSelected={this.onParentSelected.bind(this)}
                        data={this.state.parentConcepts}
                        dataRender={(item) => {
                            return ( 
                                <div>
                                    {item.preferredLabel}
                                </div> 
                            );
                        }}/>
                </div>
            );
        }
    }

    renderType() {
        var types = Constants.DB_TYPES;
        types.sort((a, b) => {
            a = Localization.get("db_" + a);
            b = Localization.get("db_" + b);
            if(a < b) {
                return -1;
            }
            if(a > b) {
                return 1;
            }
            return 0;
        });
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text="Välj typ av begrepp"/>
                <select
                    className="rounded"
                    value={this.state.type}
                    onChange={this.onTypeSelected.bind(this)}>
                    <option>--</option>
                    {types.map((value, index) => {
                        return ( <option key={index} value={value}>{Localization.get("db_" + value)}</option> );
                    })}
                </select>
            </div>
        );
    }

    renderErrorText() {
        if(this.state.isNameInvalid) {
            return (
                <div className="edit_concept_error_text font">
                    Namnet är upptaget, vänligen välj ett annat namn
                </div>
            );
        }
    }

    renderNameField() {
        if(this.state.type != "--") {
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text="Namn"/>
                    <input
                        className="rounded"
                        value={this.state.name}
                        onChange={this.onNameChanged.bind(this)}/>
                    {this.renderErrorText()}
                </div>
            );
        }
    }

    renderDefinitionField() {
        if(this.state.type != "--") {
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text="Definition"/>
                    <textarea
                        rows="10" 
                        className="rounded"
                        value={this.state.definition}
                        onChange={this.onDefinitionChanged.bind(this)}/>
                </div>
            );
        }
    }

    renderRelationTypeList() {
        if(this.props.item) {
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text="Ange relationstyp till begreppet"/>
                    <select 
                        className="rounded"
                        value={this.state.relationType}
                        onChange={this.onRelationTypeSelected.bind(this)}>
                        <option value="broader">Broader</option>
                        <option value="related">Related</option>
                        <option value="narrower">Narrower</option>
                        <option value="substitutability">Substitutability</option>
                    </select>
                </div>
            );
        }
    }
    
    renderSubsitutability() {
        if(this.state.relationType == "substitutability") {
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
            <div className="edit_concept_value_group">
                {this.renderType()}
                {this.renderRelationTypeList()}
                {this.renderSubsitutability()}
                {this.renderParentSelector()}
                {this.renderNameField()}
                <EditConceptQuality editContext={this.qualityContext}/>
                {this.renderDefinitionField()}
            </div>
        );
    }
}

export default EditConceptNewValue;