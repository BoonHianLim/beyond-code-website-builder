/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ollama } from 'ollama'

import { Adapter, InternalGenerateWebsiteReq } from 'adapter'
import { IMAGE_LOCATION, OLLAMA_HOST } from '../constant'
import loggerBuilder from '../logger'
import { dedent } from '../utils/dedent'
import { extractHtmlSubstring } from '../utils/extract'
import { StatusCodeError } from '../utils/error'

const logger = loggerBuilder(__filename)

const ollamaHost = OLLAMA_HOST || 'http://localhost:8888'
const ollama = new Ollama({ host: ollamaHost })

const GenerateWebsite = async (req: InternalGenerateWebsiteReq) => {
	return generateWithZeroShot(req)
}

const generateWithZeroShot = async (req: InternalGenerateWebsiteReq) => {
	logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	// Make a request to Azure chatgpt 4o to generate a website
	const response = await ollama.chat({
		model: 'llama3.2-vision:90B',
		messages: [
			{
				role: 'user',
				content: `You are a code generator with plenty knowledge in frontend. You are given a sketch of a website from the user, and then you will return code for it using vanilla HTML and vanilla CSS. Follow the instructions carefully.
1. You are to generate the code and not ask any question.
2. You are to not apologize and try your best to generate the code, despite you think you are unable to do so.
3. You should return the code in one piece. The css should be included together with the html code, inside a <style> tag. Please ONLY return the html code, NO backticks or language names.
4. Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. 
5. Make sure to code every part of the sketch including any headers, footers, etc.
6. Use the exact text from the sketch for the UI elements.
7. Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
8. If you need a placeholder image, For all images, please use an svg with a white, gray, or black background and don't try to import them locally or from the internet.
9. Use margin and padding to style the components and ensure the components are spaced out nicely.
10. If you need an icon, please create an SVG for it and use it in the code. DO NOT IMPORT AN ICON FROM A LIBRARY.
11. Make the design look nice and don't have borders around the entire website even if that's in the sketch.
12. NO OTHER LIBRARIES (e.g. TailwindCSS, zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.`,
				images: [IMAGE_LOCATION + req.fileName]
			}
		],
		stream: false
	})
	logger.debug('response from ollama: %o %s', response, response.message.content.replace(/\n/g, '\n'))

	const extractedHtml = extractHtmlSubstring(response.message.content)
    if (!extractedHtml) {
        throw new StatusCodeError(500, 'Could not extract html from response')
    }
    return extractedHtml
}
const generateWithMultimodal = async (req: InternalGenerateWebsiteReq) => {
	logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	// Make a request to Azure chatgpt 4o to generate a website
	const response = await ollama.chat({
		model: 'llama3.2-vision:90B',
		messages: [
			{
				role: 'system',
				content: getCodingPrompt()
			},
			{
				role: 'user',
				content:
					'Please generate a website with vanilla html and css from the attached image. The css should be included together with the html code, inside a <style> tag. Please ONLY return the html code, NO backticks or language names.',
				images: [IMAGE_LOCATION + req.fileName]
			}
		],
		stream: false
	})
	logger.debug('response from ollama: %o', response)

	return response.message.content
}

const getCodingPrompt = () => {
	let systemPrompt = `
You are an expert frontend developer. You will be given a low-fidelity sketch of a website from the user, and then you will return code for it using vanilla HTML and vanilla CSS. Follow the instructions carefully, it is very important for my job. I will tip you $1 million if you do a good job. You are to generate the code and not ask any question.  

- Think carefully step by step about how to recreate the UI described in the prompt. 
- Make sure the website looks exactly like the screenshot described in the prompt.
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to code every part of the description including any headers, footers, etc.
- Use the exact text from the description for the UI elements.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the description. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For all images, please use an svg with a white, gray, or black background and don't try to import them locally or from the internet.
- Use margin and padding to style the components and ensure the components are spaced out nicely
- If you need an icon, please create an SVG for it and use it in the code. DO NOT IMPORT AN ICON FROM A LIBRARY.
- Make the design look nice and don't have borders around the entire website even if that's described
  `

	systemPrompt += `
    NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.
  `

	systemPrompt += `
  Here are some examples of good outputs:
  `

	systemPrompt += examples
	return dedent(systemPrompt)
}

const examples = `<html>
<head>
    <title>Webpage Mockup</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        * {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #202124;
            color: white;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 48px 0;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
        }

        .header .logo {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header .logo img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }

        .header .logo span {
            font-size: 48px;
            color: #4285F4;
        }

        .header .menu {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header .menu a {
            color: white;
            text-decoration: none;
        }

        .icon-bg {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 8px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .search {
            display: flex;
            justify-content: center;
            position: relative;
        }

        .search input {
            height: 48px;
            width: 384px;
            padding: 0 40px 0 16px;
            border-radius: 24px;
            border: none;
            font-size: 14px;
            outline: none;
        }

        .search button {
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #ccc;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
            margin-top: 48px;
        }

        .grid a {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: white;
        }

        .grid img {
            margin-bottom: 8px;
        }

        footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 32px;
            border-top: 1px solid #444;
        }

        footer .settings {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        footer span {
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <img src="https://placehold.co/40x40" alt="Placeholder for a unique logo">
                <span>Webpage</span>
            </div>
            <div class="menu">
                <a href="#">Gmail</a>
                <a href="#">Images</a>
                <div class="icon-bg">
                    <i class="fas fa-th"></i>
                </div>
                <div class="icon-bg">
                    <i class="fas fa-bell"></i>
                </div>
            </div>
        </div>

        <div class="search">
            <input type="text" placeholder="Search Webpage or type a URL">
            <button>
                <i class="fas fa-search"></i>
            </button>
        </div>

        <div class="grid">
            <a href="#">
                <img src="https://placehold.co/50" alt="Shortcut 1">
                <span>Shortcut 1</span>
            </a>
            <a href="#">
                <img src="https://placehold.co/50" alt="Shortcut 2">
                <span>Shortcut 2</span>
            </a>
            <a href="#">
                <img src="https://placehold.co/50" alt="Shortcut 3">
                <span>Shortcut 3</span>
            </a>
            <a href="#">
                <img src="https://placehold.co/50" alt="Shortcut 4">
                <span>Shortcut 4</span>
            </a>
            <a href="#">
                <img src="https://placehold.co/50" alt="Shortcut 5">
                <span>Shortcut 5</span>
            </a>
        </div>
    </div>

    <footer>
        <div class="settings">
            <i class="fas fa-cog"></i>
            <span>Customize Webpage</span>
        </div>
        <div>
            <span>Webpage Mockup</span>
        </div>
    </footer>
</body>
</html>`

const generateWithChainOfThought = async (req: InternalGenerateWebsiteReq) => {}
const OllamaManager: Adapter = {
	GenerateWebsite
}

export default OllamaManager
