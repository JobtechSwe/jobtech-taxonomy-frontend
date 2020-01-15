import React from 'react';
import SelectReference from './../dialog/select_reference.jsx';
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

class Deprecated extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            isLocked: true,
            deprecationDate: null,
            reference: null,
            items: [],
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
        var references = props.item["replaced-by"];
        if(references && references.length > 0) {
            this.setState({reference: references[0]});
        }
        Rest.getConceptDayNotes(props.item.id, (data) => {
            for(var i=0; i<data.length; ++i) {
                var item = data[i];
                if(item["event-type"] == "DEPRECATED") {
                    this.setState({deprecationDate: new Date(item.timestamp)});
                    break;
                }
            }
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : Hämta daganteckningar misslyckades");
        });
    }

    onGroupLockedChanged(isLocked) {
        this.setState({isLocked: isLocked});
    }

    onVisitClicked() {
        if(this.state.reference) {
            EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.state.reference);
        }
    }

    onReferenceSelected(item) {
        EventDispatcher.fire(Constants.EVENT_SHOW_SAVE_INDICATOR);
        Rest.postReplaceConcept(this.props.item.id, item.id, () => {
            this.setState({reference: item});
            EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_INDICATOR);
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : Replace concept misslyckades");
            EventDispatcher.fire(Constants.EVENT_HIDE_SAVE_INDICATOR);
        });
    }

    onSetReferenceClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("set_reference"),
            content: <SelectReference 
                        id={this.props.item.id}
                        type={this.props.item.type}
                        current={this.state.reference}
                        onSelected={this.onReferenceSelected.bind(this)}/>,
        });
    }

    renderReplacedByActions() {
        return (
            <div>
                <Button 
                    isEnabled={this.state.reference != null}
                    text={Localization.get("visit")} 
                    onClick={this.onVisitClicked.bind(this)}/>
                <Button 
                    isEnabled={!this.state.isLocked}
                    text={Localization.get("set_reference")}
                    onClick={this.onSetReferenceClicked.bind(this)}/>
            </div>
        );
    }

    renderDate() {
        if(this.state.deprecationDate) {
            return (
                <div className="deprecated_info_row">
                    <div>{Localization.get("deprecated")}</div>
                    <div>{this.state.deprecationDate.toLocaleString()}</div>
                </div>
            );
        }
    }

    renderReplacedBy() {
        var name = this.state.reference ? this.state.reference.preferredLabel : "--";
        return (
            <div className="deprecated_info_row">
                <div>{Localization.get("referred_to")}</div>
                <div className="deprecated_reference">
                    <div>{name}</div>
                    {this.renderReplacedByActions()}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="deprecated font">
                <div>
                    {this.renderDate()}
                    {this.renderReplacedBy()}
                </div>
            </div>
        );
    }
	
}

export default Deprecated;