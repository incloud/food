import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const helpers = createMultiStyleConfigHelpers(parts.keys);

const numericStyles = defineStyle({
  '&[data-is-numeric=true]': {
    textAlign: 'end',
  },
});

const variants = {
  stripedContrast: helpers.definePartsStyle(props => {
    const { colorScheme: c } = props;

    return {
      th: {
        color: mode('gray.600', 'gray.400')(props),
        borderBottom: '1px',
        borderColor: mode(`${c}.200`, `${c}.700`)(props),
        ...numericStyles,
      },
      td: {
        borderBottom: '1px',
        borderColor: mode(`${c}.200`, `${c}.700`)(props),
        ...numericStyles,
      },
      caption: {
        color: mode('gray.600', 'gray.100')(props),
      },
      tbody: {
        tr: {
          '&:nth-of-type(odd)': {
            'th, td': {
              borderBottomWidth: '1px',
              borderColor: mode(`${c}.200`, `${c}.700`)(props),
            },
            td: {
              background: mode(`${c}.200`, `${c}.700`)(props),
            },
          },
        },
      },
      tfoot: {
        tr: {
          '&:last-of-type': {
            th: { borderBottomWidth: 0 },
          },
        },
      },
    };
  }),
};

export const Table = helpers.defineMultiStyleConfig({
  variants,
});
