import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import TaskTable from './components/TaskTable';
import TaskDetailPage from './components/TaskDetailPage';

function AppWrapper() {
	const [refresh, setRefresh] = useState(false);
	const location = useLocation();
	const isHome = location.pathname === "/";

	return (
		<div className="p-6">
			{isHome && (
				<HeaderBar
					onTaskCreated={() => setRefresh(!refresh)}
					onTasksImported={() => setRefresh(!refresh)}
				/>
			)}
			{/* <HeaderBar onTaskCreated={() => setRefresh(!refresh)} /> */}

			<Routes>
				<Route path="/" element={<TaskTable refresh={refresh} />} />
				<Route path="/task/:taskId" element={<TaskDetailPage />} />
			</Routes>
		</div>
	);
}

// export default App;
export default function App() {
	return (
		<Router>
			<AppWrapper />
		</Router>
	);
}