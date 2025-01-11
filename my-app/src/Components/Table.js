import React from "react";


const COLUMNS = [                             //An array of objects that is defining structure of table columns, key: property in data objects ; label: name displayed as column header in table
  { key: "date", label: "Date" },
  { key: "revenue", label: "Revenue" },
  { key: "netIncome", label: "Net Income" },
  { key: "grossProfit", label: "Gross Profit" },
  { key: "eps", label: "EPS" },
  { key: "operatingIncome", label: "Operating Income" },
];

const Table = ({ data, sortConfig, onSort }) => {           //actual table component that displays financial data in table format
  const sortIndicator = (key) => {                           //Only use for this is arrow indicator for sorting
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return null;
  };

  const rowRender = (item, rowIndex) => (                           //This function creates rows dynamically for each item of data array
    <tr key={rowIndex} className={`hover:bg-blue-50 ${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
      {COLUMNS.map(({ key }) => (
        <td key={key} className="px-6 py-4">{item[key]}</td>
      ))}
    </tr>
  );

  return (            //And finally after all the logic, here is the actual skeleton with necessary functions of the table
    <div className="overflow-x-auto shadow-md rounded-md">
      <table className="table-auto w-full text-left border-collapse bg-white">
        <thead style={{ backgroundColor: "rgb(22, 32, 85)", color: "white" }}>
          <tr>
         {COLUMNS.map(({ key, label }) => (               //Creates columns by mapping 
              <th key={key} className="px-6 py-3 cursor-pointer" onClick={() => onSort(key)}>{label} {sortIndicator(key)}</th>  //calls onSort function with column's key when clicked, for sorting
            ))}
          </tr>
        </thead>
        <tbody>{data.length > 0 ? (data.map(rowRender)) : (        
            <tr>
                <td colSpan={COLUMNS.length} className="px-6 py-4 text-center text-gray-500">No data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
