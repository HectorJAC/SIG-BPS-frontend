import { FaEye, FaInfoCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export const EditIcon = () => {
  return <FiEdit />
};

export const ViewIcon = () => {
  return <FaEye />
};

export const DeleteIcon = () => {
  return <MdDelete />
};

export const ActivateIcon = () => {
  return <FaCheck />
};

export const InactiveIcon = () => {
  return <IoMdClose />
};

export const InfoIcon = () => {
  return <FaInfoCircle />
};