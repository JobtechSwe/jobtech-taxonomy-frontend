import React from 'react';
import Vis from 'vis-network';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Rest from'../../context/rest.jsx';
import Util from'../../context/util.jsx';
import App from'../../context/app.jsx';

class Content3 extends React.Component { 

    constructor() {
        super();
        this.EDGE_LENGTH = 290;
        this.EDGE_LENGTH2 = 310;
        this.options = {
            configure: {
                enabled: false,
                showButton: false,
            },
            interaction: { 
                hover: true 
            },
            manipulation: {
                enabled: true
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
                    color: "#000",
                    strokeWidth: 1,
                    strokeColor: "#fff",
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
        var types = {};
        for(var i=0; i<Constants.DB_TYPES.length; ++i) {
            types[Constants.DB_TYPES[i]] = true;
        }
        this.state = {
            workmode: 0,
            enabledTypes: types,
            data: {
                nodes: [],
                edges: []
            }
        };
        this.startFrom = null;
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
        this.boundGraphModeSelected = this.onGraphModeSelected.bind(this);
        this.boundElementSelected = this.onElementSelected.bind(this);
        this.boundVisibleTypesChanged = this.onVisibleTypesChanged.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);        
        EventDispatcher.add(this.boundGraphModeSelected, Constants.EVENT_GRAPH_MODE_SELECTED);        
        EventDispatcher.add(this.boundVisibleTypesChanged, Constants.EVENT_VISIBLE_TYPES_SELECTED);
        this.edges = new Vis.DataSet(this.state.data.edges);
        this.nodes = new Vis.DataSet(this.state.data.nodes);
        var container = document.getElementById("vis_network_id");
        this.Network = new Vis.Network(container, {edges: this.edges, nodes: this.nodes}, this.options);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
        EventDispatcher.remove(this.boundGraphModeSelected);
        EventDispatcher.remove(this.boundVisibleTypesChanged);
    }

    componentDidUpdate() {
        if(!this.Network) {
            
            var container = document.getElementById("vis_network_id");
            this.Network = new Vis.Network(container, {edges: this.edges, nodes: this.nodes}, this.options);            
        }
    }

    getGroupFor(type) {
        switch(type) {
            case "continent":
                return 1;
            case "country":
                return 2;
            case "driving-licence":
                return 3;
            case "employment-duration":
                return 5;
            case "employment-type":
                return 6;
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

    isEnabled(type) {
        return this.state.enabledTypes[type] == true;
    }

    showRelations(item, type, x, y) {
        var nodes = [];
        var edges = [];
        for(var i=0; i<item[type].length; ++i) {
            var p = item[type][i];
            if(this.isEnabled(p.type)) {
                p.title = Localization.get("db_" + p.type) + "<br \>" + p.preferredLabel;
                p.group = "notFetched";                    
                p.x = x;
                p.y = y;
                if(!this.findNodeById(p.id)) {
                    nodes.push(p);
                    edges.push({
                        from: item.id,
                        to: p.id,
                    });
                }
            }
        }   
        this.nodes.add(nodes);
        this.edges.add(edges);
        this.state.data.nodes.push(...nodes);
        this.state.data.edges.push(...edges);
        this.setState({data: this.state.data});
    }

    getRelations(item, type, x, y) {
        if(item[type] == undefined) {
            Util.getConcept(item.id, item.type, (data) => {                
                item.broader = data[0].broader;
                item.narrower = data[0].narrower;
                item.related = data[0].related;                
                this.showRelations(item, type, x, y);
                if(type === Constants.RELATION_BROADER) {
                    this.showRelations(item, Constants.RELATION_NARROWER);
                }
            }, (status) => {
                App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
            });
        } else {
            this.showRelations(item, type, x, y);
            if(type === Constants.RELATION_BROADER) {
                this.showRelations(item, Constants.RELATION_NARROWER);
            }
        }
    }

    updateRelations(item, x, y) {
        if(!item) {
            console.log("Nothing selected");
            return;
        }    
        if(item.fetchedRelations) {
            return;
        }

        item.fetchedRelations = true;
        item.label = item.preferredLabel;
        item.title = Localization.get("db_" + item.type);
        item.group = this.getGroupFor(item.type);
        item.x = undefined;
        item.y = undefined;
        this.nodes.update([item]);
        if(this.state.workmode == 0) {
            this.getRelations(item, Constants.RELATION_BROADER, x, y);
        } else {
            this.getRelations(item, Constants.RELATION_RELATED, x, y);
        }
    }

    findNodeById(id) {
        return this.state.data.nodes.find((n) => {return n.id === id});
    }

    onVisibleTypesChanged(types) {
        var obj = {};
        for(var i=0; i<types.length; ++i) {
            obj[types[i]] = true;
        }
        if(this.startFrom) {
            this.state.enabledTypes = obj;
            this.onSideItemSelected(this.startFrom);
        } else {
            var d = {nodes: [], edges: []};
            this.edges.clear();
            this.edges.add(d.edges);
            this.nodes.clear();
            this.nodes.add(d.nodes);
            this.setState({
                enabledTypes: obj,
                data: d
            });
        }
    }

    onGraphModeSelected(mode) {
        if(this.startFrom) {
            this.state.workmode = mode;
            this.onSideItemSelected(this.startFrom);
        } else {
            var d = {nodes: [], edges: []};
            this.edges.clear();
            this.edges.add(d.edges);
            this.nodes.clear();
            this.nodes.add(d.nodes);
            this.setState({
                workmode: mode,
                data: d
            });
        }
    }

    onSideItemSelected(item) {
        this.startFrom = item;
        var cpy = JSON.parse(JSON.stringify(item));
        var d = {nodes: [], edges: []};
        cpy.label = cpy.preferredLabel;
        cpy.title = Localization.get("db_" + cpy.type);
        cpy.group = this.getGroupFor(cpy.type);
        d.nodes.push(cpy);
        this.edges.clear();
        this.edges.add(d.edges);
        this.nodes.clear();
        this.nodes.add(d.nodes);
        this.setState({data: d}, () => {
            this.updateRelations(cpy, 0, 0);
        });
    }

    onElementSelected(event) {
        var x = event.pointer.canvas.x;
        var y = event.pointer.canvas.y;
        if(event.event.tapCount == 1) {
            if(event.nodes.length > 0) {
                this.updateRelations(this.findNodeById(event.nodes[0]), x, y);
            }
        } else if(event.event.tapCount == 2) {
            if(event.nodes.length > 0) {
                var nodeId = event.nodes[0];
                for(var i=0; i < this.state.data.edges.length; ++i) {
                    var edge = this.state.data.edges[i];
                    if(edge.from === nodeId) {
                        this.updateRelations(this.findNodeById(edge.to), x, y);
                    } else if(edge.to === nodeId) {
                        this.updateRelations(this.findNodeById(edge.from), x, y);
                    }
                }
            }
        }
    }

    renderTitle() {
        var name = this.startFrom ? this.startFrom.preferredLabel : "";
        var title = null;
        if(this.startFrom) {
            title = Localization.get("db_"+this.startFrom.type);
        } else {
            title = this.state.workmode == 0 ? Localization.get("vertical_connections") : Localization.get("horizontal_connections");
        }
        
        return(
            <div className="main_content_title_container">
                <Label 
                    text={title}
                    css="main_content_title"/>
                <div className="main_content_title_name">
                    <Label text={name}/>
                </div>
            </div>
        );
    }

    render() {
        if(this.Network) {
            this.Network.off("select", this.boundElementSelected);
            this.Network.on("select", this.boundElementSelected);
        }
        return (
            <div className="main_content_3">
                {this.renderTitle()}
                <div 
                    id="vis_network_id"
                    className="vis_network_main"/>
            </div>
        );
    }
	
}

export default Content3;