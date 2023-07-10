import { Button, VStack } from '@chakra-ui/react';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DefaultLayout } from '~/components/DefaultLayout';
import { Error404Page } from '~/components/Error/Error404Page';
import { ErrorUnknownPage } from '~/components/Error/ErrorUnknownPage';
import { LoadingPage } from '~/components/LoadingPage';
import { PageTitle } from '~/components/PageTitle';
import { SiteDetailDisplay } from '~/pages/SitesPage/pages/SiteDetailPage/components/SiteDetailDisplay';
import { useSiteQuery } from '~/pages/SitesPage/pages/SiteDetailPage/gql/site.generated';
import { SiteForm } from '~/pages/SitesPage/pages/components/SiteForm';

export const SiteDetailPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useSiteQuery({
    variables: { id: id ?? '' },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const [updateSiteFormOpen, setUpdateSiteFormOpen] = useState(false);

  if (error) {
    return <ErrorUnknownPage />;
  }

  if (!data?.site && loading) {
    return <LoadingPage />;
  }

  if (!data?.site || !id) {
    return <Error404Page />;
  }

  return (
    <DefaultLayout>
      <PageTitle title={data.site.name}>
        {!updateSiteFormOpen && (
          <Button
            colorScheme="brand"
            onClick={() => setUpdateSiteFormOpen(true)}
          >
            {t('pages.siteDetail.editButton')}
          </Button>
        )}
      </PageTitle>
      <VStack width="50%" alignSelf="flex-start" alignItems="flex-start">
        {updateSiteFormOpen ? (
          <SiteForm
            initialValues={data.site}
            onFinish={() => {
              setUpdateSiteFormOpen(false);
              void refetch();
            }}
            onCancel={() => setUpdateSiteFormOpen(false)}
          />
        ) : (
          <SiteDetailDisplay site={data.site} />
        )}
      </VStack>
    </DefaultLayout>
  );
};
