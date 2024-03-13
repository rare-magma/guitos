import React from "react";

export function useWindowSize() {
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useLayoutEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
