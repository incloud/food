/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  Box,
  SystemStyleObject,
  ButtonGroup,
} from '@chakra-ui/react';
import { FunctionComponent, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RestaurantSelect } from '../RestaurantSelect';
import { useCreateEventMutation } from './gql/createEvent.generated';
import { useUpdateEventMutation } from './gql/updateEvent.generated';
import {
  ICreateEventMutationInput,
  IUpdateEventMutationInput,
} from '~/types.generated';

const formStyle: SystemStyleObject = {
  '.eventForm': {
    width: '100%',
  },
};

interface IEventFormProps {
  onFinish: () => void;
  onCancel?: () => void;
  initialValues?: IUpdateEventMutationInput;
}

export const EventForm: FunctionComponent<IEventFormProps> = ({
  onFinish,
  onCancel,
  initialValues,
}) => {
  const { t } = useTranslation();
  const [addEvent, { loading: createLoading, error: createError }] =
    useCreateEventMutation();
  const [updateEvent, { loading: updateLoading, error: updateError }] =
    useUpdateEventMutation();
  const error = createError || updateError;
  const loading = createLoading || updateLoading;

  const { register, handleSubmit } = useForm<
    IUpdateEventMutationInput | ICreateEventMutationInput
  >({ defaultValues: initialValues });

  const handleEventFormFinish = useCallback(
    async (values: IUpdateEventMutationInput | ICreateEventMutationInput) => {
      if (initialValues != null) {
        await updateEvent({
          variables: {
            input: {
              restaurant: values.restaurant,
              name: values.name,
              description: values.description,
              active: initialValues.active,
              id: initialValues.id,
            },
          },
        });
      } else {
        await addEvent({
          variables: {
            input: values,
          },
        });
      }
      onFinish();
    },
    [addEvent, initialValues, onFinish, updateEvent],
  );

  return (
    <Box width="100%" sx={formStyle}>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{t('common.errors.unknown.message')}</AlertTitle>
          <AlertDescription>
            {t('common.errors.unknown.description')}
          </AlertDescription>
        </Alert>
      )}
      <form
        className="eventForm"
        onSubmit={handleSubmit(handleEventFormFinish)}
      >
        <VStack alignItems="start">
          <FormControl isRequired={true}>
            <FormLabel>{t('pages.events.eventForm.nameLabel')}</FormLabel>
            <Input {...register('name')} />
            <FormErrorMessage>
              {t('pages.events.eventForm.nameRequiredMessage')}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>{t('pages.events.eventForm.description')}</FormLabel>
            <Textarea {...register('description')} />
          </FormControl>
          <FormControl isRequired={true}>
            <FormLabel>{t('pages.events.eventForm.restaurantLabel')}</FormLabel>
            <RestaurantSelect registerOptions={register('restaurant')} />
            <FormErrorMessage>
              {t('pages.events.eventForm.restaurantRequiredMessage')}
            </FormErrorMessage>
          </FormControl>
          <ButtonGroup>
            <Button colorScheme="brand" isLoading={loading} type="submit">
              {t('common.buttons.submit')}
            </Button>
            <Button onClick={onCancel} disabled={loading}>
              {t('common.buttons.cancel')}
            </Button>
          </ButtonGroup>
        </VStack>
      </form>
    </Box>
  );
};
