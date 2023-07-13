import './App.css';
import {useEffect, useState} from 'react';
import Navbar from './navbar';
import HeaderInfo from './HeaderInfo';



function App() {

  const apiUrlCrypto = 'https://api.coingecko.com/api/v3';
  const [cryptoData, setCryptoData] = useState(null);
  // https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=wrapped-bitcoin%2Cethereum%2Cdai%2Clusd%2Cusd-coin%2Ctether%2C1inch%2Caave%2Cbalancer%2Ccoinbase-wrapped-staked-eth%2Cconvex-crv%2Cethereum-name-service%2Clido-dao%2Cchainlink%2Cmaker%2Crocket-pool-eth%2Chavven%2Cuniswap%2Cweth%2Cwrapped-steth&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en
  // Get crypto data from CoinGecko API
  async function fetchCryptoData() {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=wrapped-bitcoin%2Cethereum%2Cdai%2Clusd%2Cusd-coin%2Ctether%2C1inch%2Caave%2Cbalancer%2Ccoinbase-wrapped-staked-eth%2Cconvex-crv%2Cethereum-name-service%2Clido-dao%2Cchainlink%2Cmaker%2Crocket-pool-eth%2Chavven%2Cuniswap%2Cweth%2Cwrapped-steth&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en")
    .then (respone => respone.json())
    .then(data => {
        console.log(data);
  
        setCryptoData(data);
    })
    .catch(error => {
        console.log('Error:', error);
    });
  }



  // Function to run once at the beginning
  useEffect(() => {
    fetchCryptoData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []
  );

    
  

  return (
    <div className="App">
      <Navbar/>
      {cryptoData && <HeaderInfo cryptoData = {cryptoData}/>}
    </div>
  );
}

export default App;
