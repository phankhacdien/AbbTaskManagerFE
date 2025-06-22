import React, { useState } from 'react';
import { createTask } from '../api';

export default function NewTaskDialog({ onClose, onCreate }) {
    const [form, setForm] = useState({
        id: '',
        requester: '',
        name: '',
        startDate: '',
        dueDate: '',
        status: 'TODO',
        environment: '',
        note: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTask = await createTask(form);
            onCreate(newTask); // reload task list
            onClose();         // close dialog
        } catch (err) {
            alert("Error creating task");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {['id', 'requester', 'name', 'startDate', 'dueDate', 'status', 'environment', 'note'].map(field => (
                        <input
                            key={field}
                            name={field}
                            type={field.includes('Date') ? 'date' : 'text'}
                            value={form[field]}
                            onChange={handleChange}
                            placeholder={field}
                            className="w-full border p-2 rounded"
                            required={['id', 'requester', 'name'].includes(field)}
                        />
                    ))}
                    <div className="flex justify-end space-x-3 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
