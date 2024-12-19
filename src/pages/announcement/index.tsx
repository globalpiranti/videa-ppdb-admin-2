import { useEffect } from "react";
import useLayout from "../../hooks/layout";
import Accepted from "./accepted-form";
import Rejected from "./rejected-form";

const Announcement = () => {
  const { setActive, setTitle } = useLayout();

  useEffect(() => {
    setActive("Pengumuman");
    setTitle("Pengumuman");
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-4 lg:p-8">
      <Accepted />
      <Rejected />
    </div>
  );
};

export default Announcement;
