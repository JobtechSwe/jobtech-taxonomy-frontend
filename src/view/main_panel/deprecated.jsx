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
        var references = props.item["replaced_by"];
        if(references && references.length > 0) {
            this.setState({reference: references[0]});
        }
    }

    onVisitClicked() {
        if(this.state.reference) {
            EventDispatcher.fire(Constants.EVENT_MAINPANEL_ITEM_SELECTED, this.state.reference);
        }
    }

    renderReplacedByActions() {
        return (
            <div>
                <Button 
                    isEnabled={this.state.reference != null}
                    text={Localization.get("visit")} 
                    onClick={this.onVisitClicked.bind(this)}/>
            </div>
        );
    }

    render() {
        var name = this.state.reference ? this.state.reference.preferredLabel : "--";
        return (
            <div className="deprecated deprecated_reference font">
                <div>{name}</div>
                {this.renderReplacedByActions()}
            </div>
        );
    }
	
}

export default Deprecated;