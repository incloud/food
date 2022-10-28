import { Select } from 'antd';

import { useRestaurantSelectQuery } from './gql/restaurantSelect.generated';
import { SelectProps } from 'antd/lib/select';
import { useTranslation } from 'react-i18next';
import { useCurrentUserQuery } from '../../gql/user.generated';
import { FunctionComponent } from 'react';

export const RestaurantSelect: FunctionComponent<
  SelectProps<string>
> = props => {
  const { t } = useTranslation();
  const { data: userData } = useCurrentUserQuery();
  const { data, loading } = useRestaurantSelectQuery({
    variables: { site: userData?.user.site?.id || '' },
    skip: !userData?.user.site?.id,
    fetchPolicy: 'cache-and-network',
  });
  return (
    <Select
      showSearch
      placeholder={t('components.restaurantSelect.dropdownPlaceholder')}
      optionFilterProp="children"
      loading={loading}
      disabled={loading}
      {...props}
    >
      {data?.restaurants.map(restaurant => (
        <Select.Option value={restaurant.id} key={restaurant.id}>
          {restaurant.name}
        </Select.Option>
      ))}
    </Select>
  );
};
