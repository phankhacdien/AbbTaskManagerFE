import React, { useEffect, useState } from 'react';
import { getParameterValues, addParameterValue } from '../api';

export default function ParameterDialog({ onClose, onUpdated }) {
    const [type, setType] = useState('requester');
    const [value, setValue] = useState('');
    const [params, setParams] = useState([]);

    const types = ['requester', 'status', 'environment', 'worktype', 't24Items'];

    const fetchParams = async () => {
        try {
            const data = await getParameterValues(type);
            setParams(data);
        } catch (err) {
            alert('Failed to load parameters');
        }
    };

    useEffect(() => {
        fetchParams();
    }, [type]);

    const handleAdd = async () => {
        if (!value.trim()) return;
        try {
            await addParameterValue(type, value);
            setValue('');
            fetchParams();
            if (typeof onUpdated === 'function') {
                onUpdated(); // ✅ Gọi callback
            }
        } catch (err) {
            alert('Failed to add parameter');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">⚙️ Manage Parameters</h2>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Parameter Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                    >
                        {types.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="New value"
                        className="flex-1 border border-gray-300 rounded p-2"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                        ➕ Add
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-1">Current Values</label>
                    <ul className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto">
                    {params.map((p) => (
                        <li key={p.id} className="text-sm py-1 border-b last:border-b-0">
                        {p.name}
                        </li>
                    ))}
                    </ul>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
