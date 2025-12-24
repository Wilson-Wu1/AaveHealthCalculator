import {
  Box,
  VStack,
  HStack,
  Text,
  Input
} from '@chakra-ui/react';

export default function TokenList({
  tokens,
  selectedTokens,
  onTokenToggle,
  onAmountChange,
  type = 'supply', // 'supply' or 'borrow'
  showAmounts = false
}) {
  return (
    <VStack spacing={3} align="stretch" maxH="500px" overflowY="auto" pr={2}>
      {tokens && tokens.length > 0 ? (
        tokens.map((token) => {
          const isSelected = selectedTokens.some(t => t.symbol === token.symbol);
          const selectedToken = selectedTokens.find(t => t.symbol === token.symbol);
          const isDisabled = (type === 'supply' && !token.usageAsCollateralEnabled) ||
            (type === 'borrow' && !token.borrowingEnabled);
          
          return (
            <Box
              key={token.symbol}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={isSelected ? '#1e1e1e' : '#1e1e1e'}
              borderColor={isSelected ? 'blue.400' : 'gray.600'}
              _hover={{ 
                borderColor: isDisabled ? 'gray.600' : (isSelected ? 'blue.300' : 'blue.500'),
                cursor: isDisabled ? 'not-allowed' : 'pointer',
      
                boxShadow: isDisabled ? 'none' : 'lg'
              }}
              transition="all 0.2s"
              onClick={() => {
                if (!isDisabled) {
                  onTokenToggle(token);
                }
              }}
              opacity={isDisabled ? 0.5 : 1}
              position="relative"
            >
              {isSelected && (
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  w="8px"
                  h="8px"
                  bg="blue.400"
                  borderRadius="full"
                />
              )}
              <HStack justify="space-between" align="center">
                <Text 
                  fontWeight="semibold" 
                  fontSize="lg"
                  userSelect="none" 
                  color={isSelected ? 'blue.300' : 'white'}
                >
                  {token.symbol}
                </Text>
                {showAmounts && isSelected && (
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={selectedToken?.amount || ''}
                    onChange={(e) => {
                      e.stopPropagation();
                      onAmountChange(token.symbol, parseFloat(e.target.value) || 0);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    size="sm"
                    w="150px"
                    bg="gray.700"
                    color="white"
                    borderColor="gray.600"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                    }}
                  />
                )}
              </HStack>
            </Box>
          );
        })
      ) : (
        <Text color="gray.500" textAlign="center" py={8}>
          No tokens available
        </Text>
      )}
    </VStack>
  );
}
