import { css } from '@emotion/react';

export const defaultTopMargin = css`
  margin-top: 1em;
`;

export const defaultBottomMargin = css`
  margin-bottom: 1em;
`;

export const defaultChildBottomMargin = css`
  > * {
    ${defaultBottomMargin}
  }
`;

export const textAlignCenter = css`
  text-align: center;
`;

export const defaultGutter = 16;
