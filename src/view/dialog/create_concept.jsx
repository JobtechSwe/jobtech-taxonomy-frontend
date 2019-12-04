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
		this.WIZARD_STEP_TYPE = 0;
		this.WIZARD_STEP_DESTINATION = 1;
		this.WIZARD_STEP_VALUE = 2;
        this.state = {
			name: "",
			description: "",
			type: "",
			note: "",
			step: this.WIZARD_STEP_TYPE,
        };
	}
	
	onNameChanged(e) {
		this.setState({name: e.target.value});
	}
	
	onDescriptionChanged(e) {
		this.setState({description: e.target.value});
	}
	
	onNoteChanged(e) {
		this.setState({note: e.target.value});
	}

	onTypeChanged(e) {
		this.setState({type: e.target.value});
	}

	onNextClicked() {
		var nextStep = this.state.step + 1;
		if(this.state.step == 0 && this.state.type != "skill") {
			nextStep++;
		}
		this.setState({step: nextStep});
	}

	onSaveClicked() {

	}
	
	onBackClicked() {
		var nextStep = this.state.step - 1;
		if(this.state.step == 2 && this.state.type != "skill") {
			nextStep--;
		}
		this.setState({step: nextStep});
	}

	renderNextButton(isSave) {
		return (
			<Button 
				onClick={isSave ? this.onSaveClicked.bind(this) : this.onNextClicked.bind(this)}
				text={Localization.get(isSave ? "save" : "next")}/>
		);
	}

	renderBackButton() {
		return (
			<Button 
				onClick={this.onBackClicked.bind(this)}
				text={Localization.get("previous")}/>
		);
	}

	renderAbortButton() {
		return (
			<Button 
				onClick={() => EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY)}
				text={Localization.get("abort")}/>
		);
	}

	renderWizardStep0() {
		/*
			"ssyk-level-1"
			"isco-level-4"
			"sni-level-1"
		*/
		// select type
		var roots = [
            "continent",
            "country",
            "driving-licence",
            "employment-duration",
            "employment-type",
            "keyword",
            "language",
            "language-level",
            "municipality",
            "occupation-collection",
            "occupation-field",
            "occupation-name",
            "region",
			"skill-headline",
			"skill",
            "wage-type",
            "worktime-extent",
		];
		return (
			<div>
				<Label 
					css="new_concept_wizard_step_headline"
					text="Välj vilken typ av värde som skapas"/>
				<select
					className="rounded"
					value={this.state.type}
					onChange={this.onTypeChanged.bind(this)}>
					{roots.map((value, index) => {
						var name = Localization.get("db_" + value);
						if(value == "skill-headline") {
							name = Localization.get("skill_headline");
						}
						return (
							<option 
								key={index}
								value={value}>
								{name}
							</option>
						);
					})}
				</select>
				<div className="new_concept_wizard_buttons">
					{this.renderNextButton()}
					{this.renderAbortButton()}
                </div>
			</div>
		);
	}
	
	renderWizardStep1() {
		// select destination
		return (
			<div>
				<Label 
					css="new_concept_wizard_step_headline"
					text="Välj vart det nya värdet ska hamna"/>
				<div className="new_concept_wizard_buttons">
					{this.renderBackButton()}
					{this.renderNextButton()}
					{this.renderAbortButton()}
				</div>
			</div>
		);
	}
	
	renderWizardStep2() {
		// enter values
		return (
			<div>
				<Label 
					css="new_concept_wizard_step_headline"
					text="Ange det nya värdets namn och beskrivning"/>
				<Label text={Localization.get("name")}/>
				<input 
					type="text" 
					className="rounded"
					value={this.state.name}
					onChange={this.onNameChanged.bind(this)}/>
                <Label text={Localization.get("description")}/>
                <textarea 
					rows="5" 
					className="rounded"
					value={this.state.description}
					onChange={this.onDescriptionChanged.bind(this)}/>
				<Label text={Localization.get("note")}/>
				<textarea 
					rows="5" 
					className="rounded"
					value={this.state.note}
					onChange={this.onNoteChanged.bind(this)}/>
				<div className="new_concept_wizard_buttons">
					{this.renderBackButton()}
					{this.renderNextButton(true)}
					{this.renderAbortButton()}
				</div>
			</div>
		);
	}

	renderWizard() {
		switch(this.state.step) {
			case this.WIZARD_STEP_TYPE:
				return this.renderWizardStep0();
			case this.WIZARD_STEP_DESTINATION:
				return this.renderWizardStep1();
			case this.WIZARD_STEP_VALUE:
				return this.renderWizardStep2();
		}
	}

    render() {
        return (
            <div className="dialog_content new_concept_wizard">
				{this.renderWizard()}
            </div>
        );
    }
}

export default CreateConcept;