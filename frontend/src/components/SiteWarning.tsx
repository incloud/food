import { Alert } from 'antd';
import { useCurrentUserQuery } from 'gql/user.generated';
import { defaultBottomMargin } from 'lib/styles';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

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
      showIcon
      css={defaultBottomMargin}
    />
  );
};
