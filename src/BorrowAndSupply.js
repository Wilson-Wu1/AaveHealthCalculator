const BorrowAndSupply = () => {
    const handleButtonClick = (action) => {
        if (window.gtag) {
            window.gtag("event", action, {
                event_category: "User Interaction",
                event_label: action === "supply_click" ? "Supply Button" : "Borrow Button",
            });
        }
    };

    return ( 
        <div className="b_s">
            <div className="b_s_container">
                <div className="b_s_container_supply">
                    <p className="b_s_container_supply_text">Add tokens being supplied</p>
                    <button 
                        className="b_s_container_supply_btn"
                        onClick={() => handleButtonClick("supply_click")}
                    >
                        Supply
                    </button>
                </div>
                <div className="b_s_container_borrow">
                    <p className="b_s_container_borrow_text">Add tokens being borrowed</p>
                    <button 
                        className="b_s_container_borrow_btn"
                        onClick={() => handleButtonClick("borrow_click")}
                    >
                        Borrow
                    </button>
                </div>
            </div>

            <div className="assets">
                <div className="assets_supply">
                    <p className="assets_supply_nothing">Nothing supplied yet</p>
                </div>

                <div className="assets_borrow">
                    <p className="assets_borrow_nothing">Nothing borrowed yet</p>
                </div>
            </div>
        </div>
    );
}

export default BorrowAndSupply;
