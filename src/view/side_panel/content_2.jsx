import React from 'react';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import App from '../../context/app.jsx';
import Util from '../../context/util.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';

class Content2 extends React.Component { 

    constructor() {
        super();
        this.state = {
            versions: [],
            loadingData: true,
        }
    }

    componentDidMount() {
        Rest.abort();
        Rest.getVersions((data)=>{
            console.log(data);
            for(var i=0; i<data.length; ++i) {
                data[i].date = new Date(data[i].timestamp);
            }
            data.unshift({version: -1});
            this.setState({
                versions: data,
                loadingData: false,
            });
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades med att hämta verisioner");
        });
    }

    onVersionSelected(item) {
        console.log(item);
        EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item);
    }

    renderLoader() {
        if(this.state.loadingData) {
            return(
                <Loader/>
            );
        }
    }

    renderVersions(item) {
        return(
            <div className="side_content_2_result_item">
                <div>{item.version == -1 ? "" : item.version}</div>
                <div>{item.version == -1 ? Localization.get("not_published") : item.date.toLocaleString()}</div>    
            </div>
        );
    }

    render() {
        return (
            <div className="side_content_2">
                <List 
                    data={this.state.versions} 
                    dataRender={this.renderVersions.bind(this)}
                    onItemSelected={this.onVersionSelected.bind(this)}>
                    {this.renderLoader()}
                </List>
            </div>
        );
    }
	
}

export default Content2;