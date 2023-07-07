import {useEffect, useState} from 'react';
import {ReactComponent as ExitSymbol} from './images/x-symbol.svg'

const HeaderInfo = () => {

    const [chain, setChain] = useState("Ethereum")
    const [modalSupplyVisible, setSupplyModalVisible] = useState(false);
    const [modalBorrowVisible, setBorrowModalVisible] = useState(false);

    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
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


    function openSupplyModal() {
        setSupplyModalVisible(true);
    }
    
    function closeSupplyModal() {
        setSupplyModalVisible(false);
    }

    function openBorrowModal() {
        setBorrowModalVisible(true);
    }
    
    function closeBorrowModal() {
        setBorrowModalVisible(false);
    }


    
    
    return ( 
        <div className='headerInfo'>

            <div className={`modal_supply ${modalSupplyVisible ? 'visible' : ''}`} id="modal_supply">
                <div className = "modal_supply_content">


                    <div className="modal_supply_content_header">
                        <p>Assets to Supply</p>
                        <ExitSymbol className = "modal_supply_exit" onClick = {closeSupplyModal}/>
                    </div>

                    <div className="modal_supply_content_assets">
                        <div className="modal_supply_content_assets_labels">
                            <p>Assets</p>
                            <p>Amount</p>
                        </div>
                        <div className="modal_supply_content_assets_grid">
                        </div>
                    </div>

                </div>
            </div>

            <div className={`modal_borrow ${modalBorrowVisible ? 'visible' : ''}`} id="modal_borrow">
                <div className = "modal_borrow_content">


                    <div className="modal_borrow_content_header">
                        <p>Assets to Borrow</p>
                        <ExitSymbol className = "modal_borrow_exit" onClick = {closeBorrowModal}/>
                    </div>

                    <div className="modal_borrow_content_assets">
                        <div className="modal_borrow_content_assets_labels">
                            <p>Assets</p>
                            <p>Amount</p>
                        </div>
                        <div className="modal_borrow_content_assets_grid">
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
                <div className = "b_s_container">
                    <div className = "b_s_container_supply">
                        <p className = "b_s_container_supply_text">Add tokens being supplied</p>
                        <button className = "b_s_container_supply_btn" onClick = {openSupplyModal}>Supply</button>
                    </div>
                    <div className = "b_s_container_borrow">
                        <p className = "b_s_container_borrow_text">Add tokens being borrowed</p>
                        <button className = "b_s_container_borrow_btn" onClick = {openBorrowModal}>Borrow</button>
                    </div>
                </div>

                <div className = "assets">
                    <div className = "assets_supply">
                        <p className = "assets_supply_nothing">Nothing supplied yet</p>
                    </div>

                    <div className = "assets_borrow">
                    <p className = "assets_borrow_nothing">Nothing borrowed yet</p>
                    </div>
                </div>

                
            </div>
        </div>

        
     );
}
 
export default HeaderInfo;