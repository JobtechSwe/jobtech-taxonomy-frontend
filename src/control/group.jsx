import React from 'react';
import Util from './util.jsx';
import Constants from './../context/constants.jsx';

class Group extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            locked: true,
            unlockable: props.unlockable != null ? props.unlockable : true,
        }
        this.css = "group";
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            expanded: true,
            locked: true,
            unlockable: props.unlockable != null ? props.unlockable : true,
        }, () => {
            var context = this.props.context;
            if(context && context.onLockChanged) {
                context.onLockChanged(this.state.locked);
            }
        });
    }

    onHeaderClicked() {
        this.setState({expanded: !this.state.expanded});
    }

    onLockClicked() {
        if(this.state.unlockable) {
            this.setState({locked: !this.state.locked}, () => {
                var context = this.props.context;
                if(context && context.onLockChanged) {
                    context.onLockChanged(this.state.locked);
                }
            });
        }
    }

    renderLock() {
        if(this.props.useLock) {
            var icon = this.state.locked ? Constants.ICON_LOCKED : Constants.ICON_UNLOCKED;
            if(!this.state.unlockable) {
                icon = Constants.ICON_HARD_LOCKED;
            }
            return (
                <div onMouseUp={this.onLockClicked.bind(this)}>
                    <img src={icon}/>
                </div>
            );
        }
    }

    renderHeader() {
        if(this.props.text) {
            return (
                <div className="group_header font no_select">
                    <div onMouseUp={this.onHeaderClicked.bind(this)}>
                        <img src={this.state.expanded ? Constants.ICON_EXPAND_UP : Constants.ICON_EXPAND_DOWN}/>
                        <div>
                            {this.props.text}
                        </div>
                    </div>
                    {this.renderLock()}
                </div>
            );
        }
    }

    renderChildren() {
        var s = {
            display: (this.state.expanded ? "flex" : "none"),
            "flexDirection": "column",
        }
        return (
            <div style={s}>
                {this.props.children}
            </div>
        );
    }

    render() {
        return (
            <div className={Util.getStyle(this)}>
                {this.renderHeader()}
                {this.renderChildren()}
            </div>
        );
    }
	
}

export default Group;