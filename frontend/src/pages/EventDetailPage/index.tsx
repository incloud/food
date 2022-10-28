import { DefaultLayout } from '../../components/DefaultLayout';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingPage } from '../../components/LoadingPage';
import { ErrorUnknownPage } from '../../components/Error/ErrorUnknownPage';
import { Error404Page } from '../../components/Error/Error404Page';
import { useEventQuery } from './gql/event.generated';
import { notification, Avatar, Button, List, Popconfirm, Col, Row } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { EventOrderForm } from './components/EventOrderForm';
import { useCurrentUserQuery } from '../../gql/user.generated';
import { useDeleteEventOrderMutation } from './gql/deleteEventOrder.generated';
import { useStartEventLotteryMutation } from './gql/startEventLottery.generated';
import { GreenCheckMark, RedStopSign } from '../../components/Icons';
import { EventDescriptions } from './components/EventDescriptions';
import { EventForm } from '../../components/EventForm';
import { useTranslation } from 'react-i18next';
import { SiteWarning } from 'components/SiteWarning';
import { defaultChildBottomMargin } from 'lib/styles';
import { Fragment } from 'react';

export const EventDetailPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useEventQuery({
    variables: { id: id || '' },
    skip: !id,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    pollInterval: 5000,
  });
  const { data: userData } = useCurrentUserQuery();
  const [deleteOrder, { loading: deleteLoading, error: deleteError }] =
    useDeleteEventOrderMutation();
  const [startLottery, { loading: lotteryLoading, error: lotteryError }] =
    useStartEventLotteryMutation();

  const [updateEventFormOpen, setUpdateEventFormOpen] = useState(false);
  const [createOrderFormOpen, setCreateOrderFormOpen] = useState(false);
  const [updateOrderId, setUpdateOrderId] = useState<string | null>(null);
  useEffect(() => {
    if (deleteError || lotteryError) {
      notification.error({
        message: deleteError
          ? t('pages.events.eventDetail.errors.deleteOrder')
          : t('pages.events.eventDetail.errors.lottery'),
      });
    }
  }, [deleteError, lotteryError, t]);

  const anyoneAvailabeForLottery = useMemo(() => {
    if (!data?.event?.orders) {
      return false;
    }
    return (
      data.event.orders.filter(order => order.availableForLottery).length > 0
    );
  }, [data]);

  if (error) {
    return <ErrorUnknownPage />;
  }
  if (!data?.event && loading) {
    return <LoadingPage />;
  }
  if (!id || !data?.event) {
    return <Error404Page />;
  }

  return (
    <DefaultLayout>
      <SiteWarning type="event" siteId={data.event.restaurant.site.id} />

      {!updateEventFormOpen ? (
        <Fragment>
          <Row>
            <Col flex={3}>
              <h2>{data.event.name}</h2>
            </Col>
            <Col>
              <Button
                icon={<EditOutlined />}
                onClick={() => setUpdateEventFormOpen(true)}
              />
            </Col>
          </Row>

          <EventDescriptions event={data.event} />

          {data.event.description && <p>{data.event.description}</p>}
        </Fragment>
      ) : (
        <EventForm
          initialValues={{
            ...data.event,
            restaurant: data.event.restaurant.id,
          }}
          onFinish={() => {
            setUpdateEventFormOpen(false);
            refetch();
          }}
          onCancel={() => setUpdateEventFormOpen(false)}
        />
      )}

      {!createOrderFormOpen && !updateEventFormOpen && data.event.active && (
        <div css={defaultChildBottomMargin}>
          <Button type="primary" onClick={() => setCreateOrderFormOpen(true)}>
            {t('pages.events.eventDetail.addOrder')}
          </Button>
          {data.event.active && (
            <Fragment>
              {' '}
              <Button
                type="default"
                onClick={async () => {
                  await startLottery({ variables: { id } });
                  return refetch();
                }}
                loading={lotteryLoading}
                disabled={
                  lotteryLoading || loading || !anyoneAvailabeForLottery
                }
              >
                {t('pages.events.eventDetail.startLottery')}
              </Button>
            </Fragment>
          )}
        </div>
      )}

      {createOrderFormOpen && (
        <EventOrderForm
          eventId={id}
          onFinish={() => {
            setCreateOrderFormOpen(false);
            refetch();
          }}
          onCancel={() => setCreateOrderFormOpen(false)}
        />
      )}

      <List
        dataSource={data.event.orders}
        loading={loading}
        rowKey="id"
        renderItem={item => (
          <List.Item
            actions={
              item.createdBy.id === userData?.user.id && data?.event?.active
                ? [
                    <Button
                      key={item.id}
                      icon={<EditOutlined />}
                      onClick={() =>
                        setUpdateOrderId(!updateOrderId ? item.id : null)
                      }
                    />,
                    <Popconfirm
                      key={item.id}
                      title={t('pages.events.eventDetail.deleteOrderTitle')}
                      onConfirm={async () => {
                        await deleteOrder({ variables: { id: item.id } });
                        return refetch();
                      }}
                      okText={t('pages.events.eventDetail.deleteOrderOkButton')}
                      cancelText={t(
                        'pages.events.eventDetail.deleteOrderCancelButton',
                      )}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        loading={deleteLoading}
                        disabled={deleteLoading}
                      />
                    </Popconfirm>,
                  ]
                : []
            }
          >
            {updateOrderId === item.id ? (
              <EventOrderForm
                orderId={item.id}
                eventId={id}
                onFinish={() => {
                  setUpdateOrderId(null);
                  refetch();
                }}
                initialValues={item}
              />
            ) : (
              <List.Item.Meta
                avatar={<Avatar src={item.createdBy.avatarUrl} />}
                title={
                  <Fragment>
                    {item.availableForLottery ? (
                      <GreenCheckMark />
                    ) : (
                      <RedStopSign />
                    )}{' '}
                    {item.createdBy.fullName}
                  </Fragment>
                }
                description={item.text}
              />
            )}
          </List.Item>
        )}
      />
    </DefaultLayout>
  );
};
