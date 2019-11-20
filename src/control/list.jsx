import React from 'react';
import Util from './util.jsx';
import EventDispatcher from '../context/event_dispatcher.jsx';

class List extends React.Component { 

    constructor() {
        super();
        this.state = {
            selectedIndex: -1,
            selectedItem: null,
        };
        this.css = "list font";
        this.boundOnClear = this.onClear.bind(this);        
    }

    componentDidMount() {
        if(this.props.eventId) {
            EventDispatcher.add(this.boundOnClear, this.props.eventId);
        }
    }

    componentWillUnmount() {
        EventDispatcher.remove(this.boundOnClear);
    }

    onClear() {
        this.setState({
            selectedIndex: -1, 
            selectedItem: null,});
    }

    onItemClicked(index, item) {
        this.setState({
            selectedIndex: index,
            selectedItem: item,
        });
        if(this.props.onItemSelected) {
            this.props.onItemSelected(item, index);
        }
    }

    renderData() {
        if(this.props.data && this.props.dataRender) {
            return this.props.data.map((item, index) => {
                var s = "item no_select " + (this.state.selectedIndex == index ? "selected" : "");
                return (
                    <div 
                        className={s}
                        key={index}
                        onMouseUp={this.onItemClicked.bind(this, index, item)}
                    >
                        {this.props.dataRender(item)}
                    </div>
                );
            });
        }
    }

    render() {
        return (
            <div className={Util.getStyle(this)}>
                {this.props.children}
                {this.renderData()}
            </div>
        );
    }
	
}

export default List;