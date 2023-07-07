import { SearchOutlined } from '@ant-design/icons';
import {
  Input,
  Button,
  InputGroup,
  InputRightAddon,
  Box,
  Divider,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
} from '@chakra-ui/react';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useRestaurantsQuery } from './gql/restaurants.generated';
import { DefaultLayout } from '~/components/DefaultLayout';
import { ErrorUnknownPage } from '~/components/Error/ErrorUnknownPage';
import { PageTitle } from '~/components/PageTitle';
import { useCurrentUserQuery } from '~/gql/user.generated';
import { useDebounce } from '~/lib/hooks/useDebounce';
import { paths } from '~/lib/paths';
import { RestaurantForm } from '~/pages/RestaurantsPage/components/RestaurantForm';

export const RestaurantListPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const [searchName, setSearchName] = useState('');
  const searchNameDebounced = useDebounce(searchName);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const { data: userData } = useCurrentUserQuery();
  const { data, error, refetch } = useRestaurantsQuery({
    variables: {
      site: userData?.user.site?.id || '',
      name: searchNameDebounced || null,
    },
    skip: !userData?.user.site?.id,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  if (error) {
    return <ErrorUnknownPage />;
  }

  return (
    <DefaultLayout>
      <PageTitle title={t('common.restaurant_plural')}>
        <InputGroup>
          <Input
            placeholder={t('common.name')}
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
          <InputRightAddon>
            <SearchOutlined />
          </InputRightAddon>
        </InputGroup>
        {!createFormOpen && (
          <Box>
            <Button colorScheme="brand" onClick={() => setCreateFormOpen(true)}>
              {t('pages.restaurantList.createRestaurantButton')}
            </Button>
          </Box>
        )}
      </PageTitle>

      {createFormOpen && (
        <>
          <RestaurantForm
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
              <Th>{t('common.restaurantDescription.address')}</Th>
              <Th>{t('common.restaurantDescription.website')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.restaurants.map(item => (
              <Tr>
                <Td>
                  <Link as={RouterLink} to={paths.restaurant(item.id)}>
                    {item.name}
                  </Link>
                </Td>
                <Td>{item.address?.split('\n').join(', ')}</Td>
                <Td>
                  {item.website != null && (
                    <Link
                      isExternal={true}
                      href={item.website}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.website}
                    </Link>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </DefaultLayout>
  );
};
