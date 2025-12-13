import { Alert, AlertIcon, AlertDescription, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function ErrorMessage({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!isVisible || !message) return null;

  return (
    <Box position="fixed" bottom="20px" left="50%" transform="translateX(-50%)" zIndex={1000} minW="300px" maxW="500px">
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </Box>
  );
}

