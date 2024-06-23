export function delay(ms: number): Promise<void> {
	return new Promise((res) => {
		const thisInterval = setInterval(() => {
			res()
			clearInterval(thisInterval)
		}, ms)
	})
}
