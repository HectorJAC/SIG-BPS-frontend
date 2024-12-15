import { FaEye, FaInfoCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IoMdClose, IoMdAddCircleOutline } from "react-icons/io";
import { FaCheck, FaRegCircleQuestion, FaCodePullRequest } from "react-icons/fa6";

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

export const AddIcon = () => {
  return <IoMdAddCircleOutline />
};

export const QuestionIcon = () => {
  <FaRegCircleQuestion />
};

export const ExtractDataIcon = () => {
  return <FaCodePullRequest />
}