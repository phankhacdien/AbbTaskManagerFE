import React, { useEffect, useState, useRef } from 'react';
import { FetchTasks, updateTaskField, fetchParameterList, deleteTasks } from '../api';
import TaskDetailDialog from './TaskDetailDialog';

function EditableSelect({ value, onChange, paramType }) {
	const [options, setOptions] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		fetchParameterList(paramType).then(setOptions).catch(() => {});
	}, [paramType]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={ref}>
			<input
				type="text"
				value={value || ''}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => setShowDropdown(true)}
				className="w-full bg-[#2b2b3d] text-white border border-gray-500 px-2 py-1 rounded"
			/>
			<button
				type="button"
				className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white"
				onClick={() => setShowDropdown(!showDropdown)}
			>▼</button>

			{showDropdown && (
				<div className="absolute left-0 top-full w-full bg-white text-black border border-gray-300 max-h-40 overflow-y-auto z-50">
					{options.map((opt, idx) => (
						<div
							key={opt.id || idx}
							className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
							onClick={() => {
								onChange(opt.name);
								setShowDropdown(false);
							}}
						>
							{opt.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
}


export default function TaskTable({ refresh }) {
    const [tasks, setTasks] = useState([]);
    // const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const columnWidths = useRef(JSON.parse(localStorage.getItem('taskTableWidths')) || {});
    const columnKeys = ['id', 'jiraNo', 'requester', 'title', 'startDate', 'dueDate', 'status', 'environment', 'note'];

    useEffect(() => {
        FetchTasks().then(setTasks).catch(() => alert("Error fetching tasks"));
    }, [refresh]);

    const handleColumnResize = (key, width) => {
        columnWidths.current[key] = width;
        localStorage.setItem('taskTableWidths', JSON.stringify(columnWidths.current));
    };

    const renderResizeableTh = (label, key) => (
        <th
            style={{
                width: columnWidths.current[key] || 'auto',
                resize: 'horizontal',
                overflow: 'auto',
                minWidth: '60px',
            }}
            className="px-3 py-2 border border-gray-600"
            onMouseUp={(e) => {
                const th = e.target;
                const newWidth = th.offsetWidth;
                handleColumnResize(key, newWidth);
            }}
        >
            {label}
        </th>
    );

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return alert("No tasks selected");
        if (!window.confirm("Are you sure you want to delete the selected tasks?")) return;

        deleteTasks(selectedIds)
            .then(() => {
                setTasks((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
                setSelectedIds([]);
            })
            .catch(() => alert("Failed to delete tasks"));
    };

    const handleUpdateField = (id, field, value) => {
        setTasks((prev) => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
        updateTaskField(id, field, value).catch(() => alert("❌ Failed to update"));
    };

    return (
        <div className="p-6 text-gray-100 bg-[#1e1e2f] min-h-screen">
            <div className="mb-4">
                <button
                    onClick={handleDeleteSelected}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded"
                >
                    🗑 Delete Selected
                </button>
            </div>

            <table className="w-full text-sm text-left border-collapse table-fixed">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-3 py-2 border border-gray-600 w-[40px]">
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedIds(tasks.map((t) => t.id));
                                    } else {
                                        setSelectedIds([]);
                                    }
                                }}
                                checked={selectedIds.length === tasks.length && tasks.length > 0}
                            />
                        </th>
                        {/* {renderResizeableTh('ID', 'id')} */}
                        {renderResizeableTh('Jira No', 'jiraNo')}
                        {renderResizeableTh('Requester', 'requester')}
                        {renderResizeableTh('Task Name', 'title')}
                        {renderResizeableTh('Start Date', 'startDate')}
                        {renderResizeableTh('Due Date', 'dueDate')}
                        {renderResizeableTh('Status', 'status')}
                        {renderResizeableTh('Environment', 'environment')}
                        {renderResizeableTh('Notes', 'note')}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((t, i) => (
                        <tr
                            key={t.id || i}
                            className="hover:bg-[#2b2b3d] bg-[#1f1f2f] text-gray-100 border-t border-gray-700"
                        >
                            <td className="px-3 py-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(t.id)}
                                    onChange={() => handleSelect(t.id)}
                                />
                            </td>
                            {/* <td className="px-3 py-2">{t.id}</td> */}
                            <td className="px-3 py-2">{t.jiraNo}</td>
                            <td className="px-3 py-2">
                                <EditableSelect
                                    paramType="requester"
                                    value={t.requester}
                                    onChange={(val) => handleUpdateField(t.id, 'requester', val)}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <a
                                    href={`/task/${t.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 underline hover:text-blue-300"
                                >
                                    {t.title}
                                </a>
                            </td>
                            <td className="px-3 py-2">{t.startDate}</td>
                            <td className="px-3 py-2">{t.dueDate}</td>
                            <td className="px-3 py-2">
                                <EditableSelect
                                    paramType="status"
                                    value={t.status}
                                    onChange={(val) => handleUpdateField(t.id, 'status', val)}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <EditableSelect
                                    paramType="environment"
                                    value={t.environment}
                                    onChange={(val) => handleUpdateField(t.id, 'environment', val)}
                                />
                            </td>
                            <td className="px-3 py-2">{t.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* {selectedTaskId && (
                <TaskDetailDialog taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
            )} */}
        </div>
    );
}
