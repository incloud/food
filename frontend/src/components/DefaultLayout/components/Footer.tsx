import {
  GithubOutlined,
  GlobalOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Select,
  StackDivider,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLngs } from '~/lib/i18n';

export const Footer: FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box as="footer" width="100%" paddingBottom={5} marginTop={10}>
      <VStack>
        <HStack divider={<StackDivider borderColor="black" />}>
          <Box>
            <Link
              href="https://github.com/incloud/food"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubOutlined /> {t('components.defaultLayout.footer.github')}
            </Link>
          </Box>
          <Box>
            <Link href="/playground" target="_blank" rel="noopener noreferrer">
              <ToolOutlined />{' '}
              {t('components.defaultLayout.footer.gqlPlayground')}
            </Link>
          </Box>
          <Box>
            <HStack>
              <GlobalOutlined />
              <Select
                value={i18n.language}
                onChange={event => void i18n.changeLanguage(event.target.value)}
              >
                {supportedLngs.map(language => (
                  <option title={language} value={language} key={language}>
                    {language === 'en'
                      ? 'English'
                      : language === 'de'
                      ? 'Deutsch'
                      : language}
                  </option>
                ))}
              </Select>
            </HStack>
          </Box>
          <Box>
            <Button onClick={toggleColorMode}>
              {t('common.switchColorMode', {
                colorMode: colorMode === 'light' ? 'dark' : 'light',
              })}
            </Button>
          </Box>
        </HStack>

        <Box>
          <Link
            href="https://www.qbeyond.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image width="2rem" src="/q_logo.svg" alt="q.beyond Icon" />
          </Link>
        </Box>
      </VStack>
    </Box>
  );
};
