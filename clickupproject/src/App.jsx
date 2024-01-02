import MainComponent from "./clickup/maincomponent";
function App() {
  return (
    <div>
      <MainComponent />
    </div>
  );
}
export default App;

/* import React from "react";
import { utils, writeFile } from "xlsx";

function App() {
  const generateExcelFile = () => {
    // Create a new workbook
    const workbook = utils.book_new();

    // Create a new worksheet
    const worksheet = utils.json_to_sheet([
      { Name: "John Doe", Age: 32, Gender: "Male" },
      { Name: "Jane Smith", Age: 28, Gender: "Female" },
      { Name: "Bob Johnson", Age: 45, Gender: "Male" },
    ]);

    // Add the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a file
    writeFile(workbook, "example.xlsx");
  };

  return (
    <div>
      <button onClick={generateExcelFile}>Download Excel File</button>
    </div>
  );
}

export default App; */
