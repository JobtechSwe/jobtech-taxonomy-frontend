import React from 'react';
import Util from './util.jsx';
import Constants from './../context/constants.jsx';

class Group extends React.Component { 

    constructor() {
        super();
        this.state = {
            expanded: true,
            locked: true,
        }
        this.css = "group";
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            expanded: true,
            locked: true,
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
        this.setState({locked: !this.state.locked}, () => {
            var context = this.props.context;
            if(context && context.onLockChanged) {
                context.onLockChanged(this.state.locked);
            }
        });
    }

    renderLock() {
        if(this.props.useLock) {
            return (
                <div onMouseUp={this.onLockClicked.bind(this)}>
                    <img src={this.state.locked ? Constants.ICON_LOCKED : Constants.ICON_UNLOCKED}/>
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