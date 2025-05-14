# Beyond Code: Proof-of-Concept Website Builder

Quick Links:
[[Project Page]](https://boonhianlim.github.io/beyond-code)
[[Abstract]](https://openreview.net/forum?id=JRjTtoJman)
[[Paper]](https://hdl.handle.net/10356/184126)
[[Experiment]](https://github.com/BoonHianLim/partial-UI-generation)

This project extends on [GrapesJS](https://github.com/GrapesJS/grapesjs), an open-source website builder, and additionally implements features that helps tackle the lack of extendsibility and documentation issues in website builders. 

## Features
* Frontend UI Generation: Upload an image or sketch, and the AI generates a complete website.
* Plugins-of-plugins System: Allow extensions on the existing plugins.
* Automated Documentation Generation: A feature brought by [FastAPI](https://fastapi.tiangolo.com/).
* HTML Import / Export: A feature brought by [GrapesJS](https://github.com/GrapesJS/grapesjs).

## Project Structure
```bash
.
├── fe/                  # Frontend code
│   ├── index.html       # Landing page for uploading images
│   ├── edit.html        # Editor page for customizing generated websites
│   ├── js/              # JavaScript files
│   ├── styles.css       # Main stylesheet
│   └── stylesheets/     # Additional stylesheets
├── service/             # Backend code
│   ├── main.py          # Main backend server
│   ├── src/             # Source code for backend services
│   ├── static/          # Static files served by the backend
│   └── requirements.txt # Python dependencies
├── docs/                # Documentation and diagrams
│   ├── diagrams/        # UML and other diagrams
│   └── license/         # License files
└── README.md            # Project documentation
```

## Getting Started
### Prerequisites
* Frontend: A modern web browser.
* Backend: Python 3.10+ and Node.js.

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/BoonHianLim/beyond-code-website-builder.git
    cd beyond-code-website-builder
    ```
2. Install backend dependencies:
    ```bash
    cd ../be
    python -m venv venv # create a virtual environment for Python
    source venv/bin/activate
    pip install -r requirements.txt
    ```
3. Install frontend dependencies:
    ```bash
    cd ../fe
    yarn
    ```
### Running the Project
1. Start the backend server:
    ```bash
    cd ../be
    ./dev.sh
    ```
2. Start the frontend:
    ```bash
    cd ../fe
    yarn start
    ```
3. Open your browser and navigate to http://localhost:3000.

### Usage
1. Full frontend UI Generation
    ![full-frontend-UI-generation](static/videos/full-generation.mp4)

2. Partial frontend UI Generation
    ![partial-frontend-UI-generation](static/videos/partial-generation.mp4)

3. Plugins-of-plugins System: Import new extension
    ![import-extension](static/videos/plugins-of-plugins.mp4)

4. HTML Import / Export (Native feature of GrapesJS)
    ![HTML-import](static/videos/html-import.mp4)

    ![HTML-export](static/videos/html-export.mp4)

### Technologies Used
Frontend: HTML, CSS, JavaScript, GrapesJS
Backend: Python, FastAPI
AI Models: Gemini

## License
The GrapesJS files (grapesjs.min.js, grapesjs.min.js.app, the stylesheets and image under fe directory) are licensed under [GRAPESJS-LICENSE](docs/license//GRAPESJS-LICENSE).

The icons used in the GrapesJS editor are licensed under MIT License. See `docs/license` for more information.

The rest of this project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgments
[GrapesJS](https://github.com/GrapesJS/grapesjs) for the website editor.

[FastAPI](https://fastapi.tiangolo.com/) for the backend server.

If you find this project useful, please consider citing us!

```
@misc{
	10356_184126,
	author = {Boon Hian Lim},
	title = {Beyond code: a comprehensive study on website builders, their limitations, and opportunities for innovation},
	year = {2025},
}
```