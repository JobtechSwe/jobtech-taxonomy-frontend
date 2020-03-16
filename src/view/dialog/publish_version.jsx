import React from 'react';
import Button from './../../control/button.jsx';
import App from './../../context/app.jsx';
import List from './../../control/list.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import rest from './../../context/rest.jsx';

class PublishVersion extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            result: [],
            okToPublish: false,
            skills: null,
            occupationNames: null,
        }
    }

    componentDidMount() {
        //fetch data needed for check
        Rest.getConcepts("occupation-name",  (data) => {
            this.setState({occupationNames: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
        Rest.getConcepts("skill",  (data) => {
            this.setState({skills: data}, () => {this.performChecks()});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });

        Rest.getGraph(Constants.RELATION_BROADER, "occupation-name", "ssyk-level-4", (data) => {
            this.setState({occupationToSsyk: data}, () => {this.performChecks()});
            console.log("1", data.graph.edges.length);
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });

        Rest.getGraph(Constants.RELATION_BROADER, "occupation-name", "isco-level-4", (data) => {
            this.setState({occupationToIsco: data}, () => {this.performChecks()});
            console.log("2", data.graph.edges.length);
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });

        Rest.getGraph(Constants.RELATION_BROADER, "skill", "skill-headline", (data) => {
            this.setState({skillToHeadline: data}, () => {this.performChecks()});
            console.log("3", data.graph.edges.length);
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });

        Rest.getGraph(Constants.RELATION_RELATED, "skill", "ssyk-level-4", (data) => {
            this.setState({skillToSsyk: data}, () => {this.performChecks()});
            console.log("4", data.graph.edges.length);
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta relationer");
        });
    }

    hasEdge(id, edges) {
        return edges.find(e => e.source === id || e.target === id) != undefined;
    }

    checkConcepts(concepts, edges, checkNumber) {
        var result = [];
        for(var i=0; i<concepts.length; ++i) {
            var item = concepts[i];
            var isDeprecated = item.deprecated ? item.deprecated : false;
            if(!isDeprecated && !this.hasEdge(item.id, edges)) {
                result.push({
                    item: item,
                    error: checkNumber,
                });
            }
        }
        console.log("CheckNumger " + checkNumber + ": total: " + concepts.length + ", missing: " + result.length);
        return result;
    }

    performChecks() {
        if(this.doneFetchingData()) {
            console.log("done fetching");
            var res = [];
            res.push(...this.checkConcepts(this.state.occupationNames, this.state.occupationToSsyk.graph.edges, 0));
            res.push(...this.checkConcepts(this.state.occupationNames, this.state.occupationToIsco.graph.edges, 1));
            res.push(...this.checkConcepts(this.state.skills, this.state.skillToHeadline.graph.edges, 2));
            res.push(...this.checkConcepts(this.state.skills, this.state.skillToSsyk.graph.edges, 3));
            this.setState({
                result: res,
                okToPublish: res.length == 0
            });
            
        } else {
            console.log("nope, still fetching");
        }
    }

    doneFetchingData() {
        return this.state.occupationNames && 
                this.state.skills &&
                this.state.occupationToSsyk &&
                this.state.occupationToIsco &&
                this.state.skillToHeadline &&
                this.state.skillToSsyk;
    }

    onCloseClicked() {
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }
    
    renderItem(item) {
        return (
            <div>
                <div>
                    {item.item.type}
                </div>
                <div>
                    {item.item.preferredLabel}
                </div>
                <div>
                    {item.error}
                </div>
            </div>
        );
    }

    renderResultVersion() {

    }

    render() {
        var info = "Info goes here, " + this.state.result.length;        
        return(
            <div className="dialog_content item_history_dialog">                
                {info}
                <List                     
                    data={this.state.result} 
                    dataRender={this.renderItem.bind(this)}/>
                <div>
                    <Button 
                        text={Localization.get("close")}
                        onClick={this.onCloseClicked.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default PublishVersion;