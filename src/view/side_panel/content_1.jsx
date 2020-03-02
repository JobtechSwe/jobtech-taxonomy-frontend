import React from 'react';
import ConceptsSearch from './concepts_search.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import NewConcept from './../dialog/new_concept.jsx';
import Button from './../../control/button.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();        
    }

    onNewConceptClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("new_value"),
            content: <NewConcept />
        });
    }

    render() {
        return (
            <div className="side_content_1">
                <ConceptsSearch />
                <Button 
                    text={Localization.get("new_value")}
                    onClick={this.onNewConceptClicked.bind(this)}/>
            </div>
        );
    }
	
}

export default Content1;