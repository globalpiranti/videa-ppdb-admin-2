import { plainToInstance } from "class-transformer";
import client from "../client";
import Attachment from "../models/attachment";

export const uploadFile =
  (onProgress: (progress: number) => void) => (files: File[]) => {
    const form = new FormData();
    for (const file of files) {
      form.append("files[]", file);
    }

    return client
      .post("/file", form, {
        onUploadProgress: (e) => {
          if (e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      })
      .then(({ data }): Attachment[] =>
        (data as unknown[]).map((item) =>
          plainToInstance(Attachment, item, { excludeExtraneousValues: true })
        )
      );
  };
