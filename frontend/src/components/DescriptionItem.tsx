import { Box, Spacer, Stack, StackDirection, Text } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';

interface IDescriptionItemProps {
  label: string;
  direction?: StackDirection;
  children?: ReactNode;
}

export const DescriptionItem: FunctionComponent<IDescriptionItemProps> = ({
  label,
  direction = 'row',
  children,
}) => (
  <Stack direction={direction} width="100%">
    <Text fontWeight="bold">{label}</Text>
    <Spacer />
    {children && <Box>{children}</Box>}
  </Stack>
);
