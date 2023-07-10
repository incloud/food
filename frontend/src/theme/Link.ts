import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  color: 'brand.500',
});

export const Link = defineStyleConfig({
  baseStyle,
});
