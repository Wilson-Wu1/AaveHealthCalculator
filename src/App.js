import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './navbar';
import HeaderInfo from './HeaderInfo';
import Bottom from './bottom';

function App() {
  const [metrics, setMetrics] = useState({
    netWorth: 0,
    healthFactor: { value: Infinity, display: '∞', color: 'green' },
    ltv: 0
  });

  return (
    <Box minH="100vh" bg="#121212">
      <Navbar 
        netWorth={metrics.netWorth}
        healthFactor={metrics.healthFactor}
        ltv={metrics.ltv}
      />
      <HeaderInfo onMetricsChange={setMetrics} />
      <Bottom />
    </Box>
  );
}

export default App;
