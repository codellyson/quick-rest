import { useMemo } from 'react';
import { useRequestStore } from '../stores/use-request-store';
import { useCollectionsStore } from '../stores/use-collections-store';

export const useIsDirty = () => {
  const { method, url, params, headers, bodyType, body, authType, authConfig } =
    useRequestStore();
  const { items, activeCollectionId } = useCollectionsStore();

  const activeCollection = items.find((item) => item.id === activeCollectionId);

  return useMemo(() => {
    if (!activeCollection) return false;
    return (
      activeCollection.method !== method ||
      activeCollection.url !== url ||
      JSON.stringify(activeCollection.params) !== JSON.stringify(params) ||
      JSON.stringify(activeCollection.headers) !== JSON.stringify(headers) ||
      activeCollection.bodyType !== bodyType ||
      activeCollection.body !== body ||
      activeCollection.authType !== authType ||
      JSON.stringify(activeCollection.authConfig) !== JSON.stringify(authConfig)
    );
  }, [
    activeCollection,
    method,
    url,
    params,
    headers,
    bodyType,
    body,
    authType,
    authConfig,
  ]);
};
