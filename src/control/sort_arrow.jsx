import React from 'react';

class SortArrow extends React.Component { 

    constructor() {
        super();
    }

    render() {
        return (
            <i className={this.props.css}/>
        );
    }
	
}

export default SortArrow;