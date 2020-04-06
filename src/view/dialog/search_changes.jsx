import React from 'react';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Constants from './../../context/constants.jsx';
import SearchChangesDate from './search_changes_date.jsx';
import SearchChangesType from './search_changes_type.jsx';
import Rest from '../../context/rest.jsx';

class SearchChanges extends React.Component { 

    constructor(props) {
        super(props);        
        this.state = {
            step: 0,            
            actions: [],
            relations: [],
            types: [],
            fromDate: new Date(),
            toDate: new Date(),
        };
    }

    isActionSelected(type) {
        return this.state.actions.indexOf(type) != -1;
    }

    isRelationSelected(type) {
        return this.state.relations.indexOf(type) != -1;
    }

    isTypeSelected(type) {
        return this.state.types.indexOf(type) != -1;
    }

    onActionSelectedChanged(action, e) {
        if(e.target.checked) {
            this.state.actions.push(action);
        } else {
            var index = this.state.actions.indexOf(action);
            this.state.actions.splice(index, 1);
        }
        this.setState({
            actions: this.state.actions,
            relations: []});
    }

    onRelationSelectedChanged(relation, e) {
        if(e.target.checked) {
            this.state.relations.push(relation);
        } else {
            var index = this.state.relations.indexOf(relation);
            this.state.relations.splice(index, 1);
        }
        this.setState({
            actions: [],
            relations: this.state.relations});
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

    onCloseClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    onSearchClicked() {
        console.log("Search", this.state.fromDate, this.state.toDate, this.state.actions, this.state.relations, this.state.types);
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    onNextClicked() {
        this.setState({step: 1});
    }

    onBackClicked() {
        this.setState({step: 0});
    }

    onSetFromDate(date) {
        this.state.fromDate = date;
    }

    onSetToDate(date) {
        this.state.toDate = date;
    }   

    render() {
        var getPage = (step) => {
            if(step == 0) {
                return ( 
                    <SearchChangesDate 
                        onSearchClicked={this.onSearchClicked.bind(this)}
                        onNextClicked={this.onNextClicked.bind(this)}
                        onCloseClicked={this.onCloseClicked.bind(this)}
                        onSetFromDate={this.onSetFromDate.bind(this)}
                        onSetToDate={this.onSetToDate.bind(this)}
                        actions={this.state.actions}
                        relations={this.state.relations}/> 
                );
            } else if(step == 1) {
                return ( 
                    <SearchChangesType 
                        onSearchClicked={this.onSearchClicked.bind(this)}
                        onBackClicked={this.onBackClicked.bind(this)}
                        onCloseClicked={this.onCloseClicked.bind(this)}
                        types={this.state.types}/> 
                );
            }
        };
       
        return (
            <div className="dialog_content">
                {getPage(this.state.step)}
            </div>
        );
    }
}

export default SearchChanges;