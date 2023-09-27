import { ReactComponent as LinkedInImage } from './images/linkedIn.svg';
import { ReactComponent as GitHubImage } from './images/githubLogo.svg';
import { ReactComponent as  CopyIcon} from './images/copy.svg';
const Bottom = () => {
    function copyToClipboard(text, message){
        navigator.clipboard.writeText(text);
        displayCopyMessage(message);
    }

    function displayCopyMessage(message) {
        const errorContainer = document.getElementById('bottom_errorContainer');
        errorContainer.innerText = message;
        errorContainer.style.opacity = 1; // Ensure the container is visible
        errorContainer.style.display = 'block';
        // Set a timeout to fade out the error message after the specified duration
        setTimeout(() => {
          errorContainer.style.opacity = 0; // Fade out the error message
        }, 5000);
    }

    return ( 
        <div className="bottom">
        <div className = "bottom_info">
            <ul className="bottom_socials">
                <li><a href="https://github.com/Wilson-Wu1/AaveLiquidationCalculator" target="_blank" rel="noopener noreferrer"><GitHubImage/>
                    </a></li>
                <li><a href="https://www.linkedin.com/in/wilson--wu/" target="_blank" rel="noopener noreferrer"><LinkedInImage style = {{width:"31px", height: "31px"}}/></a></li>
            </ul>
            <div className = "bottom_info_address">
                <p>Consider Donating </p>
                <div className = "bottom_info_address_div">
                    {/*}
                    <button onClick = {() => copyToClipboard("0x536366a0E8d6cd2c3424f0469a7CDC839E1bF786", "BTC address copied to clipboard")}>
                        <div>
                            <p className = "bottom_info_address_div_symbol">BTC</p>
                            <CopyIcon className = "bottom_info_address_icon"/>
                        </div>
                        
                    </button>
                    
                    <p className = "bottom_info_address_div_divider">|</p>
                    */}
                    
                    <button onClick = {() => copyToClipboard("0x536366a0E8d6cd2c3424f0469a7CDC839E1bF786", "ERC20 address copied to clipboard")}>
                        <div>
                            <p className = "bottom_info_address_div_symbol">ERC20</p>
                            <CopyIcon className = "bottom_info_address_icon"/>
                        </div>
                    </button>
                    
                </div>
            </div>
            
            <p>Created by Wilson Wu</p>
            <div className = "bottom_errorContainer" id = "bottom_errorContainer"></div>
        </div>
  </div>
     );
}
 
export default Bottom;