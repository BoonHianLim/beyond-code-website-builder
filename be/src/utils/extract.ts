export const extractHtmlSubstring = (input: string): string | null => {
	// Regular expression to match the "<html>" tag at the start and capture everything after it
	const regex = /<(.+?)(\s+[^>]*)?>([\s\S]*)<\/\1>/g // 's' flag allows matching across multiple lines
	const match = [...input.matchAll(regex)]
	// Return the matched substring or null if no match is found
	return match.map((e) => e[0]).join('\n')
}
