import { Alert, Button, Form, Input, Switch } from 'antd';
import {
  ICreateEventOrderMutationVariables,
  useCreateEventOrderMutation,
} from './gql/createEventOrder.generated';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useUpdateEventOrderMutation } from './gql/updateEventOrder.generated';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import { Fragment } from 'react';

type Values = Omit<ICreateEventOrderMutationVariables, 'event'>;

export const EventOrderForm: FunctionComponent<{
  eventId: string;
  orderId?: string;
  initialValues?: Values;
  onFinish: () => void;
  onCancel?: () => void;
}> = ({ eventId, orderId, initialValues, onFinish, onCancel }) => {
  const { t } = useTranslation();
  const [addOrder, { loading: createLoading, error: createError }] =
    useCreateEventOrderMutation();
  const [updateOrder, { loading: updateLoading, error: updateError }] =
    useUpdateEventOrderMutation();
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
      <Form
        initialValues={initialValues || { availableForLottery: true }}
        onFinish={async values => {
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
        }}
      >
        <Form.Item
          label={t('pages.events.eventDetail.eventOrderForm.textLabel')}
          name="text"
          rules={[
            {
              required: true,
              message: t('pages.events.eventDetail.eventOrderForm.textRequiredMessage'),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t(
            'pages.events.eventDetail.eventOrderForm.availableForLotteryLabel',
          )}
          name="availableForLottery"
          valuePropName="checked"
        >
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
          />
        </Form.Item>

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
