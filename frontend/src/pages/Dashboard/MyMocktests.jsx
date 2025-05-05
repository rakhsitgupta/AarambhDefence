import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../../config';

const MyMocktests = () => {
  const [mocktests, setMocktests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMocktests = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/mocktests/instructor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch mocktests');
        }

        const data = await response.json();
        setMocktests(data.data);
      } catch (error) {
        console.error('Error fetching mocktests:', error);
        toast.error('Failed to fetch mocktests');
      } finally {
        setLoading(false);
      }
    };

    fetchMocktests();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/mocktests/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete mocktest');
      }

      // Remove the deleted mocktest from the state
      setMocktests(mocktests.filter(mocktest => mocktest._id !== id));
      toast.success('Mocktest deleted successfully');
    } catch (error) {
      console.error('Error deleting mocktest:', error);
      toast.error(error.message || 'Failed to delete mocktest');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Mocktests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mocktests.map((mocktest) => (
          <div key={mocktest._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{mocktest.title}</h2>
            <p className="text-gray-600 mb-4">{mocktest.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">₹{mocktest.price}</span>
              <button
                onClick={() => handleDelete(mocktest._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyMocktests; 