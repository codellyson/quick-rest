import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      url,
      method,
      headers,
      body: requestBody,
      params,
      isFormData,
    } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let targetUrl = url;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        targetUrl += (targetUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    const requestHeaders: Record<string, string> = {};
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (value) {
          requestHeaders[key] = String(value);
        }
      });
    }

    const fetchOptions: RequestInit = {
      method: method || "GET",
      headers: requestHeaders,
    };

    if (requestBody && method !== "GET" && method !== "HEAD") {
      if (typeof requestBody === "string") {
        fetchOptions.body = requestBody;
      } else {
        fetchOptions.body = JSON.stringify(requestBody);
      }
    }

    if (isFormData && method !== "GET" && method !== "HEAD") {
      delete requestHeaders["Content-Type"];
      fetchOptions.body = undefined;
    }

    const startTime = Date.now();
    const response = await fetch(targetUrl, fetchOptions);
    const endTime = Date.now();
    const time = endTime - startTime;

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const contentType = response.headers.get("content-type") || "";
    let data: unknown;

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    } else if (contentType.includes("text/")) {
      data = await response.text();
    } else {
      const blob = await response.blob();
      data = await blob.arrayBuffer();
    }

    const size =
      typeof data === "string"
        ? new Blob([data]).size
        : JSON.stringify(data).length;

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data,
      time,
      size,
    });
  } catch (error) {
    const startTime = Date.now();
    const endTime = Date.now();
    const time = endTime - startTime;

    return NextResponse.json(
      {
        status: 0,
        statusText: error instanceof Error ? error.message : "Network Error",
        headers: {},
        data: {
          error: error instanceof Error ? error.message : "Network Error",
        },
        time,
        size: 0,
      },
      { status: 500 }
    );
  }
}
