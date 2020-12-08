var Excel = require("exceljs");
module.exports = (data, callback) => {
  // * To check first object of customFields
  console.log(
    "Creating excel file...",
    data["responses"][0]["response"].length
  );
  console.log("Creating excel file...", data["fields"].length);

  //Instantiating exceljs instance.
  var workbook = new Excel.Workbook();

  // Creating a new sheet as "My Sheet"
  const worksheet = workbook.addWorksheet("My Sheet");
  let worksheetColumns = [];
  data["fields"].map((x) => {
    worksheetColumns.push({
      header: x.fieldName,
      key: x.fieldCount,
    });
  });
  worksheet.columns = worksheetColumns;
  data["responses"].forEach((x) => {
    let rowObject = {};
    x["response"].forEach((y) => {
      rowObject[y.fieldCount] = y.response;
    });
    console.log("object before saving:", rowObject);
    worksheet.addRow(rowObject);
  });

  // Creating file.xlsx file buffer
  workbook.xlsx
    // .writeFile("sample.xlsx")
    .writeBuffer()
    .then((res) => {
      console.log("File created and is sending......");

      // * Sending that buffer to main module to create it as attachments and mail it.
      callback(false, res);
    })
    .catch((err) => {
      console.log("!!Failed to create xlsx file!!!", err);
      callback(true, err);
    });
};
