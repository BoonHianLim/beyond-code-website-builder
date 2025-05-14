import loadComponents from './components'
import loadBlocks from './blocks'
import en from './locale/en'

export default (editor, opts = {}) => {
	const options = {
		...{
			i18n: {}
			// default options
		},
		...opts
	}

	// Add components
	loadComponents(editor, options)
	// Add blocks
	loadBlocks(editor, options)
	// Load i18n files
	editor.I18n &&
		editor.I18n.addMessages({
			en,
			...options.i18n
		})

	let currentMode = editor.config.dragMode
	const availableDragModes = ['', 'absolute', 'translate']
	const availableDragModesClasses = ['fa fa-anchor', 'fa fa-arrows', 'fa fa-crosshairs']
	let nextMode = availableDragModes[(availableDragModes.indexOf(currentMode) + 1) % availableDragModes.length]
	// Add button for redirection to Sketch to Code
	const pn = editor.Panels
	console.log(editor)
	pn.addButton('options', {
		id: 'dragMode',
		attributes: { title: 'Set Drag Mode to ' + nextMode, 'data-tooltip-pos': 'bottom' },
		className: 'fa fa-anchor',
		command: () => {
			currentMode = availableDragModes[(availableDragModes.indexOf(currentMode) + 1) % availableDragModes.length]
			editor.setDragMode(currentMode)
			nextMode = availableDragModes[(availableDragModes.indexOf(currentMode) + 1) % availableDragModes.length]
			pn.getButton('options', 'dragMode').set('attributes', {
				title: 'Set Drag Mode to ' + nextMode,
				'data-tooltip-pos': 'bottom'
			})
			pn.getButton('options', 'dragMode').set(
				'className',
				availableDragModesClasses[availableDragModes.indexOf(currentMode)]
			)
		},
		active: false
	})
}
