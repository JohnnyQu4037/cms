import { VerticalAlignTopOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ToTop = styled(VerticalAlignTopOutlined)`
  position: fixed;
  bottom: 25px;
  right: 20px;
  font-size: 30px;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
  transition: all 0.5s;
  :hover {
    opacity: 0.8;
  }
`;

export default function BackToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = document.getElementById("contentLayout");
    const listener = (event) => {
      const visible = event.target.scrollTop > 600;

      setShown(visible);
    };
    element.addEventListener("scroll", listener);

    return () => {
      element.removeEventListener("scroll", listener);
    };
  }, [shown]);

  return shown ? (
    <ToTop
      onClick={() => {
        const element = document.getElementById("contentLayout");

        element.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  ) : null;
}
