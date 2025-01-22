export const extractHtmlSubstring = (input: string): string | null => {
	// Regular expression to match the "<html>" tag at the start and capture everything after it
	const regex = /<(.+?)(\s+[^>]*)?>([\s\S]*?)<\/\1>/ // No 'g' flag to match only the first occurrence
	const match = input.match(regex)
	// Return the matched substring or null if no match is found
	return match ? match[0] : null
}
