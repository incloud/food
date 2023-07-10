import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  ButtonGroup,
  HStack,
  Box,
  SystemStyleObject,
  VStack,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FunctionComponent, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCreateRestaurantMutation } from './gql/createRestaurant.generated';
import {
  IUpdateRestaurantMutationVariables,
  useUpdateRestaurantMutation,
} from './gql/updateRestaurant.generated';
import { useCurrentUserQuery } from '~/gql/user.generated';
import { IUpdateRestaurantMutationInput } from '~/types.generated';

const formStyle: SystemStyleObject = {
  '.restaurantForm': {
    width: '100%',
  },
};

interface IRestaurantFormProps {
  onFinish: () => void;
  onCancel?: () => void;
  initialValues?: IUpdateRestaurantMutationVariables['input'];
}

export const RestaurantForm: FunctionComponent<IRestaurantFormProps> = ({
  onFinish,
  onCancel,
  initialValues,
}) => {
  const { t } = useTranslation();
  const { data: userData } = useCurrentUserQuery();
  const [addRestaurant, { loading: createLoading, error: createError }] =
    useCreateRestaurantMutation();
  const [updateRestaurant, { loading: updateLoading, error: updateError }] =
    useUpdateRestaurantMutation();
  const error = createError || updateError;
  const loading = createLoading || updateLoading;

  const { register, handleSubmit } = useForm<IUpdateRestaurantMutationInput>({
    defaultValues: initialValues,
  });

  const handleFinish = useCallback(
    async (values: Omit<IUpdateRestaurantMutationInput, 'id'>) => {
      if (initialValues) {
        await updateRestaurant({
          variables: {
            input: {
              id: initialValues.id,
              address: values.address,
              comment: values.comment,
              delivery: values.delivery,
              name: values.name,
              phone: values.phone,
              website: values.website,
            },
          },
        });
      } else {
        await addRestaurant({
          variables: {
            input: {
              ...values,
              siteId: userData?.user.site?.id || '',
            },
          },
        });
      }
      onFinish();
    },
    [
      addRestaurant,
      initialValues,
      onFinish,
      updateRestaurant,
      userData?.user.site?.id,
    ],
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
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="restaurantForm" onSubmit={handleSubmit(handleFinish)}>
        <VStack>
          <Box width="50%">
            <FormControl isRequired={true}>
              <FormLabel>{t('common.name')}</FormLabel>
              <Input {...register('name')} />
            </FormControl>
            <FormControl>
              <FormLabel>{t('common.restaurantDescription.website')}</FormLabel>
              <Input {...register('website')} />
            </FormControl>
            <FormControl>
              <FormLabel>{t('common.restaurantDescription.phone')}</FormLabel>
              <Input {...register('phone')} />
            </FormControl>
            <FormControl>
              <FormLabel>{t('common.restaurantDescription.address')}</FormLabel>
              <Textarea {...register('address')} />
            </FormControl>
            <FormControl>
              <FormLabel>{t('common.restaurantDescription.comment')}</FormLabel>
              <Textarea {...register('comment')} />
            </FormControl>
            <FormControl marginTop="1rem">
              <HStack>
                <FormLabel>
                  {t('common.restaurantDescription.delivery')}
                </FormLabel>
                <Switch {...register('delivery')}></Switch>
              </HStack>
            </FormControl>
            <ButtonGroup width="100%" alignItems="flex-start">
              <Button
                colorScheme="brand"
                type="submit"
                disabled={loading}
                isLoading={loading}
              >
                {t('common.buttons.submit')}
              </Button>
              {onCancel && (
                <>
                  {' '}
                  <Button onClick={onCancel} disabled={loading}>
                    {t('common.buttons.cancel')}
                  </Button>
                </>
              )}
            </ButtonGroup>
          </Box>
        </VStack>
      </form>
    </Box>
  );
};
