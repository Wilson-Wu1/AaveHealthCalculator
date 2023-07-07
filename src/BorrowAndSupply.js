const  BorrowAndSupply = () => {

    function 

    return ( 
        <div className ="b_s">
            <div className = "b_s_container">
                <div className = "b_s_container_supply">
                    <p className = "b_s_container_supply_text">Add tokens being supplied</p>
                    <button className = "b_s_container_supply_btn">Supply</button>
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
    );
}
 
export default BorrowAndSupply;