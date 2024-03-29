import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
  Switch,
  Text,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FunctionComponent, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ICreateEventOrderMutationVariables,
  useCreateEventOrderMutation,
} from './gql/createEventOrder.generated';
import { useUpdateEventOrderMutation } from './gql/updateEventOrder.generated';

type Values = Omit<ICreateEventOrderMutationVariables, 'event'>;

interface IEventOrderFormProps {
  eventId: string;
  orderId?: string;
  initialValues?: Values;
  onFinish: () => void;
  onCancel?: () => void;
}

export const EventOrderForm: FunctionComponent<IEventOrderFormProps> = ({
  eventId,
  orderId,
  initialValues,
  onFinish,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [addOrder, { loading: createLoading, error: createError }] =
    useCreateEventOrderMutation();
  const [updateOrder, { loading: updateLoading, error: updateError }] =
    useUpdateEventOrderMutation();
  const error = createError || updateError;
  const loading = createLoading || updateLoading;

  const { register, handleSubmit } = useForm<Values>({
    defaultValues: initialValues,
  });

  const handleEventFinish = useCallback(
    async (values: Values) => {
      if (orderId) {
        await updateOrder({
          variables: {
            ...values,
            id: orderId,
          },
        });
      } else {
        await addOrder({
          variables: {
            ...values,
            event: eventId,
          },
        });
      }
      onFinish();
    },
    [addOrder, eventId, onFinish, orderId, updateOrder],
  );

  return (
    <Box>
      <Heading as="h4" size="md">
        {t(
          `pages.events.eventDetail.eventOrderForm.${
            orderId != null ? 'editOrderTitle' : 'addOrderTitle'
          }`,
        )}
      </Heading>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t('common.errors.unknown.message')}</AlertTitle>
          <AlertDescription>
            {t('common.errors.unknown.description')}
          </AlertDescription>
        </Alert>
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(handleEventFinish)}>
        <VStack>
          <FormControl isRequired={true}>
            <FormLabel>
              {t('pages.events.eventDetail.eventOrderForm.textLabel')}
            </FormLabel>
            <Input {...register('text')} />
            <FormErrorMessage>
              {t('pages.events.eventDetail.eventOrderForm.textRequiredMessage')}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <Text>
              {t(
                'pages.events.eventDetail.eventOrderForm.availableForLotteryHint',
              )}
            </Text>
          </FormControl>
          <FormControl>
            <HStack>
              <FormLabel>
                {t(
                  'pages.events.eventDetail.eventOrderForm.availableForLotteryLabel',
                )}
              </FormLabel>
              <Switch {...register('availableForLottery')} />
            </HStack>
          </FormControl>
          <FormControl>
            <ButtonGroup>
              <Button
                colorScheme="brand"
                type="submit"
                disabled={loading}
                isLoading={loading}
              >
                {t('common.buttons.submit')}
              </Button>
              {onCancel && (
                <Button onClick={onCancel} disabled={loading}>
                  {t('common.buttons.cancel')}
                </Button>
              )}
            </ButtonGroup>
          </FormControl>
        </VStack>
      </form>
    </Box>
  );
};
