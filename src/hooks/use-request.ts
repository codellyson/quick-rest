import { useCallback } from "react";
import { useRequestStore } from "../stores/use-request-store";
import { useResponseStore } from "../stores/use-response-store";
import { useHistoryStore } from "../stores/use-history-store";
import { useEnvironmentStore } from "../stores/use-environment-store";
import { useToastStore } from "../stores/use-toast-store";
import { sendRequest, RequestConfig } from "../utils/http";
import { replaceDynamicVariables, replaceVariables } from "../utils/variables";

export const useRequest = () => {
  const request = useRequestStore();
  const { setResponse, setLoading, setError } = useResponseStore();
  const { addItem: addHistoryItem } = useHistoryStore();
  const { getVariables } = useEnvironmentStore();
  const { showToast } = useToastStore();

  const send = useCallback(async () => {
    if (!request.url.trim()) {
      setError("URL is required");
      showToast("error", "URL is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const variables = getVariables();
      let url: string = replaceVariables(request.url, variables);
      url = replaceDynamicVariables(url, request.params);
      console.log("url", url);

      const enabledParams = request.params.filter((p) => p.enabled);
      const params: Record<string, string> = {};
      enabledParams.forEach((p) => {
        if (p.key) {
          params[p.key] = replaceVariables(p.value, variables);
        }
      });

      const enabledHeaders = request.headers.filter((h) => h.enabled);
      const headers: Record<string, string> = {};
      enabledHeaders.forEach((h) => {
        if (h.key) {
          headers[h.key] = replaceVariables(h.value, variables);
        }
      });

      if (request.authType === "bearer" && request.authConfig.bearerToken) {
        headers["Authorization"] = `Bearer ${request.authConfig.bearerToken}`;
      } else if (request.authType === "basic" && request.authConfig.username) {
        const credentials = btoa(
          `${request.authConfig.username}:${request.authConfig.password || ""}`
        );
        headers["Authorization"] = `Basic ${credentials}`;
      } else if (
        request.authType === "api-key" &&
        request.authConfig.apiKey &&
        request.authConfig.apiKeyHeader
      ) {
        headers[request.authConfig.apiKeyHeader] = request.authConfig.apiKey;
      }

      let body: string | FormData | undefined;
      if (request.bodyType === "json" && request.body) {
        try {
          JSON.parse(request.body);
          body = request.body;
        } catch {
          setError("Invalid JSON in body");
          showToast("error", "Invalid JSON in body");
          setLoading(false);
          return;
        }
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
      } else if (request.bodyType === "raw" && request.body) {
        body = request.body;
      } else if (request.bodyType === "form-data") {
        body = new FormData();
      }

      const config: RequestConfig = {
        method: request.method,
        url,
        headers,
        params,
        body,
      };

      const response = await sendRequest(config);
      setResponse(response);
      addHistoryItem({
        method: request.method,
        url,
        status: response.status,
      });
      showToast("success", `Request completed with status ${response.status}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Request failed";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    request,
    getVariables,
    setResponse,
    setLoading,
    setError,
    addHistoryItem,
    showToast,
  ]);

  return { send };
};
