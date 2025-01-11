# Under construction

from flask import Flask, request, jsonify   
import requests

app = Flask(__name__)   #app instance


API = "https://financialmodelingprep.com/api/v3/income-statement/0000320193?period=annual&apikey=p11QiMrqItKa8zbGuWz2djieqLRSKIVt"  

@app.route("/data", methods=["GET"])   #This is the endpoint with GET method to handle client request to fetch, filter and sort data we get from API
def get_financialData():
   
    minRevenue = request.args.get("minRevenue", type=float)        
    maxRevenue = request.args.get("maxRevenue", type=float)
    minNet = request.args.get("minNet", type=float)
    maxNet = request.args.get("maxNet", type=float)
    startDate = request.args.get("startDate")
    endDate = request.args.get("endDate") 
    sort = request.args.get("sort", "date")
    order = request.args.get("order", "asc")

    try:
        
        response = requests.get(API_URL)    #Fetches data from external financial API
        response.raise_for_status()         #raise exception if API request fails
        financialData = response.json()     #Converts reponse data into Python dictionary

        
        filtered_data = apply_filters(  #this function helps filter data based on query parameters
            data=financialData,
            startDate=startDate,
            endDate=endDate,
            minRevenue=minRevenue,
            maxRevenue=maxRevenue,
            minNet=minNet,
            maxNet=maxNet
        )

        
        sortedData = sortData(filtered_data, sort, order)     #this helps sort filtered data

        return jsonify({"success": True, "data": sortedData})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500    #Error handling


def apply_filters(data, startDate, endDate, minRevenue, maxRevenue,minNet, maxNet):     #This function filters data by criteri, it iterates over data and includes only items that match the conditions
    
    if startDate:
        data = [item for item in data if item["date"] >= startDate]
    if endDate:
        data = [item for item in data if item["date"] <= endDate]
    if minRevenue:
        data = [item for item in data if item["revenue"] >= minRevenue]
    if maxRevenue:
        data = [item for item in data if item["revenue"] <= maxRevenue]
    if minNet:
        data = [item for item in data if item["netIncome"] >=minNet]
    if maxNet:
        data = [item for item in data if item["netIncome"] <= maxNet]
    return data


def sortData(data, sort, order):        #Sorts data based on specified field and order
    
    reverse = order.lower() == "desc"
    return sorted(data, key=lambda x: x.get(sort, 0), reverse=reverse)


if __name__ == "__main__":      #starts flask application in debug mode had to use it while troubleshooting the problem
    app.run(debug=True)


 