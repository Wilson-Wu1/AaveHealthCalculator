import { Input, InputGroup, InputRightElement, Button, Box } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export default function AddressInput({ onSearch, isLoading, disabled }) {
  const [address, setAddress] = useState('');

  const handleSearch = () => {
    if (address.trim()) {
      onSearch(address.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      <InputGroup size="md">
        <Input
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled || isLoading}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={handleSearch}
            isLoading={isLoading}
            disabled={disabled || isLoading || !address.trim()}
          >
            <SearchIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}

