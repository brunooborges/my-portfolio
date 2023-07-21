import project5 from '../assets/images/projects-images/expense-tracker.png';
import project2 from '../assets/images/projects-images/github-search.png';
import project6 from '../assets/images/projects-images/memory-game.png';
import project4 from '../assets/images/projects-images/muilti-step-form.png';
import project8 from '../assets/images/projects-images/my-portfolio.png';
import project1 from '../assets/images/projects-images/mycontacts.png';
import project3 from '../assets/images/projects-images/tic-tac-toe.png';
import project7 from '../assets/images/projects-images/to-do-list.png';

interface Project {
  id: number;
  name: string;
  description: string;
  github: string;
  github2?: string;
  live: string;
  screenshot: any;
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'MyContacts',
    description: `This project is a CRUD application created during the JStack course. It leverages Node.js with Express to build the back end, providing a REST API, and utilizes React for the front end. The main purpose of the application is to manage a contacts list with features like categorization, search, and sorting, all of which are supported through the implemented REST API.

At present, the back end is hosted on Render, the database on ElephantSQL, and the front end on Railway.

Technologies:
  - Node.js with Express
  - PostgresSQL
  - REST API
  - React
  - Styled Components

  Links for the Front and Back end:`,
    github: 'https://github.com/brunooborges/mycontacts-front-end',
    github2: 'https://github.com/brunooborges/mycontacts-api',
    live: 'https://mycontacts.up.railway.app/',
    screenshot: [project1],
  },
  {
    id: 2,
    name: 'Github Search',
    description: `This project is a React application developed as part of a mock interview test for a Junior React Developer position. It integrates the GitHub REST API to provide users with an efficient way to search for GitHub users.

Technologies:
  - React
  - Styled Components
  - Github REST API`,
    github: 'https://github.com/brunooborges/github-search',
    live: 'https://brunooborges.github.io/github-search/',
    screenshot: [project2],
  },
  {
    id: 3,
    name: 'Tic-tac-toe',
    description: `This project is a web application created as part of a mock interview test for a Junior JavaScript Developer position. It features a straightforward Tic-tac-toe game with a resettable score functionality.

Technologies:
  - HTML
  - CSS
  - JavaScript`,
    github: 'https://github.com/brunooborges/tic-tac-toe',
    live: 'https://brunooborges.github.io/tic-tac-toe/',
    screenshot: [project3],
  },
  {
    id: 4,
    name: 'Multi-step Form',
    description: `This project is a React application developed using TypeScript as part of the B7Web course. It focuses on creating a simple Multi-Step Form by leveraging the Context API for state management.

    Technologies:
    - React
    - TypeScript
    - Styled Components`,
    github: 'https://github.com/brunooborges/multi-step-form',
    live: 'https://brunooborges.github.io/multi-step-form/',
    screenshot: [project4],
  },
  {
    id: 5,
    name: 'Expense Tracker',
    description: `This project is a React application developed with TypeScript as part of the B7Web course. The primary goal of the application is to create a straightforward Expense Tracker, allowing users to view and manage their expenses on a monthly basis.

    Technologies:
    - React
    - TypeScript
    - Styled Components`,
    github: 'https://github.com/brunooborges/expense-tracker',
    live: 'https://brunooborges.github.io/expense-tracker/',
    screenshot: [project5],
  },
  {
    id: 6,
    name: 'Memory Game',
    description: `This project is a React application developed using TypeScript as part of the B7Web course. The main objective of the application is to create an engaging Memory Game, featuring a timer and a reset button for an enjoyable user experience.

    Technologies:
    - React
    - TypeScript
    - Styled Components`,
    github: 'https://github.com/brunooborges/react-memory-game',
    live: 'https://brunooborges.github.io/react-memory-game/',
    screenshot: [project6],
  },
  {
    id: 7,
    name: 'To-do List',
    description: `This project is a React application developed using TypeScript as part of the B7Web course. The main focus of the application is to create a straightforward To-do List, providing users with a practical tool for task management.

    Technologies:
    - React
    - TypeScript
    - Styled Components`,
    github: 'https://github.com/brunooborges/to-do-list',
    live: 'https://brunooborges.github.io/to-do-list/',
    screenshot: [project7],
  },
  {
    id: 8,
    name: 'My Portfolio',
    description: `This portfolio is built with React and TypeScript, showcasing my skills and knowledge acquired through dedicated studies and practical application. It serves as a platform to demonstrate my abilities and highlight the projects I've developed to present myself effectively.

    Technologies:
    - React
    - TypeScript
    - Styled Components`,
    github: 'https://github.com/brunooborges/my-portfolio',
    live: 'https://brunooborges.netlify.app',
    screenshot: [project8],
  },
];