import React from 'react';
import Localization from '../context/localization.jsx';

class PagedList extends React.Component { 

    constructor() {
        super();
        this.state = {
            data: [],
            page: 1,
            itemsPerPage: 1,
            lastDataLength: 0,
        };
    }

    componentDidMount() {
        this.init(this.props);
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.init(props);
    }

    init(props) {
        var updated = false;
        if(props.data.length != this.state.lastDataLength) {
            updated = true;
            this.state.page = 1;
        }
        this.state.data = props.data;
        this.state.itemsPerPage = props.itemsPerPage;
        this.state.lastDataLength = this.state.data.length;
        if(updated) {
            this.props.onNewRange(this.getRange(this.state.page));
        }
    }

    getRange(page) {
        var start = 0;
        var end = 0;
        if(this.state.data.length > 0) {
            if(page > this.getTotalPages()) {
                page = this.getTotalPages();
            }
            start = (page - 1) * this.state.itemsPerPage;
            end = start + this.state.itemsPerPage;
            if(end > this.state.data.length) {
                end = this.state.data.length;
            }
        }         

        return {
            start: start, 
            end: end,
        }
    }

    getTotalPages() {
        return Math.floor(this.state.data.length / this.state.itemsPerPage) + 1;
    }

    onSelectPage(page) {
        if(page < 1) {
            page = 1;
        } else if(page > this.getTotalPages()) {
            page = this.getTotalPages();
        }
        if(page != this.state.page) {
            this.setState({page: page});
            this.props.onNewRange(this.getRange(page));            
        }
    }

    renderPrevious() {
        if(this.state.page > 1) {
            return (
                <div 
                    className="pager_prev font no_select"
                    onMouseUp={this.onSelectPage.bind(this, this.state.page - 1)}>
                    {Localization.get("previous")}
                </div>
            );
        } else {
            return (<div/>);
        }
    }

    renderNext() {
        if(this.state.page < this.getTotalPages()) {
            return (
                <div
                    className="pager_next font no_select" 
                    onMouseUp={this.onSelectPage.bind(this, this.state.page + 1)}>
                    {Localization.get("next")}
                </div>
            );
        } else {
            return (<div/>);
        }
    }

    renderPages() {
        var max = this.getTotalPages();
        var from = this.state.page - 5;
        if(max < 11) {
            from = 1;
        } else if(from < 1) {
            from = 1;
        } else if(from + 9 > max) {
            from = max - 9;
        }        
        var pages = [];
        var key = 0;
        for(var i = 0; i < 10 && from <= max; ++i) {
            if(from == this.state.page) {
                pages.push(
                    <div
                        className="selected_page"
                        key={key++}>
                        {from}
                    </div>
                );
            } else {
                pages.push(
                    <div  
                        onMouseUp={this.onSelectPage.bind(this, from)}
                        key={key++}>
                        {from}
                    </div>
                );
            }
            from++;
        }
        return (
            <div className="pager_pages font no_select">
                {pages}
            </div>
        );
    }

    render() {
        if(this.getTotalPages() > 1) {
            return (
                <div className="pager">
                    {this.renderPrevious()}
                    {this.renderPages()}
                    {this.renderNext()}
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
	
}

export default PagedList;