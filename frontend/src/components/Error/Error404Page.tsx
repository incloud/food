import { Button } from 'antd';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';
import { paths } from '~/lib/paths';

export const Error404Page: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage title={t('common.errors.notFound.message')}>
      <p>{t('common.errors.notFound.description')}</p>
      <p>
        <Link to={paths.home}>
          <Button>{t('components.error.goHome')}</Button>
        </Link>
      </p>
    </ErrorPage>
  );
};
