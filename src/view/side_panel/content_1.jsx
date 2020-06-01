import React from 'react';
import ConceptsSearch from './concepts_search.jsx';
import Localization from './../../context/localization.jsx';
import Constants from './../../context/constants.jsx';
import Util from './../../context/util.jsx';
import Excel from './../../context/excel.jsx';
import Rest from './../../context/rest.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import NewConcept from './../dialog/new_concept.jsx';
import Export from './../dialog/export.jsx';
import Button from './../../control/button.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.type = Constants.CONCEPT_SSYK_LEVEL_4;
    }

    onTypeChanged(type) {
        this.type = type;
    }

    onNewConceptClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("new_value"),
            content: <NewConcept />
        });
    }

    onExportClicked() {
        var getEdges = (id, edges) => {
            return edges.filter((e) => {
                return e.source === id || e.target === id;
            });
        };
        var getNodesOfType = (type, nodes) => {
            return nodes.filter((x) => {
                return x.type == type;
            });
        };
        var getAllConcepts = (edges, key, concepts) => {
            return concepts.filter((x) => {
                return edges.find((e) => {
                    return e[key] == x.id;
                }) != null;
            });
        };
        var downloadGraphRelations = async (fieldType, data, concepts) => {
            var fields = getNodesOfType(fieldType, data.nodes);
            Util.sortByKey(fields, "preferredLabel", true);
            var version = await Rest.getVersionsPromis();
            version = version[version.length - 1].version;
            // setup excel
            var name = Localization.get("db_" + this.type);
            var context = Excel.create(name, name, version);
            context.addRow();
            // insert data
            for(var i=0; i<fields.length; ++i) {
                var field = fields[i];
                var edges = getEdges(field.id, data.edges);
                var ssyks = getAllConcepts(edges, "source", concepts);
                Util.sortByKey(ssyks, "ssyk-code-2012", true);
                if(ssyks.length > 0) {
                    context.addGroupRow(field.preferredLabel, ssyks[0]["ssyk-code-2012"], ssyks[0].preferredLabel);
                    for(var j=1; j<ssyks.length; ++j) {
                        context.addGroupRow(null, ssyks[j]["ssyk-code-2012"], ssyks[j].preferredLabel);
                    }
                } else {
                    context.addGroupRow(field.preferredLabel);
                }
            }
            context.download(name + ".xlsx");
            EventDispatcher.fire(Constants.EVENT_HIDE_POPUP_INDICATOR);
        };
        var exportSsykRelations = (relationType, fieldType) => {
            Rest.getGraph(relationType, this.type, Constants.CONCEPT_SSYK_LEVEL_4, (data) => {
                data = data.graph;
                Rest.getConceptsSsyk(Constants.CONCEPT_SSYK_LEVEL_4, (concepts) => {
                    downloadGraphRelations(fieldType, data, concepts);
                }, (status) => {

                });
            }, (status) => {

            });
        };
        // excel
        var onSaveExcel = () => {
            if(this.type == Constants.CONCEPT_OCCUPATION_FIELD) {
                exportSsykRelations(Constants.RELATION_NARROWER, Constants.CONCEPT_OCCUPATION_FIELD);
            } else if(this.type == Constants.CONCEPT_SKILL) {
                exportSsykRelations(Constants.RELATION_NARROWER, Constants.CONCEPT_SKILL);
            } else {
                Rest.getConcepts(this.type, async (data) => {
                    Util.sortByKey(data, "preferredLabel", true);
                    var version = await Rest.getVersionsPromis();
                    version = version[version.length - 1].version;
                    // setup excel
                    var name = Localization.get("db_" + this.type);
                    var context = Excel.create(name, name, version);
                    context.addRow();
                    // insert data
                    for(var i=0; i<data.length; ++i) {
                        context.addRow(data[i].preferredLabel);
                    }
                    context.download(name + ".xlsx");
                    EventDispatcher.fire(Constants.EVENT_HIDE_POPUP_INDICATOR);
                }, (status) => {

                });
            }
        };
        // event
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("export") + " " + Localization.get("db_" + this.type),
            content: <Export 
                        onSaveExcel={onSaveExcel}/>
        });
    }

    render() {
        return (
            <div className="side_content_1">
                <ConceptsSearch onTypeChangedCallback={this.onTypeChanged.bind(this)}/>
                <Button 
                    text={Localization.get("new_value")}
                    onClick={this.onNewConceptClicked.bind(this)}/>
                <Button 
                    text={Util.renderExportButtonText()}
                    onClick={this.onExportClicked.bind(this)}/>
            </div>
        );
    }
	
}

export default Content1;