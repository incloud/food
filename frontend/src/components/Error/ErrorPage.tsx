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
      <h2>{title || t('common.errors.unknown.description')}</h2>
      {children}
    </DefaultLayout>
  );
};
