import React, { useState, useEffect } from 'react';
import { CreateTask, fetchParameterList } from '../api';

function SelectWithDatalist({ name, value, onChange, paramType }) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetchParameterList(paramType).then(setOptions).catch(() => {});
    }, [paramType]);

    return (
        <>
            <input
                list={`datalist-${name}`}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="flex-1 border border-gray-300 p-2 rounded"
            />
            <datalist id={`datalist-${name}`}>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt} />
                ))}
            </datalist>
        </>
    );
}

export default function NewTaskDialog({ onClose, onCreate }) {
    const [form, setForm] = useState({
        jiraNo: '',
        requester: '',
        title: '',
        startDate: '',
        dueDate: '',
        status: 'TODO',
        environment: '',
        notes: {},
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'notes') {
            setForm((prev) => ({
                ...prev,
                notes: { [new Date().toISOString()]: value }
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTask = await CreateTask(form);
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
                    {[
                        { label: 'Jira Number', name: 'jiraNo' },
                        { label: 'Requester', name: 'requester', type: 'datalist', paramType: 'requester' },
                        { label: 'Task Name', name: 'title' },
                        { label: 'Start Date', name: 'startDate', type: 'date' },
                        { label: 'Due Date', name: 'dueDate', type: 'date' },
                        { label: 'Status', name: 'status', type: 'datalist', paramType: 'status' },
                        { label: 'Dev Environment', name: 'environment', type: 'datalist', paramType: 'environment' },
                        // { label: 'Note', name: 'notes' },
                    ].map(({ label, name, type, paramType }) => (
                        <div key={name} className="flex items-center mb-3">
                            <label htmlFor={name} className="w-32 text-sm font-semibold text-gray-700">
                                {label}:
                            </label>
                            {type === 'datalist' ? (
                                <SelectWithDatalist
                                    name={name}
                                    paramType={paramType}
                                    value={form[name]}
                                    onChange={handleChange}
                                />
                            ) : (
                                <input
                                    id={name}
                                    name={name}
                                    type={type || 'text'}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className="flex-1 border border-gray-300 p-2 rounded"
                                    required={['id', 'requester', 'title'].includes(name)}
                                />
                            )}
                        </div>
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
