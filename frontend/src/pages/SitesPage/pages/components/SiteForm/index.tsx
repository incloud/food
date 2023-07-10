import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  VStack,
} from '@chakra-ui/react';
import { FunctionComponent, useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { WebhookFormControls } from '~/pages/SitesPage/pages/components/SiteForm/components/WebhookFormControls';
import { useCreateSiteMutation } from '~/pages/SitesPage/pages/components/SiteForm/gql/createSite.generated';
import { useUpdateSiteMutation } from '~/pages/SitesPage/pages/components/SiteForm/gql/updateSite.generated';
import { IUpdateSiteMutationInput } from '~/types.generated';

type FormValues = IUpdateSiteMutationInput;

interface ISiteFormProps {
  onFinish: () => void;
  onCancel?: () => void;
  initialValues?: FormValues;
}

export const SiteForm: FunctionComponent<ISiteFormProps> = ({
  onFinish,
  onCancel,
  initialValues,
}) => {
  const { t } = useTranslation();

  const [createSite] = useCreateSiteMutation();
  const [updateSite] = useUpdateSiteMutation();

  const { register, handleSubmit, control } = useForm<IUpdateSiteMutationInput>(
    {
      defaultValues: initialValues,
    },
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'webhooks',
  });

  const handleFinish = useCallback(
    async (values: IUpdateSiteMutationInput) => {
      if (initialValues) {
        await updateSite({
          variables: {
            input: {
              id: initialValues.id,
              name: values.name,
              webhooks: values.webhooks.map(webhook => ({
                id: webhook.id,
                name: webhook.name,
                url: webhook.url,
              })),
            },
          },
        });
      } else {
        await createSite({
          variables: {
            input: {
              name: values.name,
              webhooks: values.webhooks,
            },
          },
        });
      }
      onFinish();
    },
    [createSite, initialValues, onFinish, updateSite],
  );

  return (
    <Box width="100%">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(handleFinish)}>
        <VStack alignItems="flex-start">
          <FormControl isRequired={true}>
            <FormLabel>{t('common.name')}</FormLabel>
            <Input {...register('name')} />
          </FormControl>
          <VStack width="100%" alignItems="flex-start">
            <HStack width="100%">
              <Heading as="h4" size="lg">
                {t('common.webhook_plural')}
              </Heading>
              <Spacer />
              <Button onClick={() => append({ name: '', url: '' })}>
                Add additional webhook
              </Button>
            </HStack>
            {fields.map((field, index) => (
              <WebhookFormControls
                key={field.id}
                controlIndex={index}
                register={register}
                removeAction={remove}
              />
            ))}
          </VStack>
          <ButtonGroup marginTop={10}>
            <Button type="submit" colorScheme="brand">
              {t('common.buttons.submit')}
            </Button>
            <Button onClick={onCancel}>{t('common.buttons.cancel')}</Button>
          </ButtonGroup>
        </VStack>
      </form>
    </Box>
  );
};
