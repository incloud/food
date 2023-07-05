import { Alert } from 'antd';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUserQuery } from '~/gql/user.generated';

export const SiteWarning: FunctionComponent<{
  siteId: string;
  type: 'restaurant' | 'event';
}> = ({ type, siteId }) => {
  const { t } = useTranslation();
  const { data: userData } = useCurrentUserQuery();

  if (userData?.user.site?.id === siteId) {
    return null;
  }

  return (
    <Alert
      message={t('components.siteWarning', { type: t(`common.${type}`) })}
      type="warning"
      showIcon={true}
    />
  );
};
