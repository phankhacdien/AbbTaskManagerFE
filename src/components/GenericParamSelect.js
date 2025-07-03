export default function GenericParamSelect({ paramType, value, onChange }) {
	const [options, setOptions] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:8080/api/params/${paramType}`)
			.then(res => res.json())
			.then(data => {
				const opts = data.map(val => ({ label: val, value: val }));
				setOptions(opts);
			});
	}, [paramType]);

	return (
		<CreatableSelect
			isClearable
			options={options}
			onChange={(opt) => onChange(opt?.value || '')}
			value={value ? { label: value, value } : null}
			placeholder={`Select or type ${paramType}`}
			className="text-black"
		/>
	);
}
