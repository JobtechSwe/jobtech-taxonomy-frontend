import React from 'react';
import Button from '../../control/button.jsx';
import List from '../../control/list.jsx';
import Label from '../../control/label.jsx';
import Rest from '../../context/rest.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.TYPE_LIST = 0;
        this.TYPE_SOMETHING = 1;
        this.state = {
            queryType: this.TYPE_LIST,
            detailsData: [],
            resultData: [],
        };
        this.searchReference = null;
    }

    componentDidMount() {
        // TODO: rest
        Rest.getConcepts("ssyk_level_1", (data) => {
            this.setState({resultData: data});
        }, (status) => {
            console.log(status);
        });
    }

    componentWillUnmount() {

    }

    search(query) {
        if(query && query.length > 0) {
            Rest.searchConcepts("ssyk_level_1", query, (data) => {
                if(this.state.queryType == this.TYPE_LIST) {
                    this.setState({resultData: data});
                } else {
                    this.setState({detailsData: data});
                }
            }, (status) => {
                console.log(status);
            });
        } else {
            Rest.getConcepts("ssyk_level_1", (data) => {
                if(this.state.queryType == this.TYPE_LIST) {
                    this.setState({resultData: data});
                } else {
                    this.setState({detailsData: data});
                }
            }, (status) => {
                console.log(status);
            });
        }
    }

    onTypeChanged(e) {
        // TODO: query backend for type
        this.searchReference.value = "";
        this.setState({
            queryType: e.target.value,
            resultData: [],
        });
        this.search();
    }

    onSearchClicked() {
        this.search(this.searchReference.value);        
    }

    onDetailsItemSelected(item) {
        Rest.abort();
        Rest.searchRelations(item.id, (data) => {
            this.setState({resultData: data});
        }, (status) => {
            console.log(status);
        });
    }

    onResultItemSelected(item) {
        // TODO: send notification
    }

    renderQueary() {
        return(
            <div className="sub_panel">
                <select 
                    className="sub_panel_select"
                    value={this.state.queryType}
                    onChange={this.onTypeChanged.bind(this)}>
                    <option value={this.TYPE_LIST}>Lista</option>
                    <option value={this.TYPE_SOMETHING}>Något</option>
                </select>
                <div className="sub_panel_search">
                    <input 
                        type="text"
                        ref={(x) => this.searchReference = x}/>
                    <Button 
                        text="Sök"
                        onClick={this.onSearchClicked.bind(this)}/>
                </div>
            </div>
        );
    }

    renderDetailsItem(item) {
        return (
            <div>
                {item.preferredLabel}
            </div>
        );
    }

    renderResultItem(item) {
        return (
            <div className="content_1_result_item">
                <div>{0}</div>
                <div>{item.preferredLabel}</div>
            </div>
        );
    }

    renderDetails() {
        if(this.state.queryType != this.TYPE_LIST) {
            return (
                <div className="content_1_group">
                    <Label text="label"/>
                    <List 
                        data={this.state.detailsData}
                        dataRender={this.renderDetailsItem.bind(this)}
                        onItemSelected={this.onDetailsItemSelected.bind(this)}/>
                </div>
            );
        }
    }

    renderResult() {
        return (
            <div className="content_1_group">
                <Label text="Resultat"/>
                <List 
                    data={this.state.resultData}
                    dataRender={this.renderResultItem.bind(this)}
                    onItemSelected={this.onResultItemSelected.bind(this)}>
                    <div className="content_1_result_header">
                        <div>SSYK</div>
                        <div>Yrkesgrupp</div>
                    </div>
                </List>
            </div>
        );
    }

    render() {
        return (
            <div className="content_1">
                {this.renderQueary()}
                {this.renderDetails()}
                {this.renderResult()}
            </div>
        );
    }
	
}

export default Content1;