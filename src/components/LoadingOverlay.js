import { Box, Spinner, Text } from '@chakra-ui/react';

export default function LoadingOverlay({ isOpen, message = "Loading..." }) {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.600"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={4}
    >
      <Spinner size="xl" color="blue.500" thickness="4px" />
      <Text fontSize="lg" color="white">
        {message}
      </Text>
    </Box>
  );
}

