import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function TaskDetailPage() {
    const { taskId } = useParams();
    const [items, setItems] = useState([]);
    const [taskInfo, setTaskInfo] = useState({});
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/api/tasks/${taskId}`)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {
            setTaskInfo(data);
            if (Array.isArray(data) && data.length > 0) {
                const task = data[0].task || {};
                setTaskInfo(task);
                document.title = `📋 Task: ${task.title} | ABB Manager`;
            } else {
                document.title = `Task #${taskId} | ABB Manager`;
            }
        })
        .catch(() => alert("Failed to fetch task info"));

        fetch(`http://localhost:8080/api/tasksItems/${taskId}`)
            .then(res => res.json())
            .then(data => {
                setItems(Array.isArray(data) ? data : []);
            })
            .catch(() => alert("Failed to load task items"));
    }, [taskId]);

    const handleAddRow = () => {
        setItems(prev => [
            ...prev,
            { no: '', workType: '', item: '', name: '', notes: {} }
        ]);
    };

    const handleSave = () => {
        fetch(`http://localhost:8080/api/tasks/${taskId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...taskInfo, id: taskId }),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update task info");
            })
            .then(() => {
                // Sau khi lưu task info, tiếp tục lưu task items
                return fetch(`http://localhost:8080/api/tasksItems/${taskId}/saveTaskItems`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(items),
                });
            })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(() => alert("Saved successfully!"))
            .catch(() => alert("Failed to save task or items"));
    };

    const handleImportItemsExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet);

                const importedItems = json.map(row => ({
                    no: row['No'] || '',
                    workType: row['Work Type'] || '',
                    item: row['Item'] || '',
                    name: row['Name'] || '',
                    notes: {},
                }));

                setItems(prev => [...prev, ...importedItems]);
            } catch (err) {
                alert("Error parsing Excel file");
            } finally {
                setIsImporting(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDeleteRow = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index, field, value) => {
        setItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleTaskFieldChange = (field, value) => {
        setTaskInfo(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-6 text-gray-100 bg-[#1e1e2f] min-h-screen">
            <div className="flex items-center justify-between border-b border-gray-600 pb-2 mb-4">
                <h1 className="text-3xl font-bold text-white">📋 Task #{taskId} Detail View</h1>
                <div className="flex gap-2">
                    <label className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-2 rounded cursor-pointer">
                        📥 Import Items
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleImportItemsExcel}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={handleSave}
                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        💾 Save
                    </button>
                </div>
            </div>


            {/* Spinner */}
            {isImporting && (
                <div className="flex items-center gap-2 text-yellow-400 mb-4">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        />
                    </svg>
                    <span>Importing items...</span>
                </div>
            )}


            {/* Task Info */}
            <div className="mb-6 text-sm text-gray-300 bg-[#2b2b3d] p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold block mb-1">Jira Number:</label>
                        <input
                            value={taskInfo.jiraNo || ''}
                            onChange={e => handleTaskFieldChange('jiraNo', e.target.value)}
                            className="w-full bg-[#1e1e2f] text-white px-2 py-1 rounded border border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">Task Name:</label>
                        <input
                            value={taskInfo.title || ''}
                            onChange={e => handleTaskFieldChange('title', e.target.value)}
                            className="w-full bg-[#1e1e2f] text-white px-2 py-1 rounded border border-gray-600"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                    <div>
                        <label className="font-semibold block mb-1">Requester:</label>
                        <input
                            value={taskInfo.requester || ''}
                            onChange={e => handleTaskFieldChange('requester', e.target.value)}
                            className="w-full bg-[#1e1e2f] text-white px-2 py-1 rounded border border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">Due Date:</label>
                        <input
                            type="date"
                            value={taskInfo.dueDate || ''}
                            onChange={e => handleTaskFieldChange('dueDate', e.target.value)}
                            className="w-full bg-[#1e1e2f] text-white px-2 py-1 rounded border border-gray-600 [&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">Environment:</label>
                        <input
                            value={taskInfo.environment || ''}
                            onChange={e => handleTaskFieldChange('environment', e.target.value)}
                            className="w-full bg-[#1e1e2f] text-white px-2 py-1 rounded border border-gray-600"
                        />
                    </div>
                </div>
            </div>


            {/* Add row button */}
            <div className="flex gap-4 mb-4">
                <button
                    onClick={handleAddRow}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Add Row
                </button>
            </div>


            {/* Items table */}
            <table className="w-full table-fixed text-sm border border-gray-600">
                <thead className="bg-[#0f1626] text-white font-semibold text-center">
                    <tr>
                        <th className="w-[60px] border px-2">No</th>
                        <th className="w-[120px] border px-2">Work Type</th>
                        <th className="w-[200px] border px-2">Item</th>
                        <th className="w-[200px] border px-2">Name</th>
                        <th className="w-[300px] border px-2">Note</th>
                        <th className="w-[300px] border px-2">Converted</th>
                        <th className="w-[60px] border px-2">Del</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center text-gray-400 py-4 italic">
                                No items yet. You can start adding...
                            </td>
                        </tr>
                    ) : (
                        items.map((it, rowIdx) => (
                            <tr key={rowIdx} className="border bg-white text-black hover:bg-gray-100">
                                {['no', 'workType', 'item', 'name'].map((field, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className="border px-2 bg-[#fff]"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleFieldChange(rowIdx, field, e.target.innerText)}
                                    >
                                        {it[field] || ''}
                                    </td>
                                ))}
                                <td className="border px-2 bg-white">
                                    {it.editingNote ? (
                                        <textarea
                                            autoFocus
                                            defaultValue={Object.values(it.notes || {}).join('\n')}
                                            onBlur={(e) => {
                                                const updatedNotes = {
                                                    [new Date().toLocaleString()]: e.target.value
                                                };
                                                handleFieldChange(rowIdx, 'notes', updatedNotes);
                                                handleFieldChange(rowIdx, 'editingNote', false);
                                            }}
                                            className="w-full h-24 p-1 bg-white text-sm border border-gray-300 resize-y"
                                        />
                                    ) : (
                                        <div
                                            className="whitespace-pre-line cursor-pointer text-sm text-black"
                                            onClick={() => handleFieldChange(rowIdx, 'editingNote', true)}
                                        >
                                            {Object.values(it.notes || {}).join('\n') || <span className="text-gray-400 italic">Click to edit</span>}
                                        </div>
                                    )}
                                </td>
                                <td className="border px-2 bg-[#fff]">
                                    {`${it.item || ''}>${it.name || ''}`}
                                </td>
                                <td className="border px-2 text-center bg-[#fff]">
                                    <button
                                        onClick={() => handleDeleteRow(rowIdx)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        ✖
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
