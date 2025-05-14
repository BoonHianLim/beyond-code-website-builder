import re

def extract_html_substring(input_str: str) -> str | None:
    # Regular expression to match the "<html>" tag at the start and capture everything after it
    regex = r"<(.+?)(\s+[^>]*)?>([\s\S]*?)<\/\1>"
    # DOTALL allows matching across multiple lines
    matches = re.findall(regex, input_str, re.DOTALL)

    filtered_matches = [(tag, attrs, content)
                        for tag, attrs, content in matches if tag.lower() != "think"]

    # Return the matched substring(s) joined by newlines, or None if no match is found
    return minify_html('\n'.join(f"<{tag}{attrs or ''}>{content}</{tag}>" for tag, attrs, content in filtered_matches)) if filtered_matches else None

# Remove excessive spaces, newlines, and indentation
def minify_html(html):
    # Replace multiple spaces/newlines with a single space
    html = re.sub(r"\s+", " ", html)
    html = re.sub(r">\s+<", "><", html)  # Remove spaces between tags
    return html.strip()
    