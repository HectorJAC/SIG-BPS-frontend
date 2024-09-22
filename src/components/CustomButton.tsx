import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import React, { FC } from 'react';
import { Placement } from 'react-bootstrap/esm/types';

interface ButtonProps {
    onclick?: () => void;
    disabled?: boolean;
    title?: string;
    icon?: React.ReactNode;
    text: string;
    placement: Placement;
    color?: string;
    style?: React.CSSProperties;
}

export const CustomButton:FC<ButtonProps> = ({onclick, disabled, icon, text, placement, color, style}) => {
  const renderTooltip = (props:object) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show: 100, hide: 100 }}
      overlay={renderTooltip}
    >
      <Button 
        onClick={onclick} 
        disabled={disabled}
        variant={color}
        style={style}
      >
        {icon}
      </Button>
    </OverlayTrigger>
  );
};

