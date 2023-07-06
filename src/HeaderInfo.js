const HeaderInfo = () => {
    /* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
    function myFunction() {
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

    return ( 
        <div className='headerInfo'>
            <div class="dropdown">
                <div onClick={myFunction} className="dropbtn">Ethereum</div>
                <div id="myDropdown" class="dropdown-content">
                    <a href="#">Ethereum</a>
                    <a href="#">Aribtrum</a>
                    <a href="#">Avalanche</a>
                    <a href="#">Fantom</a>
                    <a href="#">Harmony</a>
                    <a href="#">Optimism</a>
                    <a href="#">Polygon</a>
                    <a href="#">Metis</a>
                </div>
            </div>
        </div>
     );
}
 
export default HeaderInfo;