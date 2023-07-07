import { extendTheme } from '@chakra-ui/react';
import { ButtonGroup } from '~/theme/ButtonGroup';
import { Divider } from '~/theme/Divider';
import { Heading } from '~/theme/Heading';
import { Input } from '~/theme/Input';
import { Link } from '~/theme/Link';
import { List } from '~/theme/List';
import { Select } from '~/theme/Select';
import { Table } from '~/theme/Table';
import { Textarea } from '~/theme/Textarea';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const styles = {
  global: {
    body: {},
  },
};

const components = {
  List,
  Link,
  Divider,
  Heading,
  Input,
  Select,
  Textarea,
  ButtonGroup,
  Table,
};

export const theme = extendTheme({
  config,
  styles,
  components,
  colors: {
    brand: {
      50: '#FFECE5',
      100: '#FFCAB8',
      200: '#FFA78A',
      300: '#FF855C',
      400: '#FF622E',
      500: '#FF4000',
      600: '#CC3300',
      700: '#992600',
      800: '#661A00',
      900: '#330D00',
    },
  },
});
