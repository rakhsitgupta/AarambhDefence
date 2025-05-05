import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskCalendar from '../../components/TaskCalendar';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/apiService';
import ErrorBoundary from '../../components/common/ErrorBoundary';

const TaskPlanner = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadTasks();
    }, [isAuthenticated, navigate]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ApiService.getTasks();
            setTasks(data.tasks);
        } catch (error) {
            setError(error.message);
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            const newTask = await ApiService.createTask(taskData);
            setTasks(prev => [...prev, newTask]);
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    };

    const handleUpdateTask = async (id, taskData) => {
        try {
            const updatedTask = await ApiService.updateTask(id, taskData);
            setTasks(prev => prev.map(task => 
                task._id === id ? updatedTask : task
            ));
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await ApiService.deleteTask(id);
            setTasks(prev => prev.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
                <div className="text-red-500 text-lg">{error}</div>
                <button
                    onClick={loadTasks}
                    className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 transition-all duration-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="p-6 text-richblack-5">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Task Planner</h1>
                    <p className="mt-1 text-sm text-richblack-200">
                        Manage your tasks and deadlines with our interactive calendar
                    </p>
                </div>
                <div className="bg-richblack-800 rounded-lg shadow">
                    <TaskCalendar
                        tasks={tasks}
                        onAddTask={handleAddTask}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                    />
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default TaskPlanner; 