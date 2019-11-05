import React from 'react';
import ControlUtil from '../../control/util.jsx';
import Label from '../../control/label.jsx';
import Group from '../../control/group.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Description from './description.jsx';
import Connections from './connections.jsx';
import ItemHistory from './item_history.jsx';

class Content1 extends React.Component { 

    constructor() {
        super();
        this.state = {
            components: [],
        };
        this.boundSideItemSelected = this.onSideItemSelected.bind(this);
        this.boundMainItemSelected = this.onMainItemSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundSideItemSelected, Constants.EVENT_SIDEPANEL_ITEM_SELECTED);
        EventDispatcher.add(this.boundMainItemSelected, Constants.EVENT_MAINPANEL_ITEM_SELECTED);
        this.onSideItemSelected();       
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSideItemSelected);
        EventDispatcher.remove(this.boundMainItemSelected);
    }

    onSideItemSelected(item) {
        var components = [];
        var key = 0;
        if(item) {

            //item.deprecated = true;

            // setup title, if deprecated we want it to be really visible
            if(item.deprecated) {
                components.push(
                    <div 
                        className="main_content_title_container"
                        key={key++}>
                        <Label 
                            css="main_content_title" 
                            text={Localization.get("db_" + item.type)}/>
                        <div className="main_content_title_name">
                            <Label text={item.preferredLabel}/>
                            <Label 
                                css="main_content_title_deprecated" 
                                text={Localization.get("deprecated")}/>
                        </div>
                    </div>
                );
            } else {
                components.push(
                    <div 
                        className="main_content_title_container"
                        key={key++}>
                        <Label 
                            css="main_content_title" 
                            text={Localization.get("db_" + item.type)}/>
                        <div className="main_content_title_name">
                            <Label text={item.preferredLabel}/>
                        </div>
                    </div>
                );
            }
            // add content for item
            var infoContext = ControlUtil.createGroupContext();
            var connectionsContext = ControlUtil.createGroupContext();
            components.push(
                <Group 
                    text="Info"
                    useLock={true}
                    context={infoContext}
                    key={key++}>
                    <Description 
                        item={item}
                        groupContext={infoContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("connections")}
                    useLock={true}
                    context={connectionsContext}
                    key={key++}>
                    <Connections 
                        item={item}
                        groupContext={connectionsContext}/>
                </Group>
            );
            components.push(
                <Group 
                    text={Localization.get("history")}
                    key={key++}>
                    <ItemHistory item={item}/>
                </Group>
            );
        } else {
            components.push(
                <Label 
                    css="main_content_title" 
                    text={Localization.get("value_storage")} 
                    key={key++}/>
            );
        }
        this.setState({components: components});
    }

    onMainItemSelected(item) {
        this.onSideItemSelected(item);
    }

    render() {
        return (
            <div className="main_content_1">                
                {this.state.components}
            </div>
        );
    }
	
}

export default Content1;