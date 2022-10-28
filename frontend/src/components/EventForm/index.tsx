import { Alert, Button, Form, Input, Switch } from 'antd';

import {
  ICreateEventMutationVariables,
  useCreateEventMutation,
} from './gql/createEvent.generated';
import { RestaurantSelect } from '../RestaurantSelect';
import {
  IUpdateEventMutationVariables,
  useUpdateEventMutation,
} from './gql/updateEvent.generated';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import { Fragment } from 'react';
import {
  ICreateEventMutationInput,
  IUpdateEventMutationInput,
} from 'types.generated';

export const EventForm: FunctionComponent<{
  onFinish: () => void;
  onCancel?: () => void;
  initialValues?: IUpdateEventMutationInput;
}> = ({ onFinish, onCancel, initialValues }) => {
  const { t } = useTranslation();
  const [addEvent, { loading: createLoading, error: createError }] =
    useCreateEventMutation();
  const [updateEvent, { loading: updateLoading, error: updateError }] =
    useUpdateEventMutation();
  const error = createError || updateError;
  const loading = createLoading || updateLoading;

  return (
    <Fragment>
      {error && (
        <Alert
          message={t('common.errors.unknown.message')}
          description={t('common.errors.unknown.description')}
          type="error"
          showIcon
          closable
        />
      )}
      <Form<IUpdateEventMutationInput | ICreateEventMutationInput>
        initialValues={initialValues}
        onFinish={async values => {
          if (initialValues) {
            await updateEvent({
              variables: {
                input: {
                  ...(values as IUpdateEventMutationInput),
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
        }}
        layout="vertical"
      >
        <Form.Item
          label={t('pages.events.eventForm.nameLabel')}
          name="name"
          rules={[
            {
              required: true,
              message: t('pages.events.eventForm.nameRequiredMessage'),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('pages.events.eventForm.description')}
          name="description"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label={t('pages.events.eventForm.restaurantLabel')}
          name="restaurant"
          rules={[
            {
              required: true,
              message: t('pages.events.eventForm.restaurantRequiredMessage'),
            },
          ]}
        >
          <RestaurantSelect />
        </Form.Item>

        {initialValues && (
          <Form.Item
            label={t('pages.events.eventForm.activeLabel')}
            name="active"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            {t('common.buttons.submit')}
          </Button>
          {onCancel && (
            <Fragment>
              {' '}
              <Button onClick={onCancel} disabled={loading}>
                {t('common.buttons.cancel')}
              </Button>
            </Fragment>
          )}
        </Form.Item>
      </Form>
    </Fragment>
  );
};
