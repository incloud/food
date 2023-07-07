import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IUpdateSiteMutationInput } from '~/types.generated';

interface IWebhookFormControlsProps {
  controlIndex: number;
  register: UseFormRegister<IUpdateSiteMutationInput>;
  removeAction: UseFieldArrayRemove;
}

export const WebhookFormControls: FunctionComponent<
  IWebhookFormControlsProps
> = ({ controlIndex, register, removeAction }) => {
  const { t } = useTranslation();

  return (
    <HStack width="100%" alignItems="flex-end">
      <FormControl>
        <FormLabel>{t('common.name')}</FormLabel>
        <Input {...register(`webhooks.${controlIndex}.name`)} />
      </FormControl>
      <FormControl>
        <FormLabel>{t('common.url')}</FormLabel>
        <Input {...register(`webhooks.${controlIndex}.url`)} />
      </FormControl>
      <ButtonGroup>
        <Button size="lg" onClick={() => removeAction(controlIndex)}>
          Remove
        </Button>
      </ButtonGroup>
    </HStack>
  );
};
