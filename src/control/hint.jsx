import React from 'react';

class Hint extends React.Component { 

    render() {        
        return (
            <div className="hint font no_select">
                {this.props.text}
            </div>
        );
    }
	
}

export default Hint;