import React from 'react';
import EventDispatcher from './../context/event_dispatcher.jsx';

class Container extends React.Component { 

    constructor() {
        super();
        this.state = {
            content: null,
        };
        this.boundSetContent = this.onSetContent.bind(this);
    }

    componentDidMount() {
        if(this.props.eventId) {
            EventDispatcher.add(this.boundSetContent, this.props.eventId);            
        }
        if(this.props.defaultView != null) {
            this.setState({content: this.getContentById(this.props.defaultView)});
        }
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundSetContent);
    }

    getContentById(id) {
        if(this.props.views) {
            var view = this.props.views.find((e) => {
                return e.id == id;
            });
            if(view) {
                return view.content;
            }
        }
        return null;
    }

    onSetContent(id) {
        this.setState({content: this.getContentById(id)});
    }

    renderView() {
        if(this.state.content) {
            return this.state.content;
        }
    }

    render() {
        return (
            <div className={this.props.css}>
                {this.renderView()}    
            </div>
        );
    }
	
}

export default Container;