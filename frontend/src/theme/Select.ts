import { selectAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const helpers = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = helpers.definePartsStyle({
  field: {
    background: 'initial',
    backgroundColor: 'white',
  },
});

export const Select = helpers.defineMultiStyleConfig({
  baseStyle,
});
