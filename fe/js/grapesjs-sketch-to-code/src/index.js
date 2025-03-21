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
	if (!options.mainUrl) {
		options.mainUrl = 'http://localhost:3000/index.html'
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

	// Add button for redirection to Sketch to Code
	const pn = editor.Panels
	pn.addButton('options', {
		id: 'sketchToCode',
		className: 'fa fa-file-pen',
		attributes: { title: 'Sketch to Code', 'data-tooltip-pos': 'bottom' },
		command: () => {
			location.href = options.mainUrl
		},
		active: false
	})
}
