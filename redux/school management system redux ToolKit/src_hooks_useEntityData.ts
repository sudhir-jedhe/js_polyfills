import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';

export function useEntityData<T>(
  selector: (state: RootState) => { entities: T[]; status: string; error: string | null },
  fetchAction: () => any
) {
  const dispatch = useDispatch<AppDispatch>();
  const { entities, status, error } = useSelector(selector);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAction());
    }
  }, [status, dispatch, fetchAction]);

  return { entities, status, error };
}

