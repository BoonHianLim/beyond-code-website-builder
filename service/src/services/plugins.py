import importlib.util
import logging
import os
import time
import traceback
import watchdog.observers
import watchdog.events

from src.utils.logging import setup_logger
from src.types.plugin_base import PluginBase

logger: logging.Logger = logging.getLogger('uvicorn.error')

CUR_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PLUGIN_DIR = os.path.join(CUR_DIR, '../plugins')

plugin_registry: dict[str, PluginBase] = {}


def load_plugin(plugin_dir: str) -> PluginBase:
    """
    Loads a plugin from the specified path.

    Args:
        plugin_dir (str): The path to the plugin.

    Returns:
        PluginBase: An instance of the loaded plugin.
    """
    entry_point = os.path.join(plugin_dir, 'main.py')
    if not os.path.exists(entry_point):
        raise FileNotFoundError(
            f"Plugin entry point '{entry_point}' does not exist.")

    temp_module_name = os.path.basename(plugin_dir)
    spec = importlib.util.spec_from_file_location(
        temp_module_name, entry_point)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    plugin_instance: PluginBase = module.get_plugin()
    if not isinstance(plugin_instance, PluginBase):
        raise TypeError(
            f"Plugin '{temp_module_name}' does not implement PluginBase interface.")
    return plugin_instance


def scan_plugins(plugin_dir: str = DEFAULT_PLUGIN_DIR):
    for subfolder in os.listdir(plugin_dir):
        subfolder_path = os.path.join(plugin_dir, subfolder)
        if not os.path.isdir(subfolder_path):
            continue

        entry_point = os.path.join(subfolder_path, 'main.py')
        if not os.path.exists(entry_point):
            continue

        try:
            plugin = load_plugin(subfolder_path)
            plugin_registry[plugin.get_name()] = plugin
            logger.info(
                f"Plugin '{plugin.get_name()}' loaded from '{subfolder_path}'.")
        except Exception as e:
            logger.error(
                f"Failed to load plugin from '{subfolder_path}': {e}")
            traceback.print_exc()


def watch_plugins(plugin_dir: str = DEFAULT_PLUGIN_DIR):
    """
    Watches the plugin directory for changes and calls the callback function.

    Args:
        plugin_path (str): The path to the plugin.
        callback (function): The function to call when changes are detected.
    """
    class PluginEventHandler(watchdog.events.FileSystemEventHandler):
        def on_created(self, event):
            try:
                if event.is_directory:
                    time.sleep(1)  # Wait for the directory to be fully created
                    plugin = load_plugin(event.src_path)
                    plugin_registry[plugin.get_name()] = plugin
                    logger.info(
                        f"Plugin '{plugin.get_name()}' loaded from '{plugin_dir}'.")
            except Exception as e:
                logger.error(
                    f"Failed to load plugin from '{event.src_path}': {e}")
                traceback.print_exc()

    observer = watchdog.observers.Observer()
    observer.schedule(PluginEventHandler(), plugin_dir, recursive=False)
    observer.start()


def get_all_uis() -> list[str]:
    """
    Returns the HTML code for all loaded plugins.
    """
    return [
        plugin.get_ui() for plugin in plugin_registry.values()
    ]


def get_all_js() -> list[str]:
    """
    Returns the JavaScript code for all loaded plugins.
    """
    return [
        plugin.get_js() for plugin in plugin_registry.values()
    ]


def get_plugin_by_name(name: str) -> PluginBase:
    """
    Returns the plugin instance by name.

    Args:
        name (str): The name of the plugin.

    Returns:
        PluginBase: An instance of the plugin.
    """
    return plugin_registry.get(name)


if __name__ == "__main__":
    # Example usage
    setup_logger()
    scan_plugins()
    watch_plugins()
