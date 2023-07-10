import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useToast,
  VStack,
} from '@chakra-ui/react';
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
  const toast = useToast();
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
      toast({
        title: t('common.errors.unknown', { returnObjects: true }),
        status: 'error',
      });
      return;
    }

    navigate(paths.restaurants);
    toast({
      title: t('pages.restaurantDetail.deleteSuccess', {
        returnObjects: true,
      }),
      status: 'success',
    });
  }, [deleteRestaurant, navigate, t, toast]);

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
            <Popover placement="bottom-end">
              {({ onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button leftIcon={<DeleteOutlined />}>
                      {t('pages.restaurantDetail.delete')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverCloseButton />
                    <PopoverHeader>
                      {t('pages.restaurantDetail.deleteConfirmation')}
                    </PopoverHeader>
                    <PopoverFooter>
                      <ButtonGroup>
                        <Button onClick={onClose}>{t('common.no')}</Button>
                        <Button
                          colorScheme="brand"
                          onClick={void handleDeleteConfirm}
                        >
                          {t('common.yes')}
                        </Button>
                      </ButtonGroup>
                    </PopoverFooter>
                  </PopoverContent>
                </>
              )}
            </Popover>
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
