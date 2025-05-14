from src.types.plugin_base import PluginBase


def get_plugin():
    """
    Returns an instance of the plugin.
    """
    return PartialSplitPlugin()


class PartialSplitPlugin(PluginBase):
    def get_name(self) -> str:
        """
        Returns the name of the plugin.
        """
        return "Testing"

    def get_description(self) -> str:
        """
        Returns the description of the plugin.
        """
        return "This plugin is used to merge partial HTML and CSS code."

    def get_ui(self) -> str:
        """
        Returns the HTML code for the plugin.
        """
        return """
<div style="text-align:center;">
<img src="https://raw.githubusercontent.com/SALT-NLP/Sketch2Code/refs/heads/main/assets/intro_pic.png" height=200px alt="Plugin Logo" />
<h2>Testing</h2>
<button>Generate Now!</button>
</div>"""

    def get_js(self) -> str:
        """
        Returns the JavaScript code for the plugin.
        """
        return ""
