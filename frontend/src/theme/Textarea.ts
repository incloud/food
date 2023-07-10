import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  background: 'initial',
  backgroundColor: 'white',
});

export const Textarea = defineStyleConfig({
  baseStyle,
});
