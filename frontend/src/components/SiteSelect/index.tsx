import { Select } from '@chakra-ui/react';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteSelectQuery } from './gql/siteSelect.generated';
import { useUpdateUserSiteMutation } from './gql/updateUserSite.generated';
import { useCurrentUserQuery } from '~/gql/user.generated';

interface ISiteSelectProps {
  autoUpdateUser?: boolean;
}

export const SiteSelect: FunctionComponent<ISiteSelectProps> = ({
  autoUpdateUser,
}) => {
  const { t } = useTranslation();
  const { data: siteData, loading: siteDataLoading } = useSiteSelectQuery();
  const { data: userData, loading: userDataLoading } = useCurrentUserQuery();
  const [updateUserSite, { loading: updateLoading }] =
    useUpdateUserSiteMutation();

  const loading = siteDataLoading || userDataLoading || updateLoading;

  const handleSelect = useCallback(
    async (value: string) => {
      if (autoUpdateUser) {
        await updateUserSite({ variables: { id: value } });
      }
    },
    [autoUpdateUser, updateUserSite],
  );

  useEffect(() => {
    if (autoUpdateUser && !loading && !userData?.user.site?.id) {
      const siteId = siteData?.sites[0]?.id;
      if (siteId != null) {
        void updateUserSite({ variables: { id: siteId } });
      }
    }
  }, [
    autoUpdateUser,
    loading,
    siteData,
    updateUserSite,
    userData?.user.site?.id,
  ]);

  return (
    <Select
      placeholder={t('components.siteSelect.dropdownPlaceholder')}
      disabled={loading}
      onSelect={void handleSelect}
    >
      {siteData?.sites.map(site => (
        <option value={site.id} key={site.id}>
          {site.name}
        </option>
      ))}
    </Select>
  );
};
