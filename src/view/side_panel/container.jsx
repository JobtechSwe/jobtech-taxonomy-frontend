import React from 'react';
import Constants from './../../context/constants.jsx';
import EventDispatcher from './../../context/event_dispatcher.jsx';

class Container extends React.Component { 

    constructor() {
        super();
        this.state = {
            content: null,
        };
        this.boundSetContent = this.onSetContent.bind(this);
    }

    componentDidMount() {        
        EventDispatcher.add(this.boundSetContent, Constants.EVENT_SET_WORKMODE);
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSetContent);
    }

    onSetContent(id) {
        console.log("--- ", id);
        //this.setState({content: id,});
    }

    render() {
        return (
            <div className="side_container">
                
            </div>
        );
    }
	
}

export default Container;