import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import TreeView from '../../control/tree_view.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';

class OccupationSkills extends React.Component { 

    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        return (
            <div className="occupation_skill">
                <Label text="Kompetenser"/>
                <TreeView />
            </div>
        );
    }
	
}

export default OccupationSkills;