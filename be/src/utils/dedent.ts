// copy from https://github.com/dmnd/dedent/blob/main/src/dedent.ts
export const dedent = (strings: string) => {
	// first, perform interpolation
	let result = strings

	// now strip indentation
	const lines = result.split('\n')
	let mindent: null | number = null
	for (const l of lines) {
		const m = l.match(/^(\s+)\S+/)
		if (m) {
			const indent = m[1].length
			if (!mindent) {
				// this is the first indented line
				mindent = indent
			} else {
				mindent = Math.min(mindent, indent)
			}
		}
	}

	if (mindent !== null) {
		const m = mindent // appease TypeScript
		result = lines
			.map((l) => (l[0] === ' ' || l[0] === '\t' ? l.slice(m) : l))
			.join('\n')
	}

	// dedent eats leading and trailing whitespace too
	result = result.trim()

	return result
}
