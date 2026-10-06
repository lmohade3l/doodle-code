import { useEffect, useState } from "react";
import { CarModel } from "./types";

const SEARCH_URL = '/api/models'

// debounce value
const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => clearTimeout(timer)
	}, [value, delay])

	return debouncedValue
}

type State =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'error', message: string }
	| { status: 'success', items: CarModel[] }

export function SearchFetch() {
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebounce(query, 300)
	const [state, setState] = useState<State>({ status: 'idle' })
	const [refetchCount, setRefetchCount] = useState(0)

	useEffect(() => {
		if (!debouncedQuery || debouncedQuery?.length < 2) {
			setState({ status: 'idle' })
			return;
		};

		setState({ status: 'loading' })
		const controller = new AbortController()
		const params = new URLSearchParams({ q: debouncedQuery })

		fetch(SEARCH_URL + '?' + params, { signal: controller.signal })
			.then((res) => {
				if (!res.ok) {
					throw new Error('HTTP Error' + res.status)
				}
				return res.json()
			})
			.then((data) => setState({ status: 'success', items: data.items }))
			.catch((error) => {
				if (controller.signal.aborted) return;
				console.error(error)
				setState({ status: 'error', message: error.message })
			})

		return () => controller.abort()
	}, [debouncedQuery, refetchCount])

	return (
		<div>
			<input
				style={{ height: 30, width: '100%' }}
				name="searchQuery"
				id="searchQuery"
				onChange={(e) => setQuery(e.target.value)}
			/>

			{/* loading */}
			{state.status === 'loading' && (
				<p>در حال دریافت اطلاعات...</p>
			)}

			{/* error */}
			{state.status === 'error' && (
				<div>
					<p>خطایی رخ داد</p>
					<button onClick={() => setRefetchCount((prev) => prev + 1)}>تلاش مجدد</button>
				</div>
			)}

			{/* empty state */}
			{state.status === 'success' && state.items.length === 0 && (
				<p>نتیجه ای یافت نشد</p>
			)}

			{/* response */}
			{state.status === 'success' && state.items?.length > 0 && (
				<>
					<p>{'تعداد نتایج:' + state.items?.length}</p>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', width: '100%' }} >
						<p>مدل</p>
						<p>نام</p>
						<p>سال</p>
						<p>یرند</p>
					</div>

					{state.items?.map((item) => (
						<div key={item?.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', width: '100%' }} >
							<p>{item?.model}</p>
							<p>{item?.label}</p>
							<p>{item?.year}</p>
							<p>{item?.brand}</p>
						</div>
					))}
				</>
			)}

			{/* idle */}
			{state.status === 'idle' && (
				<p>مدل مورد نظر را وارد کنید</p>
			)}
		</div>
	);
}
