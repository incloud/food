import { css } from '@emotion/react';
import { Avatar, Descriptions } from 'antd';
import { TFunction } from 'react-i18next';
import { IUser } from 'types.generated';
import { Timestamp } from './Timestamp';

const marginStyle = css`
  div:not(:last-child) {
    margin-bottom: 0.5em;
  }
`;

// Workaround for FunctionComponents not allowing array return values
export const getCreatedUpdatedDescriptions = ({
  entity,
  t,
}: {
  entity: {
    createdAt?: number | null;
    createdBy?: Pick<IUser, 'fullName' | 'avatarUrl'> | null;
    updatedAt?: number | null;
    updatedBy?: Pick<IUser, 'fullName' | 'avatarUrl'> | null;
  };
  t: TFunction;
}) => {
  const items = [];

  if (entity.createdAt || entity.createdBy) {
    items.push(
      <Descriptions.Item key="created" label={t('common.created')}>
        <div css={marginStyle}>
          {entity.createdAt && (
            <div>
              <Timestamp timestamp={entity.createdAt} />
            </div>
          )}
          {entity.createdBy && (
            <div>
              <Avatar src={entity.createdBy.avatarUrl} size="small" />{' '}
              {entity.createdBy.fullName}
            </div>
          )}
        </div>
      </Descriptions.Item>,
    );
  }

  if (entity.updatedAt || entity.updatedBy) {
    items.push(
      <Descriptions.Item key="updated" label={t('common.updated')}>
        <div css={marginStyle}>
          {entity.updatedAt && (
            <div>
              <Timestamp timestamp={entity.updatedAt} />
            </div>
          )}
          {entity.updatedBy && (
            <div>
              <Avatar src={entity.updatedBy.avatarUrl} size="small" />{' '}
              {entity.updatedBy.fullName}
            </div>
          )}
        </div>
      </Descriptions.Item>,
    );
  }

  return items;
};
