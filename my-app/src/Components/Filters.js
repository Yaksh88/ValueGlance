import React from "react";


const FILTERS = [             //This is the filters array of objects defining filter fields
  { 
    label: "Start Date", 
    id: "startDate", 
    type: "date" 
  },
  { 
    label: "End Date", 
    id: "endDate", 
    type: "date" 
  },
  { 
    label: "Min Revenue", 
    id: "minRevenue", 
    type: "number" 
  },
  { 
    label: "Max Revenue", 
    id: "maxRevenue", 
    type: "number" 
  },
  { 
    label: "Min Net Income", 
    id: "minNetIncome", 
    type: "number" 
  },
  { 
    label: "Max Net Income", 
    id: "maxNetIncome", 
    type: "number" 
  },
];

const Filters = ({ filters, setFilters, onApply, onReset }) => {      //A functional React component creates a form for filtering data
  const handleInputChange = (id, value) => {                          //updates filters state when input field is used to search/filter
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const renderFilterField = ({ label, id, type }) => (                //This creates a filter input field based on the properties of filter object from FILTERS
    <div key={id}>
      <label
        className="block text-sm font-semibold text-gray-600 mb-2"
        htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="border rounded-md w-full p-3 text-gray-800 focus:outline-none focus:ring-0"
        value={filters[id]}
        onChange={(e) => handleInputChange(id, e.target.value)}/>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-md p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {FILTERS.map(renderFilterField)}      {/*Dynamically generates a filter input for eachh object in FILTERS array*/}
      <div className="col-span-1 md:col-span-3 flex justify-center gap-4">
        <button
          type="button"
          className="bg-[rgb(22,32,85)] hover:bg-opacity-100 text-white font-bold px-6 py-3 rounded-md shadow-lg transition hover:shadow-[0px_0px_10px_2px_rgba(22,32,85,0.3)]"
          onClick={onApply}>
          Apply Filters
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-opacity-100 text-white font-bold px-6 py-3 rounded-md shadow-lg transition hover:shadow-[0px_0px_10px_2px_rgba(22,32,85,0.3)]"
          onClick={onReset} >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
