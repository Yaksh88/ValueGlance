import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/ValueGlance.png";
import { CSVLink } from "react-csv";  //I used React's CSV to give functionality of exporting the data in the table
import Filters from "./Components/Filters.js"; //I have divided the components of this app in different files to avoid too much code in 1 file
import Table from "./Components/Table.js";
import Footer from "./Components/Footer.js"

//Following is the API we will be using to get data, it will be in JSON format so will be filtering according to our needs
 const API = "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=p11QiMrqItKa8zbGuWz2djieqLRSKIVt";



const App = () => {


//We defined useEfect hook to efficiently 
  useEffect(() => {
    const fetchData = async () => { //This function will get the data from the API we mentioned above
     try {                           
        const response = await axios.get(API); // 2 things here, await: we wait for data we are fetching and Axios: we are using axios to send request to API to get the data
        const responseData = response.data;    //After we get data we are storing it in a variable so that we can use it later
        setData(responseData);                //setData is a function used by useState to store the fetched data into data state variable, so we can use it in the app 
        setFilteredData(responseData);        //Same is here, we are storing the data in filteredData to use it later, especially after user applies filters, which helps us for filtering functionality
      } catch {                               //This is a catch block which is usually used to handle any errors, in our case if we are not able to fetch data from API, we will display the message in setError
        setError("Failed to fetch data. Please try again later.");
      }
   
   };
   
   fetchData();  //after writing the code for fetching data we are calling it here to actually run the defined function of fetching data
 }, []);

  //Following are some of the hooks we will be using to save the state of the data
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minRevenue: "",
    maxRevenue: "",
    minNetIncome: "",
    maxNetIncome: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" }); //The state variable holds the current sorting configuration, initially sorts by date in ascending order
  const [error, setError] = useState(null);                                         //This state variable is used to store any error message that can occur, is set to null at first, this is helpful while debugging
  
  const applyFilters = () => {                          //This function applies filters to financial data, it checks the values in the filters and applies filters accordingly
    let filtered = [...data];                           //here I created a copy of the original data array so that original data doesn't get modified

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter((item) => new Date(item.date) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filtered = filtered.filter((item) => new Date(item.date) <= endDate);
    }
    if (filters.minRevenue) {
      filtered = filtered.filter((item) => item.revenue >= Number(filters.minRevenue));
    }
    if (filters.maxRevenue) {
      filtered = filtered.filter((item) => item.revenue <= Number(filters.maxRevenue));
    }
    if (filters.minNetIncome) {
      filtered = filtered.filter((item) => item.netIncome >= Number(filters.minNetIncome));
    }
    if (filters.maxNetIncome) {
      filtered = filtered.filter((item) => item.netIncome <= Number(filters.maxNetIncome));
    }

    setFilteredData(filtered);                                //After applying all the filters the filtered data is stored in the filteredData state
  };

  
  const resetFilters = () => {                            //This is reset filters function, though this was not a requriement, I thought it would be better to have a reset button, as while I was testing app functionality I didn't like reloading entire page to clear the entered data in fields
    setFilters({
      startDate: "",
      endDate: "",
      minRevenue: "",
      maxRevenue: "",
      minNetIncome: "",
      maxNetIncome: "",
    });
    setFilteredData(data);             //this also resets the filteredData to original data to show full dataset
  };

  
  const sortData = (key) => {               //This arrow function sorts the filteredData based on a key, like data, revenue etc
    const isAscending = sortConfig.key === key && sortConfig.direction === "asc";   //Here I made if else condition to check if data is already sorted by given key in ascending order
    const direction = isAscending ? "desc" : "asc";                                 //If it is sorted in ascending order, we change direction to descending

    const sorted = [...filteredData].sort((a, b) => {                               //I created a sorted version of filteredData by comparing values of keys chosen
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });                  //this updates sortConfig with new sorting key and direction
    setFilteredData(sorted);                            //and finally update filteredData with sorted data
  };

  return (
    <div className="container mx-auto p-6">
      <header className="flex flex-col items-center justify-center mb-6">
        <img src={logo} alt="Value Dashboard Logo" className="h-16 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Financial Data Filter
        </h1>
      </header>
      {error ? (            //if else checks: if there's an error it will show error message,else it will show filters, table
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <>
          <Filters filters={filters} setFilters={setFilters} onApply={applyFilters} onReset={resetFilters} />
          <Table data={filteredData} sortConfig={sortConfig} onSort={sortData} />
          <div className="flex justify-center mt-6">
            <CSVLink                                                  //This functionality let's you get the data not just in the webapp but also in you everyday use, I thought about this option when I was thinking about what else can be a useful fetaure in terms of data, again not a requirement but thought could be useful
              data={filteredData}
              headers={[
                { 
                  label: "Date",
                  key: "date" 
                },
                { 
                  label: "Revenue", 
                  key: "revenue" 
                },
                { 
                  label: "Net Income", 
                  key: "netIncome" 
                },
                { 
                  label: "Gross Profit", 
                  key: "grossProfit" 
                },
                { 
                  label: "EPS", 
                  key: "eps" 
                },
                { 
                  label: "Operating Income", 
                  key: "operatingIncome" 
                },
              ]}
              filename={"financial_data.csv"}
              className="bg-gray-500 text-white font-bold px-6 py-3 rounded-md shadow-lg">
              Export in CSV
            </CSVLink>
          </div>
        </>
      )}
      <br />
      <Footer />     {/*Just a footer at first had no plans for this one, but recently while deploying one of my projects, my project got flagged by google saying it had some phishing content or they were not able to verify what was this project for, they thought something was being misused. Though that issue was resolved in the end , don't want to take chances with my assessment, So, apologies in advance if this footer doesn't look good didn't wanted it but better to have it ;) */}
    </div>
  );
};

export default App;
