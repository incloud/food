import { Button } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorPage } from './ErrorPage';

export const ErrorUnknownPage: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <ErrorPage>
      <p>
        <Button onClick={() => window.location.reload()}>
          {t('components.error.retry')}
        </Button>
      </p>
    </ErrorPage>
  );
};
