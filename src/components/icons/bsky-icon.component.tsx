import React from "react";
import { IconComponent, IconProps } from "./icon.component";

export const BskyIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props}>
    <path
      d="M12 11.388C11.094 9.627 8.628 6.344 6.335 4.726C4.138 3.176 3.301 3.443 2.752 3.693C2.116 3.978 2 4.955 2 5.528C2 6.103 2.315 10.237 2.52 10.928C3.2 13.208 5.614 13.978 7.84 13.731C4.58 14.214 1.683 15.401 5.48 19.629C9.658 23.954 11.206 18.702 12 16.039C12.794 18.702 13.708 23.765 18.444 19.629C22 16.039 19.421 14.214 16.161 13.731C18.386 13.978 20.801 13.208 21.48 10.928C21.685 10.238 22 6.103 22 5.529C22 4.954 21.884 3.979 21.248 3.691C20.699 3.443 19.862 3.174 17.665 4.724C15.372 6.345 12.905 9.628 12 11.388Z"
      fill={fill}
    />
  </IconComponent>
);