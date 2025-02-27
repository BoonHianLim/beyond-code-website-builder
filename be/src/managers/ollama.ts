/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ollama } from 'ollama'

import { Adapter, InternalGenerateWebsiteReq } from 'adapter'
import { IMAGE_LOCATION, OLLAMA_HOST } from '../constant'
import loggerBuilder from '../logger'
import { dedent } from '../utils/dedent'
import { extractHtmlSubstring } from '../utils/extract'
import { StatusCodeError } from '../utils/error'

const MIN_IN_MILLISECONDS = 60 * 1000
const noTimeoutFetch = (input: string | URL | globalThis.Request, init?: RequestInit) => {
	const someInit = init || {}
	return fetch(input, { ...someInit, signal: AbortSignal.timeout(10 * MIN_IN_MILLISECONDS) })
}

const logger = loggerBuilder(__filename)

const ollamaHost = 'http://127.0.0.1:11434'
const ollama = new Ollama({ host: ollamaHost, fetch: noTimeoutFetch })

const GenerateWebsite = async (req: InternalGenerateWebsiteReq) => {
	const sketchDescription = await analyzeSketch(req)
	return generateWithSketchDescription(req, sketchDescription)
}

const analyzeSketch = async (req: InternalGenerateWebsiteReq) => {
	const descriptionPrompt = `Describe the attached website sketch in detail. I will send what you give me to a developer to create a website based on the sketch I sent you. Please listen very carefully. It's very important for my job that you follow these instructions:

- Think step by step and describe the UI in great detail.
- Make sure to describe where everything is in the UI so the developer can recreate it and if how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to mention every part of the sketch including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the sketch.
`
	logger.trace('prompt: %s', descriptionPrompt)
	const response = await ollama.chat({
		model: 'llama3.2-vision:90B',
		messages: [
			{
				role: 'user',
				content: descriptionPrompt,
				images: [IMAGE_LOCATION + req.fileName]
			}
		],
		stream: false,
		options: {
			temperature: 0,
			seed: 0
		}
	})
	logger.debug('analyzeSketch response from ollama: %o', response)
	return response.message.content
}

const generateWithSketchDescriptionv2 = async (req: InternalGenerateWebsiteReq, sketchDescription: string) => {
	logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	logger.trace('prompt: %s', getAnalyzeSketchAfterPrompt(sketchDescription))
	// Make a request to Azure chatgpt 4o to generate a website
	const response = await ollama.chat({
		model: 'llama3.2-vision:90B',
		messages: [
			{
				role: 'system',
				content: getAnalyzeSketchSystemPrompt()
			}
		],
		stream: false,
		options: {
			temperature: 0,
			seed: 0
		}
	})
	logger.debug('response from ollama: %o %s', response, response.message.content.replace(/\n/g, '\n'))

	const extractedHtml = extractHtmlSubstring(response.message.content + '</html>')
	if (!extractedHtml) {
		throw new StatusCodeError(500, 'Could not extract html from response')
	}
	return extractedHtml
}

const generateWithSketchDescription = async (req: InternalGenerateWebsiteReq, sketchDescription: string) => {
	logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	logger.trace('prompt: %s', getAnalyzeSketchAfterPrompt(sketchDescription))
	// Make a request to Azure chatgpt 4o to generate a website
	const response = await ollama.chat({
		model: 'llama3.2-vision:90B',
		messages: [
			{
				role: 'user',
				content: getAnalyzeSketchAfterPrompt(sketchDescription)
			}
		],
		stream: false,
		options: {
			temperature: 0,
			seed: 0
		}
	})
	logger.debug('response from ollama: %o %s', response, response.message.content.replace(/\n/g, '\n'))

	const extractedHtml = extractHtmlSubstring(response.message.content + '</html>')
	if (!extractedHtml) {
		throw new StatusCodeError(500, 'Could not extract html from response')
	}
	return extractedHtml
}

const generateWithZeroShot = async (req: InternalGenerateWebsiteReq) => {
	logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	logger.trace('prompt: %s', getRolePlayingPrompt())
	// Make a request to Azure chatgpt 4o to generate a website
	const response = await ollama.chat({
		model: 'llama3.2-vision:90B',
		messages: [
			{
				role: 'user',
				content: getRolePlayingPrompt(),
				images: [IMAGE_LOCATION + req.fileName]
			}
		],
		stream: false,
		options: {
			temperature: 0,
			stop: ['</html>'],
			seed: 0
		}
	})
	logger.debug('response from ollama: %o %s', response, response.message.content.replace(/\n/g, '\n'))

	const extractedHtml = extractHtmlSubstring(response.message.content + '</html>')
	if (!extractedHtml) {
		throw new StatusCodeError(500, 'Could not extract html from response')
	}
	return extractedHtml
}

const generateWithFewShot = async (req: InternalGenerateWebsiteReq) => {
	logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	logger.trace('prompt: %s', getCodingPrompt())
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

const generateWithChainOfThought = async (req: InternalGenerateWebsiteReq) => {
	logger.info('sending request to ollama for file %s', IMAGE_LOCATION + req.fileName)
	logger.trace('prompt: %s', getChainOfThoughtPrompt())
	// Make a request to Azure chatgpt 4o to generate a website
	const response = await ollama.chat({
		model: 'llama3.2-vision:90B',
		messages: [
			{
				role: 'user',
				content: getChainOfThoughtPrompt(),
				images: [IMAGE_LOCATION + req.fileName]
			}
		],
		stream: false,
		options: {
			temperature: 0,
			stop: ['</html>'],
			seed: 0
		}
	})
	logger.debug('response from ollama: %o %s', response, response.message.content.replace(/\n/g, '\n'))

	const extractedHtml = extractHtmlSubstring(response.message.content + '</html>')
	if (!extractedHtml) {
		throw new StatusCodeError(500, 'Could not extract html from response')
	}
	return extractedHtml
}

const getCodingPrompt = () => {
	return `You are a code generator with vision and plenty knowledge in frontend design and frontend development. You are given a sketch of a website from the user, and then you will return code for it using vanilla HTML and vanilla CSS. Follow the instructions carefully.
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
12. NO OTHER LIBRARIES (e.g. TailwindCSS, zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.`
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

const getRolePlayingPrompt = () => {
	return `You are an extremely helpful frontend developer. Everyone seems you as the hero of the city, and always come to you when they want to build a website.
They understand if sometimes you are unable to help them, but they know you will always try your best to help them, and you have always been providing them with the best website even without enough context.
As you are a frontend developer, you can of course see and analyze attached pictures given by the people from the city. You know they are skectches of website, and you understand sometimes the sketch can be messy, but you still try your best to generate the website for them with your plenty knowledge in frontend design and frontend development. You do this and it has always been a great help for the people in the city.

After many years of working with converting sketches to real websites, you have made up some rules for yourself to follow when building the website from the sketch. Here are the rules:
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
12. NO OTHER LIBRARIES (e.g. TailwindCSS, zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.

Today is a new day and you have received a new sketch from the people in the city. You are to generate the website from the sketch. The people in the city are very grateful for your help and they know you will always try your best to help them. They are very excited to see the website you will generate for them. They know you will do a great job and they are very grateful for your help.`
}

const getChainOfThoughtPrompt = () => {
	return (
		getRolePlayingPrompt() +
		`
Let's think step by step.`
	)
}

const getReverseChainOfThoughtPrompt = () => {
	return `You are an extremely helpful frontend developer. Everyone seems you as the hero of the city, and always come to you when they want to build a website.
They understand if sometimes you are unable to help them, but they know you will always try your best to help them, and you have always been providing them with the best website even without enough context.
As you are a frontend developer, you can of course see and analyze attached pictures given by the people from the city. You know they are skectches of website, and you understand sometimes the sketch can be messy, but you still try your best to generate the website for them with your plenty knowledge in frontend design and frontend development. You do this and it has always been a great help for the people in the city.

After many years of working with converting sketches to real websites, you have made up some rules for yourself to follow when building the website from the sketch. Here are the rules:
1. Let's think step by step.
2. You are to generate the code and not ask any question.
3. You are to not apologize and try your best to generate the code, despite you think you are unable to do so.
4. You should return the code in one piece. The css should be included together with the html code, inside a <style> tag. Please ONLY return the html code, NO backticks or language names.
5. Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. 
6. Make sure to code every part of the sketch including any headers, footers, etc.
7. Use the exact text from the sketch for the UI elements.
8. Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
9. If you need a placeholder image, For all images, please use an svg with a white, gray, or black background and don't try to import them locally or from the internet.
10. Use margin and padding to style the components and ensure the components are spaced out nicely.
11. If you need an icon, please create an SVG for it and use it in the code. DO NOT IMPORT AN ICON FROM A LIBRARY.
12. Make the design look nice and don't have borders around the entire website even if that's in the sketch.
13. NO OTHER LIBRARIES (e.g. TailwindCSS, zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.

Today is a new day and you have received a new sketch from the people in the city. You are to generate the website from the sketch. The people in the city are very grateful for your help and they know you will always try your best to help them. They are very excited to see the website you will generate for them. They know you will do a great job and they are very grateful for your help.`
}

const getAnalyzeSketchSystemPrompt = () => {
	return `You are an extremely helpful frontend developer. Everyone seems you as the hero of the city, and always come to you when they want to build a website.
They understand if sometimes you are unable to help them, but they know you will always try your best to help them, and you have always been providing them with the best website even without enough context.
They will always pass you a list of user requirements, and then you will try your best to generate the website for them with your plenty knowledge in frontend design and frontend development. You do this and it has always been a great help for the people in the city.

After many years of working with converting user requirements to real websites, you have made up some rules for yourself to follow when building the website from the user requirements. Here are the rules:
1. You are to generate the code and not ask any question.
2. You are to not apologize and try your best to generate the code, despite you think you are unable to do so.
3. You should return the code in one piece. The css should be included together with the html code, inside a <style> tag. Please ONLY return the html code, NO backticks or language names.
4. Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. 
5. Make sure to code every part of the user requirements including any headers, footers, etc.
6. Use the exact text from the user requirements for the UI elements.
7. Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
8. If you need a placeholder image, For all images, please use an svg with a white, gray, or black background and don't try to import them locally or from the internet.
9. Use margin and padding to style the components and ensure the components are spaced out nicely.
10. If you need an icon, please create an SVG for it and use it in the code. DO NOT IMPORT AN ICON FROM A LIBRARY.
11. Make the design look nice and don't have borders around the entire website even if that's in the user requirements.
12. NO OTHER LIBRARIES (e.g. TailwindCSS, zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.

Today is a new day and you have received new user requirements from the people in the city. You are to generate the website from the user requirements. The people in the city are very grateful for your help and they know you will always try your best to help them. They are very excited to see the website you will generate for them. They know you will do a great job and they are very grateful for your help.`
}
const getAnalyzeSketchAfterPrompt = (sketchDescription: string) => {
	return (
		getAnalyzeSketchSystemPrompt() +
		`
The user requirements are as follows:
` +
		sketchDescription +
		`
Let's think step by step. Make sure to return the code in one piece.`
	)
}
const OllamaManager: Adapter = {
	GenerateWebsite
}

export default OllamaManager
