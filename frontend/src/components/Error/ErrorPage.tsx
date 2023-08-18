import { Heading, Spacer, Text } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultLayout } from '../DefaultLayout';

export const ErrorPage: FunctionComponent<{
  title?: string;
  children: ReactNode;
}> = ({ title, children }) => {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <Spacer minH="20vh" />
      <Heading as="h2" size="lg">
        {t('common.errors.pageHeader')}
      </Heading>
      <Text>{title || t('common.errors.unknown.description')}</Text>
      {children}
    </DefaultLayout>
  );
};
