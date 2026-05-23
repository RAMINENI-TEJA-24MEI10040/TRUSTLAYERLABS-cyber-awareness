
import React, { useState } from 'react'

type Breach = {
	id: string
	name: string
	date: string
	compromised_data: string[]
	description?: string
}

type Props = {
	initialEmail?: string
	onScan?: (email: string) => Promise<Breach[]>
}

// Minimal, production-ready BreachChecker
export default function BreachChecker({ initialEmail = '', onScan }: Props) {
	const [email, setEmail] = useState(initialEmail)
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState<Breach[] | null>(null)
	const [error, setError] = useState<string | null>(null)

	const mockFetch = async (q: string) => {
		// lightweight mock data to avoid external deps
		await new Promise((r) => setTimeout(r, 900))
		if (!q.includes('@')) throw new Error('Invalid email')
		return [
			{
				id: '1',
				name: 'ShadowNet Leak',
				date: '2023-11-09',
				compromised_data: ['email', 'password', 'ip_address'],
				description: 'Large credential dump from multiple services.',
			},
			{
				id: '2',
				name: 'CloudStorage Misconfig',
				date: '2022-06-21',
				compromised_data: ['email', 'phone_number'],
				description: 'Exposed PII in public buckets.',
			},
		] as Breach[]
	}

	const handleScan = async () => {
		setError(null)
		setResults(null)
		setLoading(true)
		try {
			const res = onScan ? await onScan(email) : await mockFetch(email)
			setResults(res)
		} catch (e: any) {
			setError(e?.message || 'Scan failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-0 p-6 rounded-lg bg-gradient-to-br from-gray-900 via-slate-900 to-black text-slate-200 shadow-xl max-w-3xl mx-auto">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-semibold tracking-tight">Breach Checker</h2>
				<span className="text-sm text-slate-400">Dark Cyber · Secure Scan</span>
			</div>

			<div className="grid gap-4 sm:grid-cols-3 mb-6">
				<label className="col-span-2">
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="name@example.com"
						className="w-full px-4 py-3 rounded-md bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-slate-500"
						aria-label="email"
					/>
				</label>

				<div className="flex items-center">
					<button
						onClick={handleScan}
						disabled={loading}
						className="w-full py-3 px-4 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-black font-semibold"
					>
						{loading ? 'Scanning...' : 'Scan'}
					</button>
				</div>
			</div>

			{error && <div className="mb-4 text-sm text-rose-400">{error}</div>}

			<div>
				{!results && !loading && (
					<div className="p-4 rounded-md bg-slate-800 text-slate-400 text-sm">Enter an email and click Scan to check exposures.</div>
				)}

				{results && (
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
							<div className="text-sm text-slate-400">Found {results.length} breach(es)</div>
							<div className="flex gap-2 text-xs text-slate-400">
								<div className="px-2 py-1 bg-slate-800 rounded">Risk: Elevated</div>
								<div className="px-2 py-1 bg-slate-800 rounded">Action: Review</div>
							</div>
						</div>

						<ul className="grid gap-3">
							{results.map((b) => (
								<li key={b.id} className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-md border border-slate-700">
									<div className="flex items-start justify-between">
										<div>
											<div className="text-lg font-medium">{b.name}</div>
											<div className="text-sm text-slate-400">{b.date}</div>
										</div>
										<div className="text-xs text-slate-300">ID: {b.id}</div>
									</div>
									<p className="mt-2 text-sm text-slate-300">{b.description}</p>

									<div className="mt-3">
										<div className="text-xs text-slate-400 mb-2">Exposed Data</div>
										<div className="flex flex-wrap gap-2">
											{b.compromised_data.map((d) => (
												<span key={d} className="text-xs px-2 py-1 bg-slate-700 rounded text-cyan-200">{d}</span>
											))}
										</div>
									</div>
								</li>
							))}
						</ul>

						<div className="p-4 rounded-md bg-gradient-to-t from-slate-800 to-slate-900 border border-slate-700">
							<h3 className="text-sm font-semibold">Recommendations</h3>
							<ul className="mt-2 text-sm text-slate-300 list-inside list-disc space-y-1">
								<li>Change passwords and enable MFA on affected accounts.</li>
								<li>Search for unique passwords reused across services.</li>
								<li>Monitor accounts for suspicious activity; consider credit freeze if PII exposed.</li>
								<li>Run a full security review and rotate API keys if applicable.</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
