import React from 'react';
import Util from './util.jsx';

class List extends React.Component { 

    constructor() {
        super();
        this.state = {
            selectedIndex: -1,
            selectedItem: null,
        };
        this.css = "list font";
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
                        onMouseUp={this.onItemClicked.bind(this, index, item)}>
                        {this.props.dataRender(item)}
                    </div>
                );
            });
        }
    }

    render() {
        return (
            <div className={Util.getStyle(this)}>
                {this.renderData()}
                {this.props.children}
            </div>
        );
    }
	
}

export default List;