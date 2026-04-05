import React, { useEffect } from "react";

const Youtube = ({
  id,
  title,
  ...rest
}: {
  id: string;
  title: string;
  [key: string]: any;
}) => {
  useEffect(() => {
    import("@justinribeiro/lite-youtube");
  }, []);

  return React.createElement("lite-youtube", {
    className: "rounded-lg",
    videoid: id,
    videotitle: title,
    ...rest,
  });
};

export default Youtube;
