export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

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
  data: any;
  time: number;
  size: number;
}

export const sendRequest = async (config: RequestConfig): Promise<HttpResponse> => {
  const startTime = Date.now();
  
  let url = config.url;
  if (config.params) {
    const params = new URLSearchParams();
    Object.entries(config.params).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const queryString = params.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers = new Headers();
  Object.entries(config.headers).forEach(([key, value]) => {
    if (value) headers.append(key, value);
  });

  try {
    const response = await fetch(url, {
      method: config.method,
      headers,
      body: config.body,
    });

    const endTime = Date.now();
    const time = endTime - startTime;

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let data: any;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    const size = JSON.stringify(data).length;

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data,
      time,
      size,
    };
  } catch (error) {
    const endTime = Date.now();
    const time = endTime - startTime;
    
    return {
      status: 0,
      statusText: error instanceof Error ? error.message : 'Network Error',
      headers: {},
      data: { error: error instanceof Error ? error.message : 'Network Error' },
      time,
      size: 0,
    };
  }
};

