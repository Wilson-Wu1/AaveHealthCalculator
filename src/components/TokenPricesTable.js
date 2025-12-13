import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input
} from '@chakra-ui/react';
import { calculatePriceChange, formatPriceChange } from '../utils/tokenUtils';

export default function TokenPricesTable({ tokens, onPriceChange, onThresholdChange, supplyTokens = [] }) {
  if (!tokens || tokens.length === 0) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="md" bg="#1e1e1e">
        <Text fontWeight="semibold" mb={4}>Token Prices & Liquidation Thresholds</Text>
        <Text color="gray.500" textAlign="center" py={4}>
          Nothing supplied or borrowed yet
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="#1e1e1e">
      <Text fontWeight="semibold" mb={4}>Token Prices & Liquidation Thresholds</Text>
      <VStack spacing={4} align="stretch">
        {tokens.map((token) => {
          const priceChange = calculatePriceChange(token.price, token.originalPrice);
          const formattedChange = formatPriceChange(priceChange);
          const maxPrice = token.originalPrice * 3;

          return (
            <Box key={token.symbol} borderWidth="1px" borderRadius="md" p={4} bg="gray.100">
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="semibold" fontSize="lg">{token.symbol}</Text>
                  <HStack spacing={2}>
                    <Text fontSize="sm" color={formattedChange.color}>
                      ${token.price.toFixed(2)}
                    </Text>
                    <Text fontSize="sm" color={formattedChange.color}>
                      {formattedChange.percent}
                    </Text>
                    <Text fontSize="sm" color={formattedChange.color}>
                      {formattedChange.absolute}
                    </Text>
                  </HStack>
                </HStack>
                
                <Slider
                  value={token.price}
                  min={0}
                  max={maxPrice}
                  onChange={(value) => onPriceChange(token.symbol, value)}
                  step={0.01}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                
                <HStack justify="space-between" flexWrap="wrap" gap={4}>
                  <HStack>
                    <Text fontSize="sm">Min: $0.00</Text>
                    <Text fontSize="sm">Max: ${maxPrice.toFixed(2)}</Text>
                  </HStack>
                  {onThresholdChange && (
                    <HStack>
                      <Text fontSize="sm">Liquidation Threshold:</Text>
                      <Input
                        type="number"
                        value={token.liquidationThreshold ? (token.liquidationThreshold / 100) : ''}
                        onChange={(e) => onThresholdChange(token.symbol, (parseFloat(e.target.value) || 0) * 100)}
                        size="sm"
                        w="100px"
                        min={0}
                        max={100}
                        step={0.01}
                      />
                      <Text fontSize="sm">%</Text>
                    </HStack>
                  )}
                </HStack>
              </VStack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
