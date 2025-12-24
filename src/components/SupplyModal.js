import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  HStack,
  Divider
} from '@chakra-ui/react';
import TokenList from './TokenList';

export default function SupplyModal({
  isOpen,
  onClose,
  tokens,
  selectedTokens,
  onTokenToggle,
  onConfirm,
  onClear
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent bg="#1e1e1e" borderWidth=".5px" borderColor="gray.700">
        <ModalHeader 
          fontSize="xl" 
          fontWeight="bold"
          pb={3}
          borderBottomWidth=".5px"
          borderColor="gray.700"
        >
          Assets to Supply
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.400" mb={2}>
              Select tokens to add to your supply position
            </Text>
            <TokenList
              tokens={tokens}
              selectedTokens={selectedTokens}
              onTokenToggle={onTokenToggle}
              type="supply"
            />
          </VStack>
        </ModalBody>
        <Divider borderColor="gray.700" />
        <ModalFooter>
          <HStack spacing={3}>
            <Button 
              variant="ghost" 
              onClick={onClear}
              color="gray.400"
              _hover={{ bg: 'gray.700', color: 'white' }}
            >
              Clear All
            </Button>
            <Button 
              onClick={onConfirm}
              colorScheme="blue"
              px={8}
            >
              Confirm
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
