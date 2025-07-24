// scripts/fetch-sheet.js
import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";

(async () => {
  // 환경변수에서 시트 ID와 서비스 계정 정보 로드
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // PRIVATE_KEY 에서 \n 을 실제 줄바꿈으로 변환
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  // 스프레드시트 열기
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["News"];  // 시트 이름이 "News"인 경우
  const rows = await sheet.getRows();

  // 각 행을 객체로 변환
  const data = rows.map(r => ({
    title:    r.Title,    // 스프레드시트 헤더 컬럼명에 맞춰 변경
    content:  r.Content,
    date:     r.Date,
    link:     r.Link || null
  }));

  // JSON 파일로 저장
  fs.writeFileSync("news.json", JSON.stringify(data, null, 2), "utf8");
  console.log("✅ news.json 업데이트 완료");
})();