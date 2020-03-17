
import React from 'react';
import Constants from './constants.jsx';
import ExcelLib from 'exceljs';

class Excel { 

    constructor() {
    }

    create(sheetName, title, subTitle, lastChanged) {
        var workbook = new ExcelLib.Workbook();
        // add image resources
        var logoId = workbook.addImage({
            base64: Constants.ICON_AF_EXPORT,
            extension: 'png',
        });
        // setup sheet
        var sheet = workbook.addWorksheet(sheetName);
        // colums
        sheet.getColumn('A').width = 5;
        sheet.getColumn('B').width = 2;
        sheet.getColumn('C').width = 20;
        sheet.getColumn('D').width = 25;
        sheet.getColumn('E').width = 2;
        sheet.getColumn('F').width = 2;
        sheet.getColumn('G').width = 6;
		sheet.getColumn('H').width = 39;
		sheet.getColumn('I').width = 2;
		sheet.getColumn('J').width = 5;
		/*['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((element) => {
			sheet.getColumn(element).fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFFFFFFF' },
			};
		});*/
        // header
        sheet.addRow([]).height = 40;
        sheet.addRow([]).height = 10;
        sheet.addRow([]).height = 15;
        sheet.addRow([]).height = 35;
        sheet.addRow([]).height = 100;  
        sheet.addRow([]).height = 35;   // headline
        sheet.addRow([]).height = 5;
        sheet.addRow([]).height = 14;   // sub headline
        sheet.addRow([]).height = 14;   // last change text
        sheet.addRow([]).height = 10;
        // insert image
        sheet.addImage(logoId, 'B2:C4');
        // print date
        var dateCell = sheet.getCell('H3');
        dateCell.value = "Utskriftsdatum: " + new Date().toLocaleDateString();
		dateCell.alignment = { horizontal: 'right' };
		dateCell.font = {
			name: 'Arial',
			size: 10,
		};
        // title
        sheet.mergeCells('B6:H6');
        var headline = sheet.getCell('B6');
        headline.value = title;
        headline.alignment = { 
            vertical: 'middle',
            horizontal: 'center',
        };
        headline.font = {
            name: 'Arial',
            size: 18,
            bold: true,
        };
		if(subTitle) {
			sheet.mergeCells('B8:H8');
			headline = sheet.getCell('B8');
			headline.value = subTitle;
			headline.alignment = { 
				vertical: 'middle',
				horizontal: 'center',
			};
			headline.font = {
				name: 'Arial',
				size: 10,
			};
		}
		if(lastChanged) {
			sheet.mergeCells('B9:H9');
			headline = sheet.getCell('B9');
			headline.value = "Senast ändrad: " + lastChanged;
			headline.alignment = { 
				vertical: 'middle',
				horizontal: 'center',
			};
			headline.font = {
				name: 'Arial',
				size: 10,
			};
		}
		sheet.pageSetup = {
			fitToPage: true,
		};
		return {
			workbook: workbook,
			sheet: sheet,
			// create a binary blob and download it as a file
			download: (filename) => {
				workbook.xlsx.writeBuffer().then((buffer) => {
					var blob = new Blob([buffer], { type: "excel/xlsx" });
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = filename;
					link.click();
				});
			},
			/*
			config = {
				width: 10,
				bold: true,
				italic: true,
				wrapText: true,
				fontSize: 10
				indent: 1
			}
			*/
			addRow: (text, config) => {
				var row = sheet.addRow([]);
				config = config ? config : {};
				row.height = config.height == null ? 14 : config.height;
				if(text) {
					sheet.mergeCells('C' + row._number + ':H' + row._number +'');
					var cell = sheet.getCell('C' + row._number);
					cell.value = text;
					cell.font = {
						name: 'Arial',
						size: config.fontSize == null ? 10 : config.fontSize,
						bold: config.bold == null ? false : config.bold,
						italic: config.italic == null ? false : config.italic,
					};
					cell.alignment = {
						vertical: 'top',
						wrapText: config.wrapText == null ? false : config.wrapText,
						indent: config.indent == null ? false : config.indent,
					};
				}
			},
			addHeadlines: (leftTitle, rightTitle) => {
				var row = sheet.addRow([]);
				sheet.mergeCells('C' + row._number + ':D' + row._number +'');
				sheet.mergeCells('G' + row._number + ':H' + row._number +'');
				if(leftTitle) {
					var cell = sheet.getCell('C' + row._number);
					cell.value = leftTitle;
					cell.font = {
						name: 'Arial',
						size: 12,
						bold: true,
						italic: true,
					};
				}
				if(rightTitle) {
					var cell = sheet.getCell('G' + row._number);
					cell.value = rightTitle;
					cell.font = {
						name: 'Arial',
						size: 12,
						bold: true,
						italic: true,
					};
				}
			},
			/*
			left / right = {
				text: "text",
				bold: true,
			}
			*/
			addLeftRight: (left, right) => {
				var row = sheet.addRow([]);
				sheet.mergeCells('C' + row._number + ':D' + row._number +'');
				sheet.mergeCells('G' + row._number + ':H' + row._number +'');
				if(left) {
					var cell = sheet.getCell('C' + row._number);
					cell.value = left.text;
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: left.bold == null ? false : left.bold,
					};
					cell.alignment = { 
						wrapText: true,
					};
					if(left.bold == null || left.bold == false) {
						cell.alignment.indent = 1;
					}
				}
				if(right) {
					var cell = sheet.getCell('G' + row._number);
					cell.value = right.text;
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: right.bold == null ? false : right.bold,
					};
					cell.alignment = { 
						wrapText: true,
					};
					if(right.bold == null || right.bold == false) {
						cell.alignment.indent = 1;
					}
				}
			},
		};
    }

	
}

export default new Excel;