import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FC } from 'react';
import { Placement } from 'react-bootstrap/esm/types';

interface CustomTooltipProps {
    text: string;
    placement: Placement;
    children: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
    isButton: boolean;
}

export const CustomTooltip:FC<CustomTooltipProps> = ({
    text, 
    children, 
    placement, 
    onClick, 
    style, 
    isButton}
) => {
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
            {
                isButton 
                ?
                    <button 
                        onClick={onClick} 
                        style={style}
                    >
                        {children}
                    </button> 
                :
                    <div style={style}>
                        {children}
                    </div>
            }
        </OverlayTrigger>
    );
};
