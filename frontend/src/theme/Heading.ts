import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  marginTop: '1rem',
  paddingBottom: '1rem',
});

export const Heading = defineStyleConfig({
  baseStyle,
});
