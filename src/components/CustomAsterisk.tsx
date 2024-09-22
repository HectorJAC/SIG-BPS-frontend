import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaAsterisk } from "react-icons/fa";

export const CustomAsterisk = () => {

    const renderTooltip = (props:object) => (
        <Tooltip id="button-tooltip" {...props}>
            Campo requerido
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <span>
                <FaAsterisk 
                    color='red'
                    size={10}
                />
            </span>
        </OverlayTrigger>
    );
};