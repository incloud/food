import { Select } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { useTranslation } from 'react-i18next';
import { useSiteSelectQuery } from './gql/siteSelect.generated';
import { useUpdateUserSiteMutation } from './gql/updateUserSite.generated';
import { useCurrentUserQuery } from '../../gql/user.generated';
import { css } from '@emotion/react';
import { FunctionComponent } from 'react';

export const SiteSelect: FunctionComponent<
  SelectProps<string> & { autoUpdateUser?: boolean }
> = ({ autoUpdateUser, onSelect, ...props }) => {
  const { t } = useTranslation();
  const { data: siteData, loading: siteDataLoading } = useSiteSelectQuery();
  const { data: userData, loading: userDataLoading } = useCurrentUserQuery();
  const [updateUserSite, { loading: updateLoading }] =
    useUpdateUserSiteMutation();

  const loading = siteDataLoading || userDataLoading || updateLoading;

  if (
    autoUpdateUser &&
    !loading &&
    !userData?.user.site?.id &&
    siteData?.sites.length
  ) {
    void updateUserSite({ variables: { id: siteData.sites[0].id } });
  }

  return (
    <Select
      showSearch
      placeholder={t('components.siteSelect.dropdownPlaceholder')}
      optionFilterProp="children"
      loading={loading}
      disabled={loading}
      onSelect={async (value: string, option: DefaultOptionType) => {
        if (autoUpdateUser) {
          await updateUserSite({ variables: { id: value } });
        }
        if (onSelect) {
          onSelect(value, option);
        }
      }}
      defaultValue={userData?.user.site?.id}
      css={css`
        min-width: 10em;
      `}
      {...props}
    >
      {siteData?.sites.map(site => (
        <Select.Option value={site.id} key={site.id}>
          {site.name}
        </Select.Option>
      ))}
    </Select>
  );
};
