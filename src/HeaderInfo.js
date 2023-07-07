import {useEffect, useState} from 'react';

const HeaderInfo = () => {

    const [chain, setChain] = useState("Ethereum")

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
        const modal = document.getElementById('modal');
    }



    

    function openModal(){
        const modal = document.getElementById('modal');
        modal.style.display = 'flex';
    }

    function closeModal(){
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }


    
    return ( 
        <div className='headerInfo'>

            <div className = "modal" id = "modal">
                <div className = "modal_content">

                    <div className="modal_content_header">
                        <p>Assets to Supply</p>
                        <button className="modal_close_btn" onClick = {closeModal}>Close</button>
                    </div>

                    <div className="modal_content_assets">
                        <div className="modal_content_assets_labels">
                            <p>Assets</p>
                            <p>Amount</p>
                        </div>
                        <div className="modal_content_assets_grid">
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
                        <button className = "b_s_container_supply_btn" onClick = {openModal}>Supply</button>
                    </div>
                    <div className = "b_s_container_borrow">
                        <p className = "b_s_container_borrow_text">Add tokens being borrowed</p>
                        <button className = "b_s_container_borrow_btn">Borrow</button>
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