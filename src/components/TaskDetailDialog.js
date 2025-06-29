import React, { useEffect, useState } from 'react';

export default function TaskDetailDialog({ taskId, onClose }) {
	const [items, setItems] = useState([]);

	function handleAddItem(e) {
		e.preventDefault();
		const form = new FormData(e.target);
		const newItem = {
			no: form.get("no"),
			workType: form.get("workType"),
			item: form.get("item"),
			name: form.get("name"),
			notes: {}
		};
		fetch(`http://localhost:8080/api/tasksItems/${taskId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newItem)
		})
		.then(() => {
			setItems(prev => [...prev, newItem]); // hoặc gọi lại API
			e.target.reset();
		});
	}

	useEffect(() => {
		fetch(`http://localhost:8080/api/tasksItems/${taskId}`)
			.then(res => res.json())
			.then(setItems)
			.catch(() => alert("Failed to load task items"));
	}, [taskId]);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
			<div className="bg-white text-black rounded-lg p-6 w-full max-w-5xl overflow-auto max-h-[90vh]">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">Task Details</h2>
					<button onClick={onClose} className="text-red-600 font-semibold">Close</button>
				</div>

				<table className="w-full table-fixed border border-collapse text-sm">
					<thead className="bg-orange-200 text-black">
						<tr>
							<th className="w-[60px] border px-2">No</th>
							<th className="w-[120px] border px-2">Work Type</th>
							<th className="w-[200px] border px-2">Item</th>
							<th className="w-[200px] border px-2">Name</th>
							<th className="w-[300px] border px-2">Note</th>
							<th className="w-[300px] border px-2">Converted</th>
						</tr>
					</thead>
					<tbody>
						{items.length === 0 ? (
							<tr>
								<td colSpan={6} className="text-center text-gray-400 py-4 italic">
									No items yet. You can start adding...
								</td>
							</tr>
						) : (
							items.map(it => (
								<tr key={it.id} className="border">
									<td className="border px-2">{it.no}</td>
									<td className="border px-2">{it.workType}</td>
									<td className="border px-2">{it.item}</td>
									<td className="border px-2">{it.name}</td>
									<td className="border px-2">
										{Object.entries(it.notes || {}).map(([time, note], idx) => (
											<div key={idx} className="mb-1">
												<span className="text-xs text-gray-500">{time}</span>: {note}
											</div>
										))}
									</td>
									<td className="border px-2">{`${it.item}>${it.name}`}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
				<div className="mt-4 border-t pt-4">
					<h3 className="text-sm font-semibold mb-2">Add New Item</h3>
					<form onSubmit={handleAddItem} className="flex flex-wrap gap-2 items-center">
						<input name="no" placeholder="No" className="border p-1 rounded w-20" />
						<input name="workType" placeholder="Work Type" className="border p-1 rounded w-32" />
						<input name="item" placeholder="Item" className="border p-1 rounded w-40" />
						<input name="name" placeholder="Name" className="border p-1 rounded w-40" />
						<button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
					</form>
				</div>
			</div>
		</div>
	);
}
