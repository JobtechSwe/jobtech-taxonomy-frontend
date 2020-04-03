import React from 'react';
import Constants from './constants.jsx';
import jsPDF from 'jspdf';

class Pdf { 

    constructor() {
    }
    
    splitTextToSize(doc, text, width) {
        if(text == null) {
            return "";
        }
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
            //TODO break word if to big
            //TODO handle new line
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

    addHeader(doc, name) {
        var dateString = "Utskriftsdatum: " + new Date().toLocaleDateString();
        doc.setFontSize("9");
        doc.setFontStyle("Normal");
        var dimDate = doc.getTextDimensions(dateString);
        doc.text(dateString, 210 - 25 - dimDate.w, 25 - dimDate.h);
        doc.setFontSize("30");
        doc.setFontStyle("Bold");
        var dimName = doc.getTextDimensions(name);
        doc.text(name, (210 - dimName.w) * 0.5, 25 + dimName.h);
        return 30 + dimName.h;
    }

    addTable(doc, x, y, headers, data) {
        doc.setFontSize(12);
        var text = "XYZxyz";
        var dim = doc.getTextDimensions(text);
        var dim2 = doc.getTextDimensions(text);
        var padding = headers[0].padding;
        dim2.h = dim2.h * 0.8;
        console.log(dim, dim2);
        //build rows
        for(var i=0; i<data.length; ++i) {
            var row = data[i];
            row.cells = [];
            row.maxHeight = 1;
            for(var j=0; j<headers.length; ++j) {
                var header = headers[j];
                //make sure text fits in cell otherwise break word
                var text = this.splitTextToSize(doc, row[header.id], header.width - padding * 2);
                row.cells.push({
                    text: text,
                    width: header.width,
                });
                var height = Array.isArray(text) ? text.length : 1;
                if(row.maxHeight < height) {
                    row.maxHeight = height;
                } 
            }
        }
        headers.maxHeight = 1;
        for(var i=0; i<headers.length; ++i) {
            var header = headers[i];
            header.text = this.splitTextToSize(doc, header.name, header.width - padding * 2);
            header.height = Array.isArray(header.text) ? header.text.length : 1;
            if(headers.maxHeight < header.height) {
                headers.maxHeight = header.height;
            }
        }
        //draw table header
        var tmpX = x;
        var tmpY = y;
        doc.setFontStyle("bold");
        for(var i=0; i<headers.length; ++i) {
            var header = headers[i];       
            doc.setDrawColor(0);
            doc.setFillColor(200, 200, 200);
            doc.rect(tmpX, tmpY, header.width, padding * 2 + headers.maxHeight * dim.h, "FD")
            if(Array.isArray(header.text)) {
                for(var j=0; j<header.text.length; ++j) {
                    doc.text(header.text[j], tmpX + padding, tmpY + padding + dim2.h + dim.h * j);
                }
            } else if(header.text.length > 0){
                doc.text(header.text, tmpX + padding, tmpY + padding + dim2.h);
            }
            tmpX += header.width;
        }
        tmpX = x;
        tmpY += padding * 2 + headers.maxHeight * dim.h;
        //draw table content
        doc.setFontStyle("normal");
        for(var i=0; i<data.length; ++i) {
            var row = data[i];
            if(tmpY + row.maxHeight * dim.w > 297 - 25) {
                tmpY = 25;                
                doc.addPage();
            }
            for(var j=0; j<row.cells.length; ++j) {
                var cell = row.cells[j];
                doc.rect(tmpX, tmpY, cell.width, padding * 2 + row.maxHeight * dim.h)
                if(Array.isArray(cell.text)) {
                    for(var k=0; k<cell.text.length; ++k) {
                        doc.text(cell.text[k], tmpX + padding, tmpY + padding + dim2.h + dim.h * k);
                    }
                } else if(cell.text.length > 0){                    
                    doc.text(cell.text, tmpX + padding, tmpY + padding + dim2.h);
                }
                tmpX += cell.width;
            }
            tmpY += padding * 2 + row.maxHeight * dim.h;
            tmpX = x;
        }
    }

    createTable(name, title, header, data) {
        var doc = new jsPDF();
        //A4 = 210mm x 297mm
        
        var position = this.addHeader(doc, title);
        this.addTable(doc, 25, position, header, data);

        doc.save(name + '.pdf');
    }

}

export default new Pdf;