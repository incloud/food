import { Box, Divider, Heading, HStack, Spacer } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';

interface IPageHeaderProps {
  title: string;
  children?: ReactNode;
}

export const PageTitle: FunctionComponent<IPageHeaderProps> = ({
  title,
  children,
}) => (
  <Box width="100%">
    <HStack>
      <Box>
        <Heading as="h2">{title}</Heading>
      </Box>
      <Spacer />
      <Box>
        <HStack>{children}</HStack>
      </Box>
    </HStack>
    <Divider />
  </Box>
);
