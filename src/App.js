import './App.css';
import Navbar from './navbar';
import HeaderInfo from './HeaderInfo';
import Bottom from './bottom';

import { useEffect } from "react";

// const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID

// const useGoogleAnalytics = () => {
//   useEffect(() => {
//     // Inject the Google Analytics script dynamically
//     const script = document.createElement("script");
//     script.async = true;
//     script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
//     document.head.appendChild(script);

//     // Initialize Google Analytics
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){window.dataLayer.push(arguments);}
//     gtag("js", new Date());
//     gtag("config", GA_TRACKING_ID);
//   }, []);
// };

function App() {
  // useGoogleAnalytics();
  return (
    <div className="App">
      <Navbar/>
      <HeaderInfo/>
      <Bottom/>
    </div>
  );
}

export default App;
