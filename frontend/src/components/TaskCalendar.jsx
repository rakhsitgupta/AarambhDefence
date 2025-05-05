import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-hot-toast';

const localizer = momentLocalizer(moment);

const TaskCalendar = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start: new Date(),
        end: new Date(),
        priority: 'medium'
    });

    const handleSelect = ({ start, end }) => {
        setFormData(prev => ({
            ...prev,
            start,
            end
        }));
        setShowModal(true);
    };

    const handleEventClick = (event) => {
        setSelectedTask(event);
        setFormData({
            title: event.title,
            description: event.description || '',
            start: event.start,
            end: event.end,
            priority: event.priority || 'medium'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTask) {
                await onUpdateTask(selectedTask._id, formData);
                toast.success('Task updated successfully');
            } else {
                await onAddTask(formData);
                toast.success('Task added successfully');
            }
            setShowModal(false);
            setSelectedTask(null);
            setFormData({
                title: '',
                description: '',
                start: new Date(),
                end: new Date(),
                priority: 'medium'
            });
        } catch (error) {
            toast.error(error.message || 'Failed to save task');
        }
    };

    const handleDelete = async () => {
        if (!selectedTask) return;
        try {
            await onDeleteTask(selectedTask._id);
            toast.success('Task deleted successfully');
            setShowModal(false);
            setSelectedTask(null);
        } catch (error) {
            toast.error(error.message || 'Failed to delete task');
        }
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = '#4CAF50';
        switch (event.priority) {
            case 'high':
                backgroundColor = '#f44336';
                break;
            case 'medium':
                backgroundColor = '#ff9800';
                break;
            case 'low':
                backgroundColor = '#4CAF50';
                break;
            default:
                break;
        }
        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className="h-[80vh]">
            <Calendar
                localizer={localizer}
                events={tasks}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectSlot={handleSelect}
                onSelectEvent={handleEventClick}
                selectable
                eventPropGetter={eventStyleGetter}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-richblack-800 p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4 text-richblack-5">
                            {selectedTask ? 'Edit Task' : 'Add New Task'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-richblack-5 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-2 rounded bg-richblack-700 text-richblack-5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-richblack-5 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-2 rounded bg-richblack-700 text-richblack-5"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-richblack-5 mb-1">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                                    className="w-full p-2 rounded bg-richblack-700 text-richblack-5"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                {selectedTask && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedTask(null);
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded hover:bg-yellow-100"
                                >
                                    {selectedTask ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCalendar; 