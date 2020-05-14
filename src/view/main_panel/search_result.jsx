import React from 'react';
import Label from '../../control/label.jsx';
import Loader from '../../control/loader.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import Rest from '../../context/rest.jsx';
import { data } from 'vis-network';

class SearchResult extends React.Component { 

    constructor() {
        super();
        this.state = {
            searchFor: null,
            searching: false,
            data: [],
        };
    }

    componentDidMount() {
        this.searchFor(this.props.search);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.searchFor(props.search);
    }

    searchFor(searchFor) {
        var search = this.props.search;
        console.log("Search", search.fromDate, search.toDate, search.actions, search.relations, search.types);
        this.setState({
            searchFor: searchFor,
            searching: true,
        }, () => {
            if(search.actions.length > 0) {
                Rest.getConceptDayNotes(null, searchFor.fromDate, searchFor.toDate, (data) => {
                    console.log(data);
                    this.setState({
                        searching: false,
                        data: data
                    });
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades med att utföra sökning");
                    this.setState({searching: false});
                });
            } else {
                Rest.getRelationDayNotes(null, searchFor.fromDate, searchFor.toDate, (data) => {
                    console.log(data);
                    this.setState({
                        searching: false,
                        data: data
                    });
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades med att utföra sökning");
                    this.setState({searching: false});
                });
            }
        });
    }

    renderResult() {
        return(
            <div>
                {this.state.data.length}
            </div>
        );
    }

    render() {
        return(
            <Group 
                css="changes_group"
                text={Localization.get("changes")}>
                    {this.state.searching ? <Loader/> : this.renderResult()}
            </Group>
        );
    }
	
}

export default SearchResult;