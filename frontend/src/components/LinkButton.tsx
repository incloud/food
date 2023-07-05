import { Button, ButtonProps, Link } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

interface ILinkButtonProps extends LinkProps {
  buttonProps?: ButtonProps;
  children: ReactNode;
}

export const LinkButton: FunctionComponent<ILinkButtonProps> = ({
  children,
  buttonProps,
  ...linkProps
}) => (
  <Link as={RouterLink} {...linkProps}>
    <Button colorScheme="brand" {...buttonProps}>
      {children}
    </Button>
  </Link>
);
