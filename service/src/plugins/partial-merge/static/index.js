const partialGenerationBtnOnClick = async () => {
	alert('Generating with hint...')
	fetch('http://localhost:8081/anything')
	window.parent.postMessage('PARTIAL_GEN: Partial Merge Plugin', 'http://localhost:3000')
}
