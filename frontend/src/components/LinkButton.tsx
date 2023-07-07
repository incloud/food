import { Button, ButtonProps, Link } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';
import { Link as RouterLink, NavLink, LinkProps } from 'react-router-dom';

interface ILinkButtonProps extends LinkProps {
  buttonProps?: ButtonProps;
  isNavigation?: boolean;
  children: ReactNode;
}

export const LinkButton: FunctionComponent<ILinkButtonProps> = ({
  children,
  buttonProps,
  isNavigation = false,
  ...linkProps
}) => (
  <Link as={isNavigation ? NavLink : RouterLink} {...linkProps}>
    <Button colorScheme="brand" {...buttonProps}>
      {children}
    </Button>
  </Link>
);
