import {useEffect, useState} from 'react';
import {ReactComponent as ExitSymbol} from './images/x-symbol.svg'
import {ReactComponent as InfoIcon} from './images/infoIcon.svg'


const HeaderInfo = (props) => {

    

    const [chain, setChain] = useState("Ethereum")
    const [modalSupplyVisible, setSupplyModalVisible] = useState(false);
    const [modalBorrowVisible, setBorrowModalVisible] = useState(false);
    var endpoint = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3';

    function changeNetwork(newNetwork, isVersion3){
        if(chain != newNetwork){
            setChain(newNetwork);
            // Aave V3
            if(isVersion3){
                endpoint = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3';
                if(newNetwork != "Ethereum"){
                    endpoint += ('-'+newNetwork.toLowerCase());
                }

            }
            // Aave V2
            else{
                endpoint = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2';
                if(newNetwork != "Ethereum"){
                    endpoint += ('-'+newNetwork.toLowerCase());
                }
                
            }
            
            console.log(endpoint);
        }
        
    }

    // Query the graph for the tokens that can be supplied/borrowed for a given network
    // Retrieve each token's symbol and price.
    function searchTokens(){
        const { request } = require('graphql-request');

    }

    // Query the graph for a user's aave position on a certain network
    function queryAddressForUserPosition(){
        const address = document.getElementById("search_div_input").value.toLowerCase();
        const { request } = require('graphql-request');
        const query = `
        query getUserPosition {
            userReserves(where: {user: "${address}"}) {
              currentATokenBalance
              id
              reserve {
                symbol
                baseLTVasCollateral
              }
            }
          }
        `;
        request(endpoint, query)
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error fetching user position:', error);
        });

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
            var dropdowns = document.getElementsByClassName("dropdown-content");
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
        
        for (const key in props.cryptoData) {
            // SUPPLY SIDE
            // Create outer div
            const outerDiv = document.createElement("div");
            // Add li element to div
            const item = props.cryptoData[key];
            const liElement = document.createElement("li");
            liElement.textContent = `${item.symbol}`.toUpperCase();
            outerDiv.appendChild(liElement);

            // Create switch buttons
            const label = document.createElement("label");
            label.classList.add("switch");
            label.style.backgroundColor = "rgb(41, 46, 65)";

            const input = document.createElement("input");
            input.type = "checkbox";
            label.appendChild(input);

            const span = document.createElement("span");
            span.classList.add("slider");
            label.appendChild(span);
            input.addEventListener('click', function() {
                tempAddSupplySide(item, this);
            });
            outerDiv.appendChild(label);

            // Finally add the outer div element to the ul element
            ulElementSupply.appendChild(outerDiv);

            // BORROW SIDE
            // Create outer div
            const outerDiv1 = document.createElement("div");
            // Add li element to div
            const item1 = props.cryptoData[key];
            const liElement1 = document.createElement("li");
            liElement1.textContent = `${item1.symbol}`.toUpperCase();
            outerDiv1.appendChild(liElement1);

            // Create switch buttons
            const label1 = document.createElement("label");
            label1.classList.add("switch");
            label1.style.backgroundColor = "rgb(41, 46, 65)";

            const input1 = document.createElement("input");
            input1.type = "checkbox";
            label1.appendChild(input1);

            const span1 = document.createElement("span");
            span1.classList.add("slider");
            label1.appendChild(span1);
            input1.addEventListener('click', function() {
                tempAddBorrowSide(item1, this);
            });
            outerDiv1.appendChild(label1);

            // Finally add the outer div element to the ul element
            ulElementBorrow.appendChild(outerDiv1);
        }
    }

    const [supplyTokensArray, setSupplyTokensArray] = useState([]);
    const [borrowTokensArray, setBorrowTokensArray] = useState([]);
    const [sliderTokensArray, setSliderTokensArray] = useState([]);
    const [healthFactor, setHealthFactor] = useState(0);

    // Add tokens that are being selected in the supply modal
    function tempAddSupplySide(tokenToAdd, thisBtn){
        // Retrieve the current supply token array 
        var tempSupplyArray = supplyTokensArray;
        // Find the index of the item in the array
        const index = tempSupplyArray.indexOf(tokenToAdd);

        // Item already exists in the array
        if (index !== -1) {
            // Remove the item from the array
            tempSupplyArray.splice(index, 1);
            thisBtn.style.backgroundColor = "rgb(56, 61, 81)";
            thisBtn.textContent = "Supply Asset"
            setSupplyTokensArray(tempSupplyArray);
            removeSlider(tokenToAdd);
            removeTokenInfo(tokenToAdd, true);
            
        }
        // Item does not exist in the array
        else{
            tempSupplyArray.push(tokenToAdd);
            thisBtn.style.backgroundColor = "#547a5c";
            thisBtn.textContent = "Supplied"
            setSupplyTokensArray(tempSupplyArray);
            displaySlider(tokenToAdd);
        }
    }

    // Add tokens that are being selected in the borrow modal
    function tempAddBorrowSide(tokenToAdd, thisBtn){
        // Retrieve the current supply token array 
        var tempBorrowArray = borrowTokensArray;
        // Find the index of the item in the array
        const index = tempBorrowArray.indexOf(tokenToAdd);

        // Check if the item exists in the array
        if (index !== -1) {
            // Remove the item from the array
            tempBorrowArray.splice(index, 1);
            thisBtn.style.backgroundColor = "rgb(56, 61, 81)";
            thisBtn.textContent = "Borrow Asset"
            setBorrowTokensArray(tempBorrowArray);
            removeSlider(tokenToAdd);
            removeTokenInfo(tokenToAdd, false);
        }
        else{
            tempBorrowArray.push(tokenToAdd);
            thisBtn.style.backgroundColor = "#547a5c";
            thisBtn.textContent = "Borrowed"
            setBorrowTokensArray(tempBorrowArray);
            displaySlider(tokenToAdd);
        }
    }

    // Remove a token from the supply or borrow side
    function removeTokenInfo(token, isSupplySide){
        if(isSupplySide && document.getElementById("supply_outer_div_" + token.id)){
            const outerDivToRemove = document.getElementById("supply_outer_div_" + token.id);
            outerDivToRemove.remove();
        }
        else if (!isSupplySide && document.getElementById("borrow_outer_div_" + token.id)){
            const outerDivToRemove = document.getElementById("borrow_outer_div_" + token.id);
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
                // Check if the token has already been added to the list. If it exists, no need to rerender it. 
                // Otherwise it will lose past input values.
                const divElement = document.getElementById("supply_outer_div_" + token.id);
                if(!divElement){
                    // Create outer div
                    const outerDiv = document.createElement("div");
                    outerDiv.id = "supply_outer_div_" + token.id;
                        
                    // Add li element to div
                    const liElement = document.createElement("li");
                    liElement.textContent = token.symbol.toUpperCase();
                    outerDiv.appendChild(liElement);

                    // Add amount input to div
                    const amountElement = document.createElement("input");
                    amountElement.id = "supply_input_"+token.id;
                    amountElement.addEventListener("input", calculateCurrentHealthValue);
                    amountElement.addEventListener("input", function() {calculateTokenValue(token.id, 0);});
                    amountElement.addEventListener("input", function() {displayPrice(token.id, 0, token.current_price);});
                    amountElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(0);});
                    outerDiv.appendChild(amountElement);

                    // Add price input div
                    const priceElement = document.createElement("input");
                    priceElement.id = "supply_price_"+token.id;
                    priceElement.value = 0;
                    priceElement.addEventListener("input", function() {adjustSliderValue(token.id, true, token.current_price);});
                    priceElement.addEventListener("input", function() {calculateTokenValue(token.id, 2);});
                    priceElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(0);});
                    outerDiv.appendChild(priceElement);

                    // Add Value div (Price * Amount)
                    const valueElement = document.createElement("p");
                    valueElement.id = "supply_value_"+token.id;
                    valueElement.classList.add('supply_values');
                    valueElement.value = 0;
                    outerDiv.appendChild(valueElement);

                    // Finally add the outer div element to the ul element
                    ulElement.appendChild(outerDiv);
                    
                }
                displayPrice(token.id, 0, token.current_price);
                calculateTokenValue(token.id, 0);
  
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
                const divElement = document.getElementById("borrow_outer_div_" + token.id);
                if(!divElement){
                    // Create outer div
                    const outerDiv = document.createElement("div");
                    outerDiv.id = "borrow_outer_div_" + token.id;

                    // Add li element to div
                    const liElement = document.createElement("li");
                    liElement.textContent = token.symbol.toUpperCase();
                    outerDiv.appendChild(liElement);
                    
                    // Add amount input to div
                    const amountElement = document.createElement("input");
                    amountElement.id = "borrow_input_"+token.id;
                    amountElement.addEventListener("input", calculateCurrentHealthValue);
                    amountElement.addEventListener("input", function() {calculateTokenValue(token.id, 1);}); 
                    amountElement.addEventListener("input", function() {displayPrice(token.id, 1, token.current_price);});
                    amountElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(1);});
                    outerDiv.appendChild(amountElement);

                    // Add price div
                    const priceElement = document.createElement("input");
                    priceElement.id = "borrow_price_"+token.id;
                    priceElement.value = 0;
                    priceElement.addEventListener("input", function() {adjustSliderValue(token.id, false, token.current_price);});
                    priceElement.addEventListener("input", function() {calculateTokenValue(token.id, 2);});
                    priceElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed(1);});
                    outerDiv.appendChild(priceElement);

                    // Add Value div (Price * Amount)
                    const valueElement = document.createElement("p");
                    valueElement.id = "borrow_value_"+token.id;
                    valueElement.classList.add('borrow_values');
                    valueElement.value = 0;
                    outerDiv.appendChild(valueElement);
                    // Finally add the outer div element to the ul element
                    ulElement.appendChild(outerDiv);
                }
                displayPrice(token.id, 1, token.current_price);
                calculateTokenValue(token.id, 1);
            }

        }
        setBorrowModalVisible(false);
    }

    
    function removeSlider(token){
        const sliderToRemove = document.getElementById(token.id);
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
            // Concat the borrow and supply arrays
            const sliderList = document.getElementById("values_container_list");

            // Create outer div
            const outerDiv = document.createElement("div");
            outerDiv.classList.add('outer_div')
            outerDiv.id = token.id;

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
            priceElement.textContent = token.current_price;
            priceElement.id = 'slider_outer_top_price_' + token.id;

            // Create percentage p element
            const percentageElement = document.createElement("p");
            percentageElement.textContent = "(0%)";
            percentageElement.id = 'slider_outer_top_percent_' + token.id;

            // Create price change p element
            const priceChangeElement = document.createElement("p");
            priceChangeElement.textContent = "(0+)";
            priceChangeElement.id = 'slider_outer_top_priceChange_' + token.id;
            
            
            // Create value slider and add to sliderOuterDiv
            const valueInputElement = document.createElement("input");
            valueInputElement.type = "range";
            valueInputElement.min = "0";
            valueInputElement.step="0.01"
            valueInputElement.max = (token.current_price * 3);
            valueInputElement.value = token.current_price;
            valueInputElement.id = "slider_input_"+token.id;
            valueInputElement.classList.add('slider_input');
            valueInputElement.addEventListener("input", calculateCurrentHealthValue);
            valueInputElement.addEventListener("input", function() {calculateTokenValue(token.id, 2);});
            valueInputElement.addEventListener("input", function() {displayPrice(token.id, 2, token.current_price);});
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
            maxValueText.textContent = '$ ' + (token.current_price*3).toFixed(2);

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
            thresholdInputElement.value = 75;
            thresholdInputElement.addEventListener("input", calculateCurrentHealthValue);
            thresholdInputElement.id = "threshold_input_"+token.id;
           
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
        netWorthDiv.textContent = (supplySum - borrowSum).toFixed(2);

    }

    // Calculate the current health value
    function calculateCurrentHealthValue(){
        var denominator = 0;
        // Calculate the Denominator: ∑ ( Collateral[ith] × LiquidationThreshold[ith] )
        for(var i = 0; i < supplyTokensArray.length; i++){
            const token = supplyTokensArray[i];
            const inputAmount = document.getElementById("supply_input_"+token.id).value;
            const currentPrice = document.getElementById("slider_input_"+token.id).value;
            const liquidationThreshold = document.getElementById("threshold_input_"+token.id).value/100;
            denominator += (currentPrice * inputAmount) * liquidationThreshold;
        }
        // Calculate the Numerator: Total Borrows
        var totalBorrowValue = 0;
        for(var j = 0; j < borrowTokensArray.length; j++){
            const token = borrowTokensArray[j];
            const inputAmount = document.getElementById("borrow_input_"+token.id).value;
            const currentPrice = document.getElementById("slider_input_"+token.id).value;
            totalBorrowValue += (inputAmount * currentPrice);
            
        }
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
    

        addTokensToLists();
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


            <div className="dropdown">
                <div onClick={showDropDown} className="dropbtn">{chain} Network</div>
                <div id="myDropdown" className="dropdown-content">
                    <a href="#" onClick={ () => changeNetwork("Ethereum", true) }>Ethereum</a>
                    <a href="#" onClick={ () => changeNetwork("Aribtrum", true) }>Aribtrum</a>
                    <a href="#" onClick={ () => changeNetwork("Avalanche", true) }>Avalanche</a>
                    <a href="#" onClick={ () => changeNetwork("Fantom", true) }>Fantom</a>
                    <a href="#" onClick={ () => changeNetwork("Harmony", true) }>Harmony</a>
                    <a href="#" onClick={ () => changeNetwork("Optimism", true) }>Optimism</a>
                    <a href="#" onClick={ () => changeNetwork("Polygon", true) }>Polygon</a>
                    <a href="#" onClick={ () => changeNetwork("Metis", true) }>Metis</a>
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
                
            </div>
            
        </div>
        
     );
}
 
export default HeaderInfo;