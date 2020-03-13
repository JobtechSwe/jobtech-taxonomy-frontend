import React from 'react';
import Button from './../../control/button.jsx';
import Label from './../../control/label.jsx';
import App from './../../context/app.jsx';
import Rest from './../../context/rest.jsx';
import Util from './../../context/util.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import ControlUtil from './../../control/util.jsx';
import TreeView from './../../control/tree_view.jsx';
import Loader from './../../control/loader.jsx';

class CreateConcept extends React.Component { 

    constructor(props) {
		super(props);
		// constants
		this.WIZARD_STEP_TYPE = 0;
		this.WIZARD_STEP_DESTINATION = 1;
		this.WIZARD_STEP_VALUE = 2;
		this.WIZARD_STEP_NOTE = 3;
		// state
        this.state = {
			name: "",
			description: "",
			skillGroup: null,
			relationType: "narrower",
			substitutability: "0",
			type: Localization.get("default_option"),
			note: "",
			step: this.WIZARD_STEP_TYPE,
			isNextEnabled: false,
			isLoading: false,
        };
        // variables
        this.queryTreeView = ControlUtil.createTreeView();
		this.queryTreeView.onItemSelected = this.onQueryItemSelected.bind(this);
	}
	
    onQueryItemSelected(item) {
		this.setState({
			skillGroup: item.data.id,
			isNextEnabled: true,
		});
	}
	
	onNameChanged(e) {
		var name = e.target.value;
		this.setState({
			name: name,
			isNextEnabled: name != "" && this.state.description != "",
		});
	}
	
	onDescriptionChanged(e) {
		var desc = e.target.value;
		this.setState({
			description: desc,
			isNextEnabled: desc != "" && this.state.name != "",
		});
	}
	
	onNoteChanged(e) {
		this.setState({note: e.target.value});
	}

	onTypeChanged(e) {
		this.setState({
			type: e.target.value,
			isNextEnabled: e.target.value != Localization.get("default_option"),
		});
	}

    onRelationTypeChanged(e) {
        this.setState({relationType: e.target.value});
    }

    onSubstitutabilityChanged(e) {
        var value = e.target.value.trim();
        if(value == "0") { 
            this.setState({substitutability: value});
        } else if(value != "") {
            while(value.startsWith("0")) {
                value = value.substring(1, value.length);
            }
            var i = parseInt(value);
            if(i > 100) {
                value = "100";
            }
            this.setState({substitutability: value});
        } else {
            this.setState({substitutability: "0"});
        }
    }

	onNextClicked() {
		var nextStep = this.state.step + 1;
		if(this.state.step == 0 && this.state.type != "skill") {
			nextStep++;
		}
		this.setState({
			step: nextStep,
			isLoading: nextStep == this.WIZARD_STEP_DESTINATION,
			isNextEnabled: nextStep == this.WIZARD_STEP_NOTE,
		}, () => {
            if(this.state.step == 1) {
                Rest.getConcepts("skill-headline", (data) => {
                    this.queryTreeView.roots = [];
                    this.queryTreeView.shouldUpdateState = false;
                    for(var i=0; i<data.length; ++i) {
                        var node = ControlUtil.createTreeViewItem(this.queryTreeView, data[i]);
                        node.setText(data[i].preferredLabel);
                        this.queryTreeView.addRoot(node);
                    }
                    this.queryTreeView.shouldUpdateState = true;
                    Util.sortByKey(this.queryTreeView.roots, "text", true);
                    this.queryTreeView.invalidate();
                    this.setState({isLoading: false});
                }, () => {

                });
            }
        });
	}
	
	onBackClicked() {
		var nextStep = this.state.step - 1;
		if(this.state.step == 2 && this.state.type != "skill") {
			nextStep--;
		}
		this.setState({step: nextStep});
	}

	onSaveClicked() {
		EventDispatcher.fire(Constants.EVENT_SHOW_SAVE_INDICATOR);
		var type = this.state.type.trim();
		var name = this.state.name.trim();
		var description = this.state.description.trim();
		Rest.postConcept(type, name, encodeURIComponent(description), (data) => {
			if(this.state.skillGroup) {
				// we created a skill, need to add relation to its owning group
				this.saveSkillOwnerRelation(data.concept);
			}
			this.saveRelation(data.concept);		
		}, (status) => {
			EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_INDICATOR);
			App.showError(Util.getHttpMessage(status) + " : misslyckades att skapa concept");
		});
	}

	saveRelation(concept) {
		var ownerId = this.props.conceptId;
		var relationType = this.state.relationType;
		var substitutability = relationType === "substitutability" ? this.state.substitutability : null;
		Rest.postAddRelation(ownerId, concept.id, relationType, substitutability, (data) => {
			this.props.callback(concept);
			EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_INDICATOR);
			EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
		}, (status) => {
			EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_INDICATOR);
			App.showError(Util.getHttpMessage(status) + " : misslyckades att skapa koppling till det nya conceptet");
		});
	}

	saveSkillOwnerRelation(concept) {
		var ownerId = this.state.skillGroup;
		var note = "Automatiskt genererad koppling för ny kompetens";
		Rest.postAddRelation(ownerId, concept.id, "broader", null, (data) => {
		
		}, (status) => {
			App.showError(Util.getHttpMessage(status) + " : misslyckades att skapa koppling mellan kompetense och dess grupp");
		});
	}

	renderNextButton(isSave) {
		return (
			<Button 
				isEnabled={this.state.isNextEnabled}
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
	
    renderRelationTypeDropdown() {
        return (
            <select
                className="rounded"
                value={this.state.relationType}
                onChange={this.onRelationTypeChanged.bind(this)}>
                <option value="narrower">Narrower</option>
                <option value="broader">Broader</option>
                <option value="related">Related</option>
                <option value="substitutability">Substitutability</option>
            </select>
        );
    }

    renderSubstituability() {
        if(this.state.relationType == "substitutability") {
            return (
                <div className="add_connection_row">
                    <input 
                        className="rounded"
                        type="number" 
                        min="0" 
                        max="100"
                        dir="rtl"
                        value={this.state.substitutability}
                        onChange={this.onSubstitutabilityChanged.bind(this)}/>
                        <Label text="%"/>
                </div>
            );
        }
    }

	renderWizardStep0() {
		var createOptionElement = (value) => {
			var text = Localization.get("db_" + value);
			if(value == "skill-headline") {
				text = Localization.get("skill_headline");
			}
			return {
				text: text,
				value: value,
			};
		}
		var roots = [
            //createOptionElement("continent"),
            //createOptionElement("country"),
            //createOptionElement("driving-licence"),
            //createOptionElement("employment-duration"),
            //createOptionElement("employment-type"),
            createOptionElement("keyword"),
            //createOptionElement("language"),
            //createOptionElement("language-level"),
            //createOptionElement("municipality"),
            createOptionElement("occupation-collection"),
            createOptionElement("occupation-field"),
            createOptionElement("occupation-name"),
            //createOptionElement("region"),
			createOptionElement("skill-headline"),
			createOptionElement("skill"),
            //createOptionElement("wage-type"),
            //createOptionElement("worktime-extent"),
            createOptionElement("ssyk-level-1"),
            createOptionElement("ssyk-level-2"),
            createOptionElement("ssyk-level-3"),
            createOptionElement("ssyk-level-4"),
            createOptionElement("sun-education-field-1"),
            createOptionElement("sun-education-field-2"),
            createOptionElement("sun-education-field-3"),
            createOptionElement("sun-education-field-4"),
		];
		Util.sortByKey(roots, "text", true);
		roots.splice(0, 0, {
			text: Localization.get("default_option"),
			value: "default_option",
		});
		return (
			<div>
				<Label 
					css="new_concept_wizard_step_headline"
					text="Välj vilken typ av begrepp som skapas"/>
				<select
					className="rounded"
					value={this.state.type}
					onChange={this.onTypeChanged.bind(this)}>
					{roots.map((element, index) => {
						return (
							<option 
								key={index}
								value={element.value}>
								{element.text}
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
		return (
			<div>
				<Label 
					css="new_concept_wizard_step_headline"
					text="Välj vart det nya begreppet ska hamna"/>
				<TreeView 
                    css="add_connection_tree"
                    context={this.queryTreeView}>
					{this.renderLoader()}
                </TreeView>
				<div className="new_concept_wizard_buttons">
					{this.renderBackButton()}
					{this.renderNextButton()}
					{this.renderAbortButton()}
				</div>
			</div>
		);
	}
	
	renderWizardStep2() {
		return (
			<div>
				<Label 
					css="new_concept_wizard_step_headline"
					text="Ange det nya begreppets namn och beskrivning"/>
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
				<div className="new_concept_wizard_buttons">
					{this.renderBackButton()}
					{this.renderNextButton()}
					{this.renderAbortButton()}
				</div>
			</div>
		);
	}

	renderWizardStep3() {
		return (
			<div>
				<Label 
					css="new_concept_wizard_step_headline"
					text="Ange relation och skapa anteckning till det nya begreppet"/>
				<div className="add_connection_row">
                    <Label text={Localization.get("relation_type") + ":"}/>
                    {this.renderRelationTypeDropdown()}
                    {this.renderSubstituability()}
                </div>
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
			case this.WIZARD_STEP_NOTE:
				return this.renderWizardStep3();
		}
	}

    renderLoader() {
        if(this.state.isLoading) {
            return(
                <Loader/>
            );
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