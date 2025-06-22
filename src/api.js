export async function fetchTasks() {
	const res = await fetch('http://localhost:8080/api/tasks');
	if (!res.ok) throw new Error("Fetch failed");
	return res.json();
}
