import './App.css';
import {useEffect, useState} from 'react';
import Navbar from './navbar';
import HeaderInfo from './HeaderInfo';



function App() {

  const apiUrlCrypto = 'https://api.coingecko.com/api/v3';
  
  // Get crypto data from CoinGecko API
  async function fetchCrypotData() {
    fetch(`${apiUrlCrypto}/simple/price?ids=wrapped-bitcoin%2Cethereum%2Cdai%2Clusd%2Cusd-coin%2Ctether%2C1inch%2Caave%2Cbalancer%2Ccoinbase-wrapped-staked-eth%2Cconvex-crv%2Cethereum-name-service%2Clido-dao%2Cchainlink%2Cmaker%2Crocket-pool-eth%2Chavven%2Cuniswap%2Cweth%2Cwrapped-steth&vs_currencies=usd`)
    .then (respone => respone.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log('Error:', error);
    });
  }



  // Function to run once at the beginning
  useEffect(() => {
    fetchCrypotData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
  );

    
  

  return (
    <div className="App">
      <Navbar/>
      <HeaderInfo/>
    </div>
  );
}

export default App;
