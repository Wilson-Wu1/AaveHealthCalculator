import { Box, HStack, Link, Text, Button, IconButton, useToast, VStack } from '@chakra-ui/react';
import { ReactComponent as LinkedInImage } from './images/linkedIn.svg';
import { ReactComponent as GitHubImage } from './images/githubLogo.svg';
import { ReactComponent as CopyIcon } from './images/copy.svg';

const Bottom = () => {
  const toast = useToast();

  function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text);
    toast({
      title: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom',
    });
  }

  return (
    <Box
      as="footer"
      py={8}
      px={4}
      borderTopWidth="1px"
      borderColor="gray.200"
    >
      <VStack spacing={4}>
        <HStack spacing={4}>
          <Link
            href="https://github.com/Wilson-Wu1/AaveLiquidationCalculator"
            target="_blank"
            rel="noopener noreferrer"
            isExternal
          >
            <IconButton
              icon={<GitHubImage />}
              aria-label="GitHub"
              variant="ghost"
              size="lg"
            />
          </Link>
          <Link
            href="https://www.linkedin.com/in/wilson--wu/"
            target="_blank"
            rel="noopener noreferrer"
            isExternal
          >
            <IconButton
              icon={<LinkedInImage style={{ width: '31px', height: '31px' }} />}
              aria-label="LinkedIn"
              variant="ghost"
              size="lg"
            />
          </Link>
        </HStack>

        <Box textAlign="center">
          <Text mb={2}>Consider Donating</Text>
          <HStack spacing={2} justify="center">
            <Button
              size="sm"
              onClick={() => copyToClipboard("0x536366a0E8d6cd2c3424f0469a7CDC839E1bF786", "ERC20 address copied to clipboard")}
              leftIcon={<CopyIcon style={{ width: '14px', height: '14px' }} />}
            >
              ERC20
            </Button>
          </HStack>
        </Box>

        <Text fontSize="sm" color="gray.500">
          Created by Wilson Wu
        </Text>
      </VStack>
    </Box>
  );
};

export default Bottom;
