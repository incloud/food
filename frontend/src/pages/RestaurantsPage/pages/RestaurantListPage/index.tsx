import { FunctionComponent, useState } from 'react';
import { DefaultLayout } from 'components/DefaultLayout';
import { ErrorUnknownPage } from 'components/Error/ErrorUnknownPage';
import { Button, Col, Input, Row, Table } from 'antd';
import { useDebounce } from 'lib/hooks/useDebounce';
import { defaultChildBottomMargin, defaultGutter } from 'lib/styles';
import { useTranslation } from 'react-i18next';
import { useCurrentUserQuery } from 'gql/user.generated';
import { useRestaurantsQuery } from './gql/restaurants.generated';
import { paths } from 'lib/paths';
import { Link } from 'react-router-dom';
import { RestaurantForm } from 'pages/RestaurantsPage/components/RestaurantForm';

export const RestaurantListPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const [searchName, setSearchName] = useState('');
  const searchNameDebounced = useDebounce(searchName);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const { data: userData } = useCurrentUserQuery();
  const { data, loading, error, refetch } = useRestaurantsQuery({
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
      <Row
        justify="space-between"
        gutter={defaultGutter}
        css={defaultChildBottomMargin}
      >
        <Col flex={3}>
          <h2>{t('common.restaurant_plural')}</h2>
        </Col>
        <Col>
          <Input.Search
            placeholder={t('common.name')}
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            loading={loading && !!searchName}
          />
        </Col>
        {!createFormOpen && (
          <Col>
            <Button type="primary" onClick={() => setCreateFormOpen(true)}>
              {t('pages.restaurantList.createRestaurantButton')}
            </Button>
          </Col>
        )}
      </Row>

      {createFormOpen && (
        <RestaurantForm
          onFinish={() => {
            setCreateFormOpen(false);
            refetch();
          }}
          onCancel={() => setCreateFormOpen(false)}
        />
      )}

      <Table
        columns={[
          {
            title: t('common.name').toString(),
            dataIndex: 'name',
            render: (value: string, record) => (
              <Link to={paths.restaurant(record.id)}>{value}</Link>
            ),
          },
          {
            title: t('common.restaurantDescription.address').toString(),
            dataIndex: 'address',
            render: (value: string | null) => value?.split('\n').join(', '),
          },
          {
            title: t('common.restaurantDescription.website').toString(),
            dataIndex: 'website',
            render: (value: string) => (
              <a href={value} rel="noopener noreferrer" target="_blank">
                {value}
              </a>
            ),
          },
        ]}
        rowKey="id"
        dataSource={data?.restaurants}
        loading={loading}
        scroll={{ x: true }}
      />
    </DefaultLayout>
  );
};
