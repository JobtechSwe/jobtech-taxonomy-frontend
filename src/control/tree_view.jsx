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
            this.setState({context: props.context});
        }
    }

    componentDidMount() {
        this.__init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.__init(props);
    }

    addRoot(root) {
        this.state.context.roots.push(root);
        this.setState({context: this.state.context});
    }

    removeRoot(root) {
        root.setSelected(false);
        var index = this.state.context.roots.index(root);
        this.state.context.roots.splice(index, 1);
        this.setState({context: this.state.context});
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
                {this.renderRoots()}
            </List>
        );
    }
	
}

export default TreeView;