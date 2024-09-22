import { FC } from "react";
import { FaFileDownload } from "react-icons/fa";
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap';

interface CustomDownloadButtonProps {
    onClick?: () => void;
}

export const CustomDownloadButton: FC<CustomDownloadButtonProps> = ({onClick}) => {

    const renderTooltip = (props:object) => (
        <Tooltip id="button-tooltip" {...props}>
            Descargar
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <Button
                onClick={onClick}
            >
                <FaFileDownload />
            </Button>
        </OverlayTrigger>
    );
};