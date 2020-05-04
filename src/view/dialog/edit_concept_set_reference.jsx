import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import List from './../../control/list.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptSetReference extends React.Component { 

    constructor(props) {
        super(props);
        var replacedBy = this.props.item["replaced-by"];
        this.state = {
            defaultValue: replacedBy != null ? replacedBy[0] : null,
            selected: replacedBy != null ? replacedBy[0] : null,
            items: [],
        };
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    componentDidMount() {
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

    onSave(message, callback) {
        // TODO: handle message
        App.addSaveRequest();
        Rest.postReplaceConcept(this.props.item.id, this.state.selected.id, message, () => {
            this.props.item["replaced-by"] = [this.state.selected];
            App.removeSaveRequest();
            callback();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hänvisa begrepp");
            App.removeSaveRequest();
        });
    }

    onReferenceSelected(item) {
        this.props.editContext.setEnableSave(item != this.state.defaultValue);
        this.setState({selected: item});
    }

    render() {
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

export default EditConceptSetReference;