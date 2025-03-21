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
	// Add button for redirection to Sketch to Code
	const pn = editor.Panels
	console.log(editor)
	pn.addButton('options', {
		id: 'dragMode',
		attributes: { title: 'Set Drag Mode' },
		className: 'someClass',
		command: () => {
			console.log('Current drag mode:', currentMode)
			currentMode = availableDragModes[(availableDragModes.indexOf(currentMode) + 1) % availableDragModes.length]
			editor.setDragMode(currentMode)
			console.log('Drag mode set to', currentMode)
		},
		active: false
	})
}
