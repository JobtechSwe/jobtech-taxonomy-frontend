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
        var words = text.split(" ");
        var result = [];
        var index = 0;
        var testing = words.length;
        
        
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
        this.splitTextToSize(doc, );
    }

    createTable(name, header, data) {
        var doc = new jsPDF();
        //A4 = 210mm x 297mm
        doc.text('Hello world!', 10, 10);
        
        /*doc.table(14, 30, data, header, {
            padding: 1,
            printHeaders: 0,
            fontSize: 11,
            autoSize: true,
        });*/
        

        console.log(doc.getLineHeight(), dim);

        
        var position = this.addHeader(doc);
        this.addTable(doc, 10, position, header, data);

        doc.save(name + '.pdf');
    }

}

export default new Pdf;