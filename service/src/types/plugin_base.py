from fastapi import UploadFile


class PluginBase:
    """
    Base class for all plugins.
    """
    directory: str = None
    def get_name(self) -> str:
        """
        Returns the name of the plugin.
        """
        raise NotImplementedError("Subclasses should implement this!")

    def get_description(self) -> str:
        """
        Returns the description of the plugin.
        """
        raise NotImplementedError("Subclasses should implement this!")
    
    def get_ui(self) -> str:
        """
        Returns the UI of the plugin.
        """
        raise NotImplementedError("Subclasses should implement this!")
    
    def get_js(self) -> str:
        """
        Returns the JavaScript code for the plugin.
        """
        raise NotImplementedError("Subclasses should implement this!")
    
    def generate_code(self, html: str, partial_image: UploadFile, **kwargs) -> str:
        """
        Generates the code using the plugin.
        """
        raise NotImplementedError("Subclasses should implement this!")