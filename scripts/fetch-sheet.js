const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const SHEET_ID = process.env.SHEET_ID;
const SERVICE_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

const fetchSheet = async () => {
  const doc = new GoogleSpreadsheet(SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: SERVICE_EMAIL,
    private_key: PRIVATE_KEY,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const jsonData = rows.map(row => {
    const obj = {};
    sheet.headerValues.forEach(header => {
      obj[header] = row[header];
    });
    return obj;
  });

  fs.writeFileSync('output.json', JSON.stringify(jsonData, null, 2));
  console.log('✅ JSON 저장 완료: output.json');
};

fetchSheet().catch(console.error);