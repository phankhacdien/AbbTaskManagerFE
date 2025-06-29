import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../api';
import TaskDetailDialog from './TaskDetailDialog';

export default function TaskTable({ refresh }) {
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    useEffect(() => {
        fetchTasks().then(setTasks).catch(() => alert("Error fetching tasks"));
    }, [refresh]);

    return (
        <>
            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="text-white bg-gray-900 text-sm">
                    <tr>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">ID</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">Jira No</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">Requester</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">Task Name</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">Start Date</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">Due Date</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">Status</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left border-r border-gray-700">Environment</th>
                        <th style={{ resize: 'horizontal', overflow: 'auto' }} className="px-2 py-2 font-semibold text-left">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t, i) => (
                        <tr key={t.id || i} onClick={() => setSelectedTaskId(t.id)} className="bg-gray-700 hover:bg-gray-600 transition-all rounded cursor-pointer">
                            <td>{t.id}</td>
                            <td>{t.jiraNo}</td>
                            <td>{t.requester}</td>
                            <td>{t.title}</td>
                            <td>{t.startDate}</td>
                            <td>{t.dueDate}</td>
                            <td>{t.status}</td>
                            <td>{t.environment}</td>
                            <td>{t.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTaskId && (
                <TaskDetailDialog taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
            )}
        </>
    );
}
