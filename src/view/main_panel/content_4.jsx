import React from 'react';
import Label from '../../control/label.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Statistics from './statistics.jsx';
import MissingConnections from './missing_connections.jsx';
import SearchResult from './search_result.jsx';
import Referred from './referred.jsx';

class Content4 extends React.Component { 

    constructor() {
        super();        
        this.ssyks = [];
        //Storleken på värdeförråd mot varandra (hämta några olika)
        this.state = {
            components: [],                 
        };       
        this.selected1 = null;
        this.selected2 = null;
        this.boundOnConnectionsSelected = this.onConnectionsSelected.bind(this);
        this.boundOnStatisticsSelected = this.onStatisticsSelected.bind(this);
        this.boundSearchChanges = this.onSearchChanges.bind(this);
        this.boundReferredSelected = this.onReferredSelected.bind(this);
    }

    componentDidMount() {
        EventDispatcher.add(this.boundOnStatisticsSelected, Constants.EVENT_SIDEPANEL_STATISTICS_SELECTED);
        EventDispatcher.add(this.boundOnConnectionsSelected, Constants.EVENT_SIDEPANEL_CONNECTIONS_SELECTED);
        EventDispatcher.add(this.boundSearchChanges, Constants.EVENT_SEACH_CHANGES);
        EventDispatcher.add(this.boundReferredSelected, Constants.EVENT_SIDEPANEL_REFERRED_SELECTED);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundOnConnectionsSelected);
        EventDispatcher.remove(this.boundOnStatisticsSelected);
        EventDispatcher.remove(this.boundSearchChanges);
        EventDispatcher.remove(this.boundReferredSelected);
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
            components: components            
        });
    }

    onSearchChanges(search) {
        var components = [];
        var key = 0;
        components.push(
            <Label
                css="main_content_title" 
                text={Localization.get("search_result")} 
                key={key++}
            />
        );
        components.push(
            <SearchResult 
                search={search}
                key={key++}
            />
        );
        this.setState({
            components: components            
        });
    }

    onReferredSelected() {
        var components = [];
        var key = 0;
        components.push(
            <Label
                css="main_content_title" 
                text={Localization.get("referred")} 
                key={key++}
            />
        );
        components.push(<Referred key={key++}/>);
        this.setState({
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