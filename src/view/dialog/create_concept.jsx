import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';

class CreateConcept extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
			name: "",
			description: "",
        };
	}
	
	onNameChanged(e) {
		this.setState({name: e.target.value});
	}
	
	onDescriptionChanged(e) {
		this.setState({description: e.target.value});
	}

    render() {
        return (
            <div className="dialog_content">
				<Label text={Localization.get("name")}/>
				<input 
					type="text" 
					className="rounded"
					value={this.state.name}
					onChange={this.onNameChanged.bind(this)}/>
                <Label text={Localization.get("description")}/>
                <textarea 
					rows="10" 
					className="rounded"
					value={this.state.description}
					onChange={this.onDescriptionChanged.bind(this)}/>
            </div>
        );
    }
}

export default CreateConcept;