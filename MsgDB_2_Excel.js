const fs = require('fs');
const XLSX = require('xlsx');

// read MessageDataBase
const luaFileContent = fs.readFileSync('msgdb.lua', 'utf8');

// Sync for MsgID / Msg -> mapper
const regex = /\s*MessageID\s*=\s*"([^"]+)",\s*Message\s*=\s*"([^"]+)"/g;
let match;
const messageList = [];

while ((match = regex.exec(luaFileContent)) !== null) {
    const messageId = match[1];
    const message = match[2];
    messageList.push({ MessageID: messageId, Message: message });
}

// Excel
const workbook = XLSX.utils.book_new();
const sheetData = messageList.map((msg, index) => {
    return { IDX: msg.MessageID, MSG: msg.Message };
});
const worksheet = XLSX.utils.json_to_sheet(sheetData);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');
const excelFileName = 'MessageDataBaseWM.xlsx';
XLSX.writeFile(workbook, excelFileName);

console.log(`Excel File Generate Completed! -> ${excelFileName}`);
