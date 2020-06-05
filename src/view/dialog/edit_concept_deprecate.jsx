import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import List from './../../control/list.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import Util from './../../context/util.jsx';

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
            filter: "",
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    async fetchConcepts(type) {
        var query = 
            "concepts(type: \"" + type + "\", version: \"next\") { " + 
                "id type preferredLabel:preferred_label label:preferred_label ssyk_code_2012 isco_code_08 " + 
            "}";
        var data = await Rest.getGraphQlPromise(query);
        data = data.data.concepts;
        var key = null;
        if(type.startsWith("ssyk")) {
            key = "ssyk_code_2012";
        } else if(type.startsWith("isco")) {
            key = "isco_code_08";
        }
        for(var i=0; i<data.length; ++i) {
            var item = data[i];
            item.visible = true;
            if(key) {
                item.label = item[key] + " - " + item.label;
            }
        }
        Util.sortByKey(data, "label", true);
        this.setState({items: data});
    }

    onSave(message, callback) {
        var item = this.props.item;
        App.addSaveRequest();
        if(this.state.shouldReference) {
            App.addSaveRequest();
        }
        Rest.deleteConcept(item.id, message, () => {
            item.deprecated = true;
            if(App.removeSaveRequest()) {
                callback();
            }
        }, () => {
            App.showError(Util.getHttpMessage(status) + " : Avaktualisering misslyckades");
            App.removeSaveRequest();
        });
        if(this.state.shouldReference) {
            Rest.postReplaceConcept(this.props.item.id, this.state.selected.id, message, () => {
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
            this.fetchConcepts(this.props.item.type);
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

    onFilterChanged(e) {
        var filter = e.target.value.trim().toLowerCase();
        var items = this.state.items;
        for(var i=0; i<items.length; ++i) {
            items[i].visible = items[i].label.toLowerCase().indexOf(filter) != -1;
        }
        this.setState({
            filter: e.target.value,
            items: items,
        });
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
            var items = this.state.items.filter((item) => {
                return item.visible;
            });
            items = items.map((item, index) => {
                var id = this.state.selected ? this.state.selected.id : null;
                var css = id == item.id ? "deprecated_reference_selected" : "";
                return (
                    <div 
                        key={index}
                        className={css}
                        onMouseUp={this.onReferenceSelected.bind(this, item)}>
                        {item.label}
                    </div>
                );
            });
            return (
                <div className="edit_concept_value_group">
                    <Label 
                        css="edit_concept_value_title"
                        text="Välj det begrepp som hänvisningen går till"/>
                    <div className="edit_concept_row">
                        <input 
                            type="text"
                            className="rounded"
                            value={this.state.filter}
                            onChange={this.onFilterChanged.bind(this)}/>
                        <div className="edit_concept_text">{Localization.get("filter")}</div>
                    </div>
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