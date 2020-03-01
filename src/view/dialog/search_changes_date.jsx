import React from 'react';
import DatePicker from 'react-datepicker';
import Button from './../../control/button.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import Label from './../../control/label.jsx';

class SearchChangesDate extends React.Component { 

    constructor(props) {
        super(props);
        this.actions = [
            "CREATED",
            "UPDATED",
            "DIVERTED",
            "MOVED",
            "DEPRECATED",
            "QUALITY_LEVEL",
            "MANUAL_NOTE",
        ];
        this.relations = [
            Constants.RELATION_NARROWER,
            Constants.RELATION_BROADER,
            Constants.RELATION_RELATED,
            Constants.RELATION_SUBSTITUTABILITY,
        ]
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate()-30);
        this.state = {
            actions: this.props.actions,
            relations: this.props.relations,
            fromDate: fromDate,
            toDate: new Date(),
            searchMode: "",
        };
    }

    componentDidMount() {
        this.props.onSetFromDate(this.state.fromDate);
        this.props.onSetToDate(this.state.toDate);
    }

    isActionSelected(type) {
        return this.state.actions.indexOf(type) != -1;
    }

    isRelationSelected(type) {
        return this.state.relations.indexOf(type) != -1;
    }

    onActionSelectedChanged(action, e) {
        if(e.target.checked) {
            this.state.actions.push(action);
        } else {
            var index = this.state.actions.indexOf(action);
            this.state.actions.splice(index, 1);
        }
        this.state.relations.length = 0;
        this.setState({
            actions: this.state.actions,
            relations: this.state.relations});
    }

    onRelationSelectedChanged(relation, e) {
        if(e.target.checked) {
            this.state.relations.push(relation);
        } else {
            var index = this.state.relations.indexOf(relation);
            this.state.relations.splice(index, 1);
        }
        this.state.actions.length = 0;
        this.setState({
            actions: this.state.actions,
            relations: this.state.relations});
    }

    onSetFromDate(date) {
        this.setState({fromDate: date});
        this.props.onSetFromDate(date);
    }

    onSetToDate(date) {
        this.setState({toDate: date});
        this.props.onSetToDate(date);
    }

    onSearchTypeSelected(e) {
        this.setState({searchMode: e.target.value});
    }

    renderActions() {
        if("actions" === this.state.searchMode) {
            var actions = this.actions.map((action, index) => {
                return (
                    <div 
                        className="search_changes_row"
                        key={index}>
                        <Label 
                            css="search_changes_label"
                            text={Localization.get(action)}/>
                        <div className="search_changes_cb">
                        <input 
                            type="checkbox"                        
                            onChange={this.onActionSelectedChanged.bind(this, action)}
                            checked={this.isActionSelected(action)}/>
                        </div>
                    </div>
                );
            });
            return (
                <div>
                    <Label 
                        css="search_changes_title"
                        text={Localization.get("select_actions")}/>
                    {actions}
                </div>
            );
        }
    }

    renderRelations() {
        if("relations" === this.state.searchMode) {
            var relations = this.relations.map((relation, index) => {
                return (
                    <div 
                        className="search_changes_row"
                        key={index}>
                        <Label 
                            css="search_changes_label"
                            text={relation}/>
                        <div className="search_changes_cb">
                        <input 
                            type="checkbox"                        
                            onChange={this.onRelationSelectedChanged.bind(this, relation)}
                            checked={this.isRelationSelected(relation)}/>
                        </div>
                    </div>
                );
            });
            return(
                <div>
                    <Label 
                        css="search_changes_title"
                        text={Localization.get("select_relations")}/>
                    {relations}
                </div>
            );
        }
    }

    renderNextButton() {
        if("actions" === this.state.searchMode) {
            return(
                <Button 
                    isEnabled={this.state.actions.length > 0}                        
                    onClick={this.props.onNextClicked}
                    text={Localization.get("next")}/>
            );
        }
    }

    renderSearchButton() {
        if("relations" === this.state.searchMode) {
            return(
                <Button 
                    isEnabled={this.state.relations.length > 0}
                    onClick={this.props.onSearchClicked}
                    text={Localization.get("search")}/>
            );
        }
    }

    render() {
        return(
            <div className="search_changes">
                <div>                    
                    <Label
                        css="search_changes_title"
                        text={Localization.get("select_date")}/>
                    <div className="search_changes_column">
                        <div className="search_changes_date">
                            <Label text={Localization.get("from") + ":"}/>
                            <DatePicker 
                                selected={this.state.fromDate} 
                                onChange={this.onSetFromDate.bind(this)}
                                locale={Localization.get("locale")}
                                dateFormat="yyyy-MM-dd"/>
                        </div>
                        <div className="search_changes_date">
                            <Label text={Localization.get("to") + ":"}/>
                            <DatePicker 
                                selected={this.state.toDate} 
                                onChange={this.onSetToDate.bind(this)}
                                locale={Localization.get("locale")}
                                dateFormat="yyyy-MM-dd"/>
                        </div>
                    </div>
                </div>                
                <div>
                    <Label
                        css="search_changes_title"
                        text={Localization.get("select_search")}/>
                    <select 
                        className="rounded search_changes_select"
                        value={this.state.type}
                        onChange={this.onSearchTypeSelected.bind(this)}>
                        <option>--</option>
                        <option value="actions">{Localization.get("actions")}</option>
                        <option value="relations">{Localization.get("relations")}</option>
                    </select>
                </div>
                {this.renderActions()}
                {this.renderRelations()}
                <div className="dialog_content_buttons search_content_buttons">
                    <Button 
                        onClick={this.props.onCloseClicked}
                        text={Localization.get("close")}/>
                    {this.renderNextButton()}
                    {this.renderSearchButton()}
                </div>
            </div>
        );
    }
}

export default SearchChangesDate;