document.addEventListener('DOMContentLoaded', () => {
	const fileInput = document.getElementById('fileInput')
	const uploadBox = document.querySelector('.upload-box')
	const uploadInstructions = document.querySelector('.upload-instructions')
	const previewContainer = document.querySelector('.preview-container')
	const previewImg = document.querySelector('.preview-img')

	let selectedFile = null

	// Optional: Add drag & drop functionality
	uploadBox.addEventListener('dragover', (e) => {
		e.preventDefault()
		uploadBox.style.borderColor = '#888'
	})

	uploadBox.addEventListener('dragleave', () => {
		uploadBox.style.borderColor = '#ccc'
	})

	uploadBox.addEventListener('drop', (e) => {
		e.preventDefault()
		uploadBox.style.borderColor = '#ccc'
		const files = e.dataTransfer.files
		if (files.length > 0) {
			handleFile(files[0])
		}
	})

	// File input change
	fileInput.addEventListener('change', () => {
		if (fileInput.files.length > 0) {
			handleFile(fileInput.files[0])
		}
	})

	function handleFile(file) {
		// Check file type: must be an image
		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file (png, jpg, etc.)')
			return
		}

		// Set the selected file
		selectedFile = file

		// Preview the image
		const reader = new FileReader()
		reader.onload = function (e) {
			previewImg.src = e.target.result
			// Hide instructions and show preview
			uploadInstructions.style.display = 'none'
			previewContainer.style.display = 'flex'
		}
		reader.readAsDataURL(file)
	}

	const generateBtn = document.getElementById('generateBtn')
	const loadingOverlay = document.getElementById('loadingOverlay')
	const contentArea = document.querySelector('.content-area')

	generateBtn.addEventListener('click', async () => {
		if (!selectedFile) {
			alert('Please upload a file first.')
			return
		}

		// Show loading overlay and blur the content
		loadingOverlay.style.display = 'flex'
		contentArea.classList.add('blur')

		try {
			const isLocal =
				window.location.hostname === 'localhost' ||
				window.location.hostname === '127.0.0.1' ||
				!window.location.hostname

			const API_ENDPOINT = isLocal ? 'http://localhost:8081' : 'https://api.yourproductionurl.com'

			// Create FormData to handle file upload
			const formData = new FormData()
			formData.append('file', selectedFile)
			formData.append('type', document.getElementById('aiModel').value)

			// Send request to backend (replace URL with your API endpoint)
			const response = await fetch(API_ENDPOINT + '/generate-website', {
				method: 'POST',
				body: formData
			})

			if (response.ok) {
				// Success: Redirect to edit.html
				localStorage.setItem('generated_response', await response.json())

				window.location.href = 'edit.html'
			} else {
				// Failure: Show an alert and keep the user on the page
				alert('Failed to generate the app. Please try again.')
			}
		} catch (error) {
			console.error('Error:', error)
			alert('Something went wrong. Please check your connection.')
		} finally {
			// Hide loading overlay and remove blur
			loadingOverlay.style.display = 'none'
			contentArea.classList.remove('blur')
		}
	})
})
