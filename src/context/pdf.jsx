import React from 'react';
import Constants from './constants.jsx';
import jsPDF from 'jspdf';

class Pdf { 

    constructor() {
    }
    
    splitTextToSize(doc, text, width) {
        var dim = doc.getTextDimensions(text);
        if(dim.w < width) {
            return text;
        }
        var getFragment = (from, to, words) => {
            var res = words[from];
            for(var i=from + 1; i<to; ++i) {
                res += " " + words[i];
            }
            return res;
        }
        var words = text.split(" ");
        var result = [];
        var begin = 0;
        var end = words.length;
        while (begin < words.length && begin < end) {
            var fragment = getFragment(begin, end, words);
            var fragDim = doc.getTextDimensions(fragment);
            if(fragDim.w < width) {
                result.push(fragment);
                begin = end;
                end = words.length; 
            } else {
                end--;
            }            
        }        
        return result;
    }

    addHeader(doc) {
        return 25;
    }

    addTable(doc, x, y, header, data) {
        var text = "XYZxyz";
        var dim = doc.getTextDimensions(text);
        //build rows
        //make sure text fits in cell otherwise break word
        //save height for each row
        //draw table header
        //draw table content
        console.log(this.splitTextToSize(doc, "One pretty long text that should be split in two.", 55));
    }

    createTable(name, header, data) {
        var doc = new jsPDF();
        //A4 = 210mm x 297mm
        //doc.text('Hello world!', 10, 10);
        
        /*doc.table(14, 30, data, header, {
            padding: 1,
            printHeaders: 0,
            fontSize: 11,
            autoSize: true,
        });*/
        
        var position = this.addHeader(doc);
        this.addTable(doc, 10, position, header, data);

        //doc.save(name + '.pdf');
    }

}

export default new Pdf;