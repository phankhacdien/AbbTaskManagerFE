export async function fetchTasks() {
	const res = await fetch('http://localhost:8080/api/tasks');
	if (!res.ok) throw new Error("Fetch failed");
	return res.json();
}

export async function createTask(task) {
	const res = await fetch('http://localhost:8080/api/tasks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(task),
	});
	if (!res.ok) throw new Error("Create failed");
	return res.json();
}
