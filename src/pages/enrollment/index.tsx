import { Moment } from "moment";
import { FC, useEffect } from "react";
import { BiDownload, BiUser } from "react-icons/bi";
import { CgSearch } from "react-icons/cg";
import { listEnrollment } from "../../api/endpoints/enrollment";
import Attachment from "../../api/models/attachment";
import EnrollmentModel from "../../api/models/enrollment";
import List from "../../components/list";
import NotFound from "../../components/not_found";
import TextInput from "../../components/text_input";
import useApi from "../../hooks/api";
import useLayout from "../../hooks/layout";

export type PresentationProps = {
  value: EnrollmentModel["form"][number]["value"];
};

export const presentationMap: Record<
  EnrollmentModel["form"][number]["input"],
  FC<PresentationProps>
> = {
  upload: ({ value }) => (
    <a
      href={(value as Attachment).url}
      target="_blank"
      className="text-info-600 flex items-center space-x-2"
    >
      <BiDownload /> <span className="text-sm">Download</span>
    </a>
  ),
  text: ({ value }) => value as string,
  radio: ({ value }) => value as string,
  numeric: ({ value }) => value as string,
  dropdown: ({ value }) => value as string,
  checkbox: ({ value }) => (value as string[]).join(", "),
  calendar: ({ value }) => (value as Moment).format("DD MMMM YYYY"),
};

export default function Enrollment() {
  const { setActive, setTitle } = useLayout();

  const listEnrollmentApi = useApi(listEnrollment);

  useEffect(() => {
    setActive("Pendaftar");
    setTitle("Pendaftar");

    listEnrollmentApi({}).catch(() => {});
  }, []);

  return (
    <>
      <div className="flex justify-start items-center p-5 space-x-3">
        <TextInput
          left={() => <CgSearch />}
          placeholder="Cari..."
          containerClassName="flex-1"
        />
      </div>
      {!listEnrollmentApi.loading && !listEnrollmentApi.data?.length ? (
        <NotFound />
      ) : (
        listEnrollmentApi.data?.map((item, index) => {
          const Render = presentationMap[item.form[0].input];
          return (
            <List
              key={`${index}`}
              details={[
                {
                  className: "w-[20%]",
                  element: item.wave?.path?.name,
                },
                {
                  className: "w-[20%]",
                  element: item.wave?.name,
                },
                {
                  className: "w-[25%]",
                  element: item.email,
                },
              ]}
              icon={BiUser}
              to={`/enrollment/${item.id}`}
            >
              <Render value={item.form[0].value} />
            </List>
          );
        })
      )}
    </>
  );
}
