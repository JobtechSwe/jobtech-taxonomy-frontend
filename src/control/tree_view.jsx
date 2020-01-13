import React from 'react';
import List from './list.jsx';
import Util from './util.jsx';

class TreeView extends React.Component { 
    
    constructor() {
        super();
        this.state = {
            context: null,
        };
    }

    __init(props) {
        if(props.context) {
            props.context.addRoot = this.addRoot.bind(this);
            props.context.removeRoot = this.removeRoot.bind(this);
            props.context.clear = this.clear.bind(this);
            props.context.invalidate = this.invalidate.bind(this);
            props.context.findChild = this.findChild.bind(this);
            this.state.context = props.context;
            this.setState({context: props.context});
        }
    }

    componentDidMount() {
        this.__init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.__init(props);
    }

    addRoot(root, callback) {
        this.state.context.roots.push(root);
        root.attached = true;
        if(this.state.context.shouldUpdateState) {
            this.setState({context: this.state.context}, callback);
        }
    }

    removeRoot(root, callback) {
        root.setSelected(false);
        root.rebind();
        root.attached = false;
        var index = this.state.context.roots.indexOf(root);
        this.state.context.roots.splice(index, 1);
        this.setState({context: this.state.context}, callback);
    }

    clear() {
        if(this.state.context) {
            this.state.context.roots = [];
            this.state.context.selected = null;
            this.setState({context: this.state.context});
        }
    }

    invalidate(callback) {
        this.setState({context: this.state.context}, callback);
    }

    findChild(predicate) {
        if(this.state.context) {
            for(var i=0; i<this.state.context.roots.length; ++i) {
                var root = this.state.context.roots[i];
                if(predicate(root)) {
                    return root;
                }
                if(root.findChild != null) {
                    var result = root.findChild(predicate);
                    if(result) {
                        return result;
                    }
                }
            }
        }
        return null;
    }

    renderRoots() {
        if(this.state.context) {
            return this.state.context.roots.map((item, i) => {
                return item.reactType;
            });
        }
    }

    render() {
        return (
            <List css={this.props.css}>
                {this.props.children}
                {this.renderRoots()}
            </List>
        );
    }
	
}

export default TreeView;