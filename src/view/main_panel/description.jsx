import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Loader from '../../control/loader.jsx';
import Constants from '../../context/constants.jsx';
import Util from '../../context/util.jsx';
import Rest from '../../context/rest.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Localization from '../../context/localization.jsx';
import App from '../../context/app.jsx';

class Description extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            isLocked: true,
            preferredLabel: Util.getObjectValue(props.item, "preferredLabel", ""),
            definition: Util.getObjectValue(props.item, "definition", ""),
            iscoCodes: [],
        };
    }

    componentDidMount() {
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.init(props);
    }

    init(props) {
        if(props.groupContext) {
            props.groupContext.onLockChanged = this.onGroupLockedChanged.bind(this);
        }
        this.setState({
            preferredLabel: Util.getObjectValue(props.item, "preferredLabel", ""),
            definition: Util.getObjectValue(props.item, "definition", ""),
            iscoCodes: [],
        }, () => {
            if(props.item["ssyk"] && props.item["ssyk"].length > 3) {
                // TODO leta i relatedlistan som redan fins populerad i props.item
                if(props.item.related) {
                    for(var i=0; i < props.item.related.length; ++i) {
                        var c = props.item.related[i];
                        if(c.type === Constants.CONCEPT_ISCO_LEVEL_4) {
                            this.state.iscoCodes.push(c.isco);
                        }
                    }
                    this.state.iscoCodes.sort();
                    this.setState({iscoCodes: this.state.iscoCodes});
                }
            }
        });
    }

    onGroupLockedChanged(isLocked) {
        this.setState({isLocked: isLocked});
    }

    onUndoLabel(value) {
        this.setState({preferredLabel: value});
    }

    onUndoDefinition(value) {
        this.setState({definition: value});
    }

    onSave(changes) {
        var args = "";
        for (var prop in changes) {
            args += "&" + prop + "=" + changes[prop]; 
        }
        App.addSaveRequest();
        Rest.patchConcept(this.props.item.id, args, (data) => {
            App.removeSaveRequest();
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : sparning misslyckades");
            App.removeSaveRequest();
        });
    }

    createEditRequest(id, value, undoCallback) {
        var request = App.createEditRequest(id);
        request.newValue = value;
        request.oldValue = this.state[id];
        request.objectId = this.props.item.id;
        request.groupId = "description";
        request.undoCallback = undoCallback;
        request.saveCallback = this.onSave.bind(this);
        return request;
    }

    onDeprecateClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("deprecate"),
            content: this.renderDeprecateDialog(),
        });
    }

    onDeprecateYesClicked() {
        Rest.deleteConcept(this.props.item.id, () => {
            this.props.item.deprecated = true;
            // reselect the item, so the gui is refreshed
            EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, this.props.item);
            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        }, () => {
            App.showError(Util.getHttpMessage(status) + " : Avaktualisering misslyckades");
            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
        });
    }
    
    onDeprecateAbortClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    renderDeprecateDialog() {
        return (
            <div className="dialog_content">
                <div>
                    {Localization.get("dialog_deprecate")} "{this.state.preferredLabel}"?
                </div>
                <div className="dialog_content_buttons">
                    <Button 
                        text={Localization.get("yes")}
                        onClick={this.onDeprecateYesClicked.bind(this)}/>
                    <Button 
                        text={Localization.get("abort")}
                        onClick={this.onDeprecateAbortClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderSpecialValue(elements, key, text) {
        if(this.props.item[key]) {
            elements.push(
                <div 
                    className={"description_special_value" + (key == "id" ? " description_db_id" : "")} 
                    key={key}>
                    <Label text={text}/>
                    <input 
                        type="text" 
                        className="rounded"
                        disabled="disabled"
                        value={this.props.item[key]}/>
                </div>
            );
        } 
    }

    renderIscoCodes() {
        if(this.props.item["ssyk"] && this.props.item["ssyk"].length > 3) {
            var codes = this.state.iscoCodes.map((element, i) => {
                return (
                    <div key={i}>{element}</div>
                );
            });
            if(codes.length == 0) {
                codes = <Loader />;
            }
            return (
                <div className="description_isco_container description_special_value font">
                    <Label text="ISCO"/>
                    <div className="description_isco_values">
                        {codes}
                    </div>
                </div>
            );
        }
    }

    renderNameAndMisc() {
        var elements = [];
        elements.push(
            <div key="name-key">
                <Label text={Localization.get("name")}/>
                <input 
                    type="text" 
                    className="rounded"
                    disabled="disabled"
                    value={this.state.preferredLabel}/>
            </div>
        );
        elements.push(
            <div key="quality-key" className="description_quality_value">
                <Label text={Localization.get("quality_control")}/>
                <input 
                    type="text" 
                    className="rounded"
                    disabled="disabled"
                    value={""}/>
            </div>
        );
        this.renderSpecialValue(elements, "id", "ID");
        this.renderSpecialValue(elements, "ssyk", "SSYK");
        this.renderSpecialValue(elements, "isco", "ISCO");
        this.renderSpecialValue(elements, "iso_3166_1_alpha_2_2013", "Kod"); // land
        this.renderSpecialValue(elements, "iso_3166_1_alpha_3_2013", Localization.get("name"));
        this.renderSpecialValue(elements, "driving_licence_code_2013", "Typ"); // körkort
        this.renderSpecialValue(elements, "eures_code_2014", "Typ"); // anställningsvaraktighet
        this.renderSpecialValue(elements, "iso_639_3_alpha_2_2007", "Kod"); // språk
        this.renderSpecialValue(elements, "iso_639_3_alpha_3_2007", Localization.get("name")); 
        this.renderSpecialValue(elements, "national_nuts_level_3_code_2019", "NNUTS");  // eu region
        this.renderSpecialValue(elements, "nuts_level_3_code_2013", "NUTS");  // eu region
        this.renderSpecialValue(elements, "sni_level_code_2007", "SNI"); 
        this.renderSpecialValue(elements, "sun_education_level_code_2020", "SUN"); 
        this.renderSpecialValue(elements, "sun_education_field_code_2020", "SUN"); 
        this.renderSpecialValue(elements, "lau_2_code_2015", "LAU");
        return (
            <div className="description_name_and_misc">
                {elements}
                {this.renderIscoCodes()}
            </div>
        );
    }

    render() {
        /*
            <div>
                <Button 
                    css="deprecate_button"
                    isEnabled={!this.state.isLocked}
                    text={Localization.get("deprecate")}
                    onClick={this.onDeprecateClicked.bind(this)}/>
            </div>
        */
        return (
            <div className="description">
                {this.renderNameAndMisc()}
                <Label text={Localization.get("description")}/>
                <textarea 
                    rows="10" 
                    className="rounded"
                    disabled="disabled"
                    value={this.state.definition}/>
            </div>
        );
    }
	
}

export default Description;