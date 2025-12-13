import { Box, Heading, HStack, Text, Tooltip, IconButton, useBreakpointValue, Container } from '@chakra-ui/react';
import { CiCircleInfo } from "react-icons/ci";

const NavBar = ({ netWorth, healthFactor, ltv }) => {
  const showLabels = useBreakpointValue({ base: false, md: true });
  
  return (
    <Box
      as="nav"
      bg="gray.100"
      borderBottomWidth="1.5px"
      borderColor="gray.200"
      py={6}
      position="sticky"
      top={0}
      zIndex={1000}
      w="100%"
    >
      <Container maxW="100%" px={8}>
        <HStack justify="space-between" align="center" spacing={4} flexWrap="wrap">
        <Heading as="h1" size="md" color="white">
          Aave Health Calculator
        </Heading>
        <HStack spacing={{ base: 3, md: 6 }} flexWrap="wrap">
          <HStack spacing={2}>
            {showLabels && (
              <HStack spacing={0.5}>
                <Text fontSize="md" color="gray.600">Net Worth</Text>
                <Tooltip label="Value supplied minus value borrowed">
                  <IconButton
                    icon={<CiCircleInfo />}
                    size="xs"
                    variant="ghost"
                    aria-label="Net worth info"
                    color="gray.400"
                  />
                </Tooltip>
              </HStack>
            )}
            <Text fontSize="md" fontWeight="bold" color="white">
              ${netWorth?.toLocaleString() || '0'}
            </Text>
          </HStack>
          
          <HStack spacing={2}>
            {showLabels && (
              <HStack spacing={0.5}>
                <Text fontSize="md" color="gray.600">Health Factor</Text>
                <Tooltip label="A numeric representation of the safety of your position. If it reaches 1, liquidation will be triggered.">
                  <IconButton
                    icon={<CiCircleInfo />}
                    size="xs"
                    variant="ghost"
                    aria-label="Health factor info"
                    color="gray.400"
                  />
                </Tooltip>
              </HStack>
            )}
            <HStack spacing={1}>
              <Text
                fontSize="md"
                fontWeight="bold"
                color={
                  healthFactor?.value <= 1.1
                    ? 'red.500'
                    : healthFactor?.value <= 3
                    ? 'orange.500'
                    : 'green.500'
                }
              >
                {healthFactor?.display === '∞' ? '∞' : healthFactor?.display || '0.00'}
              </Text>
              {healthFactor?.value < 1 && (
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="red.500"
                >
                  (Liquidated)
                </Text>
              )}
            </HStack>
          </HStack>
          
          <HStack spacing={2}>
            {showLabels && (
              <HStack spacing={0.5}>
                <Text fontSize="md" color="gray.600">LTV</Text>
                <Tooltip label="The ratio of borrowed value to supplied value">
                  <IconButton
                    icon={<CiCircleInfo />}
                    size="xs"
                    variant="ghost"
                    aria-label="LTV info"
                    color="gray.400"
                  />
                </Tooltip>
              </HStack>
            )}
            <Text fontSize="md" fontWeight="bold" color="white">
              {ltv?.toFixed(2) || '0.00'}%
            </Text>
          </HStack>
        </HStack>
      </HStack>
      </Container>
    </Box>
  );
};

export default NavBar;
