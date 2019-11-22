import React from 'react';
import Rest from '../../context/rest.jsx';
import Constants from '../../context/constants.jsx';
import Localization from '../../context/localization.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';

class Content4 extends React.Component { 

    constructor() {
        super();

        this.state = {
            data: [],
            loadingData: true,
        };
    }

    componentDidMount() {        
        Rest.getConceptsSsyk("ssyk-level-1 ssyk-level-2 ssyk-level-3 ssyk-level-4", (data) => {
            for(var i=0; i<data.length; ++i) {
                var item = data[i];            
                if(item["ssyk-code-2012"]) {
                    item.ssyk = item["ssyk-code-2012"];            
                    while(item.ssyk.length < 4) {
                        item.ssyk += "0";
                    }                
                }
                item.preferredLabel = this.formatLabel(item.preferredLabel);
            }
            data.sort((a, b) => {
                if(a.ssyk) {
                    if(a.ssyk < b.ssyk) { 
                        return -1; 
                    }
                    return a.ssyk > b.ssyk ? 1 : 0;
                }
                if(a.preferredLabel < b.preferredLabel) { 
                    return -1; 
                }
                return a.preferredLabel > b.preferredLabel ? 1 : 0;
            });
            this.setState({
                data: data, 
                loadingData: false
            });
        }, (status) => {
            // TODO: error handling
        });
    }

    formatLabel(label) {
        return label.replace(/\/(?! )/g, " / ");
    }

    onItemSelected(item) {
        EventDispatcher.fire(Constants.EVENT_SIDEPANEL_ITEM_SELECTED, item);
    }

    renderLoader() {
        if(this.state.loadingData) {
            return(
                <Loader/>
            );
        }
    }

    renderItem(item) {
        return(
            <div className="ssyk_item">
                <div>{item.ssyk}</div>
                <div>{item.preferredLabel}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="side_content_4">
                <List 
                    data={this.state.data}
                    dataRender={this.renderItem.bind(this)}
                    onItemSelected={this.onItemSelected.bind(this)}
                >
                    {this.renderLoader()}
                </List>
            </div>
        );
    }
	
}

export default Content4;