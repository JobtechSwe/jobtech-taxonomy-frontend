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
              hierarchical: false
            },
            edges: {
              color: "#000000"
            }
        };
        this.state = {
            data: {
            nodes: [],
            edges: []
        }};
    }

    componentDidMount() {
        //POC
        this.getConcept("DPPw_4wa_AsH");
    }

    getConcept(id) {
        Rest.getConcept(id, (data) => {
            console.log(data);
            var d = {nodes: [], edges: []};
            data[0].label = data[0].preferredLabel;
            data[0].title = data[0].label;
            d.nodes.push(data[0]);            
            this.setState({data: d});
        }, (status) => {
            // TODO: error handling
        });
    }

    updateRelations(item) {
        if(item.fetchedRelations) {
            return;
        }
        item.fetchedRelations = true;
        Rest.getAllConceptRelations(item.id, Constants.RELATION_BROADER, (data) => {
            var nodes = JSON.parse(JSON.stringify(this.state.data.nodes));
            var edges = JSON.parse(JSON.stringify(this.state.data.edges));
            for(var i=0; i<data.length; ++i) {
                var p = data[i];
                p.label = p.preferredLabel;
                p.title = p.label;
                if(!nodes.find((n) => {return nodes.id === p.id})) {
                    nodes.push(p);
                    edges.push({
                        from: item.id,
                        to: p.id
                    });
                }
            }            
            this.setState({data: {nodes: nodes, edges: edges}});
        }, (status) => {
            // TODO: error handling
        });
        Rest.getAllConceptRelations(item.id, Constants.RELATION_NARROWER, (data) => {
            var nodes = JSON.parse(JSON.stringify(this.state.data.nodes));
            var edges = JSON.parse(JSON.stringify(this.state.data.edges));
            for(var i=0; i<data.length; ++i) {
                var p = data[i];
                p.label = p.preferredLabel;
                p.title = p.label;
                if(!nodes.find((n) => {return nodes.id === p.id})) {
                    nodes.push(p);
                    edges.push({
                        from: p.id,
                        to: item.id
                    });
                }
            }            
            this.setState({data: {nodes: nodes, edges: edges}});
        }, (status) => {
            // TODO: error handling
        });
    }

    findNodeById(id) {
        console.log(id);
        for(var i=0; i<this.state.data.nodes.length; ++i) {
            if(id === this.state.data.nodes[i].id) {
                console.log(this.state.data.nodes[i]);
                return this.state.data.nodes[i];
            }
        }
    }

    elementSelected(event) {
        console.log(event);
        this.updateRelations(this.findNodeById(event.nodes[0]));
    }

    render() {
        console.log("render", this.state.data);
        var events = {
            select: this.elementSelected.bind(this)
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