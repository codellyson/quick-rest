export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string | FormData;
  params?: Record<string, string>;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  time: number;
  size: number;
}

export const sendRequest = async (
  config: RequestConfig
): Promise<HttpResponse> => {
  const startTime = Date.now();

  let url = config.url;
  if (config.params) {
    const params = new URLSearchParams();
    Object.entries(config.params).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const queryString = params.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers: Record<string, string> = {};
  Object.entries(config.headers).forEach(([key, value]) => {
    if (value) headers[key] = value;
  });

  try {
    const isFormData = config.body instanceof FormData;
    const proxyPayload: {
      url: string;
      method: string;
      headers: Record<string, string>;
      body?: string;
      params?: Record<string, string>;
      isFormData?: boolean;
    } = {
      url,
      method: config.method,
      headers,
      params: config.params,
    };

    if (isFormData) {
      proxyPayload.isFormData = true;
    } else if (config.body !== undefined && typeof config.body === "string") {
      proxyPayload.body = config.body;
    }

    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proxyPayload),
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.statusText}`);
    }

    const result: HttpResponse = await response.json();
    return result;
  } catch (error) {
    const endTime = Date.now();
    const time = endTime - startTime;

    return {
      status: 0,
      statusText: error instanceof Error ? error.message : "Network Error",
      headers: {},
      data: { error: error instanceof Error ? error.message : "Network Error" },
      time,
      size: 0,
    };
  }
};
