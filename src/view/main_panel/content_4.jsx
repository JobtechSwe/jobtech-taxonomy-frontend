import React from 'react';
import Graph from 'react-graph-vis';
import Vis from 'vis-network';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Rest from'../../context/rest.jsx';
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';

class Content4 extends React.Component { 

    constructor() {
        super();
        this.EDGE_LENGTH = 290;
        this.EDGE_LENGTH2 = 310;
        this.options = {
            configure: {
                enabled: false,
                showButton: false,
            },
            layout: {
              hierarchical: false
            },
            edges: {
              color: "#666",
              smooth: {
                "forceDirection": "none"
              }
            },
            nodes: {
                shape: "dot",
                size: 16,
                margin: 5,
                font: {
                    size: 16,
                    color: "#000"
                },
                widthConstraint: {
                    maximum: 200
                }
            },
            groups: {
                notFetched: {
                    color: {
                        background: "#fff"
                    }
                }
            },
            //physics: {
            //    forceAtlas2Based: {
            //        gravitationalConstant: -560,
            //        centralGravity: 0.005,
            //        springLength: 230,
            //        springConstant: 0.18,
            //        avoidOverlap: 0.7
            //    },
            //    maxVelocity: 146,
            //    solver: "forceAtlas2Based",
            //    timestep: 0.35,
            //    stabilization: {iterations: 150}
            //}
            physics: {
                forceAtlas2Based: {
                    avoidOverlap: 0.41
                },
                solver: "forceAtlas2Based",
                maxVelocity: 146,
                minVelocity: 0.75,
                timestep: 0.42
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
        this.edges = new Vis.DataSet(this.state.data.edges);
        this.nodes = new Vis.DataSet(this.state.data.nodes);
        var container = document.getElementById("vis_network_id");
        this.Network = new Vis.Network(container, {edges: this.edges, nodes: this.nodes}, this.options);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
    }

    componentDidUpdate() {
        if(!this.Network) {
            
            var container = document.getElementById("vis_network_id");
            this.Network = new Vis.Network(container, {edges: this.edges, nodes: this.nodes}, this.options);
        }
        this.Network.on("select", this.onElementSelected.bind(this));
    }

    getConcept(id) {
        Rest.getConcept(id, (data) => {
            console.log(data);
            var d = {nodes: [], edges: []};
            data[0].label = Localization.get("db_" + data[0].type) + "\n" + data[0].preferredLabel;
            data[0].group = this.getGroupFor(data[0].type);
            d.nodes.push(data[0]);
            this.nodes.add(d.nodes);
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
        if(!item) {
            console.log("Nothing selected");
            return;
        }
        var selected = this.state.data.nodes.find((n) => {return n.id === item.id});
        if(selected) {
            if(selected.fetchedRelations) {
                return;
            }
            selected.fetchedRelations = true;
            selected.group = this.getGroupFor(selected.type);
            this.nodes.update([selected]);
        } else {
            console.log("Unable to find node in data");
            return;
        }
        if(selected.relations.broader > 0) {
            Rest.getAllConceptRelations(selected.id, Constants.RELATION_BROADER, (data) => {
                var nodes = [];
                var edges = [];
                for(var i=0; i<data.length; ++i) {
                    var p = data[i];
                    p.label = Localization.get("db_" + p.type) + "\n" + p.preferredLabel;
                    p.group = "notFetched";
                    if(!this.state.data.nodes.find((n) => {return n.id === p.id})) {
                        nodes.push(p);
                        edges.push({
                            from: selected.id,
                            to: p.id,
                        });
                    }
                }   
                this.nodes.add(nodes);
                this.edges.add(edges);
                this.state.data.nodes.push(...nodes);
                this.state.data.edges.push(...edges);
                this.setState({data: this.state.data});
            }, (status) => {
                // TODO: error handling
            });
        }
        if(selected.relations.narrower > 0) {
            Rest.getAllConceptRelations(selected.id, Constants.RELATION_NARROWER, (data) => {
                var nodes = [];
                var edges = [];
                for(var i=0; i<data.length; ++i) {
                    var p = data[i];
                    p.label = Localization.get("db_" + p.type) + "\n" + p.preferredLabel;
                    p.group = "notFetched";
                    if(!this.state.data.nodes.find((n) => {return n.id === p.id})) {
                        nodes.push(p);
                        edges.push({
                            from: p.id,
                            to: selected.id,                            
                        });
                    }
                }
                this.nodes.add(nodes);
                this.edges.add(edges);
                this.state.data.nodes.push(...nodes);
                this.state.data.edges.push(...edges);
                this.setState({data: this.state.data});
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
        item.label = Localization.get("db_" + item.type) + "\n" + item.preferredLabel;
        item.group = this.getGroupFor(item.type);
        d.nodes.push(item);
        this.edges.clear();
        this.edges.add(d.edges);
        this.nodes.clear();
        this.nodes.add(d.nodes);
        this.setState({data: d});
    }

    onElementSelected(event) {
        console.log(event);
        this.updateRelations(this.findNodeById(event.nodes[0]));
    }

    render() {
        var events = {
            select: this.onElementSelected.bind(this)
        };
        return (
            <div className="main_content_4">
                <div 
                    id="vis_network_id"
                    className="vis_network"/>
            </div>
        );
    }
	
}

export default Content4;