import React from 'react';
import { VictoryBar, VictoryPie, VictoryTooltip } from 'victory';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Statistics from './statistics.jsx';
import MissingConnections from './missing_connections.jsx';
import ChangeLog from './change_log.jsx';

class Content4 extends React.Component { 

    constructor() {
        super();
        this.MODE_CONNECTIONS = "connections";
        this.MODE_STATISTICS = "statistics";
        this.ssyks = [];
        //Storleken på värdeförråd mot varandra (hämta några olika)
        this.state = {
            mode: this.MODE_STATISTICS,
            components: [],                 
        };       
        this.selected1 = null;
        this.selected2 = null;
        this.boundOnConnectionsSelected = this.onConnectionsSelected.bind(this);
        this.boundOnStatisticsSelected = this.onStatisticsSelected.bind(this);
        this.boundSideTimePeriodSelected = this.onSideTimePeriodSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundOnStatisticsSelected, Constants.EVENT_SIDEPANEL_STATISTICS_SELECTED);
        EventDispatcher.add(this.boundOnConnectionsSelected, Constants.EVENT_SIDEPANEL_CONNECTIONS_SELECTED);
        EventDispatcher.add(this.boundSideTimePeriodSelected, Constants.EVENT_SIDEPANEL_TIME_PERIOD_SELECTED);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundOnConnectionsSelected);
        EventDispatcher.remove(this.boundOnStatisticsSelected);
        EventDispatcher.remove(this.boundSideTimePeriodSelected);
    }

    onConnectionsSelected(data) {     
        var components = [];
        var key = 0;
        components.push(
            <Label
                css="main_content_title" 
                text={Localization.get("connections")} 
                key={key++}
            />
        );
        components.push(
            <MissingConnections 
                type1={data.type1} 
                type2={data.type2} 
                key={key++}
            />
        );   
        this.setState({
            mode: this.MODE_CONNECTIONS, 
            components: components,
        });
    }

    onStatisticsSelected() {
        var components = [];
        var key = 0;
        components.push(
            <Label
                css="main_content_title" 
                text={Localization.get("statistics")} 
                key={key++}
            />
        );
        components.push(<Statistics key={key++}/>);
        this.setState({
            mode: this.MODE_STATISTICS, 
            components: components            
        });
    }

    onSideTimePeriodSelected(period) {
        var components = [];
        var key = 0;
        components.push(
            <Label
                css="main_content_title" 
                text={Localization.get("change_log")} 
                key={key++}
            />
        );
        components.push(
            <ChangeLog 
                period={period}
                key={key++}
            />
        );
        this.setState({
            mode: this.MODE_STATISTICS, 
            components: components            
        });
    }

    render() {
        return (
            <div className="main_content_4">
                {this.state.components}
            </div>
        );
    }	
}

export default Content4;