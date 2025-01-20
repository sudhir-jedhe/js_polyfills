import { useState, useCallback } from 'react';

export function useForm<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  return { formData, handleChange, resetForm };
}

