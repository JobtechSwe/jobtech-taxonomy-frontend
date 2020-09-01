import React from 'react';
import Label from '../../control/label.jsx';
import List from '../../control/list.jsx';
import Loader from '../../control/loader.jsx';
import Constants from '../../context/constants.jsx';
import EventDispatcher from '../../context/event_dispatcher.jsx';
import Localization from '../../context/localization.jsx';
import App from '../../context/app.jsx';
import Util from '../../context/util.jsx';

class VersionDetail extends React.Component { 

    constructor() {
        super();
        this.state = {
            item: null,
        };
    }

    componentDidMount() {
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.init(props);
    }

    init(props) {
        this.setState({
            item: props.item,
        }, () => {
            if(props.item) {
                
            }
        });
    }

    renderInfoItem(name, value, key) {
        return (
            <div 
                key={key}
                className={"version_detail_item"}>
                <div>
                    {name}
                </div>
                <div>
                    {value}
                </div>
            </div>
        );
    }

    renderItem(item) {
        if(item == null) {
            return;
        }
        var info = [];
        var key = 0;

        if(item.timestamp) {
            info.push(this.renderInfoItem(Localization.get("timestamp"), new Date(item.timestamp).toLocaleString()));
        }

        if(item["latest-version-of-concept"]) {
            info.push(this.renderInfoItem(Localization.get("preferredLabel"), Localization.get(item["latest-version-of-concept"].preferredLabel), key++));
            info.push(this.renderInfoItem(Localization.get("type"), Localization.get(item["latest-version-of-concept"].type), key++));
            info.push(this.renderInfoItem(Localization.get("id"), Localization.get(item["latest-version-of-concept"].id), key++));
        }
        if(item["concept-attribute-changes"]) {
            for(var i=0; i<item["concept-attribute-changes"].length; ++i) {
                var e = item["concept-attribute-changes"][i];
                info.push(this.renderInfoItem(Localization.get("changed"), Localization.get(e.attribute), key++));
                info.push(this.renderInfoItem(Localization.get("from"), Localization.get(e["old-value"]), key++));
                info.push(this.renderInfoItem(Localization.get("to"), Localization.get(e["new-value"]), key++));
            }
        }
        if(item.relation) {
            info.push(this.renderInfoItem(Localization.get("relation_type"), item.relation["relation-type"], key++));
            info.push(this.renderInfoItem(Localization.get("from_name"), item.relation.source.preferredLabel, key++));
            info.push(this.renderInfoItem(Localization.get("to_name"), item.relation.target.preferredLabel, key++));
            info.push(this.renderInfoItem(Localization.get("from_id"), item.relation.source.id, key++));
            info.push(this.renderInfoItem(Localization.get("to_id"), item.relation.target.id, key++));
            info.push(this.renderInfoItem(Localization.get("from_type"), Localization.get("db_" + item.relation.source.type), key++));
            info.push(this.renderInfoItem(Localization.get("to_type"), Localization.get("db_" + item.relation.target.type), key++));
        }
        if(item.comment) {
            info.push(this.renderInfoItem(Localization.get("note"), item.comment, key++));
        }
        return info;
    }

    render() {
        return (
            <div className="version_detail">
                <List>
                    {this.renderItem(this.state.item)}
                </List>
            </div>
        );
    }
	
}

export default VersionDetail;