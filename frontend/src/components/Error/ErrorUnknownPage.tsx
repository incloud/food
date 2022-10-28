import { Button } from 'antd';
import { ErrorPage } from './ErrorPage';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';

export const ErrorUnknownPage: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage>
      <p>{t('common.errors.unknown.description')}</p>
      <p>
        <Button onClick={() => window.location.reload()}>
          {t('components.error.retry')}
        </Button>
      </p>
    </ErrorPage>
  );
};
