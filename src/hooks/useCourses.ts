import { useState, useEffect } from 'react';
import { Course } from '../types';
import { settingsService } from '../services/settingsService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await settingsService.fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    setCourses,
    loading,
    fetchCourses
  };
};
