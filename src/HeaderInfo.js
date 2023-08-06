import {useEffect, useState, useRef} from 'react';
import {ReactComponent as ExitSymbol} from './images/x-symbol.svg'
import {ReactComponent as InfoIcon} from './images/infoIcon.svg'
import Web3 from 'web3';
const HeaderInfo = () => {

    

    const [chain, setChain] = useState("Ethereum")
    const [aaveVersion, setAaveVersion] = useState("V3");
    const [modalSupplyVisible, setSupplyModalVisible] = useState(false);
    const [modalBorrowVisible, setBorrowModalVisible] = useState(false);
    const [tokenData, setTokenData] = useState(null);
    const [usdPriceEth, setUsdPriceEth] = useState(0);
    const [aavePosition, setAavePosition] = useState([]);
    const [endpoint , setEndpoint] = useState('https://api.thegraph.com/subgraphs/name/aave/protocol-v3')
    const [supplyTokensArray, setSupplyTokensArray] = useState([]);
    const [borrowTokensArray, setBorrowTokensArray] = useState([]);
    const [sliderTokensArray, setSliderTokensArray] = useState([]);
    const [healthFactor, setHealthFactor] = useState(0);
    const [queryCalled, setQueryCalled] = useState(false);

    function changeNetwork(newNetwork, newAaveVersion){
       
            setChain(newNetwork);
            setAaveVersion(newAaveVersion)
            // Aave V3
            if(newAaveVersion == "V3"){
                var tempNewEndpoint = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3';

                // Metis network endpoint is different from others.
                if(newNetwork == "Metis"){
                    tempNewEndpoint = "https://andromeda.thegraph.metis.io/subgraphs/name/aave/protocol-v3-metis"
                }
                else if(newNetwork != "Ethereum"){
                    tempNewEndpoint += ('-'+(newNetwork.toLowerCase()));
                }
            }
            // Aave V2
            else{
                var tempNewEndpoint = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3';
               
                // Matic network endpoint is different from others.
                if(newNetwork == "Polygon"){
                    tempNewEndpoint = "https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic";
                }
                else if (newNetwork != "Ethereum"){
                    tempNewEndpoint += ('-'+(newNetwork.toLowerCase()));
                }
                
            }
            setEndpoint(tempNewEndpoint);
           
    }

    useEffect(() => {
        // This effect will run when the component mounts and whenever the endpoint changes
        if (endpoint !== null) {
          console.log(endpoint);
          clearAllSupplyAndBorrowData();
          getTokens();
        }
      }, [endpoint]);

    
    function test(){
        console.log(supplyTokensArray, borrowTokensArray);
    }


    // Query the graph for the tokens that can be supplied/borrowed for a given network
    // Retrieve each token's symbol and price.
    async function getTokens(){
        const { request } = require('graphql-request');
        const query = `
        {
            reserves(where: {isFrozen: false}) {
              symbol
              borrowingEnabled
              usageAsCollateralEnabled
              reserveLiquidationThreshold
              price {
                priceInEth
              }
            }
            priceOracles {
              usdPriceEth
            }
          }
        `;
        try {
            const data = await request(endpoint, query);

            for (const index in data.reserves) {
              const token = data.reserves[index];
              const decimalConvert = Math.pow(10, 8);
              token.price.priceInUSD = token.price.priceInEth / decimalConvert;
              
            }
            
            setUsdPriceEth(data.priceOracles[0].usdPriceEth);
            setTokenData(data.reserves);
           
          } catch (error) {
            console.error('Error fetching token info:', error);
          }
    }

    const symbols = ['WBTC', "LDO", "wstETH", "rETH", "cbETH"]
    const [oraclePrices, setOraclePrices] = useState([]);
    
    async function getMissingPricesMainnet() {
        const web3ProviderUrl = `https://mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
        const web3 = new Web3(web3ProviderUrl);
        const contractABI = [{"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DecimalsAboveLimit","type":"error"},{"inputs":[],"name":"DecimalsNotEqual","type":"error"},{"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
        const oracleAddresses = ['0x230E0321Cf38F09e247e50Afc7801EA2351fe56F', '0xb01e6C9af83879B8e06a092f0DD94309c0D497E4', '0x8B6851156023f4f5A66F68BEA80851c3D905Ac93', '0x05225Cd708bCa9253789C1374e4337a019e99D56','0x5f4d15d761528c57a5C30c43c1DAb26Fc5452731'];

        // For each oracle, retrieve the latest token price.
        var tempOraclePrices = [];
        for(const index in oracleAddresses){
            const oracle = oracleAddresses[index];
            const contract = new web3.eth.Contract(contractABI, oracle);
            try {
                const result = await contract.methods.latestAnswer().call();
                tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
                
                
                } catch (error) {  
            }
        }
        setOraclePrices(tempOraclePrices);

    }


    function setMissingPrices(){
        if(chain == "Ethereum" && aaveVersion == "V3"){
            for(const index in oraclePrices){
                const foundObject = tokenData.find((item) => item.symbol === symbols[index]);
                foundObject.price.priceInUSD = oraclePrices[index];
            }
            // Set $GHO token price to $1, since it does not use an Oracle
            const foundObject = tokenData.find((item) => item.symbol === "GHO");
            foundObject.price.priceInUSD = 1;
            setTokenData(tokenData);
        }
    }
    
    useEffect(() => {
        // When oraclePrices state is updated, set the missing prices
        if (oraclePrices.length > 0 && tokenData.length > 0) {
            console.log(tokenData);
            setMissingPrices();
        }
    
        // Add tokens to supply and borrow lists
        addTokensToLists();
      }, [oraclePrices, tokenData]);


    
    // Clear all the supplied and borrowed data. 
    // Including which tokens are being supplied/borrowed, sliders, and general info
    function clearAllSupplyAndBorrowData(){
        console.log("Clearing...");
        
        // Reset supply, borrow, and slider divs
        const supplyTokens = document.getElementById("assets_supply_tokens_list");
        const borrowTokens = document.getElementById("assets_borrow_tokens_list");
        const sliderDiv = document.getElementById("values_container_list");
        supplyTokens.innerHTML = "";
        borrowTokens.innerHTML = "";
        sliderDiv.innerHTML = "";

        // Set all switch buttons to false
        for (const index in tokenData){
            const key = tokenData[index];
            if(key.usageAsCollateralEnabled){
                updateSwitchButton(key.symbol, true , false);
            }
            if(key.borrowingEnabled){
                updateSwitchButton(key.symbol, false , false);
            }
            
            
        }

        // Reset supply, borrow, and slider information
        setAavePosition([]);
        setSupplyTokensArray([]);
        setBorrowTokensArray([]);
        setSliderTokensArray([]);

        // Reset net worth
        const netWorthDiv = document.getElementById("info_container_bottom_netWorth_value");
        netWorthDiv.textContent = 0;

        // Reset Health Factor
        const healthFactorDiv = document.getElementById("info_container_bottom_healthFactorValue");
        healthFactorDiv.style.color = "white";
        setHealthFactor(0);

        // Reset LTV
        const ltvDiv = document.getElementById("info_container_bottom_ltv");
        ltvDiv.textContent = "0.00%";

        // Hide supply info
        const pTag = document.getElementById("assets_supply_nothing");
        const headerTag = document.getElementById("assets_supply_header");
        const supplyInfo = document.getElementById("assets_supply_info_box_left");
        pTag.style.display = "flex";
        headerTag.style.display = "none";
        supplyInfo.style.display = "none";

        // Hide borrow info
        const pTag1 = document.getElementById("assets_borrow_nothing");
        const headerTag1 = document.getElementById("assets_borrow_header");
        const borrowInfo1 = document.getElementById("assets_borrow_info");
        pTag1.style.display = "flex";
        headerTag1.style.display = "none";
        borrowInfo1.style.display = "none";

    }

    // Query the graph for a user's Aave position on the current network
    function queryAddressForUserPosition(){
        clearAllSupplyAndBorrowData();
        const address = document.getElementById("search_div_input").value.toLowerCase();
        const { request } = require('graphql-request');
        const query = `
        {
            userReserves(where: {user: "${address}"}) {
              currentTotalDebt
              currentATokenBalance
              reserve {
                decimals
                symbol
                price {
                  priceInEth
                }
              }
            }
          }
        `;
        request(endpoint, query)
        .then((data) => {
            console.log(data.userReserves);
            setAavePosition(data.userReserves);
            setQueryCalled(true);    
        })
        .catch((error) => {
            displayErrorMessage(`Error: invalid address`);
            console.error(error);
        });

       
    }


    function updatePositions(){
        if(aavePosition.length != 0){
            for(const index in aavePosition){
                var key = aavePosition[index];

                if(key.currentATokenBalance != "0"){
                    var foundObject = tokenData.find((item) => item.symbol === key.reserve.symbol);
                    if(foundObject.usageAsCollateralEnabled){
                        foundObject.supplyAmount = key.currentATokenBalance / Math.pow(10, key.reserve.decimals);
                        tempAddSupplySide(foundObject);
                        updateSwitchButton(key.reserve.symbol, true, true);
                    }
                }
                if(key.currentTotalDebt != "0"){
                    var foundObject = tokenData.find((item) => item.symbol === key.reserve.symbol);
                    foundObject.borrowAmount = key.currentTotalDebt / Math.pow(10, key.reserve.decimals);
                    tempAddBorrowSide(foundObject);                
                    updateSwitchButton(key.reserve.symbol, false, true);
                }
            }
            //addSupplySide();
            addBorrowSide();
            //calculateCurrentHealthValue();
            //displayTotalSuppliedOrBorrowed(0);
            //displayTotalSuppliedOrBorrowed(1)

        }
        else{
            displayErrorMessage(`Error: address does not own an Aave position on the ${chain} network`);
        }
    }
    
    useEffect(() => {
        if(supplyTokensArray.length != 0){
            addSupplySide();
        }
        
    },[supplyTokensArray]);
    
    // Run updatePositions() only if the arrays have been emptied, and a new aavePosition is found
    useEffect(() => {
        if(supplyTokensArray.length == 0 && borrowTokensArray.length == 0 && sliderTokensArray.length == 0 && queryCalled == true){
            updatePositions();
            setQueryCalled(false);
        }
       
    }, [aavePosition, supplyTokensArray, borrowTokensArray, sliderTokensArray]);


    function updateSwitchButton(tokenSymbol, isSupplySide, newValue){
        if(isSupplySide){
            const inputDiv = document.getElementById("supply_input_button_" + tokenSymbol);
            inputDiv.checked = newValue;
        }
        else{
            const inputDiv = document.getElementById("borrow_input_button_" + tokenSymbol);
            inputDiv.checked = newValue;
        }
    }


    
    function setSupplyModalVisibilityFalse(){
        setSupplyModalVisible(false); 
    }
    function setSupplyModalVisibilityTrue(){
        setSupplyModalVisible(true);      
    }
    function setBorrowModalVisibilityTrue(){
        setBorrowModalVisible(true);
    }
    function setBorrowModalVisibilityFalse(){
        setBorrowModalVisible(false);   
    }

    // When the user clicks on the button, toggle between hiding and showing the dropdown content
    function showDropDown() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
    
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown_content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                }
            }
        }
    }

    // Adds tokens to the supply list modal
    function addTokensToLists(){
        
        const ulElementSupply = document.getElementById("modal_supply_content_scrollable_list");
        const ulElementBorrow = document.getElementById("modal_borrow_content_scrollable_list");
        ulElementSupply.innerHTML = "";
        ulElementBorrow.innerHTML = "";
        
        for (const key in tokenData) {
            /* -- SUPPLY SIDE -- */
            const item = tokenData[key];
            if(item.usageAsCollateralEnabled){
                // Create outer div
                const outerDiv = document.createElement("div");
                // Add li element to div
                const liElement = document.createElement("li");
                liElement.textContent = `${item.symbol}`;
                outerDiv.appendChild(liElement);

                // Create switch buttons
                const label = document.createElement("label");
                label.classList.add("switch");
                label.style.backgroundColor = "rgb(41, 46, 65)";
                const input = document.createElement("input");
                input.type = "checkbox";
                input.id = "supply_input_button_" + item.symbol;
                label.appendChild(input);
                const span = document.createElement("span");
                span.classList.add("slider");
                label.appendChild(span);
                // Add event listener to switch buttons
                input.addEventListener('click', function() {
                    tempAddSupplySide(item);
                });
                outerDiv.appendChild(label);

                // Finally add the outer div element to the ul element
                ulElementSupply.appendChild(outerDiv);
            }

            /* -- BORROW SIDE -- */
            const item1 = tokenData[key];
                
            if(item1.borrowingEnabled){
                // Create outer div
                const outerDiv1 = document.createElement("div");
                // Add li element to div
                
                const liElement1 = document.createElement("li");
                liElement1.textContent = `${item1.symbol}`;
                outerDiv1.appendChild(liElement1);

                // Create switch buttons
                const label1 = document.createElement("label");
                label1.classList.add("switch");
                label1.style.backgroundColor = "rgb(41, 46, 65)";
                const input1 = document.createElement("input");
                input1.id = "borrow_input_button_" + item.symbol;
                input1.type = "checkbox";
                label1.appendChild(input1);
                const span1 = document.createElement("span");
                span1.classList.add("slider");
                label1.appendChild(span1);
                //Add event listener to switch button
                input1.addEventListener('click', function() {
                    tempAddBorrowSide(item1);
                });
                outerDiv1.appendChild(label1);

                // Finally add the outer div element to the ul element
                ulElementBorrow.appendChild(outerDiv1);
            }
        }
    }


    function tempAddSupplySide(tokenToAdd) {
        // Create a new copy of the array
        var tempSupplyArray = [...supplyTokensArray];
      
        const index = tempSupplyArray.indexOf(tokenToAdd);
      
        if (index === -1) {
          tempSupplyArray.push(tokenToAdd);
          setSupplyTokensArray(tempSupplyArray);
          displaySlider(tokenToAdd);
        } else if (index !== -1) {
            console.log("ere");
          tempSupplyArray.splice(index, 1);
          setSupplyTokensArray(tempSupplyArray);
          removeSlider(tokenToAdd);
          removeTokenInfo(tokenToAdd, true);
        }
      }
      
      

    // Add tokens that are being selected in the borrow modal
    function tempAddBorrowSide(tokenToAdd){
        // Retrieve the current supply token array 
        var tempBorrowArray = borrowTokensArray;
        // Find the index of the item in the array
        const index = tempBorrowArray.indexOf(tokenToAdd);
        //console.log(borrowTokensArray);

        if(index == -1 ){
            tempBorrowArray.push(tokenToAdd);
            setBorrowTokensArray(tempBorrowArray);
            displaySlider(tokenToAdd);
        }
        // Check if the item exists in the array
        else if (index !== -1) {

            // Remove the item from the array
            tempBorrowArray.splice(index, 1);
            setBorrowTokensArray(tempBorrowArray);
            
            removeSlider(tokenToAdd);
            removeTokenInfo(tokenToAdd, false);
        }
        
    }

    // Remove a token from the supply or borrow side
    function removeTokenInfo(token, isSupplySide){
        
        if(isSupplySide && document.getElementById("supply_outer_div_" + token.symbol)){
            const outerDivToRemove = document.getElementById("supply_outer_div_" + token.symbol);
            outerDivToRemove.remove();
        }
        else if (!isSupplySide && document.getElementById("borrow_outer_div_" + token.symbol)){
            const outerDivToRemove = document.getElementById("borrow_outer_div_" + token.symbol);
            outerDivToRemove.remove();
        }
    }
    
    // Add tokens to the supply side from the selected tokens
    function addSupplySide() {
        const ulElement = document.getElementById("assets_supply_tokens_list");
        const pTag = document.getElementById("assets_supply_nothing");
        const headerTag = document.getElementById("assets_supply_header");
        const supplyInfo = document.getElementById("assets_supply_info_box_left");
        if(supplyTokensArray.length == 0){
            pTag.style.display = "flex";
            headerTag.style.display = "none";
            supplyInfo.style.display = "none";
        }
        else{
            pTag.style.display = "none";
            headerTag.style.display = "grid";
            supplyInfo.style.display = "flex";
 
            for (const token of supplyTokensArray) {
                console.log(token.symbol);
                // Check if the token has already been added to the list. If it exists, no need to rerender it. 
                // Otherwise it will lose past input values.
                const divElement = document.getElementById("supply_outer_div_" + token.symbol);
                if(!divElement){
                    //console.log("addsupplyside: ", token.symbol);
                    // Create outer div
                    const outerDiv = document.createElement("div");
                    outerDiv.id = "supply_outer_div_" + token.symbol;
                        
                    // Add li element to div
                    const liElement = document.createElement("li");
                    liElement.textContent = token.symbol;
                    outerDiv.appendChild(liElement);

                    // Add amount input to div
                    const amountElement = document.createElement("input");
                    amountElement.id = "supply_input_"+token.symbol;
                    
                    if(token.supplyAmount !== undefined){

                        amountElement.value = token.supplyAmount;
                    }
                    
                    amountElement.addEventListener("input", calculateCurrentHealthValue);
                    amountElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 0);});
                    amountElement.addEventListener("input", function() {displayPrice(token.symbol, 0, token.price.priceInUSD);});
                    amountElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(0);});
                    outerDiv.appendChild(amountElement);

                    // Add price input div
                    const priceElement = document.createElement("input");
                    priceElement.id = "supply_price_"+token.symbol;
                    priceElement.value = 0;
                    priceElement.addEventListener("input", function() {adjustSliderValue(token.symbol, true, token.price.priceInUSD);});
                    priceElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 2);});
                    priceElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(0);});
                    priceElement.addEventListener("input", calculateCurrentHealthValue);
                    outerDiv.appendChild(priceElement);

                    // Add Value div (Price * Amount)
                    const valueElement = document.createElement("p");
                    valueElement.id = "supply_value_"+token.symbol;
                    valueElement.classList.add('supply_values');
                    valueElement.value = 0;
                    outerDiv.appendChild(valueElement);

                    // Finally add the outer div element to the ul element
                    ulElement.appendChild(outerDiv);
                    
                }
                displayPrice(token.symbol, 0, token.price.priceInUSD);
                calculateTokenValue(token.symbol, 0);
  
            }
        }
        setSupplyModalVisible(false);
    }

    // Add tokens to the borrow side from the selected tokens
    function addBorrowSide() {
        const ulElement = document.getElementById("assets_borrow_tokens_list");
        const pTag = document.getElementById("assets_borrow_nothing");
        const headerTag = document.getElementById("assets_borrow_header");
        const borrowInfo = document.getElementById("assets_borrow_info");

        if(borrowTokensArray.length == 0){
            pTag.style.display = "flex";
            headerTag.style.display = "none";
            borrowInfo.style.display = "none";
            
        }
        else{
            pTag.style.display = "none";
            headerTag.style.display = "grid";
            borrowInfo.style.display = "flex";
            
            for (const token of borrowTokensArray) {
                
            // Check if the token has already been added to the list. If it exists, no need to rerender it. 
            // Otherwise it will lose past input values.
            const divElement = document.getElementById("borrow_outer_div_" + token.symbol);
                
                if(!divElement){
                    // Create outer div
                    const outerDiv = document.createElement("div");
                    outerDiv.id = "borrow_outer_div_" + token.symbol;

                    // Add li element to div
                    const liElement = document.createElement("li");
                    liElement.textContent = token.symbol;
                    outerDiv.appendChild(liElement);
                    
                    // Add amount input to div
                    const amountElement = document.createElement("input");
                    amountElement.id = "borrow_input_"+token.symbol;
                    if(token.borrowAmount !== undefined){
                        amountElement.value = token.borrowAmount;
                    }

                    amountElement.addEventListener("input", calculateCurrentHealthValue);
                    amountElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 1);}); 
                    amountElement.addEventListener("input", function() {displayPrice(token.symbol, 1, token.price.priceInUSD);});
                    amountElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(1);});
                    outerDiv.appendChild(amountElement);

                    // Add price div
                    const priceElement = document.createElement("input");
                    priceElement.id = "borrow_price_"+token.symbol;
                    priceElement.value = 0;
                    priceElement.addEventListener("input", function() {adjustSliderValue(token.symbol, false, token.price.priceInUSD);});
                    priceElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 2);});
                    priceElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(1);});
                    priceElement.addEventListener("input", calculateCurrentHealthValue);
                    outerDiv.appendChild(priceElement);

                    // Add Value div (Price * Amount)
                    const valueElement = document.createElement("p");
                    valueElement.id = "borrow_value_"+token.symbol;
                    valueElement.classList.add('borrow_values');
                    valueElement.value = 0;
                    outerDiv.appendChild(valueElement);

                    // Finally add the outer div element to the ul element
                    ulElement.appendChild(outerDiv);
                }
                displayPrice(token.symbol, 1, token.price.priceInUSD);
                calculateTokenValue(token.symbol, 1);
            
            }

        }
        setBorrowModalVisible(false);
    }



    function removeSlider(token){
        const sliderToRemove = document.getElementById("slider_"+token.symbol);

        var tempArray = sliderTokensArray;
        var tempArray1 = supplyTokensArray;
        var tempArray2 = borrowTokensArray;

        const index = tempArray.indexOf(token);
        const index1 = tempArray1.indexOf(token);
        const index2 = tempArray2.indexOf(token);

        if (index1 == -1 && index2 == -1) {
            tempArray.splice(index, 1);
            setSliderTokensArray(tempArray);
            sliderToRemove.remove();
        }
        
        const sliderHeader = document.getElementById('values_container_header');
        const sliderEmptyText = document.getElementById('values_container_empty');

        if(tempArray.length == 0){
            sliderHeader.style.display = "none";
            sliderEmptyText.style.display = "block";
        }
    }

    


    function displaySlider(token){
        var tempArray = sliderTokensArray;
        const index = tempArray.indexOf(token);

        const sliderHeader = document.getElementById('values_container_header');
        const sliderEmptyText = document.getElementById('values_container_empty');
        sliderHeader.style.display = "grid";
        sliderEmptyText.style.display = "none";

        if (index == -1) {
            
            const sliderList = document.getElementById("values_container_list");

            // Create outer div
            const outerDiv = document.createElement("div");
            outerDiv.classList.add('outer_div')
            outerDiv.id = "slider_" + token.symbol;

            // Add li element to div
            const liElement = document.createElement("li");
            liElement.textContent = token.symbol.toUpperCase();
            outerDiv.appendChild(liElement);

            // Create sliderOuterDiv
            const sliderOuterDiv = document.createElement("div");
            sliderOuterDiv.classList.add('slider_outer_div');

            // Create top div for price and percentage
            const sliderTopDiv =  document.createElement("div");
            sliderTopDiv.classList.add("slider_div_top");

            // Create price p element
            const priceElement = document.createElement("p");
            priceElement.textContent = token.price.priceInUSD;
            priceElement.id = 'slider_outer_top_price_' + token.symbol;

            // Create percentage p element
            const percentageElement = document.createElement("p");
            percentageElement.textContent = "(0%)";
            percentageElement.id = 'slider_outer_top_percent_' + token.symbol;

            // Create price change p element
            const priceChangeElement = document.createElement("p");
            priceChangeElement.textContent = "(+0)";
            priceChangeElement.id = 'slider_outer_top_priceChange_' + token.symbol;
            
            
            // Create value slider and add to sliderOuterDiv
            const valueInputElement = document.createElement("input");
            valueInputElement.type = "range";
            valueInputElement.min = "0";
            valueInputElement.step="0.01"
            valueInputElement.max = (token.price.priceInUSD * 3);
            valueInputElement.value = token.price.priceInUSD;
            valueInputElement.id = "slider_input_"+token.symbol;
            valueInputElement.classList.add('slider_input');
            valueInputElement.addEventListener("input", calculateCurrentHealthValue);
            valueInputElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 2);});
            valueInputElement.addEventListener("input", function() {displayPrice(token.symbol, 2, token.price.priceInUSD);});
            valueInputElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(2);});

            // Create div below the slider
            const sliderBottomDiv = document.createElement("div");
            sliderBottomDiv.classList.add('slider_div_bottom');

            // Create p tags for the min and max values
            const lowValueText = document.createElement("p");
            lowValueText.id = 'slider_div_top_min_max';
            lowValueText.textContent = "$ 0";
            const maxValueText = document.createElement("p");
            maxValueText.id = 'slider_div_top_min_max';
            maxValueText.textContent = '$ ' + (token.price.priceInUSD*3).toFixed(2);

            sliderBottomDiv.appendChild(lowValueText);
            sliderBottomDiv.appendChild(maxValueText);

            sliderTopDiv.appendChild(priceElement);
            sliderTopDiv.appendChild(percentageElement);
            sliderTopDiv.appendChild(priceChangeElement);
            
            sliderOuterDiv.appendChild(sliderTopDiv);
            sliderOuterDiv.appendChild(valueInputElement);
            sliderOuterDiv.appendChild(sliderBottomDiv);

            outerDiv.appendChild(sliderOuterDiv);
            
            const thresholdInputElement = document.createElement("input");
            thresholdInputElement.type = "number";
            thresholdInputElement.min = 0;
            thresholdInputElement.max = 100;
            thresholdInputElement.step = 1;
            thresholdInputElement.value = token.reserveLiquidationThreshold/100;
            thresholdInputElement.addEventListener("input", calculateCurrentHealthValue);
            thresholdInputElement.id = "threshold_input_"+token.symbol;
           
            outerDiv.appendChild(thresholdInputElement);

            // Finally add the outer div element to the sliderList 
            sliderList.appendChild(outerDiv);

            tempArray.push(token);
            setSliderTokensArray(tempArray);
        }
    }

    // Calculate the Value of a borrow/supply, and update the display
    function calculateTokenValue(tokenID, caller){

        // Get the price from the slider input 
        const price = document.getElementById("slider_input_"+tokenID).value;

        // Update supply side
        if(caller == 0){
            const amount = document.getElementById("supply_input_"+tokenID).value;
            const valueElement = document.getElementById("supply_value_"+tokenID);
            valueElement.textContent = (amount*price).toFixed(2) + " USD";
            valueElement.value = (amount*price)
        }
        // Update borrow side
        else if (caller == 1){
            const amount = document.getElementById("borrow_input_"+tokenID).value;
            const valueElement = document.getElementById("borrow_value_"+tokenID);
            valueElement.textContent = (amount*price).toFixed(2)+ " USD";
            valueElement.value = (amount*price)
        }
        
        else if (caller == 2){
            // Caller is from slider. Potentially update both sides.
            // First check the supply/borrow divs exist first 
            const supplyDiv= document.getElementById("supply_input_"+tokenID);
            if(supplyDiv){
                const valueElement = document.getElementById("supply_value_"+tokenID);
                valueElement.textContent = (supplyDiv.value * price).toFixed(2) + " USD";
                valueElement.value = (supplyDiv.value * price);

            }
            const borrowDiv = document.getElementById("borrow_input_"+tokenID);
            if(borrowDiv){
                const valueElement = document.getElementById("borrow_value_"+tokenID);
                valueElement.textContent = (borrowDiv.value * price).toFixed(2) + " USD";
                valueElement.value = (borrowDiv.value * price);
            }
        }
    }

    // Update the token price in both or either the supply and borrow sides
    function displayPrice(tokenID, caller, currentTokenPrice){
        const price = document.getElementById("slider_input_"+tokenID).value;
        if(caller == 0){
            
            const priceElement = document.getElementById("supply_price_"+tokenID);
            priceElement.value = price;
        }
        else if (caller == 1){
            
            const priceElement = document.getElementById("borrow_price_"+tokenID);
            priceElement.value = price;

        }
        else if (caller == 2){
            
            const supplyDiv = document.getElementById("supply_price_"+tokenID);
            if(supplyDiv){
                
                supplyDiv.value = price;
            }
            const borrowDiv = document.getElementById("borrow_price_"+tokenID);
            if(borrowDiv){
                
                borrowDiv.value = price;
            }

        }

        // Change price
        const sliderPrice = document.getElementById('slider_outer_top_price_' + tokenID);
        sliderPrice.textContent = "$" +price;

        // Change percent value
        const sliderPercent = document.getElementById('slider_outer_top_percent_' + tokenID);
        if((price /currentTokenPrice) * 100 >= 100){
            sliderPercent.textContent = "(+" + ((price /currentTokenPrice -1) * 100).toFixed(2) + "%)" ;
            sliderPercent.style.color = "green";
        }
        else{
            sliderPercent.textContent = "(" + ((price /currentTokenPrice - 1)*100).toFixed(2) + "%)" ;
            sliderPercent.style.color = "red";
        }

        // Change +/- value
        const sliderPriceChange = document.getElementById('slider_outer_top_priceChange_' + tokenID);
        if(price - currentTokenPrice >= 0){
            sliderPriceChange.textContent = "(+$" +(price - currentTokenPrice).toFixed(2) + ")";
            sliderPriceChange.style.color = "green";
        }
        else{
            sliderPriceChange.textContent = "(-$" + Math.abs((price - currentTokenPrice)).toFixed(2) + ")";
            sliderPriceChange.style.color = "red";
        }
        
    }

    // Update the token price in the slider, and possibly the borrow/supply side
    function adjustSliderValue(tokenID, isSupplySide, currentTokenPrice){
        const slider = document.getElementById("slider_input_"+tokenID);
        const supply = document.getElementById("supply_price_"+tokenID);
        const borrow = document.getElementById("borrow_price_"+tokenID);
        const sliderPrice = document.getElementById('slider_outer_top_price_' + tokenID);
        const sliderPercent = document.getElementById('slider_outer_top_percent_' + tokenID);
        const sliderPriceChange = document.getElementById('slider_outer_top_priceChange_' + tokenID);
        var price;
        if(isSupplySide){
            price = supply.value;
            if(price == ""){
                price = 0;
            }
            if(borrow){
                borrow.value = price;
            }
            slider.value = price;
            sliderPrice.textContent = price;

            // Change percent value    
            if((price /currentTokenPrice) * 100 >= 100){
                sliderPercent.textContent = "(+" + ((price /currentTokenPrice) * 100).toFixed(2) + "%)" ;
                sliderPercent.style.color = "green";
            }
            else{
                sliderPercent.textContent = "(" + ((price /currentTokenPrice - 1)*100).toFixed(2) + "%)" ;
                sliderPercent.style.color = "red";
            }

            // Change +/- value
            if(price - currentTokenPrice >= 0){
                sliderPriceChange.textContent = "(+$" +(price - currentTokenPrice).toFixed(2) + ")";
                sliderPriceChange.style.color = "green";
            }
            else{
                sliderPriceChange.textContent = "(-$" + Math.abs((price - currentTokenPrice)).toFixed(2) + ")";
                sliderPriceChange.style.color = "red";
            }

            
            
        }
        else{
            price = borrow.value;
            if(price == ""){
                price = 0;
            }
            if(supply){
                supply.value = price;
            }

            // Change price value
            slider.value = price;
            sliderPrice.textContent = price;

            // Change percent value
            if((price /currentTokenPrice) * 100 >= 100){
                sliderPercent.textContent = "(+" + ((price /currentTokenPrice - 1) * 100).toFixed(2) + "%)" ;
                sliderPercent.style.color = "green";
            }
            else{
                sliderPercent.textContent = "(" + ((price /currentTokenPrice - 1)*100).toFixed(2) + "%)" ;
                sliderPercent.style.color = "red";
            }

            // Change +/- value
            if(price - currentTokenPrice >= 0){
                sliderPriceChange.textContent = "(+$" + (price - currentTokenPrice).toFixed(2) + ")";
                sliderPriceChange.style.color = "green";
            }
            else{
                sliderPriceChange.textContent = "(-$" + Math.abs((price - currentTokenPrice)).toFixed(2) + ")";
                sliderPriceChange.style.color = "red";
            }
        }

    }

    function displayTotalSuppliedOrBorrowed(caller){
        
        // Calculate and update total value supplied 
        const supplyElements = document.getElementsByClassName("supply_values");
        var supplySum = 0;
        for (let i = 0; i < supplyElements.length; i++) {
            const divElement = supplyElements[i];
            supplySum += divElement.value;
        }
        const totalSupplyDiv = document.getElementById("info_container_bottom_totalSupplied");
        totalSupplyDiv.textContent = supplySum.toFixed(2);

        // Calculate and update total value borrowed 
        const borrowElements = document.getElementsByClassName("borrow_values");
        var borrowSum = 0;
        for (let i = 0; i < borrowElements.length; i++) {
            const divElement = borrowElements[i];
            borrowSum += divElement.value;
        }
        const totalBorrowDiv = document.getElementById("info_container_bottom_totalBorrowed");
        totalBorrowDiv.textContent = borrowSum.toFixed(2);
    
        // Calculate and update Loan-to-Value ratio (Total Supplied / Total borrowed)
        const ltvDiv = document.getElementById("info_container_bottom_ltv");
        if(isNaN(borrowSum/supplySum)){
            ltvDiv.textContent = "0%";
        }
        else{
            ltvDiv.textContent = (borrowSum/supplySum*100).toFixed(2) + "%";
        }

        // Calculate and update Net Worth 
        const netWorthDiv = document.getElementById("info_container_bottom_netWorth_value");
        netWorthDiv.textContent = ((supplySum - borrowSum).toFixed(2).toLocaleString('en-US'));

    }

    // Calculate the current health value
    function calculateCurrentHealthValue(){
        var denominator = 0;
        // Calculate the Denominator: ∑ ( Collateral[ith] × LiquidationThreshold[ith] )
        
        for(var i = 0; i < supplyTokensArray.length; i++){
            
            const token = supplyTokensArray[i];
            const inputAmount = document.getElementById("supply_input_"+token.symbol).value;
            const currentPrice = document.getElementById("slider_input_"+token.symbol).value;
            const liquidationThreshold = document.getElementById("threshold_input_"+token.symbol).value/100;
            denominator += (currentPrice * inputAmount) * liquidationThreshold;
        }
        
        // Calculate the Numerator: Total Borrows
        var totalBorrowValue = 0;
        for(var j = 0; j < borrowTokensArray.length; j++){
            const token = borrowTokensArray[j];
            const inputAmount = document.getElementById("borrow_input_"+token.symbol).value;
            const currentPrice = document.getElementById("slider_input_"+token.symbol).value;
            totalBorrowValue += (inputAmount * currentPrice);
        }
        console.log(denominator, totalBorrowValue);
        var healthFactor = (denominator/totalBorrowValue).toFixed(2);
        const healthFactorDiv = document.getElementById("info_container_bottom_healthFactorValue");
        if(isNaN(healthFactor)){
            healthFactor = 0;
        }
        if(!isFinite(healthFactor)){
            healthFactor = "∞";
        }

        
        if(healthFactor <= 1.1){
            healthFactorDiv.style.color = "red";
        }
        else if (healthFactor <= 3){
            healthFactorDiv.style.color = "orange";
        }
        else{
            healthFactorDiv.style.color = "green";
        }
    
        setHealthFactor(healthFactor);
    }

    function displayErrorMessage(message) {
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerText = message;
        errorContainer.style.opacity = 1; // Ensure the container is visible
        errorContainer.style.display = 'block';
        // Set a timeout to fade out the error message after the specified duration
        setTimeout(() => {
          errorContainer.style.opacity = 0; // Fade out the error message
        }, 5000);
    }
    
    const isGetMissingPricesMainnetCalled = useRef(false);
    useEffect(() => {
        const svg = document.getElementById("info_container_top_netWorth_icon");
        const textBox = document.getElementById("textbox");
    
        svg.addEventListener("click", () => {
        textBox.style.display = "block";
        });
    
        document.addEventListener("click", (event) => {
        if (!svg.contains(event.target) && !textBox.contains(event.target)) {
            textBox.style.display = "none";
        }
        });
    
        getTokens();
        if (!isGetMissingPricesMainnetCalled.current) {
            getMissingPricesMainnet();
            isGetMissingPricesMainnetCalled.current = true;
        }
        handleResize();
        function handleResize() {
            const supplyDiv = document.getElementById("assets_supply").offsetWidth;
            const borrowDiv = document.getElementById("assets_borrow").offsetWidth;
            const sliderDiv = document.getElementById("values_container");
            const infoDiv = document.getElementById("info_container");
            sliderDiv.style.width = `${supplyDiv + borrowDiv-7}px`;
            infoDiv.style.width = `${supplyDiv + borrowDiv+15}px`;
            
        }
        // Attach the event listener for window resize
        window.addEventListener('resize', handleResize);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );


    return ( 
        <div className='headerInfo'>
            <div className={`modal_supply ${modalSupplyVisible ? 'visible' : ''}`} id="modal_supply">

                <div className = "modal_supply_content">
                    <div className="modal_supply_content_header">
                        <p>Assets to Supply</p>
                        <ExitSymbol className = "modal_supply_exit" onClick = {setSupplyModalVisibilityFalse}/>
                    </div>

                    <div className="modal_supply_content_assets">
                        <div className="modal_supply_content_assets_labels">
                            <p>Assets</p>
                            <p>Supply</p>
                        </div>
                        <div className="modal_supply_content_assets_grid">
                            <div className="modal_supply_content_scrollable">
                                <ul id = "modal_supply_content_scrollable_list" className = "modal_supply_content_scrollable_list"></ul>
                            </div>
                            <div className = "modal_supply_content_assets_bottom">
                                <button className = "modal_supply_content_assets_bottom_btn" onClick = {addSupplySide}>Add Supply Tokens</button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div className={`modal_borrow ${modalBorrowVisible ? 'visible' : ''}`} id="modal_borrow">
                <div className = "modal_borrow_content">
                    <div className="modal_borrow_content_header">
                        <p>Assets to Borrow</p>
                        <ExitSymbol className = "modal_borrow_exit" onClick = {setBorrowModalVisibilityFalse}/>
                    </div>

                    <div className="modal_borrow_content_assets">
                        <div className="modal_borrow_content_assets_labels">
                            <p>Assets</p>
                            <p>Borrow</p>
                        </div>
                        <div className="modal_borrow_content_assets_grid">
                            <div className="modal_borrow_content_scrollable">
                                <ul id = "modal_borrow_content_scrollable_list" className = "modal_borrow_content_scrollable_list">
                                </ul>
                            </div>
                            <div className = "modal_borrow_content_assets_bottom">
                                <button className = "modal_borrow_content_assets_bottom_btn" onClick = {addBorrowSide}>Add Borrow Tokens</button>
                            </div>
                         </div>
                    </div>

                </div>
            </div>
            <div className = "drop">
                <div className="dropdown" >
                    <div className = "dropDown_text">
                        <div onClick={showDropDown} className="dropbtn">{chain} Market</div>
                        <div className="dropdown_version" >
                            <p className="dropdown_version_text" id = "dropdown_version_text"  >{aaveVersion} </p>
                        </div>
                    </div>
                    <div id="myDropdown" className="dropdown_content">
                        <p className = "dropdown_content_text">Select Aave Market</p>
                        <a href="#" onClick={ () => changeNetwork("Ethereum", "V3") }>Ethereum</a>
                        <a href="#" onClick={ () => changeNetwork("Arbitrum", "V3") }>Arbitrum</a>
                        <a href="#" onClick={ () => changeNetwork("Avalanche", "V3") }>Avalanche</a>
                        <a href="#" onClick={ () => changeNetwork("Optimism", "V3") }>Optimism</a>
                        <a href="#" onClick={ () => changeNetwork("Polygon", "V3") }>Polygon</a>
                        <a href="#" onClick={ () => changeNetwork("Metis", "V3") }>Metis</a>
                        <a href="#" onClick={ () => changeNetwork("Ethereum", "V2") }>Ethereum V2</a>
                        <a href="#" onClick={ () => changeNetwork("Avalanche", "V2") }>Avalanche V2</a>
                        <a href="#" onClick={ () => changeNetwork("Polygon", "V2") }>Polygon V2</a>
                    </div>
                   
                </div>
            </div>
     
            <div className = "search">
                <div className = "search_div">
                    <input id = "search_div_input" className = "search_div_input"></input>
                    <button className = "search_div_button" onClick = {queryAddressForUserPosition}>Search</button>
                </div>
            </div>

   

            <div className ="b_s">
                <div className='info'>
                
                    <div className = "info_container" id='info_container'>
                    <div className = "info_container_outer"> 
                        <div className = "info_container_top">   
                            <div>
                                <p className = "info_container_top_netWorth">Net Worth</p> 
                                <InfoIcon className = "info_container_top_netWorth_icon" id ="info_container_top_netWorth_icon"></InfoIcon>
                                <div className="textbox" id="textbox">Value supplied minus value borrowed.</div>
                            </div>   
                            <div>
                                <p className = "info_container_top_healthFactor">Health Factor</p>
                                <InfoIcon className = "info_container_top_icon_healthFactor_icon"></InfoIcon>
                            </div>
                            <div>
                                <p className='info_container_top_ltv'>Current LTV</p>
                                <InfoIcon className = "info_container_top_icon_ltv_icon"></InfoIcon>
                            </div>
                            
                                                                                            
                        </div>
                        <div className = "info_container_bottom">
                            <div className = "info_container_bottom_netWorth">
                                <div className='info_container_bottom_netWorth_symbol'>$</div>
                                <div className="info_container_bottom_netWorth_value" id = "info_container_bottom_netWorth_value">0.00</div>
                            </div>
                            <div className = "info_container_bottom_healthFactorValue" id = "info_container_bottom_healthFactorValue">{healthFactor}</div>
                            <div className="info_container_bottom_ltv" id = "info_container_bottom_ltv">0.00%</div> 
                            
                        </div>
                    </div>     
                    </div>                         
                </div>

                <div className = "assets">
                    <div className = "assets_supply" id="assets_supply">
                        <div className = "assets_supply_top">
                            <p className = "assets_supply_top_header">Supplies</p>
                            <button className = "b_s_container_supply_btn" onClick = {setSupplyModalVisibilityTrue}>Supply</button>
                        </div>
                        <p className = "assets_supply_nothing" id = "assets_supply_nothing">Nothing supplied yet</p>
                        <div className = "assets_supply_info">
                            <div className = "assets_supply_info_box" id = "assets_supply_info_box">
                                <div className='assets_supply_info_box_left' id ="assets_supply_info_box_left">
                                    <p>Total Supplied $</p>   
                                    <div className="info_container_bottom_totalSupplied" id ="info_container_bottom_totalSupplied">0.00</div> 
                                </div>
                            </div>
                        </div>    
                        <div className = "assets_supply_header" id ="assets_supply_header">
                            <h3>Asset</h3>
                            <h3>Amount</h3>
                            <h3>Price</h3>
                            <h3>Value</h3>
                        </div>
                        <div className="assets_supply_tokens">
                            <ul id = "assets_supply_tokens_list" className = "assets_supply_tokens_list"></ul>
                        </div>
                        
                    </div>

                    <div className = "assets_borrow" id="assets_borrow">
                        <div className = "assets_borrow_top">
                            <p className = "assets_borrow_top_header">Borrows</p>
                            <button className = "b_s_container_borrow_btn" onClick = {setBorrowModalVisibilityTrue}>Borrow</button>
                        </div>
                        <p className = "assets_borrow_nothing" id = "assets_borrow_nothing">Nothing borrowed yet</p>
                        <div className = "assets_borrow_info" id = "assets_borrow_info">
                            <div className = "assets_borrow_info_box_left">
                                <div className = "assets_borrow_info_box_left_inner">
                                    <p>Total Borrowed $</p>  
                                    <div className="info_container_bottom_totalBorrowed" id = "info_container_bottom_totalBorrowed">0.00</div>
                                </div>
                            </div> 
                            <div className = "assets_borrow_info_box_right">
                                <p>Borrowing Power Used</p>  
                                <div className="info_container_bottom_borrowPower" id = "info_container_bottom_borrowPower">0.00%</div>
                            </div>  
                        </div>
               
                       
                        <div className = "assets_borrow_header" id = "assets_borrow_header">
                            <h3>Asset</h3>
                            <h3>Amount</h3>
                            <h3>Price</h3>
                            <h3>Value</h3>
                        </div>
                        <div className="assets_borrow_tokens">
                            <ul id = "assets_borrow_tokens_list" className = "assets_borrow_tokens_list"></ul>
                        </div>
                    </div>

                </div>

                <div className = "values" id ="values">
                    <div className = "values_container" id="values_container">
                        <p className='values_container_title'>Token Prices & Liquidation Thresholds</p>
                        <p className = "values_container_empty" id =  "values_container_empty">Nothing supplied or borrowed yet</p>
                        <div className = "values_container_header" id = "values_container_header">
                            <h3>Asset</h3>
                            <h3>Price</h3>
                            <h3>Liquidation Threshold %</h3>
                        </div>
                        <ul id = "values_container_list" className = "values_container_list"></ul>
                    
                    </div>
                </div>
            
                <div className="error-container" id="errorContainer"></div>
                <button onClick={test}>asdf</button>
            </div>
            
        </div>
        
     );
}
 
export default HeaderInfo;