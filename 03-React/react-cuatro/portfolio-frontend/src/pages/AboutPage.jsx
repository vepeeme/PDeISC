import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from '../components/ErrorDisplay';

const AboutPage = () => {
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get('/about');
        setAbout(response.data[0]?.content || '');
      } catch (err) {
        setError('Error al cargar la información');
      }
    };
    fetchAbout();
  }, []);

  return (
    <div>
      <h1>Sobre Mí</h1>
      {error && <ErrorDisplay message={error} />}
      <p>{about}</p>
    </div>
  );
};

export default AboutPage;