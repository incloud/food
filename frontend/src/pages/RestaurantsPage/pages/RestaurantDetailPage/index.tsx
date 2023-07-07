import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  VStack,
} from '@chakra-ui/react';
import { notification, Popconfirm } from 'antd';
import { useState, FunctionComponent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteRestaurantMutation } from './gql/deleteRestaurant.generated';
import { useRestaurantQuery } from './gql/restaurant.generated';
import { DefaultLayout } from '~/components/DefaultLayout';
import { Error404Page } from '~/components/Error/Error404Page';
import { ErrorUnknownPage } from '~/components/Error/ErrorUnknownPage';
import { LoadingPage } from '~/components/LoadingPage';
import { PageTitle } from '~/components/PageTitle';
import { SiteWarning } from '~/components/SiteWarning';
import { getCommonRestaurantDescriptions } from '~/components/getCommonRestaurantDescriptions';
import { getCreatedUpdatedDescriptions } from '~/components/getCreatedUpdatedDescriptions';
import { paths } from '~/lib/paths';
import { RestaurantForm } from '~/pages/RestaurantsPage/components/RestaurantForm';

export const RestaurantDetailPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useRestaurantQuery({
    variables: { id: id || '' },
    skip: !id,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });
  const [deleteRestaurant, { loading: deleteLoading }] =
    useDeleteRestaurantMutation({
      variables: { id: id || '' },
    });

  const [updateRestaurantFormOpen, setUpdateRestaurantFormOpen] =
    useState(false);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteRestaurant();
    } catch {
      notification.error(t('common.errors.unknown', { returnObjects: true }));
      return;
    }

    navigate(paths.restaurants);
    notification.success(
      t('pages.restaurantDetail.deleteSuccess', {
        returnObjects: true,
      }),
    );
  }, [deleteRestaurant, navigate, t]);

  if (error) {
    return <ErrorUnknownPage />;
  }
  if (!data?.restaurant && loading) {
    return <LoadingPage />;
  }
  if (!data?.restaurant || !id) {
    return <Error404Page />;
  }

  return (
    <DefaultLayout>
      <SiteWarning type="restaurant" siteId={data.restaurant.site.id} />
      {data.restaurant.deleted && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t('pages.restaurantDetail.deleted')}</AlertTitle>
        </Alert>
      )}
      <PageTitle title={data.restaurant.name}>
        {!updateRestaurantFormOpen && !data.restaurant.deleted && (
          <ButtonGroup>
            <Button
              colorScheme="brand"
              leftIcon={<EditOutlined />}
              onClick={() => setUpdateRestaurantFormOpen(true)}
              isLoading={deleteLoading}
            >
              {t('pages.restaurantDetail.edit')}
            </Button>
            <Popconfirm
              title={t('pages.restaurantDetail.deleteConfirmation')}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              onConfirm={() => void handleDeleteConfirm}
            >
              <Button leftIcon={<DeleteOutlined />}>
                {t('pages.restaurantDetail.delete')}
              </Button>
            </Popconfirm>{' '}
          </ButtonGroup>
        )}
      </PageTitle>
      {!updateRestaurantFormOpen ? (
        <VStack width="50%" alignSelf="flex-start">
          {getCommonRestaurantDescriptions({
            restaurant: data.restaurant,
            t,
            showName: false,
          })}
          {getCreatedUpdatedDescriptions({ entity: data.restaurant, t })}
        </VStack>
      ) : (
        <RestaurantForm
          initialValues={data.restaurant}
          onFinish={() => {
            setUpdateRestaurantFormOpen(false);
            void refetch();
          }}
          onCancel={() => setUpdateRestaurantFormOpen(false)}
        />
      )}
    </DefaultLayout>
  );
};
