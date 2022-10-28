import { css } from '@emotion/react';
import { Avatar, Button, Divider, Menu } from 'antd';
import { SiteSelect } from 'components/SiteSelect';
import { paths } from 'lib/paths';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IUser } from 'types.generated';

export const Navigation: FunctionComponent<{
  user?: Pick<IUser, 'fullName' | 'avatarUrl'> | null;
  activeKey: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}> = ({ user, activeKey, direction = 'horizontal', className }) => {
  const { t } = useTranslation();

  return (
    <nav
      css={css`
        display: flex;
        ${direction === 'horizontal'
          ? `
        flex-direction: row;
        > * {
          margin-left: 1em;
        }
      `
          : `
        flex-direction: column-reverse;
        justify-content: flex-end;
        padding: 2em 0;
        height: 100%;
      `}
      `}
      className={className}
    >
      <Menu
        mode={direction}
        selectedKeys={[activeKey]}
        style={{ flex: 2 }}
        theme="dark"
        items={[
          {
            key: paths.events,
            label: <Link to={paths.events}>{t('common.event_plural')}</Link>,
          },
          {
            key: paths.restaurants,
            label: (
              <Link to={paths.restaurants}>
                {t('common.restaurant_plural')}
              </Link>
            ),
          },
        ]}
      />

      {direction === 'vertical' && <Divider />}

      {user && (
        <div>
          <SiteSelect autoUpdateUser={true} />
        </div>
      )}

      {direction === 'vertical' && <Divider />}

      <div>
        {user ? (
          <span>
            <span
              css={css`
                margin-right: 1em;
              `}
            >
              {t('components.layout.greeting', {
                name: user.fullName,
              })}
            </span>
            <Avatar src={user.avatarUrl} />
          </span>
        ) : (
          <a href="/oauth2/authorization/oidc">
            <Button>{t('components.layout.loginButton')}</Button>
          </a>
        )}
      </div>
    </nav>
  );
};
