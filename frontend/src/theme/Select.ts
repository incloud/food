import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const helpers = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helpers.definePartsStyle(props => ({
  field: {
    background: 'initial',
    backgroundColor: mode('white', 'black')(props),
    color: mode('black', 'white')(props),
  },
}));

export const Select = helpers.defineMultiStyleConfig({
  baseStyle,
});
