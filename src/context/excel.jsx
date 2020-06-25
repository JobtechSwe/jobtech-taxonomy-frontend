
import React from 'react';
import Constants from './constants.jsx';
import ExcelLib from 'exceljs';

class Excel { 

    constructor() {
    }
    
    createSimple(sheetName, version, columns) {
		var workbook = new ExcelLib.Workbook();
		// add image resources
		var logoId = workbook.addImage({
			base64: Constants.ICON_AF_EXPORT_B64,
			extension: 'png',
        });
        // setup sheet
        var sheet = workbook.addWorksheet(sheetName);
		// colums
		sheet.getColumn(1).width = 5;
		for(var i=0; i<columns.length; ++i) {
			sheet.getColumn(i + 2).width = columns[i].width;
		}
		sheet.getColumn(columns.length + 2).width = 5;

		sheet.addRow([]).height = 40;
        sheet.addRow([]).height = 24;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 100; 
		sheet.addRow([]).height = 30;
		// disclaimer
        sheet.mergeCells('B2:E2');
		var disclaimerCell = sheet.getCell('B2');
		disclaimerCell.value = "Observera att datat uppdateras kontinuerligt. Den här filen ger en bild över nuvarande version.";
        disclaimerCell.alignment = { 
            vertical: 'top',
        };
		disclaimerCell.font = {
			name: 'Arial',
			size: 10,
			italic: true,
		};
		// insert image
		sheet.addImage(logoId, {
			tl: { col: 1.0, row: 2.5 },
			ext: { width: 410, height: 50 }
		});
		// print date
        var dateCell = sheet.getCell('E4');
        dateCell.value = "Utskriftsdatum: " + new Date().toLocaleDateString();
		dateCell.alignment = { horizontal: 'right' };
		dateCell.font = {
			name: 'Arial',
			size: 10,
		};
		// version
		var versionCell = sheet.getCell('E5');
        versionCell.value = "Version: " + version;
		versionCell.alignment = { horizontal: 'right' };
		versionCell.font = {
			name: 'Arial',
			size: 10,
		};
		// headers
		for(var i=0; i<columns.length; ++i) {
			var header = sheet.getRow(8).getCell(i + 2);
			header.font = {
				name: 'Arial',
				size: 18,
				bold: true,
			};
			header.value = columns[i].text;
		}
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
			addRow: (values) => {
				sheet.addRow(values);
				/*var row = sheet.addRow([]);
				for(var i=0; i<values.length; ++i) {
					row.getCell(i + 1).value = values[i];
				}*/
			},
		};
	}

    create(sheetName, title, version, subTitle, lastChanged) {
        var workbook = new ExcelLib.Workbook();
        // add image resources
        var logoId = workbook.addImage({
			base64: Constants.ICON_AF_EXPORT_B64,
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
		sheet.getColumn('I').width = 18;
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
        sheet.addRow([]).height = 24;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 12;
        sheet.addRow([]).height = 100;  
        sheet.addRow([]).height = 35;   // headline
        sheet.addRow([]).height = 5;
        sheet.addRow([]).height = 14;   // sub headline
        sheet.addRow([]).height = 14;   // last change text
		sheet.addRow([]).height = 10;
		// disclaimer
        sheet.mergeCells('B2:H2');
		var disclaimerCell = sheet.getCell('B2');
		disclaimerCell.value = "Observera att datat uppdateras kontinuerligt. Den här filen ger en bild över nuvarande version.";
        disclaimerCell.alignment = { 
            vertical: 'top',
        };
		disclaimerCell.font = {
			name: 'Arial',
			size: 10,
			italic: true,
		};
        // insert image
		sheet.addImage(logoId, {
			tl: { col: 1.0, row: 2.5 },
			ext: { width: 410, height: 50 }
		});
        // print date
        var dateCell = sheet.getCell('H4');
        dateCell.value = "Utskriftsdatum: " + new Date().toLocaleDateString();
		dateCell.alignment = { horizontal: 'right' };
		dateCell.font = {
			name: 'Arial',
			size: 10,
		};
		// version
		var versionCell = sheet.getCell('H5');
        versionCell.value = "Version: " + version;
		versionCell.alignment = { horizontal: 'right' };
		versionCell.font = {
			name: 'Arial',
			size: 10,
		};
        // title
        sheet.mergeCells('B8:H8');
        var headline = sheet.getCell('B8');
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
			sheet.mergeCells('B10:H10');
			headline = sheet.getCell('B10');
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
			sheet.mergeCells('B11:H11');
			headline = sheet.getCell('B11');
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
		sheet.pageSetup.margins.left = 0.3;
		sheet.pageSetup.margins.right = 0.3;
		sheet.pageSetup.paperSize = 9;
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
			setCell: (cell, text, bold) => {
				var cell = sheet.getCell(cell);
				cell.value = text;
				cell.font = {
					name: 'Arial',
					size: 10,
					bold: bold == null ? false : bold,
				};
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
				return row._number;
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
				return row._number;
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
				return row._number;
			},
			addGroupRow: (title, number, text, bold) => {
				var row = sheet.addRow([]);
				sheet.mergeCells('C' + row._number + ':D' + row._number +'');
				if(title) {
					var cell = sheet.getCell('C' + row._number);
					cell.value = title;
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: bold == null ? false : bold,
					};
				}
				if(number) {
					var cell = sheet.getCell('G' + row._number);
					cell.value = "" + number;
					cell.font = {
						name: 'Arial',
						size: 10,
					};
				}
				if(text) {
					var cell = sheet.getCell('H' + row._number);
					cell.value = text;
					cell.font = {
						name: 'Arial',
						size: 10,
					};
				}
				return row._number;
			},
		};
    }

	
}

export default new Excel;