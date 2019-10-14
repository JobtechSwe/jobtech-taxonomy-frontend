import React from 'react';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import List from '../../control/list.jsx';

class Content2 extends React.Component { 

    constructor() {
        super();
        this.state = {
            versions: [],
        }
    }

    componentDidMount() {
        Rest.abort();
        Rest.getVersions((data)=>{
            for(var i=0; i<data.length; ++i) {
                data[i].date = new Date(data[i].timestamp);
            }
            this.setState({versions: data});
        }, (status) => {
            // TODO: display error
        });
    }

    onVersionSelected(item) {
        console.log(item);
        EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item);
    }

    renderVersions(item) {
        return(
            <div className="side_content_2_result_item">
                <div>{item.version}</div>
                <div>{item.date.toLocaleString()}</div>    
            </div>
        );
    }

    render() {
        return (
            <div className="side_content_2">
                <List 
                    data={this.state.versions} 
                    dataRender={this.renderVersions.bind(this)}
                    onItemSelected={this.onVersionSelected.bind(this)}/>
            </div>
        );
    }
	
}

export default Content2;