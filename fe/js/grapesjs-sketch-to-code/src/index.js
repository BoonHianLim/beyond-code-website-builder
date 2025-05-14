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
	if (!options.serverUrl) {
		options.serverUrl = 'http://localhost:8081'
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
	const modal = editor.Modal

	pn.addButton('options', {
		id: 'sketchToCode',
		className: 'fa fa-pencil-square-o',
		attributes: { title: 'Sketch to Code', 'data-tooltip-pos': 'bottom' },
		command: () => {
			location.href = options.mainUrl + "/full-gen.html"
		},
		active: false
	})

	pn.addButton('options', {
		id: 'partialSketchToCode',
		className: 'fa fa-pencil-square-o',
		attributes: { title: 'Partial Sketch to Code', 'data-tooltip-pos': 'bottom' },
		command: () => {
			// location.href = options.serverUrl + '/generator/partial/html'
			const modalContent = `<iframe src="${options.serverUrl + '/generator/partial/html'}" style="width: 100%; height: 400px;" sandbox="allow-scripts"></iframe>`
			modal.setTitle('Partial Sketch to Code')
			modal.setContent(modalContent)
			modal.open()
		},
		active: false
	})

	const base64ToFile = (base64, filename) => {
		const arr = base64.split(',')
		const mimeMatch = arr[0].match(/:(.*?);/)
		const mime = mimeMatch ? mimeMatch[1] : 'image/png'
		const bstr = atob(arr[1])
		let n = bstr.length
		const u8arr = new Uint8Array(n)

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}

		return new File([u8arr], filename, { type: mime })
	}
	const handlePartialGeneration = async (event) => {
		if (event.data.startsWith('PARTIAL_GEN')) {
			// Handle the UID message
			const API_ENDPOINT = 'http://localhost:8081/generator/partial'
			const formData = new FormData()
			const current_html = editor.getHtml()

			const parser = new DOMParser()
			const doc = parser.parseFromString(current_html, 'text/html')
			const partial_image = doc.querySelector('img[tag="partial-sketch-block"]')
			if (!partial_image) {
				alert('No partial image found in the HTML.')
				return
			}
			const base64Src = partial_image.src
			const partial_image_file = base64ToFile(base64Src, 'partial_image.png')

			const missing = doc.createElement('missing')
			partial_image.replaceWith(missing)

			formData.append('partialImage', partial_image_file)
			formData.append('html', doc.documentElement.outerHTML + '<style>' + editor.getCss() + '</style>')
			formData.append('pluginName', 'Partial Merge Plugin')
			const response = await fetch(API_ENDPOINT, {
				method: 'POST',
				body: formData
			})
			if (!response.ok) {
				alert('Failed to generate the app due to server: Generate server error. Please try again.')
				return
			}

			const response_json = await response.json()
			if (response_json.error) {
				alert('Failed to generate the app due to server: Generate resolve JSON error. Please try again.')
				return
			}

			const uuid = response_json.uuid
			if (!uuid) {
				alert('Failed to generate the app due to server: no UUID in JSON. Please try again.')
				return
			}
			const UUID_API_ENDPOINT = 'http://localhost:8081/generator/partial'
			const uuid_params = new URLSearchParams({
				uuid: uuid
			})

			const uuid_response = await fetch(UUID_API_ENDPOINT + '?' + uuid_params, {
				method: 'GET'
			})
			if (!uuid_response.ok) {
				alert('Failed to generate the app due to server: uuid endpoint. Please try again.')
				return
			}
			const uuid_response_html = await uuid_response.json()
			if (uuid_response_html.error) {
				alert('Failed to generate the app due to server: resolve HTML error after UUID. Please try again.')
				return
			}
			editor.setComponents(uuid_response_html)
			alert('Partial generation completed successfully!')
			modal.close()
		}
	}
	window.addEventListener('message', handlePartialGeneration, false)
}
