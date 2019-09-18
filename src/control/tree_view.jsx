import React from 'react';
import List from './list.jsx';
import Util from './util.jsx';

class TreeView extends React.Component { 
    
    constructor() {
        super();
        this.state = {
            context: null,
        };
        this.css = "";
    }

    componentDidMount() {
        if(this.props.context) {
            this.setState({context: this.props.context});
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if(props.context) {
            this.setState({context: props.context});
        }
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
            <List css={Util.getStyle(this)}>
                {this.renderRoots()}
            </List>
        );
    }
	
}

export default TreeView;