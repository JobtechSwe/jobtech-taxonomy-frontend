import React from 'react';
import Localization from './../context/localization.jsx';
import Util from './util.jsx';

class ConceptWrapper extends React.Component { 
    
    constructor() {
        super();
        this.state = {
            isOpen: false,
            x: 0,
            y: 0,
        };
        this.ref = React.createRef();
        this.boundContextMenu = this.onContextMenu.bind(this);
        this.boundMouseUp = this.onMouseUp.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mouseup", this.boundMouseUp, false);
        this.ref.current.addEventListener("contextmenu", this.boundContextMenu, false);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.boundMouseUp);
        this.ref.current.removeEventListener("contextmenu", this.boundContextMenu);
    }

    fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            if(!successful) {
                console.log('Fallback: Copying text command was unsuccessful');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }

    copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
        } else {
            navigator.clipboard.writeText(text).then(() => {
            }, (err) => {
                console.error('Async: Could not copy text: ', err);
            });
        }
    }

    onMouseUp(e) {
        if(this.state.isOpen) {
            this.setState({isOpen: false});
        }
    }

    onContextMenu(e) {
        this.setState({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
        });
        if(e) {
            e.preventDefault();
        } else {
            this.ref.current.event.returnValue = false;
        }
    }

    onItemClicked(item, e) {
        this.copyTextToClipboard(item.value);
        e.preventDefault();
    }

    createValue(text, value) {
        return {
            value: value,
            label: Localization.get(text)
        };
    }

    renderCopyOptions() {
        var concept = this.props.concept;
        var options = [];
        options.push(this.createValue("database_id", concept.id));
        options.push(this.createValue("type", concept.type));
        options.push(this.createValue("name", concept.preferredLabel));
        if(concept.definition != null) {
            options.push(this.createValue("description", concept.definition));
        }
        if(concept.last_changed != null) {
            options.push(this.createValue("last_changed", new Date(concept.last_changed).toLocaleString()));
        }
        if(concept.last_changed != null) {
            options.push(this.createValue("quality_classification", concept.quality_level));
        }
        if(concept.ssyk != null) {
            options.push(this.createValue("concept.external-standard/ssyk-code-2012", concept.ssyk));
        }
        if(concept.isco != null) {
            options.push(this.createValue("concept.external-standard/isco-code-08", concept.isco));
        }
        if(concept.sni_level_code_2007 != null) {
            options.push(this.createValue("concept.external-standard/sni-level-code-2007", concept.sni_level_code_2007));
        }
        if(concept.sun_education_field_code_2020 != null) {
            options.push(this.createValue("concept.external-standard/sun-education-field-code-2020", concept.sun_education_field_code_2020));
        }
        if(concept.sun_education_level_code_2020 != null) {
            options.push(this.createValue("concept.external-standard/sun-education-level-code-2020", concept.sun_education_level_code_2020));
        }
        if(concept.iso_639_3_alpha_2_2007 != null) {
            options.push(this.createValue("concept.external-standard/iso-639-3-alpha-2-2007", concept.iso_639_3_alpha_2_2007));
        }
        if(concept.iso_639_3_alpha_3_2007 != null) {
            options.push(this.createValue("concept.external-standard/iso-639-3-alpha-3-2007", concept.iso_639_3_alpha_3_2007));
        }
        if(concept.lau_2_code_2015 != null) {
            options.push(this.createValue("concept.external-standard/lau-2-code-2015", concept.lau_2_code_2015));
        }
        if(concept.national_nuts_level_3_code_2019 != null) {
            options.push(this.createValue("concept.external-standard/nnuts", concept.national_nuts_level_3_code_2019));
        }
        if(concept.nuts_level_3_code_2013 != null) {
            options.push(this.createValue("concept.external-standard/nuts-level-3-code-2013", concept.nuts_level_3_code_2013));
        }
        if(concept.iso_3166_1_alpha_2_2013 != null) {
            options.push(this.createValue("concept.external-standard/iso-3166-1-alpha-2-2013", concept.iso_3166_1_alpha_2_2013));
        }
        if(concept.iso_3166_1_alpha_3_2013 != null) {
            options.push(this.createValue("concept.external-standard/iso-3166-1-alpha-3-2013", concept.iso_3166_1_alpha_3_2013));
        }
        if(concept.driving_licence_code_2013 != null) {
            options.push(this.createValue("concept.external-standard/driving-licence-code-2013", concept.driving_licence_code_2013));
        }
        if(concept.eures_code_2014 != null) {
            options.push(this.createValue("concept.external-standard/eures", concept.eures_code_2014));
        }
        return options.map((element, index) => {
            return (
                <div 
                    className="concepts_wrapper_value" 
                    key={index}
                    onMouseDown={this.onItemClicked.bind(this, element)}>
                    {element.label}
                </div>
            );
        });
    }

    renderContextMenu() {
        if(this.state.isOpen) {
            var s = {
                left: this.state.x,
                top: this.state.y,
            };
            return (
                <div className="concepts_wrapper font" style={s}>
                    <div>
                        Kopiera:
                    </div>
                    {this.renderCopyOptions()}
                </div>
            );
        }
    }

    render() {
        return (
            <div ref={this.ref}>
                {this.props.children}
                {this.renderContextMenu()}
            </div>
        );
    }
	
}

export default ConceptWrapper;