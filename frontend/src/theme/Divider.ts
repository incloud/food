import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  height: '2px',
  backgroundColor: 'brand.500',
  margin: '0.5rem 0',
  opacity: 1,
});

export const Divider = defineStyleConfig({
  baseStyle,
});
