export async function FetchTasks() {
	const res = await fetch('http://localhost:8080/api/tasks');
	if (!res.ok) throw new Error("Fetch failed");
	return res.json();
}

export async function CreateTask(task) {
	const res = await fetch('http://localhost:8080/api/tasks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(task),
	});
	if (!res.ok) throw new Error("Create failed");
	return res.json();
}

export async function fetchParameterList(type) {
    const res = await fetch(`http://localhost:8080/api/${type}`);
    if (!res.ok) throw new Error("Failed to fetch parameters");
    return res.json();
}

export async function updateTaskField(id, field, value) {
    const res = await fetch(`http://localhost:8080/api/tasks/${id}/field`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
    });
    if (!res.ok) throw new Error("Failed to update field");
}

export const deleteTasks = (selectedIds) => {
    return fetch('http://localhost:8080/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedIds),
    });
};

export async function getParameterValues(type) {
  const res = await fetch(`http://localhost:8080/api/${type}`);
  if (!res.ok) throw new Error('Failed to fetch parameters');
  return res.json();
}

export async function addParameterValue(type, value) {
  const res = await fetch(`http://localhost:8080/api/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: value }),
  });
  if (!res.ok) throw new Error('Failed to add parameter');
}

