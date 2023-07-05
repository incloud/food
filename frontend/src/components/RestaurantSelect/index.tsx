import { Select } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRestaurantSelectQuery } from './gql/restaurantSelect.generated';
import { useCurrentUserQuery } from '~/gql/user.generated';

interface IRestaurantSelectProps {
  registerOptions: UseFormRegisterReturn<'restaurant'>;
}

export const RestaurantSelect: FunctionComponent<IRestaurantSelectProps> = ({
  registerOptions,
}) => {
  const { t } = useTranslation();
  const { data: userData } = useCurrentUserQuery();
  const { data, loading } = useRestaurantSelectQuery({
    variables: { site: userData?.user.site?.id || '' },
    skip: !userData?.user.site?.id,
    fetchPolicy: 'cache-and-network',
  });
  return (
    <Select
      placeholder={t('components.restaurantSelect.dropdownPlaceholder')}
      disabled={loading}
      {...registerOptions}
    >
      {data?.restaurants.map(restaurant => (
        <option value={restaurant.id} key={restaurant.id}>
          {restaurant.name}
        </option>
      ))}
    </Select>
  );
};
