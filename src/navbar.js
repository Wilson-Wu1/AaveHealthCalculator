import {ReactComponent as QuestionIcon} from './images/questionIcon.svg'
const NavBar = () => {
    return (  
        <nav className="navbar">
            
           
            <h1>Aave Health Calculator</h1>
            <QuestionIcon className = "navbar_questionIcon" id = "navbar_questionIcon"/>
        </nav>

    );
}
 
export default NavBar;