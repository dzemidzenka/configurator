const XLSX = require('xlsx');
const fs = require('fs');


let wb = XLSX.readFile(__dirname + '/data.xlsx');
let ws = wb.Sheets[wb.SheetNames[0]];
let data = XLSX.utils.sheet_to_json(ws,
  {
    header: ['setType', 'type', 'partNumber', 'description', 'material', 'available', 'H', 'L', 'W', 'lordosis', 'qtyInSet'],
    raw: true
  });



const RAW = data
  .filter(o => o.qtyInSet > 0)
  .slice(1)                           //delete header row  
  .map(o => {
    o.partNumber += '';               //convert to string
    return o;
  })
  .map(o => {
    delete o.type;                    //delete property    
    delete o.available;               //delete property
    return o;
  })
  .map(o => {
    o.lordosisOrig = o.lordosis;      //determine outliers
    if (o.H === 14 || o.H === 16 || o.W === 40) {
      o.lordosis = 99;
    }
    return o;
  });


let serialized = 'export const RAW_DATA = ' + JSON.stringify(RAW, undefined, 2);
console.log(serialized);
fs.writeFile(__dirname + '/data.ts', serialized, 'utf8');




// SET CONTENT
wb = XLSX.readFile(__dirname + '/setContent.xlsx');
ws = wb.Sheets[wb.SheetNames[0]];
data = XLSX.utils.sheet_to_json(ws,
  {
    header: ['setType', 'content'],
    raw: true
  });


serialized = 'export const SET_CONTENT_DATA = ' + JSON.stringify(data, undefined, 2);
console.log(serialized);
fs.writeFile(__dirname + '/setContent.ts', serialized, 'utf8');



