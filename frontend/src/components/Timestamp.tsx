import { Fragment } from 'react';
import { FunctionComponent } from 'react';

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

export const Timestamp: FunctionComponent<{
  timestamp: number;
  withTime?: boolean;
}> = ({ timestamp, withTime = true }) => {
  const date = new Date(timestamp * 1000);

  return (
    <Fragment>
      {Intl.DateTimeFormat(
        'default',
        withTime
          ? {
              ...options,
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            }
          : options,
      ).format(date)}
    </Fragment>
  );
};
