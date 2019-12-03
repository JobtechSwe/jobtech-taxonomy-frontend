import React from 'react';
import Rest from '../../context/rest.jsx';
import Util from '../../context/util.jsx';
import App from '../../context/app.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import Button from '../../control/button.jsx';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import Group from '../../control/group.jsx';

class MissingConnections extends React.Component { 

    constructor() {
        super();
        this.state = {
            type1: "",
            type2: "",
            loadingConnectionsData: "",
            noConnectionsData1: [],
            noConnectionsCounts1: [],
            noConnectionsData2: [],
            noConnectionsCounts2: [],
        };
        this.concepts = [];
        this.edges = [];
        this.selected1 = null;
        this.selected2 = null;
    }

    componentDidMount() {
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.init(props);
    }

    init(props) {
        this.setState({
            type1: props.type1, 
            type2: props.type2,
            loadingConnectionsData: true,
            noConnectionsData1: [],
            noConnectionsData2: [],
            noConnectionsCounts1: [],
            noConnectionsCounts2: []
        }, () => {            
            this.createReports();
        });
    }

    hasEdge(id, edges) {
        return edges.find(e => e.source === id || e.target === id) != undefined;
    }

    findAllWithoutConnection(nodes, edges) {
        var foundConnections = [];
        for(var i=0; i<nodes.length; ++i) {
            var node = nodes[i];
            if(!this.hasEdge(node.id, edges)) {
                foundConnections.push(node);
            }
        }
        return foundConnections.sort((a, b) => {
            if(a["ssyk-code-2012"] != null) {
                if(a["ssyk-code-2012"] < b["ssyk-code-2012"]) {
                    return -1;
                }
                if(a["ssyk-code-2012"] > b["ssyk-code-2012"]) {
                    return 1;
                }
                return 0;
            }
            if(a.preferredLabel < b.preferredLabel) {
                return -1;
            }
            if(a.preferredLabel > b.preferredLabel) {
                return 1;
            }
            return 0;
        });
    }

    getEdgeCount(id, edges) {
        var filtered = edges.filter(e => e.source === id || e.target === id);
        if(filtered) {
            return filtered.length;
        }
        return 0;
    }

    getConnectionCounts(nodes, edges) {
        var counts = [];
        for(var i=0; i<nodes.length; ++i) {
            var node = nodes[i];
            var count = this.getEdgeCount(node.id, edges);
            var obj = counts.find((p) => {return p.x == count});
            if(obj) {
                obj.y++;
            } else {
                counts.push({x: count, y: 1, label: ""+count});
            }
        }
        return counts;
    }

    getConcepts(type) {
        var concepts = this.concepts.find((c) => {return c.type === type}); 
        return concepts == null ? null : concepts.data;
    }

    fetchConcepts(type) {
        this.selected1 = null;
        this.selected2 = null;
        this.setState({loadingConnectionsData: Localization.get("loading") + " " + Localization.get("db_" + type)}, () => {
            if(type == "ssyk-level-4") {
                Rest.getConceptsSsyk(type, (data) => {
                    this.concepts.push({type: type, data: data});
                    this.createReports();
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades hämta ssyk concept");
                });
            } else {
                Rest.getConcepts(type, (data) => {
                    this.concepts.push({type: type, data: data});
                    this.createReports();
                }, (status) => {
                    App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
                });
            }    
        });
    }

    getEdges(type1, type2, relationType) {
        var edges = this.edges.find((e) => {
            return e.type1 === type1 && e.type2 === type2 && e.relationType === relationType;
        });
        return edges == null ? null : edges.data;
    }

    fetchGraph(type1, type2, relationType) {
        this.setState({loadingConnectionsData: Localization.get("loading") + " " + Localization.get("db_" + type1) + " <-> " + Localization.get("db_" + type2)}, () => {
            Rest.getGraph(relationType, type1, type2, (data) => {
                this.edges.push({
                    relationType: relationType,
                    type1: type1,
                    type2: type2,
                    data: data.graph.edges
                });
                this.createReports();
            }, (status) => {
                App.showError(Util.getHttpMessage(status) + " : misslyckades hämta graph");
            });
        });
    }

    createReports() {
        var concepts1 = this.getConcepts(this.state.type1);
        if(concepts1 == null) {
            this.fetchConcepts(this.state.type1);
            return;
        }
        var concepts2 = this.getConcepts(this.state.type2);
        if(concepts2 == null) {
            this.fetchConcepts(this.state.type2);
            return;
        }
        var narrowerEdges = this.getEdges(this.state.type1, this.state.type2, Constants.RELATION_NARROWER);
        if(narrowerEdges == null) {
            this.fetchGraph(this.state.type1, this.state.type2, Constants.RELATION_NARROWER);
            return;
        }
        var broaderEdges = this.getEdges(this.state.type1, this.state.type2, Constants.RELATION_BROADER);
        if(broaderEdges == null) {
            this.fetchGraph(this.state.type1, this.state.type2, Constants.RELATION_BROADER);
            return;
        }

        
        var withoutConnection1 = this.findAllWithoutConnection(concepts1, narrowerEdges);
        withoutConnection1 = this.findAllWithoutConnection(withoutConnection1, broaderEdges);
        var countConnections1 = this.getConnectionCounts(concepts1, narrowerEdges);

        var withoutConnection2 = this.findAllWithoutConnection(concepts2, narrowerEdges);
        withoutConnection2 = this.findAllWithoutConnection(withoutConnection2, broaderEdges);
        var countConnections2 = this.getConnectionCounts(concepts2, narrowerEdges);

        this.setState({
            noConnectionsData1: withoutConnection1, 
            noConnectionsCounts1: countConnections1, 
            noConnectionsData2: withoutConnection2, 
            noConnectionsCounts2: countConnections2, 
            loadingConnectionsData: false
        });
    }
    
    onItemSelected1(item) {
        this.selected1 = item;
        console.log(item);
    }

    onItemSelected2(item) {
        this.selected2 = item;
    }

    onVisitClicked1() {
        if(this.selected1 != null) {
            EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_1);
            setTimeout(() => {
                EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, this.selected1);
            }, 500);            
        }
    }

    onVisitClicked2() {
        if(this.selected2 != null) {
            EventDispatcher.fire(Constants.ID_NAVBAR, Constants.WORK_MODE_1);
            setTimeout(() => {
                EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, this.selected2);
            }, 500);            
        }
    }

    renderInfo(data, type1, type2) {        
        var totalCount = 0;
        var concepts = this.getConcepts(type1);
        if(concepts != null) {            
            totalCount = concepts.length;
        }

        var info = data.length + " " + Localization.get("of") + " " + totalCount + " " + Localization.get("are_missing_connections");
        if(data.length == totalCount) {
            info = Localization.get("no_items_connected");
        } else if(data.length == 0) {
            info = Localization.get("all_items_connected");
        }
        return (
            <Label text={info}/>
        );
    }

    renderItem(item) {
        return (
            <div className="main_content_4_list_item">
                <div>
                    {item.id}
                </div>                
                <div>
                    {item.preferredLabel}
                </div>
            </div>
        );
    }

    renderList(data, onItemSelected) {
        if(data != null && data.length > 0) {
            return (
                <List
                    css="main_content_4_list"
                    data={data}
                    onItemSelected={onItemSelected}
                    dataRender={this.renderItem.bind(this)}
                />
            );
        }
    }

    render() {
        if(this.state.loadingConnectionsData.length > 0) {
            return (<Loader text={this.state.loadingConnectionsData}/>);
        }
        return (
            <div>
                <Group text={Localization.get("db_"+this.state.type1) + " " + Localization.get("to") + " " + Localization.get("db_"+this.state.type2)}>
                    <div className="main_content_4_connections">                        
                        {this.renderInfo(
                            this.state.noConnectionsData1,
                            this.state.type1,
                            this.state.type2
                        )}
                        {this.renderList(this.state.noConnectionsData1, this.onItemSelected1.bind(this))}
                        <div>
                            <Button
                                isEnabled={this.state.noConnectionsData1.length > 0}
                                text={Localization.get("visit")} 
                                onClick={this.onVisitClicked1.bind(this)}
                            />
                        </div>
                    </div>
                </Group>                
                <Group text={Localization.get("db_"+this.state.type2) + " " + Localization.get("to") + " " + Localization.get("db_"+this.state.type1)}>
                    <div className="main_content_4_connections">                        
                        {this.renderInfo(
                            this.state.noConnectionsData2,
                            this.state.type2,
                            this.state.type1
                        )}
                        {this.renderList(this.state.noConnectionsData2, this.onItemSelected2.bind(this))}
                        <div>
                            <Button
                                isEnabled={this.state.noConnectionsData1.length > 0}
                                text={Localization.get("visit")} 
                                onClick={this.onVisitClicked2.bind(this)}
                            />
                        </div>
                    </div>
                </Group>                
            </div>
        );
    }
}

export default MissingConnections;