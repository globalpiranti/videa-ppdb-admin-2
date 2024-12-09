import { useState } from "react";

export default function useApi<Params, Data>(
  endpoint: (params: Params) => Promise<Data>
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();

  const call = (params: Params) => {
    setLoading(true);
    return endpoint(params)
      .then((data) => {
        setData(data);
        setLoading(false);
        return data;
      })
      .catch((e) => {
        setLoading(false);
        throw e;
      });
  };

  return Object.assign(call, { data, loading });
}
