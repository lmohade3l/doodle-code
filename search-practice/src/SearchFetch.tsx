import { useEffect, useState } from "react";

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

type CAR_ITEM = {
	id: string,
	label: string,
	year: number,
	model: string,
	brand: string
}

interface CAR_ITEMS_RESPONSE {
	items: CAR_ITEM[],
	total: number,
	message?: string
}

export function SearchFetch() {
	const [query, setQuery] = useState('')
	const debouncedQuery = useDebounce(query, 300)
	const [items, setItems] = useState<CAR_ITEM[] | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [refetchCount , setRefetchCount] = useState(0) 

	const fetchData = (signal: AbortSignal) => {
		setLoading(true)
		setError('')
		fetch(SEARCH_URL + `?q=${debouncedQuery}`, { signal: signal })
			.then((res) => {
				if (!res.ok) {
					setError('خطایی رخ داد')
					setItems(null)
					return;
				}
				return res.json()
			})
			.then((res: CAR_ITEMS_RESPONSE) => {
				if (res?.items && Array.isArray(res?.items)) {
					setItems(res.items)
				} else if (res?.message) {
					setError(res?.message)
					setItems(null)
				}
			}).catch((err) => {
				if (err?.name === 'AbortError') return;
				setError('خطایی رخ داد')
				setItems(null)
			}).finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		if (!debouncedQuery || debouncedQuery?.length < 2) {
			setItems(null)
			return;
		};
		const controller = new AbortController()

		fetchData(controller.signal)

		return () => controller.abort()
	}, [debouncedQuery , refetchCount])

	return (
		<div>
			<input
				style={{ height: 30, width: '100%' }}
				name="searchQuery"
				id="searchQuery"
				onChange={(e) => setQuery(e.target.value)}
			/>

			{/* loading */}
			{loading && (
				<p>در حال دریافت اطلاعات...</p>
			)}

			{/* error */}
			{error && (
				<div>
					<p>خطایی رخ داد</p>
					<button onClick={() => setRefetchCount((prev) => prev + 1)}>تلاش مجدد</button>
				</div>
			)}

			{/* empty state */}
			{items && Array.isArray(items) && items?.length === 0 && !loading && (
				<p>نتیجه ای یافت نشد</p>
			)}

			{/* response */}
			{items && Array.isArray(items) && items?.length > 0 && (
				<>
					<p>{'تعداد نتایج:' + items?.length}</p>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', width: '100%' }} >
						<p>مدل</p>
						<p>نام</p>
						<p>سال</p>
						<p>یرند</p>
					</div>

					{items?.map((item) => (
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
			<p>مدل مورد نظر را وارد کنید</p>
		</div>
	);
}
