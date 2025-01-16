export const extractHtmlSubstring = (input: string): string | null => {
    // Regular expression to match the "<html>" tag at the start and capture everything after it
    const regex = /(<html>.*)$/s; // 's' flag allows matching across multiple lines
    const match = input.match(regex);
    // Return the matched substring or null if no match is found
    return match ? match[1] : null;
}
