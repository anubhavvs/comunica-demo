# Comunica Demo

![logo](https://comunica.dev/img/comunica_wide.svg)

This a simple data visualization project using Comunica which utilizes the power of knowledge graphs to display complex data structures and relationships.

## Setup

You will need to have a local database running which can host the [LinkedMDB dataset](https://www.cs.toronto.edu/~oktie/linkedmdb/). We used [Apache Jena Fuseki](https://jena.apache.org/index.html) as our database.

1. Start the server

    ```unix
    cd server/
    npm install
    npm run start
    ```

2. Star the client

    ```unix
    npm install
    npm run dev
    ```

## Dependencies

- [LinkedMDB](https://www.cs.toronto.edu/~oktie/linkedmdb/)
- [Apache Jena Fuseki](https://jena.apache.org/index.html)
- [vis.js](https://visjs.github.io/vis-network/docs/network/)
- [Comunica](https://comunica.dev/)
- [Vite](https://vitejs.dev/)