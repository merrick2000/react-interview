## Overview of this repository

- [Vite](https://vitejs.dev/guide/) Typescript React base
- [Chakra-UI](https://chakra-ui.com/docs/principles) interface styling (feel free to replace with your favorite UI)
- [Pretty resolver](tsconfig.paths.json), aliased modules for readability: `import Home from "@components/Home"`
- [Github Actions](.github/workflows/push.yaml) to build and deploy this project to Github Pages (creates `gh-pages` branch)

### Getting Started

1. Extract the repository `unzip react-interview-exercise`
2. Install dependencies `cd react-interview-exercise && npm i`
3. Run local development server `npm run dev`
4. Navigate to http://localhost:3000
5. Follow the Prompt
8. Initialize and push to Github `git init` `git origin add your-repo-url` `git push origin main`
9. Enable Github Pages and send us a link!

## Prompt

The goal of this exercise is to build a prototype utility that gives users ability to search and view school district information from [NCES + ArcGIS apis](https://data-nces.opendata.arcgis.com/datasets/nces::private-school-locations-current/api). See [this dataset and others](https://data-nces.opendata.arcgis.com/datasets/school-district-characteristics-2019-20/explore). The api methods are already [implemented for you in this repository](src/utils/nces.ts), your objective is to create an interactive interface to filter and view the selected data. 

- Push all your changes to Github
    - Looking for semi-descriptive commit messages
- Working out of [Home.tsx](/src/components/Home.tsx):
    - Add the needed React `useEffect` statements for district and school searching
    - Create the UX around these 2 functions, utilize search inputs, lists, and a view container
    - District and School selection functionality, display a list, then when selected show more information

### Considerations

- If there is a requirement for more components, create them for optimal code readability and performance
- If something should be dramatically changed in the setup or organization of this repository, do so or document your perspective
- Most importantly, have fun! Express your passion for web development, we are lifelong learners and should enjoy tackling difficult challenges

## Extra Credit

- Please enable Github Pages and Github Actions in your Fork and update the url in your README.md
    - If your repository is not named `react-interview-exercise` you must update [vite.config.ts](vite.config.ts) "base" path
    - Especially if you are applying for a Fullstack position, we want to see your ability to deploy an app.
- CharacterStrong is highly design oriented and aims to provide students with animated interactive content. Show how you convey this in your UX. Reference https://characterstrong.com for our design considerations.
- There are issues with this repository, if you see something you don't like, add a comment/fix them!
- If you want to add a package, feel free and be ready to explain why you added it.
- Could you display school(s) on a Google Map? (API Key in [maps.ts](src/utils/maps.ts) is outdated, please provide a new one)
- Are there any other [NCES APIs](https://data-nces.opendata.arcgis.com/search?tags=nces) that might be useful for this tool?
