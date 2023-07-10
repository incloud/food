import {
  Button,
  Divider,
  Link,
  List,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { DefaultLayout } from '~/components/DefaultLayout';
import { ErrorUnknownPage } from '~/components/Error/ErrorUnknownPage';
import { PageTitle } from '~/components/PageTitle';
import { useDebounce } from '~/lib/hooks/useDebounce';
import { paths } from '~/lib/paths';
import { useSitesQuery } from '~/pages/SitesPage/pages/SiteListPage/gql/sites.generated';
import { SiteForm } from '~/pages/SitesPage/pages/components/SiteForm';

export const SiteListPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const [searchName] = useState('');
  const searchNameDebounced = useDebounce(searchName);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const { data, error, refetch } = useSitesQuery({
    variables: { name: searchNameDebounced || null },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  if (error) {
    return <ErrorUnknownPage />;
  }

  return (
    <DefaultLayout>
      <VStack width="100%" maxWidth="8xl" marginX="auto" paddingX={4}>
        <PageTitle title={t('common.site_plural')}>
          {!createFormOpen && (
            <Button colorScheme="brand" onClick={() => setCreateFormOpen(true)}>
              {t('pages.siteList.createSiteButton')}
            </Button>
          )}
        </PageTitle>

        {createFormOpen && (
          <>
            <SiteForm
              onFinish={() => {
                setCreateFormOpen(false);
                void refetch();
              }}
              onCancel={() => setCreateFormOpen(false)}
            />
            <Divider />
          </>
        )}

        <TableContainer width="100%">
          <Table variant="stripedContrast" size="lg">
            <Thead>
              <Tr>
                <Th>{t('common.name')}</Th>
                <Th>{t('common.webhook_plural')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.sites.map(site => (
                <Tr key={site.id}>
                  <Td verticalAlign="top">
                    <Link as={RouterLink} to={paths.site(site.id)}>
                      {site.name}
                    </Link>
                  </Td>
                  <Td>
                    <List>
                      {site.webhooks.map(webhook => (
                        <ListItem>{webhook.name}</ListItem>
                      ))}
                    </List>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </DefaultLayout>
  );
};
