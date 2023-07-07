import { Flex, HStack } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkButton } from '~/components/LinkButton';
import { paths } from '~/lib/paths';
import { IUser } from '~/types.generated';

interface INavigationProps {
  user?: Pick<IUser, 'fullName' | 'avatarUrl'> | null;
  activeKey: string;
  direction?: 'horizontal' | 'vertical';
}

export const Navigation: FunctionComponent<INavigationProps> = () => {
  const { t } = useTranslation();

  return (
    <Flex as="nav">
      <HStack>
        <LinkButton isNavigation={true} to={paths.events}>
          {t('common.event_plural')}
        </LinkButton>
        <LinkButton isNavigation={true} to={paths.restaurants}>
          {t('common.restaurant_plural')}
        </LinkButton>
        <LinkButton to={paths.sites}>{t('common.site_plural')}</LinkButton>
      </HStack>
    </Flex>
  );
};
