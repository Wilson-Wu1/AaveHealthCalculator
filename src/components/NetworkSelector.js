import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Text,
  HStack
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { iconComponents, SUPPORTED_NETWORKS, AAVE_VERSIONS } from '../utils/networkUtils';

export default function NetworkSelector({ chain, aaveVersion, onNetworkChange, onVersionChange }) {
  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="outline"
          minW="200px"
        >
          <HStack spacing={2}>
            <Box w="20px" h="20px">
              {iconComponents[chain]}
            </Box>
            <Text>{chain} Market</Text>
            <Text fontSize="sm" color="gray.500">
              {aaveVersion}
            </Text>
          </HStack>
        </MenuButton>
        <MenuList>
          {SUPPORTED_NETWORKS.map((network) => (
            <MenuItem
              key={network}
              onClick={() => onNetworkChange(network)}
              bg={chain === network ? 'blue.500' : 'transparent'}
            >
              <HStack spacing={2}>
                <Box w="20px" h="20px">
                  {iconComponents[network]}
                </Box>
                <Text>{network}</Text>
              </HStack>
            </MenuItem>
          ))}
          <Box borderTop="1px" borderColor="gray.700" mt={2} pt={2}>
            {AAVE_VERSIONS.map((version) => (
              <MenuItem
                key={version}
                onClick={() => onVersionChange(version)}
                bg={aaveVersion === version ? 'blue.500' : 'transparent'}
              >
                <Text>{version}</Text>
              </MenuItem>
            ))}
          </Box>
        </MenuList>
      </Menu>
    </Box>
  );
}

