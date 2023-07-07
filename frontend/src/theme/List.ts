import { listAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const helpers = createMultiStyleConfigHelpers(parts.keys);

const variants = {
  fullWidth: helpers.definePartsStyle({
    container: {
      width: '100%',
    },
  }),
};

const baseStyle = helpers.definePartsStyle({
  container: {
    width: '100%',
    minWidth: '100%',
  },
  item: {
    width: '100%',
    paddingY: 2,
    borderBlockEnd: '1px solid black',

    _dark: {
      borderBlockEnd: '1px solid white',
    },
  },
});

export const List = helpers.defineMultiStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'fullWidth',
  },
});
