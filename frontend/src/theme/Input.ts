import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const helpers = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helpers.definePartsStyle(props => ({
  field: {
    background: 'initial',
    backgroundColor: mode('white', 'black')(props),

    _placeholder: {
      color: mode('gray.500', 'gray.400')(props),
    },
  },
}));

export const Input = helpers.defineMultiStyleConfig({
  baseStyle,
});
