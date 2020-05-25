import React from 'react';

import SvgIcon from 'app/icons/svgIcon';

type SvgIconProps = React.ComponentProps<typeof SvgIcon>;

import {IconWrapper} from './styles';
import {BreadcrumbDetails} from './types';

type Props = Omit<BreadcrumbDetails, 'description'> &
  Pick<SvgIconProps, 'size'> & {isDisabled?: boolean};

const Icon = ({icon, color, size, isDisabled}: Props) => {
  const SvgIconComponent = icon as React.ComponentType<SvgIconProps>;
  return (
    <IconWrapper color={isDisabled ? 'gray1' : color}>
      <SvgIconComponent size={size} />
    </IconWrapper>
  );
};

export {Icon};
