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
            var latestVersion = 0;
            for(var i=0; i<data.length; ++i) {
                data[i].date = new Date(data[i].timestamp);
                if(latestVersion < data[i].version) {
                    latestVersion = data[i].version;
                }
            }
            data = Util.sortByKey(data, "version", false),
            data.unshift({
                version: -1,
                latestVersion: latestVersion,
            });
            this.setState({
                versions: data,
                loadingData: false,
            });
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades med att hämta verisioner");
        });
    }

    onVersionSelected(item) {        
        var prevItem = null;
        var pos = this.state.versions.indexOf(item);
        if(pos == 0) {
            prevItem = this.state.versions[this.state.versions.length -1];
        } else if(pos > 1) {
            prevItem = this.state.versions[pos -1];
        }
        EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, {
            selected: item,
            prev: prevItem});
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