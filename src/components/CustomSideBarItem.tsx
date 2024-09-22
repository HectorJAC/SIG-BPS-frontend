import { FC } from "react";
import { Accordion, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface CustomSideBarItemProps {
  linkText: string,
  linkPath?: string,
  activeOption: string | null,
  handleActiveOption: (option: string) => void
}

export const CustomSideBarItem:FC<CustomSideBarItemProps> = ({
  linkText,
  linkPath,
  activeOption,
  handleActiveOption
}) => {
  const navigate = useNavigate();

  return (
    <Accordion.Body 
      className={`${activeOption === `${linkText}` ? 'active' : 'sidebar-body'}`}
    >
      <Nav.Link onClick={() => {
        navigate(linkPath || '')
        handleActiveOption(`${linkText}`)
      }}>
        {linkText}
      </Nav.Link>
    </Accordion.Body>
  );
};