import {
  Box,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { calculateTokenValue, formatPrice } from '../utils/tokenUtils';

export default function BorrowSection({
  tokens,
  onRemoveToken,
  onAmountChange,
  onAddClick
}) {
  const totalBorrowed = tokens.reduce((sum, token) => {
    return sum + calculateTokenValue(token.amount, token.price);
  }, 0);

  if (tokens.length === 0) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="md" bg="#1e1e1e">
        <HStack justify="space-between" mb={4}>
          <Text fontWeight="semibold" fontSize="lg">Borrows</Text>
          <Button 
            onClick={onAddClick}
            colorScheme="purple"
            size="md"
            fontWeight="semibold"
            px={6}
          >
            Borrow
          </Button>
        </HStack>
        <Text color="gray.500" textAlign="center" py={4}>
          Nothing borrowed yet
        </Text>
      </Box>
    );
  }

  return (
      <Box p={4} borderWidth="1px" borderRadius="md" bg="#1e1e1e">
        <HStack justify="space-between" mb={4}>
          <Text fontWeight="semibold" fontSize="lg">Borrows</Text>
          <Button 
            onClick={onAddClick}
            colorScheme="purple"
            size="md"
            fontWeight="semibold"
            px={6}
          >
            Borrow
          </Button>
        </HStack>

      <Box mb={4}>
        <Text fontSize="sm" color="gray.500">Total Borrowed</Text>
        <Text fontSize="xl" fontWeight="bold">${formatPrice(totalBorrowed)}</Text>
      </Box>

      <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.200" overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th>Amount</Th>
              <Th>Value</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {tokens.map((token) => (
              <Tr key={token.symbol}>
                <Td>{token.symbol}</Td>
                <Td >
                  <Input
                    type="number"
                    value={token.amount || ''}
                    onChange={(e) => onAmountChange(token.symbol, parseFloat(e.target.value) || 0)}
                    size="sm"
                    w="100px"
                    bg="#1e1e1e"
                  />
                </Td>
                <Td>${formatPrice(calculateTokenValue(token.amount, token.price))}</Td>
                <Td>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() => onRemoveToken(token.symbol)}
                    aria-label="Remove token"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

