import { create } from 'zustand';
import { HttpResponse } from '../utils/http';

interface ResponseState {
  response: HttpResponse | null;
  loading: boolean;
  error: string | null;
  setResponse: (response: HttpResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useResponseStore = create<ResponseState>((set) => ({
  response: null,
  loading: false,
  error: null,
  setResponse: (response) => set({ response, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, response: null }),
  reset: () => set({ response: null, loading: false, error: null }),
}));

