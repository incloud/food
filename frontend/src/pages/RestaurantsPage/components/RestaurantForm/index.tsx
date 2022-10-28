import { Alert, Button, Form, Input, Switch } from 'antd';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  IUpdateRestaurantMutationVariables,
  useUpdateRestaurantMutation,
} from './gql/updateRestaurant.generated';
import { useCreateRestaurantMutation } from './gql/createRestaurant.generated';
import { useCurrentUserQuery } from 'gql/user.generated';
import { FunctionComponent } from 'react';
import { Fragment } from 'react';

export const RestaurantForm: FunctionComponent<{
  onFinish: () => void;
  onCancel?: () => void;
  initialValues?: IUpdateRestaurantMutationVariables['input'];
}> = ({ onFinish, onCancel, initialValues }) => {
  const { t } = useTranslation();
  const { data: userData } = useCurrentUserQuery();
  const [addRestaurant, { loading: createLoading, error: createError }] =
    useCreateRestaurantMutation();
  const [updateRestaurant, { loading: updateLoading, error: updateError }] =
    useUpdateRestaurantMutation();
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
      <Form<Omit<IUpdateRestaurantMutationVariables['input'], 'id'>>
        initialValues={initialValues}
        onFinish={async values => {
          if (initialValues) {
            await updateRestaurant({
              variables: {
                input: {
                  ...values,
                  id: initialValues.id,
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
        }}
        layout="vertical"
      >
        <Form.Item
          label={t('common.name')}
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('common.restaurantDescription.website')}
          name="website"
        >
          <Input />
        </Form.Item>

        <Form.Item label={t('common.restaurantDescription.phone')} name="phone">
          <Input />
        </Form.Item>

        <Form.Item
          label={t('common.restaurantDescription.address')}
          name="address"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label={t('common.restaurantDescription.comment')}
          name="comment"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label={t('common.restaurantDescription.delivery')}
          name="delivery"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
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
