import React from 'react';
import HeaderBar from './components/HeaderBar';
import TaskTable from './components/TaskTable';

function App() {
	return (
		<div className="p-6">
			<HeaderBar />
			<TaskTable />
		</div>
	);
}

export default App;
