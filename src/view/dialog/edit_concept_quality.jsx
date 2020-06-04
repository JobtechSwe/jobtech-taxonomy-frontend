import React from 'react';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import Localization from './../../context/localization.jsx';
import Rest from './../../context/rest.jsx';

class EditConceptQuality extends React.Component { 

    constructor(props) {
        super(props);
        var value = "undefined"
        if(this.props.item != null && this.props.item.quality_level != null) {
             value = this.props.item.quality_level;
        }
        this.state = {
            value: value,
            isChanged: false,
		};
        this.props.editContext.onSave = this.onSave.bind(this);
    }

    onSave(message, callback) {
        var item = this.props.item;
        var value = this.state.value === "undefined" ? "" : this.state.value;
        App.addSaveRequest();
        Rest.patchConcept(item.id, message, "&quality-level=" + value.trim(), () => {
            this.props.item.qualityLevel = value.trim();
            App.removeSaveRequest();
            callback();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades uppdatera kvalitetssäkring");
            App.removeSaveRequest();
        });
    }

    onValueChanged(e) {
        this.props.editContext.quality = e.target.value;
        this.props.editContext.setEnableSave(true);
        this.setState({
			value: e.target.value,
			isChanged: true,
		});
    }

    render() {
        return (
            <div className="edit_concept_value_group">
                <Label 
                    css="edit_concept_value_title"
                    text={Localization.get("quality_classification")}/>
                <select 
                    className="rounded"
                    value={this.state.value}
                    onChange={this.onValueChanged.bind(this)}>
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option value="undefined">{Localization.get("undefined")}</option>
				</select>
            </div>
        );
    }
}

export default EditConceptQuality;