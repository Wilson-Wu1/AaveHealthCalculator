import {useEffect, useState} from 'react';
import {ReactComponent as ExitSymbol} from './images/x-symbol.svg'



const HeaderInfo = (props) => {

    const [chain, setChain] = useState("Ethereum")
    const [modalSupplyVisible, setSupplyModalVisible] = useState(false);
    const [modalBorrowVisible, setBorrowModalVisible] = useState(false);
    
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
            // Create outer div
            const outerDiv = document.createElement("div");
            // Add li element to div
            const item = props.cryptoData[key];
            const liElement = document.createElement("li");
            liElement.textContent = `${item.symbol}`.toUpperCase();
            outerDiv.appendChild(liElement);
            // Add button element to div
            const btnElement = document.createElement("button");
            btnElement.textContent = 'Supply Asset';
            btnElement.addEventListener('click', () => {tempAddSupplySide(item, btnElement)});
            outerDiv.appendChild(btnElement);
            // Finally add the outer div element to the ul element
            ulElementSupply.appendChild(outerDiv);

            // Create outer div
            const outerDiv1 = document.createElement("div");
            // Add li element to div
            const item1 = props.cryptoData[key];
            const liElement1 = document.createElement("li");
            liElement1.textContent = `${item1.symbol}`.toUpperCase();
            outerDiv1.appendChild(liElement1);
            // Add button element to div
            const btnElement1 = document.createElement("button");
            btnElement1.textContent = 'Supply Asset';
            btnElement1.addEventListener('click', () => {tempAddBorrowSide(item1, btnElement1)});
            outerDiv1.appendChild(btnElement1);
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
        }
        else{
            tempBorrowArray.push(tokenToAdd);
            thisBtn.style.backgroundColor = "#547a5c";
            thisBtn.textContent = "Borrowed"
            setBorrowTokensArray(tempBorrowArray);
            displaySlider(tokenToAdd);
        }
    }
    
    // Add tokens to the supply side from the selected tokens
    function addSupplySide() {
        const ulElement = document.getElementById("assets_supply_tokens_list");
        const pTag = document.getElementById("assets_supply_nothing");
        const headerTag = document.getElementById("assets_supply_header");
        // Clear the existing list
        ulElement.innerHTML = ''; 

        if(supplyTokensArray.length == 0){
            pTag.style.display = "flex";
            headerTag.style.display = "none";
        }
        else{
            headerTag.style.display = "grid";
            pTag.style.display = "none";
            for (const token of supplyTokensArray) {
                // Create outer div
                const outerDiv = document.createElement("div");
                
                // Add li element to div
                const liElement = document.createElement("li");
                liElement.textContent = token.symbol.toUpperCase();
                outerDiv.appendChild(liElement);

                // Add amount input to div
                const amountElement = document.createElement("input");
                amountElement.id = "supply_input_"+token.id;
                amountElement.addEventListener("input", calculateCurrentHealthValue);
                amountElement.addEventListener("input", function() {calculateTokenValue(token.id);});
                amountElement.addEventListener("input", function() {displayPrice(token.id);});
                outerDiv.appendChild(amountElement);

                // Add price div
                const priceElement = document.createElement("p");
                priceElement.id = "supply_price_"+token.id;
                priceElement.value = 0;
                outerDiv.appendChild(priceElement);

                // Add Value div (Price * Amount)
                const valueElement = document.createElement("p");
                valueElement.id = "supply_value_"+token.id;
                valueElement.value = 0;
                outerDiv.appendChild(valueElement);

                // Finally add the outer div element to the ul element
                ulElement.appendChild(outerDiv);
            }
        }
        setSupplyModalVisible(false);
    }

    // Add tokens to the borrow side from the selected tokens
    function addBorrowSide() {
        const ulElement = document.getElementById("assets_borrow_tokens_list");
        const pTag = document.getElementById("assets_borrow_nothing");
        const headerTag = document.getElementById("assets_supply_header");
        // Clear the existing list
        ulElement.innerHTML = ''; 

        if(borrowTokensArray.length == 0){
            pTag.style.display = "flex";
            headerTag.style.display = "none";
        }
        else{
            headerTag.style.display = "grid";
            pTag.style.display = "none";
            for (const token of borrowTokensArray) {
                // Create outer div
                const outerDiv = document.createElement("div");
                // Add li element to div
                const liElement = document.createElement("li");
                liElement.textContent = token.symbol.toUpperCase();
                outerDiv.appendChild(liElement);
                // Add amount input to div
                const amountElement = document.createElement("input");
                amountElement.id = "borrow_input_"+token.id;
                amountElement.addEventListener("input", calculateCurrentHealthValue);
                outerDiv.appendChild(amountElement);
                // Finally add the outer div element to the ul element
                ulElement.appendChild(outerDiv);
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
    }

    function displaySlider(token){
        var tempArray = sliderTokensArray;
        const index = tempArray.indexOf(token);

        if (index == -1) {
            // Concat the borrow and supply arrays
            const sliderList = document.getElementById("values_container_list");

            // Create outer div
            const outerDiv = document.createElement("div");
            outerDiv.id = token.id;

            // Add li element to div
            const liElement = document.createElement("li");
            
            liElement.textContent = token.symbol.toUpperCase();
            outerDiv.appendChild(liElement);

            // Add value slider to div
            const valueInputElement = document.createElement("input");
            valueInputElement.type = "range";
            valueInputElement.min = "0";
            valueInputElement.max = token.current_price*2;
            valueInputElement.value = token.current_price;
            valueInputElement.id = "slider_input_"+token.id;
            valueInputElement.addEventListener("input", calculateCurrentHealthValue);
            valueInputElement.addEventListener("input", function() {calculateTokenValue(token.id);});
            valueInputElement.addEventListener("input", function() {displayPrice(token.id);});
            // Display the initial price;
            
            outerDiv.appendChild(valueInputElement);
            
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
    function calculateTokenValue(tokenID){
        const amount = document.getElementById("supply_input_"+tokenID).value;
        const price = document.getElementById("slider_input_"+tokenID).value;
        const valueElement = document.getElementById("supply_value_"+tokenID);

        valueElement.textContent = amount*price + " USD";
    }

    function displayPrice(tokenID){
        const price = document.getElementById("slider_input_"+tokenID).value;
        const priceElement = document.getElementById("supply_price_"+tokenID);
        priceElement.textContent = price + " USD";
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
            //console.log(token.id,inputAmount,currentPrice,liquidationThreshold );
            //console.log(inputAmount,currentPrice,liquidationThreshold);
            denominator += (currentPrice * inputAmount) * liquidationThreshold;
        }
        // Calculate the Numerator: Total Borrows
        var totalBorrowValue = 0;
        for(var j = 0; j < borrowTokensArray.length; j++){
            const token = borrowTokensArray[j];
            const inputAmount = document.getElementById("borrow_input_"+token.id).value;
            const currentPrice = document.getElementById("slider_input_"+token.id).value;
            totalBorrowValue += (inputAmount * currentPrice);
            console.log(inputAmount, currentPrice);
        }
        setHealthFactor(denominator/totalBorrowValue);
        //console.log(healthFactor);
        
    }

    useEffect(() => {
        addTokensToLists();
        handleResize();
        function handleResize() {
            const supplyDiv = document.getElementById("assets_supply").offsetWidth;
            const borrowDiv = document.getElementById("assets_borrow").offsetWidth;
            const sliderDiv = document.getElementById("values_container");
            const infoDiv = document.getElementById("info_container");
            sliderDiv.style.width = `${supplyDiv + borrowDiv}px`;
            infoDiv.style.width = `${supplyDiv + borrowDiv}px`;
            
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
                            <p>Amount</p>
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
                            <p>Amount</p>
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
                    <a href="#" onClick={ () => setChain("Ethereum") }>Ethereum</a>
                    <a href="#" onClick={ () => setChain("Aribtrum") }>Aribtrum</a>
                    <a href="#" onClick={ () => setChain("Avalanche") }>Avalanche</a>
                    <a href="#" onClick={ () => setChain("Fantom") }>Fantom</a>
                    <a href="#" onClick={ () => setChain("Harmony") }>Harmony</a>
                    <a href="#" onClick={ () => setChain("Optimism") }>Optimism</a>
                    <a href="#" onClick={ () => setChain("Polygon") }>Polygon</a>
                    <a href="#" onClick={ () => setChain("Metis") }>Metis</a>
                </div>
            </div>

            <div>
                <p>Net Worth</p>
                <div>$ 0</div>
            </div>

            <div className ="b_s">
                <div className='info'>
                    <div className = "info_container" id='info_container'>
                        <p>Position Information</p>

        
                        <div>Health Factor: {healthFactor}</div>
                    </div>
                </div>

                <div className = "assets">
                    <div className = "assets_supply" id="assets_supply">
                        <div className = "assets_supply_top">
                            <p className = "assets_supply_top_header">Supplies</p>
                            <button className = "b_s_container_supply_btn" onClick = {setSupplyModalVisibilityTrue}>Supply</button>
                        </div>
                        <p className = "assets_supply_nothing" id = "assets_supply_nothing">Nothing supplied yet</p>
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
                        <ul id = "values_container_list" className = "values_container_list"></ul>
                    
                    </div>
                </div>

                
            </div>
            <button onClick = {calculateCurrentHealthValue}>CALCULATE</button>
            
        </div>

        
     );
}
 
export default HeaderInfo;