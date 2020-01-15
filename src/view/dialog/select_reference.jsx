import React from 'react';
import Button from './../../control/button.jsx';
import List from './../../control/list.jsx';
import App from './../../context/app.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';
import Localization from './../../context/localization.jsx';
import Rest from './../../context/rest.jsx';
import ContextUtil from './../../context/util.jsx';
import Constants from './../../context/constants.jsx';
import TreeView from './../../control/tree_view.jsx';
import Label from './../../control/label.jsx';
import ControlUtil from './../../control/util.jsx';
import Loader from './../../control/loader.jsx';

class SelectReference extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            selected: props.current,
            items: [],
        };
    }

    componentDidMount() {
        Rest.getConcepts(this.props.type, (data) => {
            data = data.filter((item) => {
                return item != null && item.id != this.props.id;
            });
            data.sort((a, b) => {
                if(a.preferredLabel < b.preferredLabel) { 
                    return -1; 
                }
                return a.preferredLabel > b.preferredLabel ? 1 : 0;
            });
            this.setState({items: data});
        }, (status) => {
            App.showError(Util.getHttpMessage(status) + " : misslyckades hämta concept");
        });
    }

    onReferenceSelected(item) {
        this.setState({selected: item});
    }

    onSetReferenceClicked() {
        this.props.onSelected(this.state.selected);
        EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
    }

    render() {
        var items = this.state.items.map((item, index) => {
            var id = this.state.selected ? this.state.selected.id : null;
            var css = id == item.id ? "deprecated_reference_selected" : "";
            return (
                <div 
                    key={index}
                    className={css}
                    onMouseUp={this.onReferenceSelected.bind(this, item)}>
                    {item.preferredLabel}
                </div>
            );
        });
        return (
            <div className="deprecated_reference_dialog">
                <List css="deprecated_reference_list">
                    {items}
                </List>
                <div className="dialog_content_buttons">
                    <Button
                        onClick={this.onSetReferenceClicked.bind(this)}
                        text={Localization.get("select")}/>
                    <Button
                        onClick={() => {
                            Rest.abort();
                            EventDispatcher.fire(Constants.EVENT_HIDE_OVERLAY);
                        }}
                        text={Localization.get("abort")}/>
                </div>
            </div>
        );
    }
}

export default SelectReference;