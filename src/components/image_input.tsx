import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Attachment from "../api/models/attachment";
import useApi from "../hooks/api";
import { uploadFile } from "../api/endpoints/file";

export type ImageInputProps = {
  label?: string;
  containerClassName?: string;
  value?: Attachment;
  onChange?: (attachment?: Attachment) => void;
  message?: string;
};

export default function ImageInput({
  label,
  containerClassName,
  value,
  onChange,
  message,
}: ImageInputProps) {
  const [url, setUrl] = useState("");
  const [progress, setProgess] = useState(0);
  const uploadFileApi = useApi(uploadFile((val) => setProgess(val)));

  useEffect(() => {
    setUrl(value?.url || "");
  }, [value]);

  const onDrop = useCallback((files: File[]) => {
    if (files.length) {
      if (onChange) onChange(undefined);
      setUrl(URL.createObjectURL(files[0]));

      uploadFileApi([files[0]])
        .then((attachment) => {
          if (onChange) onChange(attachment[0]);
        })
        .catch(() => {});
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png", ".PNG"],
      "image/jpeg": [".jpg", ".jpeg", ".JPG", ".JPEG"],
    },
    multiple: false,
  });

  return (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <div
        {...getRootProps()}
        className={`flex w-full h-40 border rounded relative overflow-hidden justify-center items-center p-5 ${
          isDragActive
            ? "bg-info-100 border-info-500"
            : "bg-white border-neutral-300"
        }`}
      >
        <input {...getInputProps()} />
        {Boolean(url) && (
          <img src={url} className="w-full h-full object-contain" />
        )}
        {!uploadFileApi.loading ? (
          <div
            className={`w-full h-full flex justify-center items-center text-center absolute top-0 left-0 ${
              url
                ? "bg-black bg-opacity-50 text-white"
                : "bg-transparent text-neutral-800"
            }`}
          >
            {isDragActive ? (
              <p>Drop gambar disini</p>
            ) : (
              <p>Seret atau klik disini untuk memilih</p>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-center absolute top-0 left-0 bg-black bg-opacity-50">
            <div className="w-[60%] h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-white">Uploading...</div>
          </div>
        )}
      </div>
      {message && <div className="text-sm text-danger-600 mt-1">{message}</div>}
    </div>
  );
}
