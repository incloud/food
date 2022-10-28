import { DefaultLayout } from '../../../../components/DefaultLayout';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingPage } from '../../../../components/LoadingPage';
import { ErrorUnknownPage } from '../../../../components/Error/ErrorUnknownPage';
import { Error404Page } from '../../../../components/Error/Error404Page';
import {
  Alert,
  Button,
  Col,
  Descriptions,
  notification,
  Popconfirm,
  Row,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useRestaurantQuery } from './gql/restaurant.generated';
import { RestaurantForm } from 'pages/RestaurantsPage/components/RestaurantForm';
import { getCommonRestaurantDescriptions } from 'components/getCommonRestaurantDescriptions';
import { defaultBottomMargin } from 'lib/styles';
import { SiteWarning } from 'components/SiteWarning';
import { useDeleteRestaurantMutation } from './gql/deleteRestaurant.generated';
import { paths } from 'lib/paths';
import { getCreatedUpdatedDescriptions } from 'components/getCreatedUpdatedDescriptions';
import { FunctionComponent } from 'react';
import { Fragment } from 'react';

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
      {data.restaurant.deleted && (
        <Alert
          message={t('pages.restaurantDetail.deleted')}
          type="error"
          showIcon
          css={defaultBottomMargin}
        />
      )}

      <SiteWarning type="restaurant" siteId={data.restaurant.site.id} />

      {!updateRestaurantFormOpen ? (
        <Fragment>
          <Row>
            <Col flex={3}>
              <h2>{data.restaurant.name}</h2>
            </Col>
            {!data.restaurant.deleted && (
              <Col>
                <Popconfirm
                  title={t('pages.restaurantDetail.deleteConfirmation')}
                  okText={t('common.yes')}
                  cancelText={t('common.no')}
                  onConfirm={async () => {
                    try {
                      await deleteRestaurant();
                    } catch {
                      notification.error(
                        t('common.errors.unknown', { returnObjects: true }),
                      );
                      return;
                    }

                    navigate(paths.restaurants);
                    notification.success(
                      t('pages.restaurantDetail.deleteSuccess', {
                        returnObjects: true,
                      }),
                    );
                  }}
                >
                  <Button icon={<DeleteOutlined />} />
                </Popconfirm>{' '}
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setUpdateRestaurantFormOpen(true)}
                  loading={deleteLoading}
                />
              </Col>
            )}
          </Row>

          <Descriptions column={1} css={defaultBottomMargin} bordered={true}>
            {getCommonRestaurantDescriptions({
              restaurant: data.restaurant,
              t,
              showName: false,
            })}
            {getCreatedUpdatedDescriptions({ entity: data.restaurant, t })}
          </Descriptions>
        </Fragment>
      ) : (
        <RestaurantForm
          initialValues={data.restaurant}
          onFinish={() => {
            setUpdateRestaurantFormOpen(false);
            refetch();
          }}
          onCancel={() => setUpdateRestaurantFormOpen(false)}
        />
      )}
    </DefaultLayout>
  );
};
