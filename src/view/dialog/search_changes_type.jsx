import React from 'react';
import Button from './../../control/button.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import Label from './../../control/label.jsx';

class SearchChangesType extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {            
            types: this.props.types,
        };
    }

    isTypeSelected(type) {
        return this.state.types.indexOf(type) != -1;
    }

    onTypeSelectedChanged(type, e) {
        if(e.target.checked) {
            this.state.types.push(type);            
        } else {
            var index = this.state.types.indexOf(type);
            this.state.types.splice(index, 1);
        }
        this.setState({types: this.state.types});
    }

    render() {
        var list = JSON.parse(JSON.stringify(Constants.DB_TYPES));
        list.sort((a, b) => {
            var p1 = Localization.get(a === Constants.CONCEPT_SKILL_HEADLINE ? "skill_headline" : "db_" + a);
            var p2 = Localization.get(b === Constants.CONCEPT_SKILL_HEADLINE ? "skill_headline" : "db_" + b);
            if(p1 < p2) return -1;
            if(p1 > p2) return 1;
            return 0;
        });
        var types = list.map((type, index) => {
            return (
                <div className="search_changes_row"
                    key={index}>
                    <Label 
                        css="search_changes_label"
                        text={Localization.get(type === Constants.CONCEPT_SKILL_HEADLINE ? "skill_headline" : "db_" + type)}/>
                    <div className="search_changes_cb">
                    <input 
                        type="checkbox"                        
                        onChange={this.onTypeSelectedChanged.bind(this, type)}
                        checked={this.isTypeSelected(type)}/>
                    </div>
                </div>
            );
        });
        return(
            <div className="search_changes">
                <div>
                    <Label 
                        css="search_changes_title"
                        text={Localization.get("select_types")}/>
                    {types}
                </div>
                <div className="dialog_content_buttons">
                    <Button 
                        onClick={this.props.onCloseClicked}
                        text={Localization.get("close")}/>
                    <Button 
                        onClick={this.props.onBackClicked}
                        text={Localization.get("back")}/>
                    <Button 
                        isEnabled={this.state.types.length > 0}
                        onClick={this.props.onSearchClicked}
                        text={Localization.get("search")}/>
                </div>
            </div>
        );
    }
}

export default SearchChangesType;