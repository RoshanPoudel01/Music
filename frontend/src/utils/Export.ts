import FileSaver from "file-saver";
import * as XLSX from "xlsx";

//helper function for exporting data to excel
export const ExportCSV = ({ csvData, fileName, Heading, header }: any) => {
  const wscols = header.map(() => {
    return { wch: 30 };
  });
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (
    csvData: any[],
    fileName: string,
    wscols: XLSX.ColInfo[],
    header: string[]
  ) => {
    const filteredData = csvData.map((data) =>
      header.reduce((obj: any, key) => {
        obj[key] = data[key];
        return obj;
      }, {})
    );
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Heading, {
      header,
      skipHeader: true,
    });

    ws["!cols"] = wscols;
    try {
      XLSX.utils.sheet_add_json(ws, filteredData, {
        header,
        skipHeader: true,
        origin: -1, //ok
      });
    } catch (err) {
      console.error("error!!!", err);
    }
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  if (csvData) {
    exportToCSV(csvData, fileName, wscols, header);
  }

  return null;
};
