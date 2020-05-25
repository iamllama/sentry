import React from 'react';

import Tag from 'app/views/settings/components/tag';
import {t} from 'app/locale';

import {BreadcrumbLevelType} from './types';

type Props = {
  level?: BreadcrumbLevelType;
  isDisabled?: boolean;
};

const Level = ({level, isDisabled}: Props) => {
  switch (level) {
    case BreadcrumbLevelType.FATAL:
    case BreadcrumbLevelType.ERROR:
      return <Tag priority={isDisabled ? undefined : 'error'}>{level}</Tag>;
    case BreadcrumbLevelType.INFO:
      return <Tag priority={isDisabled ? undefined : 'info'}>{level}</Tag>;
    case BreadcrumbLevelType.WARNING:
      return <Tag priority={isDisabled ? undefined : 'warning'}>{level}</Tag>;
    default:
      return <Tag>{level || t('undefined')}</Tag>;
  }
};

export {Level};
