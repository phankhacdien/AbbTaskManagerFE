import React, { useRef, useState } from 'react';
import NewTaskDialog from './NewTaskDialog';
import * as XLSX from 'xlsx';
import ParameterDialog from './ParameterDialog';

export default function HeaderBar({ onTaskCreated, onTasksImported }) {
	const [showDialog, setShowDialog] = useState(false);
	const [showParamDialog, setShowParamDialog] = useState(false);
	const fileInputRef = useRef(null);
	// const filters = ['New Task', 'Suspend', 'Done', 'PreGolive', 'All'];
	const [importing, setImporting] = useState(false);
	const [progress, setProgress] = useState(0); // percentage

	const handleImportClick = () => fileInputRef.current.click();

	const handleImportExcel = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setImporting(true);		// start spinner
		setProgress(0);

		let fakeProgress = 0;
		const interval = setInterval(() => {
			if (fakeProgress >= 90) {
				clearInterval(interval);	// Stop interval, the rest will be handeled by fetch
			} else {
				fakeProgress += 10;
				setProgress(fakeProgress);
			}
		}, 200)		// 200ms raise 10%

		const reader = new FileReader();
		reader.onload = (evt) => {
			const data = evt.target.result;
			const workbook = XLSX.read(data, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const json = XLSX.utils.sheet_to_json(sheet);

			const formatted = json.map((row) => ({
				jiraNo: row['Jira No'] || '',
				requester: row['Requester'] || '',
				title: (row['Task Name'] || '').replace(/_/g, ' '),
				startDate: row['Start Date'] || '',
				dueDate: row['Due Date'] || '',
				status: row['Status'] || '',
				environment: row['Environment'] || '',
				note: row['Notes'] || '',
			}));

			fetch('http://localhost:8080/api/tasks/import', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formatted),
			})
				.then((res) => {
					if (!res.ok) throw new Error();
					// alert('📥 Import successful!');
					onTasksImported(); // trigger refresh
				})
				.catch(() => alert('❌ Import failed!'))
				.finally(() => {
					// () => setImporting(false)
					clearInterval(interval); // dừng giả lập
					setProgress(100); // kết thúc
					setTimeout(() => {
						setImporting(false);
						setProgress(0);
					}, 500); // đợi tí rồi tắt
				});
		};

		reader.readAsBinaryString(file);
	};

	return (
		<>
			<div className="flex items-center space-x-4 mb-6">
				<div className="text-2xl">📋</div>
				<button
					className="px-4 py-1 rounded-full bg-blue-500 hover:bg-blue-600"
					onClick={() => setShowDialog(true)}
				>
					New Task
				</button>

				{/* 📥 Import Excel button */}
				<button
					onClick={handleImportClick}
					disabled={importing}
					className={`relative px-4 py-1 rounded-full text-white ${
						importing ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'
					}`}
				>
					{importing ? (
						<div className="relative w-[160px] h-5 bg-gray-800 rounded overflow-hidden">
							<div
								className="bg-green-400 h-full text-black text-xs font-bold text-center transition-all duration-200"
								style={{ width: `${progress}%` }}
							>
								{progress}%
							</div>
						</div>
					) : (
						'📥 Import Excel'
					)}
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept=".xlsx, .xls"
					className="hidden"
					onChange={handleImportExcel}
				/>

				{/* ⚙️ Settings Button */}
				<button
					onClick={() => setShowParamDialog(true)}
					className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded-full"
				>
					⚙️ Setting Parameters
				</button>

				{/* Search */}
				<div className="ml-auto">
					<input type="text" placeholder="Search..." className="rounded px-3 py-1 text-black" />
				</div>
			</div>

			{showDialog && <NewTaskDialog onClose={() => setShowDialog(false)} onCreate={onTaskCreated} />}
			{showParamDialog && <ParameterDialog onClose={() => setShowParamDialog(false)} onUpdated={() => window.location.reload()} />}
		</>
	);
}
