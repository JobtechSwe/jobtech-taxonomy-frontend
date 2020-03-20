import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import List from './../../control/list.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptDeprecate extends React.Component { 

    constructor(props) {
		super(props);
        this.state = {
			defaultValue: this.props.item.deprecated != null ? this.props.item.deprecated : false,
            value: this.props.item.deprecated != null ? this.props.item.deprecated : false,
            isChanged: false,
            shouldReference: false,
            items: [],
            selected: null,
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    onSave(message, callback) {
        // TODO: handle message
        var item = this.props.item;
        App.addSaveRequest();
        if(this.state.shouldReference) {
            App.addSaveRequest();
        }
        Rest.deleteConcept(item.id, () => {
            item.deprecated = true;
            if(App.removeSaveRequest()) {
                callback();
            }
        }, () => {
            App.showError(Util.getHttpMessage(status) + " : Avaktualisering misslyckades");
            App.removeSaveRequest();
        });
        if(this.state.shouldReference) {
            Rest.postReplaceConcept(this.props.item.id, this.state.selected.id, () => {
                this.props.item["replaced-by"] = [this.state.selected];
                if(App.removeSaveRequest()) {
                    callback();
                }
            }, (status) => {
                App.showError(Util.getHttpMessage(status) + " : misslyckades hänvisa begrepp");
                App.removeSaveRequest();
            });
        }
    }

    onValueChanged(e) {
		var isChanged = e.target.checked != this.state.defaultValue;
        if(isChanged != this.state.isChanged) {
            this.props.editContext.setEnableSave(isChanged);
        }
        this.setState({
            value: e.target.checked,
            isChanged: isChanged,
        });
    }

    onShouldReferenceChanged(e) {
        if(this.state.items.length == 0) {
            Rest.getConcepts(this.props.item.type, (data) => {
                data = data.filter((item) => {
                    return item != null && 
                           !item.deprecated &&
                           item.id != this.props.item.id;
                });
                data.sort((a, b) => {
                    if(a.preferredLabel < b.preferredLabel) { 
                        return -1; 
                    }
                    return a.preferredLabel > b.preferredLabel ? 1 : 0;
                });
                this.setState({items: data});
            }, (status) => {
                App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
            });
        }
        if(this.state.shouldReference) {
            this.props.editContext.setEnableSave(this.state.isChanged);
        } else {
            this.props.editContext.setEnableSave(this.state.selected != null);
        }
        this.setState({shouldReference: e.target.checked});
    }

    onReferenceSelected(item) {
        this.props.editContext.setEnableSave(this.state.isChanged);
        this.setState({selected: item});
    }

    renderDeprecate() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text="Avaktualisera begrepp"/>
                <div className="edit_concept_row">
                    <input
                        id="deprecate"
                        type="checkbox"
                        disabled={this.state.defaultValue ? "disabled" : ""}
                        value={this.state.value}
                        onChange={this.onValueChanged.bind(this)}/>
                    <label htmlFor="deprecate">{Localization.get("yes")}</label>
                </div>
            </div>
        );
    }

    renderReferenceCheckbox() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text="Ska begreppet hänvisas"/>
                <div className="edit_concept_row">
                    <input
                        id="shouldReference"
                        type="checkbox"
                        value={this.state.shouldReference}
                        onChange={this.onShouldReferenceChanged.bind(this)}/>
                    <label htmlFor="shouldReference">{Localization.get("yes")}</label>
                </div>
            </div>
        );
    }

    renderReferenceItems() {
        if(this.state.shouldReference) {
            var items = this.state.items.map((item, index) => {
                var id = this.state.selected ? this.state.selected.id : null;
                var css = id == item.id ? "deprecated_reference_selected" : "";
                return (
                    <div 
                        key={index}
                        className={css}
                        onMouseUp={this.onReferenceSelected.bind(this, item)}>
                        {item.preferredLabel}
                    </div>
                );
            });
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text="Välj det begrepp som hänvisningen går till"/>
                    <List css="deprecated_reference_list">
                        {items}
                    </List>
                </div>
            );
        }
    }

	render() {
        return (
            <div className="edit_concept_group_collection">
                {this.renderDeprecate()}
                {this.renderReferenceCheckbox()}
                {this.renderReferenceItems()}
            </div>
        );
    }
}

export default EditConceptDeprecate;