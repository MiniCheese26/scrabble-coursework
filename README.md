## Steps to run

* Node.js version 16.1.0 was used at the time of submission. Also tested and working with LTS. 
* Navigate to the project root directory in a command line tool.
* Use `npm run setup` to install dependencies and compile the application.
* Run with `npm start` or `ts-node src/index.ts`.
* To inspect the plain JS code that targets ESNext, please check `project-dir/plainBuild` and `project-dir/client/plainBuild`.
* Navigate to localhost:8080 and Scrabble away!

## What I have achieved

* I've developed a fully functional web based Scrabble game that supports up to 4 player local and online multiplayer.
* The game features all relevant game mechanics and rules of Scrabble allowing for a full game to be played.
* The website is built as an SPA to allow more seamless navigation and UI updates.
* The functionality is processed solely on the server-side and not under a peer-to-peer system which defends against a host abusing cheats.
    * Though arguably this system may scale up poorly if this was deployed for a larger user base.
* I developed my own websocket system from scratch including the ability to
    * Easily create and manage rooms and connections
    * Develop a consistent and standard model for request/responses via JSON

## What I would improve

* I would've liked to have written unit tests for my application. On several occasions I made a change that I thought I knew all the side effects of. Only to later find some bug that I luckily happened to stumble across.
* There is a lack of user feedback when actions fail on the server side. The program will handle server-side failures but will not inform the user explicitly.
* The CSS is somewhat responsive but it doesn't always scale well on smaller screens, especially with the grid and the individual boxes.  

## What was this project?

* This project was a first year university coursework project.
* The objective was to develop a Scrabble-like game with whatever extended functionality you see fit.

## Technologies used in this application

* HTML, CSS (Styled Components), Javascript (Typescript)
* ReactJS w/ React Router, JSX/TSX, React-Spring
* Webpack
* Express.js
