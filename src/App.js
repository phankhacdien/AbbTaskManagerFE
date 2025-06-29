import React, { useState } from 'react';
import HeaderBar from './components/HeaderBar';
import TaskTable from './components/TaskTable';

function App() {
	const [refresh, setRefresh] = useState(false);

	return (
		<div className="p-6">
			<HeaderBar onTaskCreated={() => setRefresh(!refresh)} />
			<TaskTable refresh={refresh} />
		</div>
	);
}

export default App;
