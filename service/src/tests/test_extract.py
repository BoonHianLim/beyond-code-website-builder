import unittest
from src.utils.extract import extract_html_substring


class TestParser(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(TestParser, self).__init__(*args, **kwargs)

    def test_parse(self):
        input_str = """

        The following is a sample HTML document:
        <html>
            <head>
                <title>Sample HTML</title>
            </head>
            <body>
                <h1>Hello, World!</h1>
                <p>This is a sample HTML document.</p>
            </body>
        </html>

        The following is a sample CSS code:
        <style>
            h1 {
                color: blue;
            }
            p {
                color: green;
            }
        </style>

        Hope this helps!
        """
        self.assertEqual(extract_html_substring(
            input_str), "<html><head><title>Sample HTML</title></head><body><h1>Hello, World!</h1><p>This is a sample HTML document.</p></body></html><style> h1 { color: blue; } p { color: green; } </style>")

    def test_parse_with_think(self):
        input_str = """
        <think>

        Ok, the user wants to build a snowman.

        In this case, we can probably use the following code:

        <html>
        <body>
        Hello!
        </body>
        </html>

        </think>
        The following is a sample HTML document:
        <html>
            <head>
                <title>Sample HTML</title>
            </head>
            <body>
                <h1>Hello, World!</h1>
                <p>This is a sample HTML document.</p>
            </body>
        </html>
        
        The following is a sample CSS code:
        <style>
            h1 {
                color: blue;
            }
            p {
                color: green;
            }
        </style>

        Hope this helps!
        """
        self.assertEqual(extract_html_substring(
            input_str), "<html><head><title>Sample HTML</title></head><body><h1>Hello, World!</h1><p>This is a sample HTML document.</p></body></html><style> h1 { color: blue; } p { color: green; } </style>")
