import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../api';

export default function TaskTable() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks().then(setTasks).catch(() => alert("Error fetching tasks"));
    }, []);

    return (
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="text-gray-300 uppercase text-xs">
                <tr>
                    <th>STT</th>
                    <th>Requester</th>
                    <th>Task Name</th>
                    <th>Start Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Environment</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((t, i) => (
                    <tr key={t.id || i} className="bg-gray-700 rounded">
                        <td>{t.id}</td>
                        <td>{t.requester}</td>
                        <td>{t.name}</td>
                        <td>{t.startDate}</td>
                        <td>{t.dueDate}</td>
                        <td>{t.status}</td>
                        <td>{t.environment}</td>
                        <td>{t.note}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
