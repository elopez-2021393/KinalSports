// src/features/fields/hooks/useFields.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';

export const useFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/fields');
      const data = response.data.data || response.data;
      
      const mappedFields = data.map((field) => ({
        id: field._id || field.id,
        name: field.fieldName,
        image: field.photo,
        location: `${field.fieldType} • ${field.capacity}`,
        isAvailable: Boolean(field.isActive),
        fieldType: field.fieldType,
        capacity: field.capacity,
        price: field.price,
        description: field.description,
      }));
      
      setFields(mappedFields);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar canchas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return { fields, loading, error, refetch: fetchFields };
};
