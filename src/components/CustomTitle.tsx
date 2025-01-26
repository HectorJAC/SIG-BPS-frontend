import { FC } from "react";

interface CustomTitleProps {
  title: string;
}

export const CustomTitle:FC<CustomTitleProps> = ({title}) => {
  return (
    <h1 className="mt-3 mb-4 text-black my-3">
      {title}
    </h1>
  );
};

// fw-bold text-black my-3
