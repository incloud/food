import { DeleteOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  List,
  ListItem,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { EventDescriptions } from './components/EventDescriptions';
import { EventOrderForm } from './components/EventOrderForm';
import { useDeleteEventOrderMutation } from './gql/deleteEventOrder.generated';
import { useEventQuery } from './gql/event.generated';
import { useStartEventLotteryMutation } from './gql/startEventLottery.generated';
import { DefaultLayout } from '~/components/DefaultLayout';
import { DescriptionItem } from '~/components/DescriptionItem';
import { Error404Page } from '~/components/Error/Error404Page';
import { ErrorUnknownPage } from '~/components/Error/ErrorUnknownPage';
import { EventForm } from '~/components/EventForm';
import { useUpdateEventMutation } from '~/components/EventForm/gql/updateEvent.generated';
import { GreenCheckMark, RedStopSign } from '~/components/Icons';
import { LoadingPage } from '~/components/LoadingPage';
import { PageTitle } from '~/components/PageTitle';
import { SiteWarning } from '~/components/SiteWarning';
import { useCurrentUserQuery } from '~/gql/user.generated';

export const EventDetailPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const toast = useToast();
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
  const [updateEvent, { loading: updateLoading, error: updateError }] =
    useUpdateEventMutation();

  const [updateEventFormOpen, setUpdateEventFormOpen] = useState(false);
  const [createOrderFormOpen, setCreateOrderFormOpen] = useState(false);
  const [updateOrderId, setUpdateOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (deleteError || lotteryError || updateError) {
      let titleKey = '';
      switch (true) {
        case !!deleteError:
          titleKey = 'deleteOrder';
          break;
        case !!lotteryError:
          titleKey = 'lottery';
          break;
        case !!updateError:
          titleKey = 'reactivateEvent';
          break;
        default:
      }

      if (titleKey) {
        toast({
          title: t(`pages.events.eventDetail.errors.${titleKey}`),
          status: 'error',
          isClosable: true,
        });
      }
    }
  }, [deleteError, lotteryError, t, toast, updateError]);

  const handleLotteryStart = useCallback(
    async (startId: string) => {
      await startLottery({ variables: { id: startId } });
      return refetch();
    },
    [refetch, startLottery],
  );

  const handleDeleteOrder = useCallback(
    async (itemId: string) => {
      await deleteOrder({ variables: { id: itemId } });
      return refetch();
    },
    [deleteOrder, refetch],
  );

  const anyoneAvailableForLottery = useMemo(() => {
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
      <PageTitle title={data.event.name}>
        <Box>
          <Button
            colorScheme="brand"
            {...(data.event.active
              ? {
                  onClick: () => setUpdateEventFormOpen(true),
                  leftIcon: <EditOutlined />,
                }
              : {
                  //  eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick: () =>
                    data.event &&
                    updateEvent({
                      variables: {
                        input: {
                          restaurant: data.event.restaurant.id,
                          name: data.event.name,
                          description: data.event.description,
                          id: data.event.id,
                          active: true,
                        },
                      },
                    }),
                  isLoading: updateLoading,
                })}
          >
            {t(
              `pages.events.eventDetail.${
                data.event.active ? 'edit' : 'reactivate'
              }Event`,
            )}
          </Button>
        </Box>
      </PageTitle>
      <Grid templateColumns="repeat(6, 1fr)" gap={6} width="100%">
        <GridItem colSpan={4}>
          <HStack>
            <Box>
              <Heading>
                {t('pages.events.eventDetail.participantList.title')}
              </Heading>
            </Box>
            <Spacer />
            {!createOrderFormOpen &&
              !updateEventFormOpen &&
              data.event.active && (
                <ButtonGroup>
                  <Button
                    colorScheme="brand"
                    onClick={() => setCreateOrderFormOpen(true)}
                  >
                    {t('pages.events.eventDetail.addOrder')}
                  </Button>
                  {data.event.active && (
                    <>
                      <Button
                        onClick={() => void handleLotteryStart(id)}
                        isLoading={lotteryLoading}
                        disabled={
                          lotteryLoading ||
                          loading ||
                          !anyoneAvailableForLottery
                        }
                      >
                        {t('pages.events.eventDetail.startLottery')}
                      </Button>
                    </>
                  )}
                </ButtonGroup>
              )}
          </HStack>
          <Divider />
          {createOrderFormOpen && (
            <EventOrderForm
              eventId={id}
              onFinish={() => {
                setCreateOrderFormOpen(false);
                void refetch();
              }}
              onCancel={() => setCreateOrderFormOpen(false)}
              initialValues={{
                availableForLottery: true,
                text: '',
              }}
            />
          )}
          <List>
            {data.event.orders.map(item => (
              <ListItem key={item.id}>
                <VStack>
                  <Flex alignSelf="flex-end">
                    {item.createdBy.id === userData?.user.id &&
                      data?.event?.active && (
                        <ButtonGroup key={item.id}>
                          <IconButton
                            aria-label={t('common.edit')}
                            icon={
                              updateOrderId === item.id ? (
                                <CloseOutlined />
                              ) : (
                                <EditOutlined />
                              )
                            }
                            onClick={() =>
                              setUpdateOrderId(
                                updateOrderId == null ||
                                  updateOrderId !== item.id
                                  ? item.id
                                  : null,
                              )
                            }
                          />
                          <Popover placement="bottom-end">
                            {({ onClose }) => (
                              <>
                                <PopoverTrigger>
                                  <IconButton
                                    aria-label={t('common.delete')}
                                    icon={<DeleteOutlined />}
                                    isLoading={deleteLoading}
                                    disabled={
                                      deleteLoading || updateOrderId === item.id
                                    }
                                  />
                                </PopoverTrigger>
                                <PopoverContent>
                                  <PopoverCloseButton />
                                  <PopoverHeader>
                                    {t(
                                      'pages.events.eventDetail.deleteOrderTitle',
                                    )}
                                  </PopoverHeader>
                                  <PopoverFooter>
                                    <ButtonGroup>
                                      <Button onClick={onClose}>
                                        {t(
                                          'pages.events.eventDetail.deleteOrderCancelButton',
                                        )}
                                      </Button>
                                      <Button
                                        colorScheme="brand"
                                        onClick={() =>
                                          void handleDeleteOrder(item.id)
                                        }
                                      >
                                        {t(
                                          'pages.events.eventDetail.deleteOrderOkButton',
                                        )}
                                      </Button>
                                    </ButtonGroup>
                                  </PopoverFooter>
                                </PopoverContent>
                              </>
                            )}
                          </Popover>
                        </ButtonGroup>
                      )}
                  </Flex>
                  <Box width="100%">
                    {updateOrderId === item.id ? (
                      <>
                        <EventOrderForm
                          orderId={item.id}
                          eventId={id}
                          onFinish={() => {
                            setUpdateOrderId(null);
                            void refetch();
                          }}
                          initialValues={item}
                        />
                        <Divider />
                      </>
                    ) : (
                      <HStack>
                        <Avatar src={item.createdBy.avatarUrl} size="sm" />
                        <Box>
                          {item.availableForLottery ? (
                            <GreenCheckMark />
                          ) : (
                            <RedStopSign />
                          )}
                        </Box>
                        <Box>{item.createdBy.fullName}</Box>
                      </HStack>
                    )}
                  </Box>
                  <DescriptionItem label={t('common.order')} direction="column">
                    <Text fontSize="2xl">{item.text}</Text>
                  </DescriptionItem>
                </VStack>
              </ListItem>
            ))}
          </List>
        </GridItem>
        <GridItem colSpan={2}>
          <VStack width="100%">
            <Box width="100%">
              <Heading as="h3">
                {t('pages.events.eventDetail.eventDescriptions.title')}
              </Heading>
              <Divider />
            </Box>
            <Box width="100%">
              {!updateEventFormOpen ? (
                <>
                  <EventDescriptions event={data.event} />
                </>
              ) : (
                <EventForm
                  initialValues={{
                    ...data.event,
                    restaurant: data.event.restaurant.id,
                  }}
                  onFinish={() => {
                    setUpdateEventFormOpen(false);
                    void refetch();
                  }}
                  onCancel={() => setUpdateEventFormOpen(false)}
                />
              )}
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </DefaultLayout>
  );
};
