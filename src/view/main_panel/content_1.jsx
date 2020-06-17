import React from 'react';
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
import Rest from '../../context/rest.jsx';

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
        Util.getConcept(this.state.item.id, this.state.item.type, (data) => {
            // merge item
            for(var member in data[0]) {
                if(this.state.item[member] == null) {
                    this.state.item[member] = data[0][member];
                }
            }
            this.state.item.broader = data[0].broader;
            this.state.item.narrower = data[0].narrower;
            this.state.item.related = data[0].related;
            this.onSideItemSelected(this.state.item);
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
    }

    onExportClicked() {
        var item = this.state.item;
        // values
        var values = [{
            text: "Inkludera kvalitetssäkring",
            selected: true,
            id: 0,
        }, {
            text: "Inkludera databas-ID",
            selected: false,
            id: 1,
        }];
        // excel
        var onSaveExcel = (values) => {
            var splitRelationTypes = (relations) => {
                var result = [];
                if(relations) {
                    for(var i=0; i<relations.length; ++i) {
                        var concept = relations[i];
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
                        slot.items.push(relations[i]);
                    }
                }
                return result;
            };
            Util.getFullyPopulatedConcept(item.id, item.type, async (concept) => {
                // extract special title
                var specialTitle = null;
                if(concept.type.startsWith("ssyk")) {
                    specialTitle = "SSYK " + concept.ssyk;
                } else if(concept.type.startsWith("isco")) {
                    specialTitle = "ISCO " + concept.isco;
                }
                // find last change
                var lastChange = null;
                if(concept.local_history && concept.local_history.length) {
                    lastChange = concept.local_history[0].date.toLocaleString();
                }
                var version = await Rest.getVersionsPromis();
                version = version[version.length - 1].version;
                // setup excel writer
                var context = Excel.create(concept.preferredLabel, concept.preferredLabel, version, specialTitle, lastChange);
                
                context.addRow();

                if(concept.type == "ssyk-level-4") {
                    // broader relations
                    var broaderRelations = splitRelationTypes(concept.broader);
                    for(var i=0; i<broaderRelations.length; ++i) {
                        var collection = broaderRelations[i];
                        context.addRow(Localization.get("db_" + collection.type), { bold: true });
                        for(var j=0; j<collection.items.length; ++j) {
                            context.addRow(collection.items[j].preferredLabel);
                        }
                        context.addRow();
                    }
                }

                // database id
                context.addRow("Databas-ID", { bold: true });
                context.addRow(concept.id);
                context.addRow();

                // definition
                context.addRow(Localization.get("description"), { bold: true });
                context.addRow(concept.definition, { height: 28, wrapText: true });
                context.addRow();

                if(concept.type == "ssyk-level-4") {
                    var relations = splitRelationTypes(concept.narrower);
                    relations = relations.concat(splitRelationTypes(concept.related));
                    // find skill-headline and occupation-name
                    var skills = relations.find((x) => {
                        return x.type == "skill-headline";
                    });
                    skills = skills == null ? [] : skills.items;
                    var names = relations.find((x) => {
                        return x.type == "occupation-name";
                    });
                    names = names == null ? [] : names.items;
                    // headline
                    context.addRow();
                    context.addHeadlines(Localization.get("db_occupation-name"), Localization.get("db_skill"));
                    // create virtual rows
                    var nextSkillIndex = 0;
                    var nextNameIndex = 0;
                    var rows = [];
                    var count = skills.length > names.length ? skills.length : names.length;
                    for(var i=0; i<count; ++i) {
                        var skillHeadline = i < skills.length ? skills[i] : null;
                        var name = i < names.length ? names[i] : null;
                        // add row
                        rows.push({});
                        // setup row
                        if(skillHeadline) {
                            // add headline
                            rows[nextSkillIndex++].right = {
                                bold: true,
                                text: skillHeadline.concept.preferredLabel,
                            };
                            // add skills
                            for(var j=0; j<skillHeadline.children.length; ++j) {
                                rows.push({
                                    right: { text: skillHeadline.children[j].preferredLabel },
                                });
                                nextSkillIndex++;
                            }
                        }
                        if(name) {
                            rows[nextNameIndex++].left = { text: name.preferredLabel };
                        }
                    }
                    // add rows
                    for(var i=0; i<rows.length; ++i) {
                        context.addLeftRight(rows[i].left, rows[i].right);
                    }
                } else {
                    var relations = splitRelationTypes(concept.broader);
                    relations = relations.concat(splitRelationTypes(concept.narrower));
                    relations = relations.concat(splitRelationTypes(concept.related));
                    for(var i=0; i<relations.length; ++i) {
                        var collection = relations[i];
                        if(collection.type == 'skill-headline' && concept.type == 'skill-headline') {
                            // skip this since the concept is the headline
                            continue;
                        }
                        context.addRow(Localization.get("db_" + collection.type), { 
                            bold: true, 
                            italic: true,
                            fontSize: 12,
                        });
                        if(collection.type == 'skill-headline') {
                            for(var j=0; j<collection.items.length; ++j) {
                                var skillHeadline = collection.items[j];
                                context.addRow(skillHeadline.preferredLabel, { bold: true });
                                for(var k=0; k<skillHeadline.children.length; ++k) {
                                    context.addRow(skillHeadline.children[k].preferredLabel, { indent: 1 });
                                }
                            }
                        } else {
                            for(var j=0; j<collection.items.length; ++j) {
                                context.addRow(collection.items[j].preferredLabel);
                            }
                        }
                        context.addRow();
                    }
                }
                // download the file
                context.download(concept.preferredLabel + ".xlsx");
                EventDispatcher.fire(Constants.EVENT_HIDE_POPUP_INDICATOR);
            });
        };
        // event
        EventDispatcher.fire(Constants.EVENT_SHOW_OVERLAY, {
            title: Localization.get("export") + " " + this.state.item.preferredLabel,
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
                        text={Util.renderExportButtonText()}
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
                    text={Localization.get("info")}
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