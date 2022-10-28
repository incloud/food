import { useCurrentUserQuery } from 'gql/user.generated';
import { Button, Col, Drawer, Layout, Row, Select } from 'antd';
import { css, SerializedStyles } from '@emotion/react';
import { FunctionComponent, ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { paths } from 'lib/paths';
import logoQ from '!file-loader!assets/q_logo.svg';
import logoBurger from 'assets/burger.png';
import { title } from 'lib/title';
import {
  GithubOutlined,
  GlobalOutlined,
  MenuOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Navigation } from './components/Navigation';
import { useTranslation } from 'react-i18next';
import { supportedLngs } from 'lib/i18n';

const mobileMediaQuery = '@media (max-width: 1000px)';

const hiddenOnMobileStyle = css`
  ${mobileMediaQuery} {
    display: none;
  }
`;
const onlyOnMobileStyle = css`
  display: none;

  ${mobileMediaQuery} {
    display: block;
  }
`;

const sidePaddingStyle = css`
  padding-left: 3rem;
  padding-right: 3rem;

  ${mobileMediaQuery} {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export const DefaultLayout: FunctionComponent<{
  children: ReactNode;
  contentStyle?: SerializedStyles;
}> = ({ children, contentStyle }) => {
  const { t, i18n } = useTranslation();
  const { data } = useCurrentUserQuery();
  const { pathname } = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  let activeKey = '';
  if (pathname === '/' || pathname.startsWith(paths.event(''))) {
    activeKey = paths.events;
  } else {
    const splits = pathname.split('/');
    if (splits.length > 1) {
      activeKey = `/${splits[1]}`;
    }
  }

  return (
    <Layout
      css={css`
        min-height: 100vh;
      `}
    >
      <Layout.Header css={sidePaddingStyle}>
        <Row gutter={16}>
          <Col>
            <Link to={paths.home}>
              <h1
                css={css`
                  font-family: monospace;
                  font-size: 1rem;
                  margin: 0;
                  padding: 0;
                `}
              >
                <img src={logoBurger} alt="Burger Logo" />
                <span
                  css={css`
                    @media (max-width: 340px) {
                      display: none;
                    }
                  `}
                >
                  {` ${title}`}
                </span>
              </h1>
            </Link>
          </Col>

          <Col flex={1}>
            <Navigation
              css={hiddenOnMobileStyle}
              user={data?.user}
              activeKey={activeKey}
            />
          </Col>

          <Col css={onlyOnMobileStyle}>
            <Button
              onClick={() => setDrawerVisible(!drawerVisible)}
              icon={<MenuOutlined />}
            />
          </Col>
        </Row>
      </Layout.Header>

      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
        <Navigation
          user={data?.user}
          activeKey={activeKey}
          direction="vertical"
        />
      </Drawer>

      <Layout.Content
        css={css`
          ${sidePaddingStyle};
          padding-top: 1rem;
          padding-bottom: 1rem;
          ${contentStyle}
        `}
      >
        {children}
      </Layout.Content>

      <Layout.Footer
        css={css`
          text-align: center;

          color: #555;

          a {
            color: #555;

            &:hover {
              color: #888;
            }
          }

          .ant-select {
            .ant-select-selector {
              color: #555;
              padding: 0;
              text-align: left;
            }
          }
          .ant-select-open {
            min-width: 8em;
          }
        `}
      >
        <p>
          <a
            href="https://github.com/incloud/food"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubOutlined /> {t('components.defaultLayout.footer.github')}
          </a>
          {' · '}
          <a href="/playground" target="_blank" rel="noopener noreferrer">
            <ToolOutlined />{' '}
            {t('components.defaultLayout.footer.gqlPlayground')}
          </a>
          {' · '}
          <GlobalOutlined />{' '}
          <Select
            value={i18n.language}
            onChange={language => i18n.changeLanguage(language)}
            bordered={false}
            showArrow={false}
          >
            {supportedLngs.map(language => (
              <Select.Option title={language} value={language} key={language}>
                {language === 'en'
                  ? 'English'
                  : language === 'de'
                  ? 'Deutsch'
                  : language}
              </Select.Option>
            ))}
          </Select>
        </p>

        <p>
          <a
            href="https://www.qbeyond.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              css={css`
                width: 2em;
              `}
              src={logoQ}
              alt="q.beyond Icon"
            />
          </a>
        </p>
      </Layout.Footer>
    </Layout>
  );
};
