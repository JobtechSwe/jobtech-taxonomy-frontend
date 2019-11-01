import React from 'react';
import Graph from 'react-graph-vis';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Rest from'../../context/rest.jsx';

class Content4 extends React.Component { 

    constructor() {
        super();
        this.options = {
            layout: {
              hierarchical: true
            },
            edges: {
              color: "#000000"
            },
            nodes: {
                shape: "box",
                margin: 10,
                font: {
                    size: 16,
                    color: "#000"
                },
                widthConstraint: {
                    maximum: 200
                }
            }
        };
        this.state = {
            data: {
            nodes: [],
            edges: []
        }};
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        this.getConcept("DPPw_4wa_AsH");
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
    }

    getConcept(id) {
        Rest.getConcept(id, (data) => {
            console.log(data);
            var d = {nodes: [], edges: []};
            data[0].label = data[0].preferredLabel + "\n" + Localization.get("db_" + data[0].type);
            data[0].group = this.getGroupFor(data[0].type);
            d.nodes.push(data[0]);            
            this.setState({data: d});
        }, (status) => {
            // TODO: error handling
        });
    }

    getGroupFor(type) {
        switch(type) {
            case "continent":
                return 1;
            case "country":
                return 2;
            case "driving-licence":
                return 3;
            case "driving-licence-combination":
                return 4;
            case "employment-duration":
                return 5;
            case "employment-type":
                return 6;
            case "isco-level-1":
            case "isco-level-4":
                return 7;
            case "keyword":
                return 8;
            case "language":
                return 9;
            case "language-level":
                return 10;
            case "municipality":
                return 11;
            case "occupation-collection":
                return 12;
            case "occupation-field":
                return 13;
            case "occupation-name":
                return 14;
            case "region":
                return 15;
            case "skill":
            case "skill-headline":
                return 16;
            case "sni-level-1":
            case "sni-level-2":
                return 17;
            case "ssyk-level-1":
            case "ssyk-level-2":
            case "ssyk-level-3":
            case "ssyk-level-4":
                return 18;
            case "sun-education-field-1":
            case "sun-education-field-2":
            case "sun-education-field-3":
            case "sun-education-field-4":
                return 19;
            case "sun-education-level-1":
            case "sun-education-level-2":
            case "sun-education-level-3":
                return 20;
            case "wage-type":
                return 21;
            case "worktime-extent":
                return 22;
            default:
                return 0;
        }
    }

    updateRelations(item) {
        if(item.fetchedRelations) {
            return;
        }
        item.fetchedRelations = true;
        if(item.relations.broader > 0) {
            Rest.getAllConceptRelations(item.id, Constants.RELATION_BROADER, (data) => {
                var nodes = JSON.parse(JSON.stringify(this.state.data.nodes));
                var edges = JSON.parse(JSON.stringify(this.state.data.edges));
                for(var i=0; i<data.length; ++i) {
                    var p = data[i];
                    p.label = p.preferredLabel + "\n" + Localization.get("db_" + p.type);
                    p.group = this.getGroupFor(p.type);
                    if(!nodes.find((n) => {return nodes.id === p.id})) {
                        nodes.push(p);
                        edges.push({
                            from: item.id,
                            to: p.id
                        });
                    }
                }   
                this.state.data = {nodes: nodes, edges: edges};
                this.setState({data: {nodes: nodes, edges: edges}});
            }, (status) => {
                // TODO: error handling
            });
        }
        if(item.relations.narrower > 0) {
            Rest.getAllConceptRelations(item.id, Constants.RELATION_NARROWER, (data) => {
                var nodes = JSON.parse(JSON.stringify(this.state.data.nodes));
                var edges = JSON.parse(JSON.stringify(this.state.data.edges));
                for(var i=0; i<data.length; ++i) {
                    var p = data[i];
                    p.label = p.preferredLabel + "\n" + Localization.get("db_" + p.type);
                    p.group = this.getGroupFor(p.type);
                    if(!nodes.find((n) => {return nodes.id === p.id})) {
                        nodes.push(p);
                        edges.push({
                            from: p.id,
                            to: item.id
                        });
                    }
                }
                this.state.data = {nodes: nodes, edges: edges};
                this.setState({data: {nodes: nodes, edges: edges}});
            }, (status) => {
                // TODO: error handling
            });
        }
    }

    findNodeById(id) {
        for(var i=0; i<this.state.data.nodes.length; ++i) {
            if(id === this.state.data.nodes[i].id) {
                return this.state.data.nodes[i];
            }
        }
    }

    onSideItemSelected(item) {
        var d = {nodes: [], edges: []};
        item.label = item.preferredLabel + "\n" + Localization.get("db_" + item.type);
        item.group = this.getGroupFor(item.type);
        d.nodes.push(item);
        this.setState({data: d});
    }

    onElementSelected(event) {
        console.log(event);
        this.updateRelations(this.findNodeById(event.nodes[0]));
    }

    render() {
        console.log("render", this.state.data);
        var events = {
            select: this.onElementSelected.bind(this)
        };
        return (
            <div className="main_content_4">
                <Graph
                    graph={this.state.data}
                    options={this.options}
                    events={events}
                />
            </div>
        );
    }
	
}

export default Content4;