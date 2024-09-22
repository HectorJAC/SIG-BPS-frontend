import React, { FC } from "react";
import { Image } from "react-bootstrap";

interface CustomImageProps {
  imageData: any;
  alt: string;
  style: React.CSSProperties;
  className?: string;
}

export const CustomImage:FC<CustomImageProps> = ({
  imageData,
  alt,
  style,
  className
}) => {
  return (
    <Image 
      src={`data:image/jpg;base64,${imageData}`}
      alt={alt}
      fluid 
      style={style}
      className={className}
    />
  )
}
