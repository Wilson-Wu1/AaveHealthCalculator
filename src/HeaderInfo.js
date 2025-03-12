import {useEffect, useState} from 'react';
//import {ReactComponent as ExitSymbol} from './images/x-symbol.svg'
import {ReactComponent as InfoIcon} from './images/infoIcon.svg'
import {ReactComponent as SearchIcon} from './images/search.svg'
import {ReactComponent as EthereumSymbol} from './images/ethereum.svg'
import {ReactComponent as ArbitrumSymbol} from './images/arbitrum.svg'
import {ReactComponent as OptimismSymbol} from './images/optimism.svg'
import {ReactComponent as AvalancheSymbol} from './images/avalanche.svg'
import {ReactComponent as PolygonSymbol} from './images/polygon.svg'
import {ReactComponent as MetisSymbol} from './images/metis.svg'

import Web3 from 'web3';
const HeaderInfo = () => {
    const [chain, setChain] = useState("Ethereum")
    const [aaveVersion, setAaveVersion] = useState("V3");
    const [modalSupplyVisible, setSupplyModalVisible] = useState(false);
    const [modalBorrowVisible, setBorrowModalVisible] = useState(false);
    const [tokenData, setTokenData] = useState(null);
    const [aavePosition, setAavePosition] = useState([]);
    const [endpoint, setEndpoint] = useState(getSubgraphEndpoint("Ethereum", "V3"));
    const [healthFactor, setHealthFactor] = useState(0);
    const [queryCalled, setQueryCalled] = useState(false);
    const [missingPricesFilled, setMissingPricesFilled] = useState(false);
    const [oraclePricesChanged, setOraclePricesChanged] = useState(false);
    const [tokenDataChanged, setTokenDataChanged] = useState(false);
    
    function getSubgraphEndpoint(networkName, version) {
      switch (networkName) {
        case "Ethereum":
          return version == "V3"
            ? `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g`
            : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/8wR23o1zkS4gpLqLNU4kG3JHYVucqGyopL5utGxP2q1N`;
        case "Arbitrum":
          return `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/DLuE98kEb5pQNXAcKFQGQgfSQ57Xdou4jnVbAEqMfy3B`;
        case "Avalanche":
          return version == "V3"
            ? `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/2h9woxy8RTjHu1HJsCEnmzpPHFArU33avmUh4f71JpVn`
            : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/EZvK18pMhwiCjxwesRLTg81fP33WnR6BnZe5Cvma3H1C`;
        case "Optimism":
          return `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/DSfLz8oQBUeU5atALgUFQKMTSYV9mZAVYp4noLSXAfvb`;
        case "Polygon":
          return version == "V3"
            ? `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/Co2URyXjnxaw8WqxKyVHdirq9Ahhm5vcTs4dMedAq211`
            : `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/H1Et77RZh3XEf27vkAmJyzgCME2RSFLtDS2f4PPW6CGp`;
        case "Metis":
          return `https://andromeda.thegraph.metis.io/subgraphs/name/aave/protocol-v3-metis`;
        // default to ETH V3
        default:
          return `https://gateway.thegraph.com/api/${process.env.REACT_APP_SUBGRAPH_KEY}/subgraphs/id/Cd2gEDVeqnjBn1hSeqFMitw8Q1iiyV9FYUZkLNRcL87g`;
      }
    }

    function changeNetwork(newNetwork, newAaveVersion){
        // Only continue if the network and version has changed. Otherwise do nothing
        if(newNetwork != chain || newAaveVersion != aaveVersion){
            setTokenDataChanged(false);
            setOraclePricesChanged(false);
            
            setChain(newNetwork);
            
            setAaveVersion(newAaveVersion)

            // Show loading div
            const loadingDiv = document.getElementById("loading");
            const loadingText = document.getElementById("loading_text");
            loadingText.textContent = `Loading ${newNetwork} network token data`;
            loadingDiv.style.display = "flex";

            // Disable buttons while getting data
            const searchDiv = document.getElementById("search_div_search");
            const supplyDiv = document.getElementById("b_s_container_supply_btn");
            const borrowDiv = document.getElementById("b_s_container_borrow_btn");
            // Todo: Disable the search button. Probably have to set its color because it is a div and not a button
            // Set color of the icon iself?
            searchDiv.disabled = true;  
            supplyDiv.disabled = true;
            borrowDiv.disabled = true;
            
            setEndpoint(getSubgraphEndpoint(newNetwork, newAaveVersion));
        }
    }

    
    const iconComponents = {
        Ethereum: <EthereumSymbol />,
        Arbitrum: <ArbitrumSymbol />,
        Polygon: <PolygonSymbol />,
        Optimism: <OptimismSymbol />,
        Metis: <MetisSymbol />,
        Avalanche: <AvalancheSymbol />
    };
      
    useEffect(() => {
        if (endpoint !== null) {
            removeAllTokenDivs();
            clearPositionInfo();
            //Todo: This is being called unnecessarily at the begining
            getMissingPrices();
            queryTokenDataFromTheGraph();
        }
      }, [endpoint, aaveVersion]);



    function setCheckedValueSupply(token){
        const inputDiv = document.getElementById("supply_input_button_" + token.symbol);
        inputDiv.checked = false;
        removeTokenSupply(token);
        displayTotalSuppliedOrBorrowed();
        calculateCurrentHealthValue();
    }

    function setCheckedValueBorrow(token){
        const inputDiv = document.getElementById("borrow_input_button_" + token.symbol);
        inputDiv.checked = false;
        addOrRemoveBorrowToken(token);
        displayTotalSuppliedOrBorrowed();
        calculateCurrentHealthValue();
    }

    function addOrRemoveSupplyToken(token){
        const inputDiv = document.getElementById("supply_input_button_" + token.symbol);
        var checkedValue = inputDiv.checked;
        if(checkedValue){
            addTokenSupply(token);
        }
        else{
            removeTokenSupply(token);
        }
        displayTotalSuppliedOrBorrowed();
        calculateCurrentHealthValue();
    }

    function addOrRemoveBorrowToken(token){
        const inputDiv = document.getElementById("borrow_input_button_" + token.symbol);
        var checkedValue = inputDiv.checked
        if(checkedValue){
            addTokenBorrow(token);
        }
        else{
            removeTokenBorrow(token);
        }
        displayTotalSuppliedOrBorrowed();
        calculateCurrentHealthValue();
    }

    function addTokenSupply(token){
        const outerDiv = document.getElementById("supply_outer_div_" + token.symbol);
        outerDiv.style.display = "grid";
        displayPrice(token.symbol, 0, token.price.priceInUSD);
        calculateTokenValue(token.symbol, 0);
        displaySlider(token);
        displaySupplyLabels();
    }

    function removeTokenSupply(token){
        // Hide outer div
        const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
        supplyOuterDiv.style.display = "none";
        
        // Reset amount supplied
        const inputDiv = document.getElementById("supply_input_" + token.symbol);
        inputDiv.value = 0;

        const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
        if(!borrowOuterDiv || borrowOuterDiv.style.display == "none"){
            removeSlider(token);
            
        }

        var remainingSupply = false;
        for(const index in tokenData){
            const token = tokenData[index];
            const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
            if(supplyOuterDiv && supplyOuterDiv.style.display == "grid"){
                remainingSupply = true;
                break;
            }
        }
        if(!remainingSupply){
            const pTag = document.getElementById("assets_supply_nothing");
            const headerTag = document.getElementById("assets_supply_header");
            const supplyInfo = document.getElementById("assets_supply_info_box_left");
            pTag.style.display = "block";
            headerTag.style.display = "none";
            supplyInfo.style.display = "none";
        }
    }

    function addTokenBorrow(token){
        const outerDiv = document.getElementById("borrow_outer_div_" + token.symbol);
        outerDiv.style.display = "grid";
        displayPrice(token.symbol, 1, token.price.priceInUSD);
        calculateTokenValue(token.symbol, 1);
        displaySlider(token);
        displayBorrowLabels();
    }

    function removeTokenBorrow(token){
        // Hide outer div
        const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
        borrowOuterDiv.style.display = "none";

        // Reset amount borrowed
        const inputDiv = document.getElementById("borrow_input_" + token.symbol);
        inputDiv.value = 0;

        const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
        if(!supplyOuterDiv || supplyOuterDiv.style.display == "none"){
            removeSlider(token);
        }

        var remainingBorrow = false;
        for(const index in tokenData){
            const token = tokenData[index];
            const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
            if(borrowOuterDiv && borrowOuterDiv.style.display == "grid"){
                remainingBorrow = true;
                break;
            }
        }
        if(!remainingBorrow){
            const pTag = document.getElementById("assets_borrow_nothing");
            const headerTag = document.getElementById("assets_borrow_header");
            const borrowInfo = document.getElementById("assets_borrow_info");
            const borrowInfoLeft = document.getElementById("assets_borrow_info_box_left");
            pTag.style.display = "block";
            headerTag.style.display = "none";
            borrowInfo.style.display = "none";
            borrowInfoLeft.style.display = "none";
        }
    }

    function resetTokenData(){
        for(const index in tokenData){
            const token  = tokenData[index];

            const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
            if(supplyOuterDiv){
                supplyOuterDiv.style.display = "none";
                const supplyInput = document.getElementById("supply_input_" + token.symbol);
                supplyInput.value = null;
            }

            const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
            if(borrowOuterDiv){
                borrowOuterDiv.style.display = "none";
                const borrowInput = document.getElementById("borrow_input_" + token.symbol);
                borrowInput.value = null;
            }

            const displaySlider = document.getElementById("slider_" + token.symbol);
            if(displaySlider){
                displaySlider.style.display = "none";

                // Reset slider value
                const sliderInput = document.getElementById("slider_input_"+token.symbol);
                sliderInput.value = token.price.priceInUSD;

                // Reset token threshold
                const tokenThreshold = document.getElementById("threshold_input_"+token.symbol);
                tokenThreshold.value = token.reserveLiquidationThreshold/100;
            }

            const supplyButton = document.getElementById("supply_input_button_" + token.symbol);
            if(supplyButton){
                supplyButton.checked = false;
            }

            const borrowButton = document.getElementById("borrow_input_button_" + token.symbol);
            if(borrowButton){
                borrowButton.checked = false;
            }
        }
    }

    function removeAllTokenDivs(){
        for(const index in tokenData){
            const token  = tokenData[index];
            const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
            if(supplyOuterDiv){
                supplyOuterDiv.remove();
            }
            const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
            if(borrowOuterDiv){
                borrowOuterDiv.remove();
            }
            const displaySlider = document.getElementById("slider_" + token.symbol);
            if(displaySlider){
                displaySlider.remove();
            }
        }
    }

    function clearPositionInfo(){
        // Reset net worth
        const netWorthDiv = document.getElementById("info_container_bottom_netWorth_value");
        netWorthDiv.textContent = 0;

        // Reset Health Factor
        const healthFactorDiv = document.getElementById("info_container_bottom_healthFactorValue");
        healthFactorDiv.style.color = "white";
        setHealthFactor(0);

        // Reset LTV
        const ltvDiv = document.getElementById("info_container_bottom_ltv");
        ltvDiv.textContent = "0.00";

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

        // Hide slider info
        const sliderPTag = document.getElementById("values_container_empty");
        const sliderHeaderTag = document.getElementById("values_container_header");
        sliderPTag.style.display = "block";
        sliderHeaderTag.style.display = "none";
    }

    function displaySupplyLabels(){
        const pTag = document.getElementById("assets_supply_nothing");
        const headerTag = document.getElementById("assets_supply_header");
        const supplyInfo = document.getElementById("assets_supply_info_box_left");
        pTag.style.display = "none";
        headerTag.style.display = "grid";
        supplyInfo.style.display = "flex";
    }

    function displayBorrowLabels(){
        const pTag = document.getElementById("assets_borrow_nothing");
        const headerTag = document.getElementById("assets_borrow_header");
        const borrowInfo = document.getElementById("assets_borrow_info");
        const borrowInfoLeft = document.getElementById("assets_borrow_info_box_left");
        pTag.style.display = "none";
        headerTag.style.display = "grid";
        borrowInfo.style.display = "flex";
        borrowInfoLeft.style.display = "flex";
    }

    function renderSupplySide(){
        // Clear supply div
        const ulElement = document.getElementById("assets_supply_tokens_list");
        ulElement.innerHTML = "";

        const pTag = document.getElementById("assets_supply_nothing");
        const headerTag = document.getElementById("assets_supply_header");
        const supplyInfo = document.getElementById("assets_supply_info_box_left");
        pTag.style.display = "flex";
        headerTag.style.display = "none";
        supplyInfo.style.display = "none";

        for (const index in tokenData) {
            const token = tokenData[index];
            if(token.usageAsCollateralEnabled){
                // Create outer div
                const outerDiv = document.createElement("div");
                outerDiv.id = "supply_outer_div_" + token.symbol;
                outerDiv.classList.add("supply_outer_div");
                outerDiv.style.display = "none";

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
                amountElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed();});
                outerDiv.appendChild(amountElement);

                // Add price input div
                const priceElement = document.createElement("input");
                priceElement.id = "supply_price_"+token.symbol;
                priceElement.value = 0;
                priceElement.addEventListener("input", function() {adjustSliderValue(token.symbol, true, token.price.priceInUSD);});
                priceElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 2);});
                priceElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed();});
                priceElement.addEventListener("input", calculateCurrentHealthValue);
                outerDiv.appendChild(priceElement);

                // Add Value div (Price * Amount)
                const valueElement = document.createElement("p");
                valueElement.id = "supply_value_"+token.symbol;
                valueElement.classList.add('supply_values');
                valueElement.value = 0;
                outerDiv.appendChild(valueElement);

                // Add remove button 
                const removeButton = document.createElement("button");
                removeButton.id = "supply_button_"+token.symbol;
                removeButton.classList.add('supply_buttons');
                removeButton.addEventListener("click", function() {setCheckedValueSupply(token);});
                outerDiv.appendChild(removeButton);
               
                // Finally add the outer div element to the ul element
                ulElement.appendChild(outerDiv);
                
            }
        }
    }

    function renderBorrowSide(){
        // Clear borrow div
        const ulElement = document.getElementById("assets_borrow_tokens_list");
        ulElement.innerHTML = "";

        const pTag = document.getElementById("assets_borrow_nothing");
        const headerTag = document.getElementById("assets_borrow_header");
        const borrowInfo = document.getElementById("assets_borrow_info_box_left");
        // pTag.style.display = "none";
        // headerTag.style.display = "grid";
        // supplyInfo.style.display = "flex";
        pTag.style.display = "flex";
        headerTag.style.display = "none";
        borrowInfo.style.display = "none";

        for (const index in tokenData) {
            const token = tokenData[index];
            if(token.borrowingEnabled){
                // Create outer div
                const outerDiv = document.createElement("div");
                outerDiv.id = "borrow_outer_div_" + token.symbol;
                outerDiv.classList.add("borrow_outer_div");
                outerDiv.style.display = "none";

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
                amountElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed();});
                outerDiv.appendChild(amountElement);

                // Add price input div
                const priceElement = document.createElement("input");
                priceElement.id = "borrow_price_"+token.symbol;
                priceElement.value = 0;
                priceElement.addEventListener("input", function() {adjustSliderValue(token.symbol, false, token.price.priceInUSD);});
                priceElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 2);});
                priceElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed();});
                priceElement.addEventListener("input", calculateCurrentHealthValue);
                outerDiv.appendChild(priceElement);

                // Add Value div (Price * Amount)
                const valueElement = document.createElement("p");
                valueElement.id = "borrow_value_"+token.symbol;
                valueElement.classList.add('borrow_values');
                valueElement.value = 0;
                outerDiv.appendChild(valueElement);

                 // Add remove button 
                 const removeButton = document.createElement("button");
                 removeButton.id = "borrow_button_"+token.symbol;
                 removeButton.classList.add('borrow_buttons');
                 removeButton.addEventListener("click", function() {setCheckedValueBorrow(token);});
                 outerDiv.appendChild(removeButton);

                // Finally add the outer div element to the ul element
                ulElement.appendChild(outerDiv);

            }
        }
    }

    // Query the graph for the tokens that can be supplied/borrowed for a given network
    // Retrieve each token's symbol and price.
    async function queryTokenDataFromTheGraph(){
    
        const { request } = require('graphql-request');

        //TODO: Query for decimals for Polygon V2 token prices
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
          }
        `;
        try {
            const data = await request(endpoint, query);

            for (const index in data.reserves) {
              const token = data.reserves[index];
              const decimalConvert = Math.pow(10, 8);
              token.price.priceInUSD = token.price.priceInEth / decimalConvert;
              
            }
            console.log(data.reserves);
            setTokenData(data.reserves);
            setTokenDataChanged(true);
        } 
        catch (error) {
            console.error('Error fetching token info:', error);
            displayErrorMessage('Error fetching token info. ' + error);

            // Re-enable buttons once error is caught
            const searchDiv = document.getElementById("search_div_search");
            const supplyDiv = document.getElementById("b_s_container_supply_btn");
            const borrowDiv = document.getElementById("b_s_container_borrow_btn");
            searchDiv.disabled = false;
            supplyDiv.disabled = false;
            borrowDiv.disabled = false;

            // Hide loading div
            const loadingDiv = document.getElementById("loading");
            loadingDiv.style.display = "none";
            setMissingPricesFilled(true);
        }
    }

    const missingEthereumSymbols = ['WBTC', "LDO", "wstETH", "rETH", "cbETH"];
    const missingArbitrumSymbols = ['wstETH','rETH'];
    const missingAvalancheSymbols = ['sAVAX'];
    const missingPolygonSymbols = ['wstETH'];
    const missingOptimismSymbols = ['rETH'];
    const [oraclePrices, setOraclePrices] = useState([]);
    
    async function getMissingPrices() {
        //TODO: SDAI on Ethereum V3 fetching 0.
        if(chain == "Ethereum" && (aaveVersion == "V3" || aaveVersion == "V2")){
            const web3ProviderUrl = `https://mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
            const web3 = new Web3(web3ProviderUrl);
            const contractABI = [{"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DecimalsAboveLimit","type":"error"},{"inputs":[],"name":"DecimalsNotEqual","type":"error"},{"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
            const oracleAddresses = ['0x230E0321Cf38F09e247e50Afc7801EA2351fe56F', '0xb01e6C9af83879B8e06a092f0DD94309c0D497E4', '0x8B6851156023f4f5A66F68BEA80851c3D905Ac93', '0x05225Cd708bCa9253789C1374e4337a019e99D56','0x5f4d15d761528c57a5C30c43c1DAb26Fc5452731'];
    
            // For each oracle, retrieve the latest token price.
            var tempOraclePrices = [];
            for(const index in oracleAddresses){
                const oracle = oracleAddresses[index];
                const contract = new web3.eth.Contract(contractABI, oracle);
                try{
                    const result = await contract.methods.latestAnswer().call();
                    tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
                } 
                catch (error){  
                    displayErrorMessage('Error fetching oracle token info. ' + error);
                }
            }
            setOraclePrices(tempOraclePrices);
        }
        else if(chain == "Arbitrum" && aaveVersion == "V3"){
            
            const web3ProviderUrl = `https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
            const web3 = new Web3(web3ProviderUrl);
            const contractABI = [{"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DecimalsAboveLimit","type":"error"},{"inputs":[],"name":"DecimalsNotEqual","type":"error"},{"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
            const oracleAddresses = ['0x945fD405773973d286De54E44649cc0d9e264F78','0x04c28D6fE897859153eA753f986cc249Bf064f71'];
    
            // For each oracle, retrieve the latest token price.
            var tempOraclePrices = [];
            for(const index in oracleAddresses){
                const oracle = oracleAddresses[index];
                const contract = new web3.eth.Contract(contractABI, oracle);
                try{
                    const result = await contract.methods.latestAnswer().call();
                    tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
                } 
                catch (error){  
                    displayErrorMessage('Error fetching oracle token info. ' + error);
                }
            }
            setOraclePrices(tempOraclePrices);
        }
        else if(chain == "Optimism"){
   
            const web3ProviderUrl = `https://optimism-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
            const web3 = new Web3(web3ProviderUrl);
            const contractABI = [{"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DecimalsAboveLimit","type":"error"},{"inputs":[],"name":"DecimalsNotEqual","type":"error"},{"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
            const oracleAddresses = ['0x52d5F9f884CA21C27E2100735d793C6771eAB793'];
    
            // For each oracle, retrieve the latest token price.
            var tempOraclePrices = [];
            for(const index in oracleAddresses){
                const oracle = oracleAddresses[index];
                const contract = new web3.eth.Contract(contractABI, oracle);
                try{
                    const result = await contract.methods.latestAnswer().call();
                    tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
                    
                } 
                catch (error){
                    displayErrorMessage('Error fetching oracle token info. ' + error);  
                }
            }
            setOraclePrices(tempOraclePrices);
           
        }
        else if(chain == "Polygon"){
            //Polygon V3
            if(aaveVersion == "V3"){
                const web3ProviderUrl = `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
                const web3 = new Web3(web3ProviderUrl);
                const contractABI = [{"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DecimalsAboveLimit","type":"error"},{"inputs":[],"name":"DecimalsNotEqual","type":"error"},{"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
                const oracleAddresses = ['0xe34949A48cd2E6f5CD41753e449bd2d43993C9AC'];
        
                // For each oracle, retrieve the latest token price.
                var tempOraclePrices = [];
                for(const index in oracleAddresses){
                    const oracle = oracleAddresses[index];
                    const contract = new web3.eth.Contract(contractABI, oracle);
                    try{
                        const result = await contract.methods.latestAnswer().call();
                        tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
                        
                    } 
                    catch (error){  
                        displayErrorMessage('Error fetching oracle token info. ' + error);
                    }
                }
                setOraclePrices(tempOraclePrices);
            }
            // Polygon V2
            else{
                //TODO: Fetch price of eth. divide prices of polygon tokens by price of eth.
                // const web3ProviderUrl = `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
                // const web3 = new Web3(web3ProviderUrl);
                // const contractABI = [{"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DecimalsAboveLimit","type":"error"},{"inputs":[],"name":"DecimalsNotEqual","type":"error"},{"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
                // const ethOracleAddress = '';
                // const contract = new web3.eth.Contract(contractABI, ethOracleAddress);
                // try{
                //     const result = await contract.methods.latestAnswer().call();
                //     tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
                    
                // } 
                // catch (error){  
                //     displayErrorMessage('Error fetching oracle token info. ' + error);
                // }
            }
            
            
        }
        
        else if(chain == "Avalanche" && (aaveVersion == "V3" || aaveVersion == "V2")){
            
            const web3ProviderUrl = `https://avalanche-mainnet.infura.io/v3/${process.env.REACT_APP_API_KEY}`;
            const web3 = new Web3(web3ProviderUrl);
            const contractABI = [{"inputs":[{"internalType":"address","name":"pegToBaseAggregatorAddress","type":"address"},{"internalType":"address","name":"assetToPegAggregatorAddress","type":"address"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"DecimalsAboveLimit","type":"error"},{"inputs":[],"name":"DecimalsNotEqual","type":"error"},{"inputs":[],"name":"ASSET_TO_PEG","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DENOMINATOR","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PEG_TO_BASE","outputs":[{"internalType":"contract IChainlinkAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"}];
            const oracleAddresses = ['0xc9245871D69BF4c36c6F2D15E0D68Ffa883FE1A7'];
    
            // For each oracle, retrieve the latest token price.
            var tempOraclePrices = [];
            for(const index in oracleAddresses){
                const oracle = oracleAddresses[index];
                const contract = new web3.eth.Contract(contractABI, oracle);
                try{
                    const result = await contract.methods.latestAnswer().call();
                    tempOraclePrices.push((Number(result) / 100000000).toFixed(2));
                } 
                catch (error) 
                {  
                    displayErrorMessage('Error fetching oracle token info. ' + error);
                }
            }
            setOraclePrices(tempOraclePrices);
            
        }
        setOraclePricesChanged(true);
    }

    function setMissingPrices(){
        setMissingPricesFilled(false);
        if(chain == "Ethereum" && (aaveVersion == "V3"|| aaveVersion == "V2")){
            for(const index in oraclePrices){
                const foundObject = tokenData.find((item) => item.symbol === missingEthereumSymbols[index]);
                foundObject.price.priceInUSD = oraclePrices[index];
            }
        }
        else if(chain == "Arbitrum"){
            for(const index in oraclePrices){
                const foundObject = tokenData.find((item) => item.symbol === missingArbitrumSymbols[index]);
                foundObject.price.priceInUSD = oraclePrices[index];
            }
        }
        else if(chain == "Avalanche" && (aaveVersion == "V3"|| aaveVersion == "V2")){
            for(const index in oraclePrices){
                
                const foundObject = tokenData.find((item) => item.symbol === missingAvalancheSymbols[index]);
                foundObject.price.priceInUSD = oraclePrices[index];
            }
        }
        else if(chain == "Polygon" && aaveVersion == "V3"){
            for(const index in oraclePrices){
                const foundObject = tokenData.find((item) => item.symbol === missingPolygonSymbols[index]);
                foundObject.price.priceInUSD = oraclePrices[index];
            }
        }
        else if(chain == "Optimism"){
            
            for(const index in oraclePrices){
                const foundObject = tokenData.find((item) => item.symbol === missingOptimismSymbols[index]);
                foundObject.price.priceInUSD = oraclePrices[index];
            }
        }
        // Set $GHO token price to $1, since it does not use an Oracle
        const foundObject = tokenData.find((item) => item.symbol === "GHO");
        if(foundObject){
            foundObject.price.priceInUSD = 1;
        }
        setTokenData(tokenData);
        setTokenDataChanged(true);
    }
    
    useEffect(() => {
        // When oraclePrices state is updated, set the missing prices
        if (oraclePrices.length > 0 && oraclePricesChanged && tokenDataChanged) {
      
            setMissingPrices();
        }
    }, [oraclePrices, oraclePricesChanged, tokenDataChanged, tokenData]);

    useEffect(() => {
        
        if(!missingPricesFilled){
            renderSupplyAndBorrowLists();
            renderSupplySide();
            renderBorrowSide();
            renderSliders();
            // Re-enable buttons once data has been retrieved
            const searchDiv = document.getElementById("search_div_search");
            const supplyDiv = document.getElementById("b_s_container_supply_btn");
            const borrowDiv = document.getElementById("b_s_container_borrow_btn");
            searchDiv.disabled = false;
            supplyDiv.disabled = false;
            borrowDiv.disabled = false;
            // Hide loading div
            const loadingDiv = document.getElementById("loading");
            loadingDiv.style.display = "none";
            setMissingPricesFilled(true);
        }

    }, [tokenData, missingPricesFilled]);

    useEffect(() => {
        if(queryCalled){
            updatePositions(); 
            setQueryCalled(false);

            // Hide loading div
            const loadingDiv = document.getElementById("loading");
            loadingDiv.style.display = "none";

            // Re-enable buttons once data has been retrieved
            const searchDiv = document.getElementById("search_div_search");
            const supplyDiv = document.getElementById("b_s_container_supply_btn");
            const borrowDiv = document.getElementById("b_s_container_borrow_btn");
            searchDiv.disabled = false;
            supplyDiv.disabled = false;
            borrowDiv.disabled = false;
        }
            
    }, [aavePosition, queryCalled]);

    // Query the graph for a user's Aave position on the current network
    function queryAddressForUserPosition(){

        // Show loading div
        const loadingDiv = document.getElementById("loading");
        const loadingText = document.getElementById("loading_text");
        loadingText.textContent = `Searching for user's Aave position`;
        loadingDiv.style.display = "flex";

        // Disable buttons while getting data
        const searchDiv = document.getElementById("search_div_search");
        const supplyDiv = document.getElementById("b_s_container_supply_btn");
        const borrowDiv = document.getElementById("b_s_container_borrow_btn");
        searchDiv.disabled = true;
        supplyDiv.disabled = true;
        borrowDiv.disabled = true;

        resetTokenData();
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
            displayErrorMessage(error);
            console.error(error);

            // Re-enable buttons once error is caught
            const searchDiv = document.getElementById("search_div_search");
            const supplyDiv = document.getElementById("b_s_container_supply_btn");
            const borrowDiv = document.getElementById("b_s_container_borrow_btn");
            searchDiv.disabled = false;
            supplyDiv.disabled = false;
            borrowDiv.disabled = false;

            // Hide loading div
            const loadingDiv = document.getElementById("loading");
            loadingDiv.style.display = "none";
            setMissingPricesFilled(true);
        
        });
    }

    function updatePositions(){
        if(aavePosition.length != 0){
            var atLeastOneSupply = false;
            var atLeastOneBorrow = false;
            for(const index in aavePosition){
                const token = aavePosition[index];

                // Display supplied token
                if(token.currentATokenBalance != 0){
                    const outerDiv = document.getElementById("supply_outer_div_" + token.reserve.symbol);
                    outerDiv.style.display = "grid";
                    // Display token price
                    var foundTokenData = tokenData.find((item) => item.symbol === token.reserve.symbol);
                    displayPrice(foundTokenData.symbol, 0, foundTokenData.price.priceInUSD);
                    // Display amount supplied
                    const amountDiv = document.getElementById("supply_input_" + token.reserve.symbol);
                    amountDiv.value = token.currentATokenBalance / Math.pow(10, token.reserve.decimals);
                    // Set supply button to true
                    updateSupplySwitchButton(token.reserve.symbol);
                    // Calculate token position value
                    calculateTokenValue(foundTokenData.symbol, 0);    
                    // Display slider
                    const sliderDiv = document.getElementById("slider_" + token.reserve.symbol);
                    sliderDiv.style.display = "grid";

                    if(!atLeastOneSupply){
                        displaySupplyLabels();
                        atLeastOneSupply = true;
                    }
                    
                }
                // Display borrowed token
                if(token.currentTotalDebt != 0){
                    const outerDiv = document.getElementById("borrow_outer_div_" + token.reserve.symbol);
                    outerDiv.style.display = "grid";
                    // Display token price
                    var foundTokenData = tokenData.find((item) => item.symbol === token.reserve.symbol);
                    displayPrice(foundTokenData.symbol, 1, foundTokenData.price.priceInUSD);
                    // Display amount borrowed
                    const amountDiv = document.getElementById("borrow_input_" + token.reserve.symbol);
                    amountDiv.value = token.currentTotalDebt / Math.pow(10, token.reserve.decimals);
                    // Set borrow button to true
                    updateBorrowSwitchButton(token.reserve.symbol);
                    // Calculate token position value
                    calculateTokenValue(foundTokenData.symbol, 1);
                    // Display slider 
                    const sliderDiv = document.getElementById("slider_" + token.reserve.symbol);
                    sliderDiv.style.display = "grid";

                    if(!atLeastOneBorrow){
                        displayBorrowLabels();
                        atLeastOneBorrow = true;
                    }
                }
            }
            // Display slider labels if at least one supply or one borrow
            if(atLeastOneBorrow || atLeastOneSupply){
                
                const sliderHeader = document.getElementById('values_container_header');
                const sliderEmptyText = document.getElementById('values_container_empty');
                sliderHeader.style.display = "grid";
                sliderEmptyText.style.display = "none";
            }
            calculateCurrentHealthValue();
            displayTotalSuppliedOrBorrowed();
            
        }
        else{
            // Remove any previous position info
            clearPositionInfo();
            displayErrorMessage(`Error: Address does not own an Aave position on the ${chain} network`);
        }
        
    }

    function updateSupplySwitchButton(tokenSymbol){
        const inputDiv = document.getElementById("supply_input_button_" + tokenSymbol);
        inputDiv.checked = true;
    }

    function updateBorrowSwitchButton(tokenSymbol){
        const inputDiv = document.getElementById("borrow_input_button_" + tokenSymbol);
        inputDiv.checked = true;
    }

    function setSupplyModalVisibilityFalse(){
        // Disable supply buttons as they are still clickable when modal is not visible 
        for(const index in tokenData){
            const token = tokenData[index];
            const supplyInputButton = document.getElementById("supply_input_button_" + token.symbol);
            if(supplyInputButton){              
                supplyInputButton.disabled = true;
            }
        }
        setSupplyModalVisible(false); 
    }
    function setSupplyModalVisibilityTrue(){
        if (window.gtag) {
            window.gtag("event", "supply_click", {
                event_category: "User Interaction",
                event_label: "Supply Button",
            });
        } else {
            console.error("Google Analytics is not initialized");
        }
        // Re-enable supply buttons
        for(const index in tokenData){
            const token = tokenData[index];
            const supplyInputButton = document.getElementById("supply_input_button_" + token.symbol);
            if(supplyInputButton){
                supplyInputButton.disabled = false;
            }
        }
        setSupplyModalVisible(true);      
    }
    function setBorrowModalVisibilityTrue(){
        // Re-enable borrow buttons
        for(const index in tokenData){
            const token = tokenData[index];
            const borrowInputButton = document.getElementById("borrow_input_button_" + token.symbol);
            if(borrowInputButton){ 
                borrowInputButton.disabled = false;
            }
        }
        setBorrowModalVisible(true);
    }
    function setBorrowModalVisibilityFalse(){
        // Disable borrow buttons as they are still clickable when modal is not visible 
        for(const index in tokenData){
            const token = tokenData[index];
            const borrowInputButton = document.getElementById("borrow_input_button_" + token.symbol);
            if(borrowInputButton){
                
                borrowInputButton.disabled = true;
            }
        }
        setBorrowModalVisible(false);   
    }

    // When the user clicks on the button, toggle between hiding and showing the dropdown content
    function showDropDown() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
    
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropdown_btn')) {
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

    // // Adds tokens to the supply list modal
    function renderSupplyAndBorrowLists(){
        
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
                    addOrRemoveSupplyToken(item);
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
                    addOrRemoveBorrowToken(item1);
                });
                outerDiv1.appendChild(label1);

                // Finally add the outer div element to the ul element
                ulElementBorrow.appendChild(outerDiv1);
            }
        }
    }

    function displaySlider(token){
        const sliderDiv = document.getElementById("slider_" + token.symbol);
        sliderDiv.style.display = "grid";
        
        const sliderHeader = document.getElementById('values_container_header');
        const sliderEmptyText = document.getElementById('values_container_empty');
        sliderHeader.style.display = "grid";
        sliderEmptyText.style.display = "none";
    }

    function removeSlider(token){
        // Hide Slider
        const sliderDiv = document.getElementById("slider_" + token.symbol);
        sliderDiv.style.display = "none";

        // Reset slider value
        const sliderInput = document.getElementById("slider_input_"+token.symbol);
        sliderInput.value = token.price.priceInUSD;

        // Reset token threshold
        const tokenThreshold = document.getElementById("threshold_input_"+token.symbol);
        tokenThreshold.value = token.reserveLiquidationThreshold/100;
        
        // Remove labels if no remaining sliders
        var remainingSliders = false;
        for(const key in tokenData){
            const token = tokenData[key];
            const sliderDivs = document.getElementById("slider_" + token.symbol);
            if(sliderDivs && sliderDivs.style.display == "grid"){
                remainingSliders = true;
                break;
            }
        }
        if(!remainingSliders){
            const sliderHeader = document.getElementById('values_container_header');
            const sliderEmptyText = document.getElementById('values_container_empty');
            sliderHeader.style.display = "none";
            sliderEmptyText.style.display = "block";
        }

    }

    function renderSliders(){
        const sliderHeader = document.getElementById('values_container_header');
        const sliderEmptyText = document.getElementById('values_container_empty');
        sliderHeader.style.display = "none";
        sliderEmptyText.style.display = "block";
        
        const sliderList = document.getElementById("values_container_list");
        sliderList.innerHTML = "";
        for(const key in tokenData){
            const token = tokenData[key];
            // Create outer div
            const outerDiv = document.createElement("div");
            outerDiv.classList.add('outer_div')
            outerDiv.id = "slider_" + token.symbol;
            outerDiv.style.display = "none";

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
            valueInputElement.step= "0.01"
            valueInputElement.max = (token.price.priceInUSD * 3);
            valueInputElement.value = token.price.priceInUSD;
            valueInputElement.id = "slider_input_"+token.symbol;
            valueInputElement.classList.add('slider_input');
            valueInputElement.addEventListener("input", calculateCurrentHealthValue);
            valueInputElement.addEventListener("input", function() {calculateTokenValue(token.symbol, 2);});
            valueInputElement.addEventListener("input", function() {displayPrice(token.symbol, 2, token.price.priceInUSD);});
            valueInputElement.addEventListener("input", function() {displayTotalSuppliedOrBorrowed();});

            // Create div below the slider
            const sliderBottomDiv = document.createElement("div");
            sliderBottomDiv.classList.add('slider_div_bottom');

            // Create p tags for the min and max values
            const lowValueText = document.createElement("p");
            lowValueText.id = 'slider_div_top_min';
            lowValueText.textContent = "$ 0";
            const maxValueText = document.createElement("p");
            maxValueText.id = 'slider_div_top_max_'+token.symbol;
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
            thresholdInputElement.classList.add("threshold_input");
            
            outerDiv.appendChild(thresholdInputElement);

            // Finally add the outer div element to the sliderList 
            sliderList.appendChild(outerDiv);
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
            valueElement.textContent = parseFloat((amount*price).toFixed(2)).toLocaleString() + " USD";
            //valueElement.textContent = amount*price;
            valueElement.value = amount*price;
        }
        // Update borrow side
        else if (caller == 1){
            const amount = document.getElementById("borrow_input_"+tokenID).value;
            const valueElement = document.getElementById("borrow_value_"+tokenID);
            valueElement.textContent = parseFloat((amount*price).toFixed(2)).toLocaleString() + " USD";
            valueElement.value = amount*price;
            //valueElement.textContent = amount*price;
        }

        
        else if (caller == 2){
            // Caller is from slider. Potentially update both sides.
            // First check the supply/borrow divs exist first 
            const supplyDiv= document.getElementById("supply_input_"+tokenID);
            if(supplyDiv){
                const valueElement = document.getElementById("supply_value_"+tokenID);
                valueElement.textContent = parseFloat((supplyDiv.value*price).toFixed(2)).toLocaleString() + " USD";
                valueElement.value = supplyDiv.value*price;
                //valueElement.textContent = supplyDiv.value*price;

            }
            const borrowDiv = document.getElementById("borrow_input_"+tokenID);
            if(borrowDiv){
                const valueElement = document.getElementById("borrow_value_"+tokenID);
                valueElement.textContent = parseFloat((borrowDiv.value*price).toFixed(2)).toLocaleString() + " USD";
                valueElement.value = borrowDiv.value*price;
                //valueElement.textContent = borrowDiv.value*price;
            }
        }
    }

    // Update the token price in both or either the supply and borrow sides
    function displayPrice(tokenID, caller, currentTokenPrice){
        var price = document.getElementById("slider_input_"+tokenID).value;
        price = parseFloat(price);
        if(caller == 0){
            const priceElement = document.getElementById("supply_price_"+tokenID);
            priceElement.value = price;
            
        }
        else if (caller == 1){
            const priceElement = document.getElementById("borrow_price_"+tokenID);
            priceElement.value = price
           
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
        sliderPrice.textContent = "$" + parseFloat(price.toFixed(2)).toLocaleString();

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

    // Change the price located in the sliders. Called by token supply and borrow divs
    function adjustSliderValue(tokenID, isSupplySide, currentTokenPrice){
        const slider = document.getElementById("slider_input_"+tokenID);
        const supply = document.getElementById("supply_price_"+tokenID);
        const borrow = document.getElementById("borrow_price_"+tokenID);
        const sliderPrice = document.getElementById('slider_outer_top_price_' + tokenID);
        const sliderPercent = document.getElementById('slider_outer_top_percent_' + tokenID);
        const sliderPriceChange = document.getElementById('slider_outer_top_priceChange_' + tokenID);
        const sliderMaxValueText = document.getElementById('slider_div_top_max_'+tokenID);
        const sliderMaxValue = slider.max;
        var price;
        
        if(isSupplySide){
            price = supply.value;
            const priceAsNum = parseFloat(price);
            if(isNaN(price)){
                price = 0;
            }
            if(borrow){
                borrow.value = price;
                //borrow.textContent = parseFloat(priceAsNum.toFixed(2)).toLocaleString();
            }

            // Change max price according to current price
            slider.max = price * 3;
            sliderMaxValueText.textContent = '$ ' + (price*3).toFixed(2);
            // Change price values 
            sliderPrice.textContent = "$" + parseFloat(priceAsNum.toFixed(2)).toLocaleString();
            sliderPrice.value = price;
            slider.value = price;

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
            const priceAsNum = parseFloat(price);
            if(isNaN(price)){
                price = 0;
            }
            if(supply){
                supply.value = price;
                //supply.textContent = parseFloat(priceAsNum.toFixed(2)).toLocaleString();
            }
            
            // Change max price according to current price
            slider.max = price * 3;
            sliderMaxValueText.textContent = '$ ' + (price*3).toFixed(2);
            // Change price value
            sliderPrice.textContent = "$" + parseFloat(priceAsNum.toFixed(2)).toLocaleString();
            sliderPrice.value = price;
            slider.value = price;

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

    function displayTotalSuppliedOrBorrowed(){
        // Calculate and update total value supplied 
        var supplySum = 0;
        for(const index in tokenData){
            const token = tokenData[index];
            const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
            if(supplyOuterDiv && supplyOuterDiv.style.display == "grid"){
                const supplyValue = document.getElementById("supply_value_" + token.symbol);
                supplySum += supplyValue.value;
            }
        }
        const totalSupplyDiv = document.getElementById("info_container_bottom_totalSupplied");
        totalSupplyDiv.textContent = parseFloat(supplySum.toFixed(2)).toLocaleString();

        // Calculate and update total value borrowed 
        var borrowSum = 0;
        for(const index in tokenData){
            const token = tokenData[index];
            const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
            if(borrowOuterDiv && borrowOuterDiv.style.display == "grid"){
                const borrowValue = document.getElementById("borrow_value_" + token.symbol);
                borrowSum += borrowValue.value;
                
            }
        }
        const totalBorrowDiv = document.getElementById("info_container_bottom_totalBorrowed");
        totalBorrowDiv.textContent = parseFloat(borrowSum.toFixed(2)).toLocaleString();
    
        // Calculate and update Loan-to-Value ratio (Total Supplied / Total borrowed)
        const ltvDiv = document.getElementById("info_container_bottom_ltv");
        const ltvPercent = borrowSum/supplySum;
        if(isNaN(ltvPercent)){
            ltvDiv.textContent = "0";
        }
        else if (!isFinite(ltvPercent)){
            ltvDiv.textContent = "∞";
        }
        else{
            ltvDiv.textContent = (borrowSum/supplySum*100).toFixed(2);
        }

        // Calculate and update Net Worth 
        const netWorthDiv = document.getElementById("info_container_bottom_netWorth_value");
        netWorthDiv.textContent = parseFloat((supplySum - borrowSum).toFixed(2)).toLocaleString();

    }

    // // Calculate the current health value
    function calculateCurrentHealthValue(){
        var denominator = 0;
        var totalBorrowValue = 0;
        // Calculate the Denominator: ∑ ( Collateral[ith] × LiquidationThreshold[ith] )
        
        for(const index in tokenData){
            const token = tokenData[index];
            const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
            if(supplyOuterDiv && supplyOuterDiv.style.display == "grid"){
                const inputAmount = document.getElementById("supply_input_"+token.symbol).value;
                const currentPrice = document.getElementById("slider_input_"+token.symbol).value;
                const liquidationThreshold = document.getElementById("threshold_input_"+token.symbol).value/100;
                denominator += (currentPrice * inputAmount) * liquidationThreshold;
            }
            const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
            if(borrowOuterDiv && borrowOuterDiv.style.display == "grid"){
                const inputAmount = document.getElementById("borrow_input_"+token.symbol).value;
                const currentPrice = document.getElementById("slider_input_"+token.symbol).value;
                totalBorrowValue += (currentPrice * inputAmount)
            }
            
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

    function clearSupplySide(){
        const pTag = document.getElementById("assets_supply_nothing");
        const headerTag = document.getElementById("assets_supply_header");
        const supplyInfo = document.getElementById("assets_supply_info_box_left");
        pTag.style.display = "block";
        headerTag.style.display = "none";
        supplyInfo.style.display = "none";

        for(const index in tokenData){
            const token  = tokenData[index];

            const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
            if(supplyOuterDiv){
                supplyOuterDiv.style.display = "none";
                const supplyInput = document.getElementById("supply_input_" + token.symbol);
                supplyInput.value = null;
            }
            const displaySlider = document.getElementById("slider_" + token.symbol);
            const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
            
            if(displaySlider && borrowOuterDiv && borrowOuterDiv.style.display == "none"){
                displaySlider.style.display = "none";

                // Reset slider value
                const sliderInput = document.getElementById("slider_input_"+token.symbol);
                sliderInput.value = token.price.priceInUSD;

                // Reset token threshold
                const tokenThreshold = document.getElementById("threshold_input_"+token.symbol);
                tokenThreshold.value = token.reserveLiquidationThreshold/100;
            }

            const supplyButton = document.getElementById("supply_input_button_" + token.symbol);
            if(supplyButton){
                supplyButton.checked = false;
            }
        }

        // Remove labels if no remaining sliders
        var remainingSliders = false;
        for(const key in tokenData){
            const token = tokenData[key];
            const sliderDivs = document.getElementById("slider_" + token.symbol);
            if(sliderDivs && sliderDivs.style.display == "grid"){
                remainingSliders = true;
                break;
            }
        }
        if(!remainingSliders){
            const sliderHeader = document.getElementById('values_container_header');
            const sliderEmptyText = document.getElementById('values_container_empty');
            sliderHeader.style.display = "none";
            sliderEmptyText.style.display = "block";
        }
    }

    function clearBorrowSide(){
        const pTag = document.getElementById("assets_borrow_nothing");
        const headerTag = document.getElementById("assets_borrow_header");
        const borrowInfo = document.getElementById("assets_borrow_info_box_left");
        pTag.style.display = "block";
        headerTag.style.display = "none";
        borrowInfo.style.display = "none";

        for(const index in tokenData){
            const token  = tokenData[index];

            const borrowOuterDiv = document.getElementById("borrow_outer_div_" + token.symbol);
            if(borrowOuterDiv){
                borrowOuterDiv.style.display = "none";
                const borrowInput = document.getElementById("borrow_input_" + token.symbol);
                borrowInput.value = null;
            }
            const displaySlider = document.getElementById("slider_" + token.symbol);
            const supplyOuterDiv = document.getElementById("supply_outer_div_" + token.symbol);
            
            if(displaySlider && (!supplyOuterDiv || supplyOuterDiv.style.display == "none")){
                displaySlider.style.display = "none";

                // Reset slider value
                const sliderInput = document.getElementById("slider_input_"+token.symbol);
                sliderInput.value = token.price.priceInUSD;

                // Reset token threshold
                const tokenThreshold = document.getElementById("threshold_input_"+token.symbol);
                tokenThreshold.value = token.reserveLiquidationThreshold/100;
            }

            const borrowButton = document.getElementById("borrow_input_button_" + token.symbol);
            if(borrowButton){
                borrowButton.checked = false;
            }
        }

        // Remove labels if no remaining sliders
        var remainingSliders = false;
        for(const key in tokenData){
            const token = tokenData[key];
            const sliderDivs = document.getElementById("slider_" + token.symbol);
            if(sliderDivs && sliderDivs.style.display == "grid"){
                remainingSliders = true;
                break;
            }
        }
        if(!remainingSliders){
            const sliderHeader = document.getElementById('values_container_header');
            const sliderEmptyText = document.getElementById('values_container_empty');
            sliderHeader.style.display = "none";
            sliderEmptyText.style.display = "block";
        }
    }
    
    useEffect(() => {
        // Display or hide net worth, health factor, and ltv textboxs
        const netWorthInfoIcon = document.getElementById("info_container_top_netWorth_icon");
        const netWorthTextBox = document.getElementById("netWorth_textbox");
        const healthFactorInfoIcon = document.getElementById("info_container_top_icon_healthFactor_icon");
        const healthFactorTextBox = document.getElementById("healthFactor_textbox");
        const ltvInfoIcon = document.getElementById("info_container_top_icon_ltv_icon");
        const ltvTextBox = document.getElementById("ltv_textbox");
    
        netWorthInfoIcon.addEventListener("click", () => {
            netWorthTextBox.style.opacity = "1";
            netWorthTextBox.style.visibility = "visible";
            
        });
        healthFactorInfoIcon.addEventListener("click", () => {
            healthFactorTextBox.style.opacity = "1";
            healthFactorTextBox.style.visibility = "visible";
        });
        ltvInfoIcon.addEventListener("click", () => {
            ltvTextBox.style.opacity = "1";
            ltvTextBox.style.visibility = "visible"
           
        });
    
        document.addEventListener("click", (event) => {
        if (!netWorthInfoIcon.contains(event.target) && !netWorthTextBox.contains(event.target)) {
            netWorthTextBox.style.opacity = "0";
            netWorthTextBox.style.visibility = "hidden";
           
        }
        if (!healthFactorInfoIcon.contains(event.target) && !healthFactorTextBox.contains(event.target)) {
            healthFactorTextBox.style.opacity = "0";
            healthFactorTextBox.style.visibility = "hidden";
        }
        if (!ltvInfoIcon.contains(event.target) && !ltvTextBox.contains(event.target)) {
            ltvTextBox.style.opacity = "0";
            ltvTextBox.style.visibility = "hidden";
        }
    });
        


        queryTokenDataFromTheGraph();
        handleResize();

        function handleResize() {
            const supplyDiv = document.getElementById("assets_supply");
            const borrowDiv = document.getElementById("assets_borrow");
            const supplyButton = document.getElementById('supply_button');
            const borrowButton = document.getElementById('borrow_button');
            const infoContainerOuter = document.getElementById('info_container_outer');
            const infoContainer = document.getElementById("info_container_top");
            const supplyModal = document.getElementById("modal_supply_content");
            const borrowModal = document.getElementById("modal_borrow_content");
            
            const supplyDivWidth = document.getElementById("assets_supply").offsetWidth;
            const borrowDivWidth = document.getElementById("assets_borrow").offsetWidth;
            const sliderDiv = document.getElementById("values_container");
            const switchSupplyAndBorrowBtn = document.getElementById("switchSupplyAndBorrow");
            const swithSupplyAndBorrowDiv = document.getElementById("switchSupplyAndBorrow_container");
            const screenWidth = window.innerWidth;

            const tabletThreshold = 1000;
            const mobileThreshold = 682;
            // If screen size is less than threshold
            if(screenWidth < tabletThreshold){
                switchSupplyAndBorrowBtn.style.display = "flex";
                borrowDiv.style.display = "none";
                supplyDiv.style.display = "block";
                sliderDiv.style.width = "90%";
                borrowDiv.style.width = "90%";
                supplyDiv.style.width = sliderDiv.style.width;
                supplyDiv.style.margin = "0";
                sliderDiv.style.paddingRight = "20px";
                sliderDiv.style.paddingLeft = "10px";
                // Set the supply/borrow button to supply
                supplyButton.classList.add('active');
                borrowButton.classList.remove('active');

            }
            else{
                switchSupplyAndBorrowBtn.style.display = "none";
                borrowDiv.style.width = "40%";
                supplyDiv.style.width = "40%";
                supplyDiv.style.marginRight = "15px";
                
                sliderDiv.style.paddingRight = "10px";
                sliderDiv.style.paddingLeft = "10px";
                
                supplyDiv.style.display = "block";
                borrowDiv.style.display = "block";
                infoContainerOuter.style.display = "block";
                
                sliderDiv.style.width = `${supplyDivWidth + borrowDivWidth -7}px`;
                
            }
            
            if(screenWidth < mobileThreshold){
                // Change the info container grid layout
                infoContainer.style.gridTemplateColumns = 'repeat(1, 1fr)';
                infoContainer.style.gridTemplateRows = 'repeat(6, auto)';
                swithSupplyAndBorrowDiv.style.width = "200px";

                //Adjust modal width
                supplyModal.style.width = "90%";
                borrowModal.style.width = "90%";
            }
            else{
                // Change the info container grid layout
                infoContainer.style.gridTemplateColumns ='repeat(3, 1fr)';
                infoContainer.style.gridTemplateRows =  'repeat(2, auto)';
                swithSupplyAndBorrowDiv.style.width = "";
                //Adjust modal width
                supplyModal.style.width = "50%";
                borrowModal.style.width = "50%";
            }

        }

        const supplyButton = document.getElementById('supply_button');
        const borrowButton = document.getElementById('borrow_button');
        const supplyDiv = document.getElementById("assets_supply");
        const borrowDiv = document.getElementById("assets_borrow");
        
        supplyButton.addEventListener('click', () => {
            supplyButton.classList.add('active');
            borrowButton.classList.remove('active');
            // Add logic here to switch to "supply" mode
            supplyDiv.style.display = "block";
            borrowDiv.style.display = "none";
        });

        borrowButton.addEventListener('click', () => {
            borrowButton.classList.add('active');
            supplyButton.classList.remove('active');
            // Add logic here to switch to "borrow" mode
            supplyDiv.style.display = "none";
            borrowDiv.style.display = "block";
        });


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

                <div className = "modal_supply_content" id = "modal_supply_content">
                    <div className="modal_supply_content_header">
                        <p>Assets to Supply</p>
                        <button className = "modal_supply_content_header_btn" onClick={clearSupplySide}>Clear Supply</button>                 
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
                            <div className = "modal_supply_content_assets_div">
                                <div className = "modal_supply_content_assets_bottom">
                                    <button className = "modal_supply_content_assets_bottom_btn" onClick={setSupplyModalVisibilityFalse}>Confirm</button>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                </div>

            </div>

            <div className={`modal_borrow ${modalBorrowVisible ? 'visible' : ''}`} id="modal_borrow">
                <div className = "modal_borrow_content" id = "modal_borrow_content">
                    <div className="modal_borrow_content_header">
                        <p>Assets to Borrow</p>
                        <button className = "modal_borrow_content_header_btn" onClick={clearBorrowSide}>Clear Borrow</button>
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
                            <div className = "modal_borrow_content_assets_div">
                                <div className = "modal_borrow_content_assets_bottom">
                                    <button className = "modal_borrow_content_assets_bottom_btn" onClick={setBorrowModalVisibilityFalse}>Confirm</button>
                                </div>
                            </div>
                         </div>
                    </div>

                </div>
            </div>
            <div className = "drop">
                <div className="dropdown">
                    <div className = "dropdown_text">
                        <div className = "dropdown_icon" id="dropdown_icon">{iconComponents[chain]}</div>       
                        <div onClick={showDropDown} className="dropdown_btn">{chain} Market</div>
                        <div className="dropdown_version" >
                            <p className="dropdown_version_text" id = "dropdown_version_text"  >{aaveVersion} </p>
                        </div>
                    </div>
                    <div id="myDropdown" className="dropdown_content">
                        <p className = "dropdown_content_text">Select Aave Market</p>
                        <button onClick={ () => changeNetwork("Ethereum", "V3") }>
                            <p>Ethereum</p>
                        </button>
                        <button onClick={ () => changeNetwork("Arbitrum", "V3") }>
                            <p>Arbitrum</p>
                        </button>
                        <button onClick={ () => changeNetwork("Avalanche", "V3") }>
                            <p>Avalanche</p>
                        </button>
                        <button onClick={ () => changeNetwork("Optimism", "V3") }>
                            <p>Optimism</p>
                        </button>
                        <button onClick={ () => changeNetwork("Polygon", "V3") }>
                            <p>Polygon</p>
                        </button>
                        {/* <button onClick={ () => changeNetwork("Metis", "V3") }>
                            <p>Metis</p>
                        </button>
                        <button onClick={ () => changeNetwork("Ethereum", "V2") }>
                            <p>Ethereum V2</p>
                        </button>
                        <button onClick={ () => changeNetwork("Polygon", "V2") }>
                            <p>Polygon V2</p>
                        </button>
                        <button onClick={ () => changeNetwork("Avalanche", "V2") }>
                            <p>Avalanche V2</p>
                        </button> */}
                    </div>
                </div>
                
            </div>


            <div className = "loading" id = "loading">
                <div className="loading_circle" id="loading_circle"></div>
                <p className = "loading_text" id = "loading_text">Loading Token Data...</p>
            </div>
     
            <div className = "search">
                <div className = "search_div">
                    <input id = "search_div_input" className = "search_div_input" placeholder = "Search by Address"></input>
                    <div className = "search_div_search" id = "search_div_search" onClick = {queryAddressForUserPosition}>
                        <SearchIcon className = "search_div_search_icon"/>
                    </div>
                </div>
            </div>

   

            <div className ="b_s">
                <div className='info'>
                    <div className = "info_container" id='info_container'>
                        <div className = "info_container_outer" id = "info_container_outer"> 
                            <div className = "info_container_top" id="info_container_top"> 

                                <div className = "info_container_top_div">
                                    <p className = "info_container_top_netWorth">Net Worth</p> 
                                    <div className = "info_container_top_iconDiv">
                                        <InfoIcon className = "info_container_top_netWorth_icon" id ="info_container_top_netWorth_icon"></InfoIcon>
                                    </div>  
                                    <div className="textbox" id="netWorth_textbox">Value supplied minus value borrowed.</div>
                                </div>   
                                <div className = "info_container_bottom_netWorth">
                                    <div className='info_container_bottom_netWorth_symbol'>$</div>
                                    <div className="info_container_bottom_netWorth_value" id = "info_container_bottom_netWorth_value">0.00</div>
                                </div>


                                <div className = "info_container_top_div">
                                    <p className = "info_container_top_healthFactor">Health Factor</p>
                                    <div className = "info_container_top_iconDiv">
                                        <InfoIcon className = "info_container_top_icon_healthFactor_icon" id = "info_container_top_icon_healthFactor_icon"></InfoIcon>
                                    </div>
                                    <div className="textbox" id="healthFactor_textbox">A numeric representation of the safety of your deposited assets against the borrowed assets and its underlying value. The higher the value is, the safer the state of your funds are against liquidation. If the health factor reaches 1, the liquidation of your deposits will be triggered.</div>   
                                </div>
                                <div className = "info_container_bottom_healthFactorValue" id = "info_container_bottom_healthFactorValue">{healthFactor}</div>
                                

                                <div className = "info_container_top_div">
                                    <p className='info_container_top_ltv'>Loan-to-Value Ratio</p>
                                    <div className = "info_container_top_iconDiv">
                                        <InfoIcon className = "info_container_top_icon_ltv_icon" id = "info_container_top_icon_ltv_icon"></InfoIcon>
                                    </div>
                                    <div className="textbox" id="ltv_textbox">The Loan to Value (”LTV”) ratio defines the maximum amount of assets that can be borrowed with a specific collateral. It is expressed as a percentage (e.g., at LTV=75%, for every 1 ETH worth of collateral, borrowers will be able to borrow 0.75 ETH worth of the corresponding currency).</div>
                                </div>  

                                <div>
                                    <div className="info_container_bottom_ltv" id = "info_container_bottom_ltv">0.00</div> 
                                    <div className='info_container_bottom_ltv_symbol'>%</div>         
                                </div>                                                    
                            </div>

                        </div>     
                    </div>                         
                </div>
                <div className = "switchSupplyAndBorrow" id = "switchSupplyAndBorrow">
                    <div className="switchSupplyAndBorrow_container" id ="switchSupplyAndBorrow_container">
                            <button id="supply_button" className="switchSupplyAndBorrow_button active">
                                <div className = "supply_button_div" id = "supply_button_div"></div>
                                <p className = "supply_button_text">Supply</p>
                            </button>
                            <button id="borrow_button" className="switchSupplyAndBorrow_button">
                                <div className = "borrow_button_div" id = "borrow_button_div"></div>
                                <p className = "borrow_button_text">Borrow</p>
                            </button>
                    </div>
                </div>
                <div className = "assets">
                    <div className = "assets_supply" id="assets_supply">
                        <div className = "assets_supply_top">
                            <p className = "assets_supply_top_header">Supplies</p>
                            <button className = "b_s_container_supply_btn" id = "b_s_container_supply_btn" onClick = {setSupplyModalVisibilityTrue}>Supply</button>
                        
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
                            <h3>Price (USD)</h3>
                            <h3>Value</h3>
                            <h3></h3>
                        </div>
                        <div className="assets_supply_tokens">
                            <ul id = "assets_supply_tokens_list" className = "assets_supply_tokens_list"></ul>
                        </div>
                        
                    </div>
                    
                    <div className = "assets_borrow" id="assets_borrow">
                        <div className = "assets_borrow_top">
                            <p className = "assets_borrow_top_header">Borrows</p>
                            <button className = "b_s_container_borrow_btn" id = "b_s_container_borrow_btn" onClick = {setBorrowModalVisibilityTrue}>Borrow</button>
                        </div>
                        <p className = "assets_borrow_nothing" id = "assets_borrow_nothing">Nothing borrowed yet</p>
                        <div className = "assets_borrow_info" id = "assets_borrow_info">
                            <div className = "assets_borrow_info_box_left" id = "assets_borrow_info_box_left" >
                                <div className = "assets_borrow_info_box_left_inner" >
                                    <p>Total Borrowed $</p>  
                                    <div className="info_container_bottom_totalBorrowed" id = "info_container_bottom_totalBorrowed">0.00</div>
                                </div>
                            </div> 
                        </div>
               
                       
                        <div className = "assets_borrow_header" id = "assets_borrow_header">
                            <h3>Asset</h3>
                            <h3>Amount</h3>
                            <h3>Price (USD)</h3>
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
           
            </div>
            
        </div>
        
     );
}
 
export default HeaderInfo;
