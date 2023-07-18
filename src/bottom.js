import { ReactComponent as LinkedInImage } from './images/linkedIn.svg';
import { ReactComponent as GitHubImage } from './images/githubLogo.svg';
const Bottom = () => {
    return ( 
        <div className="bottom">
        <div className = "bottom_info">
            
            
            <ul className="bottom_socials">
                <li><a href="https://github.com/Wilson-Wu1/CurrencyConverter" target="_blank" rel="noopener noreferrer"><GitHubImage/>
                    </a></li>
                <li><a href="https://www.linkedin.com/in/wilson--wu/" target="_blank" rel="noopener noreferrer"><LinkedInImage style = {{width:"31px", height: "31px"}}/></a></li>
            </ul>
            <div className = "bottom_info_address">
                <p>Consider Donating </p>
                <p>ERC20: <span>0x536366a0E8d6cd2c3424f0469a7CDC839E1bF786</span> </p>
                <p>BTC: <span>0x536366a0E8d6cd2c3424f0469a7CDC839E1bF786</span> </p>
            </div>
            
            <p>Created by Wilson Wu</p>
        </div>
  </div>
     );
}
 
export default Bottom;