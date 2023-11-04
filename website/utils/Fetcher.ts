import { apiDomain } from "../constants";

const requestBuckets = {
  background: [] as (() => Promise<void>)[],
  important: [] as (() => Promise<void>)[],
  bulkActive: [] as (() => Promise<void>)[],
  default: [] as (() => Promise<void>)[],
};
const bucketConfigs = {
  background: {
    concurrency: 1,
    timeout: 0,
  },
  important: {
    concurrency: 200,
    timeout: 0,
  },
  bulkActive: {
    concurrency: 5,
    timeout: 0,
  },
  default: {
    concurrency: 2,
    timeout: 0,
  },
};
export const fetcher = (
  input: RequestInfo,
  init?: RequestInit | undefined,
  withAuth = true
) => {
  //   console.log('[fetcher]', input, init, btype))
  return new Promise<Response>(async (resolve, reject) => {
    const fet = fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
        ...(withAuth
          ? {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          : {}),
      },
    });
    const res = await fet;
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    resolve(res);
  });
};
