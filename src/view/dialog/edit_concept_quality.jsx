import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class EditConceptQuality extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            value: "1",
            isChanged: false,
		};
		// NOTE: temporary
		this.props.editContext.setEnableSave(true);
    }

    onValueChanged(e) {
		this.props.editContext.quality = e.target.value;
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
				</select>
            </div>
        );
    }
}

export default EditConceptQuality;