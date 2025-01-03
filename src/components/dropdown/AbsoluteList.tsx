import React, { useEffect, useRef, useState } from "react";

const AbsoluteList = ({
  children,
  position,
  parent,
}: {
  children: React.ReactNode;
  position: string;
  parent: React.ReactNode;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      parentRef.current &&
      !parentRef.current.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={parentRef} onClick={() => setShow(true)}>
        {parent}
      </div>
      {show && (
        <div
          className={`border rounded-md absolute border-neutral-300 z-20 shadow bg-white p-1 ${position}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default AbsoluteList;
