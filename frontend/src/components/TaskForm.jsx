import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../features/tasks/taskSlice';
import { toast } from 'react-hot-toast';

const TaskForm = ({ task = null, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        time: task?.time || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (task) {
                await dispatch(updateTask({ id: task._id, ...formData })).unwrap();
                toast.success('Task updated successfully');
            } else {
                await dispatch(addTask(formData)).unwrap();
                toast.success('Task added successfully');
            }
            onClose();
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <label className="block text-sm font-medium text-richblack-5">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-richblack-700 border-richblack-600 text-richblack-5 shadow-sm focus:border-yellow-50 focus:ring-yellow-50"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-richblack-5">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md bg-richblack-700 border-richblack-600 text-richblack-5 shadow-sm focus:border-yellow-50 focus:ring-yellow-50"
                    rows="3"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-richblack-5">Due Date</label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-richblack-700 border-richblack-600 text-richblack-5 shadow-sm focus:border-yellow-50 focus:ring-yellow-50"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-richblack-5">Time (Optional)</label>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="mt-1 block w-full rounded-md bg-richblack-700 border-richblack-600 text-richblack-5 shadow-sm focus:border-yellow-50 focus:ring-yellow-50"
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-richblack-5 bg-richblack-700 border border-richblack-600 rounded-md hover:bg-richblack-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-richblack-900 bg-yellow-50 border border-transparent rounded-md hover:bg-yellow-100"
                >
                    {task ? 'Update Task' : 'Add Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm; 