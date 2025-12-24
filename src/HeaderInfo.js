import { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Container, VStack, HStack, Tabs, TabList, TabPanels, Tab, TabPanel, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { getSubgraphEndpoint } from './utils/networkUtils';
import { useTokenData } from './hooks/useTokenData';
import { useAavePosition } from './hooks/useAavePosition';
import { useTokenManagement } from './hooks/useTokenManagement';
import { useHealthFactor } from './hooks/useHealthFactor';
import NetworkSelector from './components/NetworkSelector';
import AddressInput from './components/AddressInput';
import SupplyModal from './components/SupplyModal';
import BorrowModal from './components/BorrowModal';
import SupplySection from './components/SupplySection';
import BorrowSection from './components/BorrowSection';
import TokenPricesTable from './components/TokenPricesTable';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorMessage from './components/ErrorMessage';
import { useDisclosure } from '@chakra-ui/react';

const HeaderInfo = ({ onMetricsChange }) => {
  const [chain, setChain] = useState("Ethereum");
    const [aaveVersion, setAaveVersion] = useState("V3");
  const [endpoint, setEndpoint] = useState(() => getSubgraphEndpoint("Ethereum", "V3"));
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    isOpen: isSupplyModalOpen,
    onOpen: onSupplyModalOpen,
    onClose: onSupplyModalClose
  } = useDisclosure();

  const {
    isOpen: isBorrowModalOpen,
    onOpen: onBorrowModalOpen,
    onClose: onBorrowModalClose
  } = useDisclosure();

  const { tokenData, loading: tokenDataLoading, error: tokenDataError } = useTokenData(endpoint, chain, aaveVersion);
  const { position, loading: positionLoading, error: positionError, fetchPosition, clearPosition } = useAavePosition(endpoint);
  
  const {
    supplyTokens,
    borrowTokens,
    addSupplyToken,
    removeSupplyToken,
    updateSupplyToken,
    addBorrowToken,
    removeBorrowToken,
    updateBorrowToken,
    clearSupplyTokens,
    clearBorrowTokens,
    clearAllTokens
  } = useTokenManagement();

  const { healthFactor, netWorth, ltv } = useHealthFactor(supplyTokens, borrowTokens);
      
    useEffect(() => {
    if (onMetricsChange) {
      onMetricsChange({ netWorth, healthFactor, ltv });
    }
  }, [netWorth, healthFactor, ltv, onMetricsChange]);

  const handleNetworkChange = useCallback((newNetwork) => {
    if (newNetwork !== chain) {
      setChain(newNetwork);
      setEndpoint(getSubgraphEndpoint(newNetwork, aaveVersion));
      clearAllTokens();
      clearPosition();
      setHasSearched(false);
    }
  }, [chain, aaveVersion, clearAllTokens, clearPosition]);

  const handleVersionChange = useCallback((newVersion) => {
    if (newVersion !== aaveVersion) {
      setAaveVersion(newVersion);
      setEndpoint(getSubgraphEndpoint(chain, newVersion));
      clearAllTokens();
      clearPosition();
      setHasSearched(false);
    }
  }, [chain, aaveVersion, clearAllTokens, clearPosition]);

  const handleAddressSearch = useCallback(async (address) => {
    setHasSearched(true);
    await fetchPosition(address);
  }, [fetchPosition]);

  useEffect(() => {
    if (position && position.length > 0 && tokenData) {
      clearAllTokens();
      
      position.forEach((pos) => {
        const token = tokenData.find(t => t.symbol === pos.reserve.symbol);
        if (!token) return;

        if (pos.currentATokenBalance > 0) {
          const amount = pos.currentATokenBalance / Math.pow(10, pos.reserve.decimals);
          addSupplyToken(token);
          updateSupplyToken(token.symbol, { amount });
        }

        if (pos.currentTotalDebt > 0) {
          const amount = pos.currentTotalDebt / Math.pow(10, pos.reserve.decimals);
          addBorrowToken(token);
          updateBorrowToken(token.symbol, { amount });
        }
      });
    } else if (hasSearched && position && position.length === 0) {
      setErrorMessage(`Address does not own an Aave position on the ${chain} network`);
    }
  }, [position, tokenData, addSupplyToken, addBorrowToken, updateSupplyToken, updateBorrowToken, clearAllTokens, chain, hasSearched]);
    
    useEffect(() => {
    if (tokenDataError) {
      setErrorMessage(tokenDataError);
    }
  }, [tokenDataError]);

    useEffect(() => {
    if (positionError) {
      setErrorMessage(positionError);
    }
  }, [positionError]);

  const handleSupplyTokenToggle = useCallback((token) => {
    const exists = supplyTokens.find(t => t.symbol === token.symbol);
    if (exists) {
      removeSupplyToken(token.symbol);
    } else {
      addSupplyToken(token);
    }
  }, [supplyTokens, addSupplyToken, removeSupplyToken]);

  const handleBorrowTokenToggle = useCallback((token) => {
    const exists = borrowTokens.find(t => t.symbol === token.symbol);
    if (exists) {
      removeBorrowToken(token.symbol);
        } else {
      addBorrowToken(token);
    }
  }, [borrowTokens, addBorrowToken, removeBorrowToken]);

  const handlePriceChange = useCallback((symbol, price) => {
    // Update both supply and borrow tokens if they exist
    const supplyToken = supplyTokens.find(t => t.symbol === symbol);
    const borrowToken = borrowTokens.find(t => t.symbol === symbol);
    
    if (supplyToken) {
      updateSupplyToken(symbol, { price });
    }
    if (borrowToken) {
      updateBorrowToken(symbol, { price });
    }
  }, [supplyTokens, borrowTokens, updateSupplyToken, updateBorrowToken]);

  const handleThresholdChange = useCallback((symbol, threshold) => {
    // Update supply token threshold (only supply tokens' thresholds affect health factor calculations)
    const supplyToken = supplyTokens.find(t => t.symbol === symbol);
    const borrowToken = borrowTokens.find(t => t.symbol === symbol);
    
    if (supplyToken) {
      updateSupplyToken(symbol, { liquidationThreshold: threshold });
    }
    // Also update borrow token threshold if it exists (for consistency, even though it doesn't affect calculations)
    if (borrowToken) {
      updateBorrowToken(symbol, { liquidationThreshold: threshold });
    }
  }, [supplyTokens, borrowTokens, updateSupplyToken, updateBorrowToken]);

  const handleSupplyAmountChange = useCallback((symbol, amount) => {
    updateSupplyToken(symbol, { amount });
  }, [updateSupplyToken]);

  const handleBorrowAmountChange = useCallback((symbol, amount) => {
    updateBorrowToken(symbol, { amount });
  }, [updateBorrowToken]);

  const allTokens = useMemo(() => {
    const tokenMap = new Map();
    
    // Add supply tokens first (they have liquidation threshold)
    supplyTokens.forEach(token => {
      tokenMap.set(token.symbol, { ...token });
    });
    
    // Add or merge borrow tokens
    borrowTokens.forEach(token => {
      if (tokenMap.has(token.symbol)) {
        // Token exists in both, keep supply token data (has threshold)
        // Price should already be synced via handlePriceChange
        const existing = tokenMap.get(token.symbol);
        // Ensure price is the same (use supply token's price)
        tokenMap.set(token.symbol, {
          ...existing,
          price: existing.price,
        });
      } else {
        // Only in borrow, add it with liquidation threshold (from token data)
        tokenMap.set(token.symbol, { 
          ...token,
          liquidationThreshold: token.liquidationThreshold || 0
        });
      }
    });
    
    return Array.from(tokenMap.values());
  }, [supplyTokens, borrowTokens]);

  const availableSupplyTokens = useMemo(() => {
    return tokenData?.filter(token => token.usageAsCollateralEnabled) || [];
  }, [tokenData]);

  const availableBorrowTokens = useMemo(() => {
    return tokenData?.filter(token => token.borrowingEnabled) || [];
  }, [tokenData]);

  const isLoading = tokenDataLoading || positionLoading;
  const isMobile = useBreakpointValue({ base: true, lg: false });

    return ( 
    <Box>
      <LoadingOverlay isOpen={isLoading} message={isLoading ? "Loading..." : ""} />
      <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
      
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={4} justify="space-between">
            <NetworkSelector
              chain={chain}
              aaveVersion={aaveVersion}
              onNetworkChange={handleNetworkChange}
              onVersionChange={handleVersionChange}
            />
            <AddressInput
              onSearch={handleAddressSearch}
              isLoading={positionLoading}
              disabled={!tokenData || isLoading}
            />
          </HStack>

          {isMobile ? (
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>Supply</Tab>
                <Tab>Borrow</Tab>
              </TabList>

              <TabPanels>
              <TabPanel>
                <SupplySection
                  tokens={supplyTokens}
                  onRemoveToken={removeSupplyToken}
                  onAmountChange={handleSupplyAmountChange}
                  onAddClick={onSupplyModalOpen}
                />
              </TabPanel>
              <TabPanel>
                <BorrowSection
                  tokens={borrowTokens}
                  onRemoveToken={removeBorrowToken}
                  onAmountChange={handleBorrowAmountChange}
                  onAddClick={onBorrowModalOpen}
                />
              </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <SimpleGrid columns={2} spacing={6}>
              <SupplySection
                tokens={supplyTokens}
                onRemoveToken={removeSupplyToken}
                onAmountChange={handleSupplyAmountChange}
                onAddClick={onSupplyModalOpen}
              />
              <BorrowSection
                tokens={borrowTokens}
                onRemoveToken={removeBorrowToken}
                onAmountChange={handleBorrowAmountChange}
                onAddClick={onBorrowModalOpen}
              />
            </SimpleGrid>
          )}

          <TokenPricesTable 
            tokens={allTokens} 
            onPriceChange={handlePriceChange}
            onThresholdChange={handleThresholdChange}
            supplyTokens={supplyTokens}
          />

          <SupplyModal
            isOpen={isSupplyModalOpen}
            onClose={onSupplyModalClose}
            tokens={availableSupplyTokens}
            selectedTokens={supplyTokens}
            onTokenToggle={handleSupplyTokenToggle}
            onConfirm={onSupplyModalClose}
            onClear={clearSupplyTokens}
          />

          <BorrowModal
            isOpen={isBorrowModalOpen}
            onClose={onBorrowModalClose}
            tokens={availableBorrowTokens}
            selectedTokens={borrowTokens}
            onTokenToggle={handleBorrowTokenToggle}
            onConfirm={onBorrowModalClose}
            onClear={clearBorrowTokens}
          />
        </VStack>
      </Container>
    </Box>
  );
};
 
export default HeaderInfo;
