import React from 'react';
import XLSX from 'xlsx';
import ControlUtil from '../../control/util.jsx';
import Label from '../../control/label.jsx';
import Button from '../../control/button.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Settings from '../../context/settings.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import App from '../../context/app.jsx';
import CacheManager from '../../context/cache_manager';
import SavePanel from './save_panel.jsx';
import Description from './description.jsx';
import Deprecated from './deprecated.jsx';
import Connections from './connections.jsx';
import ItemHistory from './item_history.jsx';
import Save from '../dialog/save.jsx';
import EditConcept from '../dialog/edit_concept.jsx';
import Export from '../dialog/export.jsx';
import Util from '../../context/util.jsx';
import Excel from '../../context/excel.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.state = {
            item: null,
            components: [],
        };
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        this.onSideItemSelected();       
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
    }

    onItemSaved() {
        CacheManager.invalidateCachedRelations(this.state.item.id);
        CacheManager.updateTypeListItem(this.state.item);
        this.onSideItemSelected(this.state.item);
    }

    onExportClicked() {
        var item = this.state.item;        
        // special fields
        var specialFields = [{
            id: "ssyk-code-2012", 
            text: "SSYK",
        }, {
            id: "isco-code-08", 
            text: "ISCO",
        }, {
            id: "iso-3166-1-alpha-2-2013", 
            text: Localization.get("code"),
        }, {
            id: "iso-3166-1-alpha-3-2013", 
            text: Localization.get("name"),
        }, {
            id: "driving-licence-code-2013", 
            text: Localization.get("type"),
        }, {
            id: "eures-code-2014", 
            text: Localization.get("type"),
        }, {
            id: "iso-639-3-alpha-2-2007", 
            text: Localization.get("code"),
        }, {
            id: "iso-639-3-alpha-3-2007", 
            text: Localization.get("name"),
        }, {
            id: "nuts-level-3-code-2013", 
            text: "NUTS",
        }, {
            id: "sni-level-code-2007", 
            text: "SNI",
        }, {
            id: "sun-education-level-code-2020", 
            text: "SUN",
        }, {
            id: "sun-education-field-code-2020", 
            text: "SUN",
        }];
        // values
        var values = [{
            text: "Info",
            selected: true,
            id: 0,
        }, {
            text: Localization.get("connections"),
            selected: true,
            id: 1,
        }, {
            text: Localization.get("history"),
            id: 2,
        }];
        // excel
        var onSaveExcel = (values) => {
            var splitRelationTypes = (relations) => {
                var result = [];
                if(relations) {
                    for(var i=0; i<relations.length; ++i) {
                        var concept = relations[i].concept;
                        var slot = result.find((x) => {
                            return x.type == concept.type;
                        });
                        if(slot == null) {
                            slot = {
                                type: concept.type,
                                items: [],
                            };
                            result.push(slot);
                        }
                        slot.items.push(concept);
                    }
                }
                return result;
            };
            Util.getFullyPopulatedConcept(item.id, item.type, (concept) => {
                // extract special title
                var specialTitle = null;
                if(item.type.startsWith("ssyk")) {
                    specialTitle = "SSYK " + item["ssyk-code-2012"];
                } else if(item.type.startsWith("isco")) {
                    specialTitle = "ISCO " + item["isco-code-08"];
                }
                // find last change
                var lastChange = null;
                if(concept.local_history && concept.local_history.length) {
                    lastChange = concept.local_history[0].date.toLocaleString();
                }
                // setup excel writer
                var context = Excel.create(item.preferredLabel, item.preferredLabel, specialTitle, lastChange);
                
                // broader relations
                var currentType = null;
                var broaderRelations = splitRelationTypes(concept.broader_list);
                for(var i=0; i<broaderRelations.length; ++i) {
                    var collection = broaderRelations[i];
                    if(currentType != collection.type) {
                        context.addRow(Localization.get("db_" + collection.type), true);
                        for(var j=0; j<collection.items.length; ++j) {
                            context.addRow(collection.items[j].preferredLabel);
                        }
                        context.addRow();
                    }
                }

                // database id

                // definition
                context.addRow(Localization.get("description"), true);
                context.addRow(item.definition, false, true, 28);
                context.addRow();

                console.log(concept);
                
                
                for(var i=0; i<values.length; ++i) {
                    if(values[i].id == 0) {
                        // build sheet
                        /*sheet['A1'] = createCell(Localization.get("name"));
                        sheet['B1'] = createCell(concept.preferredLabel);
                        sheet['A2'] = createCell(Localization.get("type"));
                        sheet['B2'] = createCell(concept.type);
                        sheet['A3'] = createCell("ID");
                        sheet['B3'] = createCell(concept.id);
                        sheet['A4'] = createCell(Localization.get("description"));
                        sheet['B4'] = createCell(concept.definition);
                        for(var j=0; j<specialFields.length; ++j) {
                            if(concept[specialFields[j].id] != null) {
                                index++;
                                sheet['A' + index] = createCell(specialFields[j].text);
                                sheet['B' + index] = createCell(concept[specialFields[j].id]);
                            }
                        }*/
                    } else if(values[i].id == 1) {
                        /*var index = 1;
                        var pushRelations = (list, type) => {
                            for(var j=0; j<list.length; ++j) {
                                var rc = list[j].concept;
                                sheet['A' + index] = createCell(type);
                                sheet['B' + index] = createCell(rc.preferredLabel);
                                sheet['C' + index] = createCell(rc.type);
                                sheet['D' + index] = createCell(rc.id);
                                index++;
                            }
                        };
                        if(concept.relations.broader) {
                            pushRelations(concept.broader_list, "Broader");
                        }
                        if(concept.relations.narrower) {
                            pushRelations(concept.narrower_list, "Narrower");
                        }
                        if(concept.relations.related) {
                            pushRelations(concept.related_list, "Related");
                        }*/
                    } else if(values[i].id == 2) {
                        /*for(var j=0; j<concept.local_history.length; ++j) {
                            var e = concept.local_history[j];
                            sheet['A' + index] = createCell(e.event);
                            sheet['B' + index] = createCell(e.date.toLocaleString());
                            sheet['C' + index] = createCell(e['user-id']);
                            index++;
                        }*/
                    }
                }
                context.download(item.preferredLabel + ".xlsx");
            });
        };
        // pdf

        // event
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("export"),
            content: <Export 
                        values={values}
                        onSaveExcel={onSaveExcel}/>
        });
    }

    onEditClicked() {
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("edit") + " " + this.state.item.preferredLabel,
            content: <EditConcept 
                        item={this.state.item}
                        onItemUpdated={this.onItemSaved.bind(this)}/>
        });
    }

    onSideItemSelected(item) {
        var components = [];
        var key = 0;
        if(item) {            
            var deprecated = item.deprecated != null ? item.deprecated : false;
            var css = item.type == Constants.CONCEPT_ISCO_LEVEL_4 ? "isco_color" : null;

            components.push(
                <div 
                    className="main_content_1_buttons"
                    key={key++}>
                    <Button
                        text={Localization.get("export")}
                        onClick={this.onExportClicked.bind(this)}/>
                    <Button
                        text={Localization.get("edit")}
                        onClick={this.onEditClicked.bind(this)}/>
                </div>
            );

            if(deprecated) {
                components.push(
                    <Group 
                        text={Localization.get("referred_to")}
                        css={css}
                        key={key++}>
                        <Deprecated 
                            item={item}
                            groupContext={infoContext}/>
                    </Group>
                );
            }

            // add content for item
            var infoContext = ControlUtil.createGroupContext();
            var connectionsContext = ControlUtil.createGroupContext();
            components.push(
                <Group 
                    text="Info"
                    context={infoContext}
                    css={css}
                    key={key++}>
                    <Description 
                        item={item}
                        groupContext={infoContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("connections")}
                    context={connectionsContext}
                    css={css}
                    key={key++}>
                    <Connections 
                        item={item}
                        groupContext={connectionsContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("history")}
                    css={css}
                    key={key++}>
                    <ItemHistory item={item}/>
                </Group>
            );
        }
        this.setState({
            isShowingSavePanel: false,
            item: item,
            components: components,
        });
    }
    
    renderTitle() {
        var item = this.state.item;
        if(item == null) {
            return (
                <Label 
                    css="main_content_title" 
                    text={Localization.get("value_storage")}/>
            );
        } else {
            var key = 0;
            var isDeprecated = item.deprecated ? item.deprecated : false;
            var components = [];
            components.push(
                <Label 
                    key={key++}
                    text={item.preferredLabel}/>
            );
            if(isDeprecated) {
                components.push(
                    <Label 
                        key={key++}
                        css="main_content_title_deprecated" 
                        text={Localization.get("deprecated")}/>
                );
            }
            return (
                <div className="main_content_title_container">
                    <Label 
                        css="main_content_title" 
                        text={Localization.get("db_" + item.type)}/>
                    <div className="main_content_title_name">
                        {components}
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="main_content_1">
                {this.renderTitle()}             
                {this.state.components}
            </div>
        );
    }
	
}

export default Content1;