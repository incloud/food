import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const baseStyle = defineStyle(props => ({
  background: 'initial',
  backgroundColor: mode('white', 'black')(props),

  _placeholder: {
    color: mode('gray.500', 'gray.400')(props),
  },
}));

export const Textarea = defineStyleConfig({
  baseStyle,
});
