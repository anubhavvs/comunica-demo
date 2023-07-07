import { QueryEngine } from '@comunica/query-sparql/lib/QueryEngine.js';
import express from 'express';

const router = express.Router();
const myEngine = new QueryEngine();

router.get('/query', async (req, res) => {
  var type = req.query.type;
  var name = req.query.name;

  var nodeData = { links: [], nodes: [] };
  var data = [
    {
      id: 1,
      label: name,
      group: 'source',
    },
  ];
  var links = [];

  const bindingsStream = await myEngine.queryBindings(
    `
              PREFIX lmdb: <http://data.linkedmdb.org/movie/>
              PREFIX dc: <http://purl.org/dc/terms/>

              SELECT ?movie ?film_id ?title WHERE {
              ?bacon a lmdb:${type} .
              ?bacon lmdb:${type}_name "${name}" .
              ?movie a lmdb:film ;
              lmdb:filmid ?film_id ;
              dc:title ?title ;
              lmdb:${type} ?bacon ;
          }`,
    {
      sources: [
        {
          type: 'sparql',
          value: 'http://localhost:3030/moviedb/sparql',
          mediaType: 'application/n-quads',
        },
      ],
    }
  );

  bindingsStream.on('data', (binding) => {
    let movie = {
      id: data.length + 1,
      label: binding.get('title').value,
      url: binding.get('movie').value,
      group: 'movie',
    };
    let link = {
      from: 1,
      to: movie.id,
    };
    data.push(movie);
    links.push(link);
  });

  bindingsStream.on('end', (binding) => {
    nodeData = {
      nodes: data,
      edges: links,
    };
    console.log('-', type, name, new Date().toLocaleTimeString());
    res.json(nodeData);
  });
});

router.get('/stats', async (req, res) => {
  var countData = {};

  const bindingsStream = await myEngine.queryBindings(
    `
      PREFIX lmdb: <http://data.linkedmdb.org/movie/>
      SELECT (COUNT(?film) AS ?filmCount) (COUNT(?actor) AS ?actorCount) (COUNT(?director) AS ?directorCount) (COUNT(?genre) AS ?genreCount)
      WHERE {
        {
          ?film a lmdb:film .
        } UNION {
          ?actor a lmdb:actor .
        } UNION {
          ?director a lmdb:director .
        } UNION {
          ?genre a lmdb:film_genre .
        }
      }
      `,
    {
      sources: [
        {
          type: 'sparql',
          value: 'http://localhost:3030/moviedb/sparql',
          mediaType: 'application/n-quads',
        },
      ],
    }
  );

  bindingsStream.on('data', (binding) => {
    let filmCount = binding.get('filmCount').value;
    let actorCount = binding.get('actorCount').value;
    let directorCount = binding.get('directorCount').value;
    let genreCount = binding.get('genreCount').value;
    let count = {
      filmCount: filmCount,
      genreCount: genreCount,
      directorCount: directorCount,
      actorCount: actorCount,
    };
    countData = count;
  });

  bindingsStream.on('end', (binding) => {
    console.log('-', 'stats', new Date().toLocaleTimeString());
    res.json(countData);
  });
});

router.post('/film', async (req, res) => {
  var nodeData = { links: [], nodes: [] };
  var filmName = '';
  var uri = req.body.uri;

  const filmData = [
    {
      id: 1,
      label: 'actor',
      group: 'actor',
    },
    {
      id: 2,
      label: 'director',
      group: 'director',
    },
    {
      id: 3,
      label: 'writer',
      group: 'writer',
    },
    {
      id: 4,
      label: 'editor',
      group: 'editor',
    },
    {
      id: 5,
      label: 'producer',
      group: 'producer',
    },
    {
      id: 6,
      label: 'genre',
      group: 'genre',
    },
  ];

  const filmLinks = [
    {
      from: 0,
      to: 1,
    },
    {
      from: 0,
      to: 2,
    },
    {
      from: 0,
      to: 3,
    },
    {
      from: 0,
      to: 4,
    },
    {
      from: 0,
      to: 5,
    },
    {
      from: 0,
      to: 6,
    },
  ];

  const bindingsStream = await myEngine.queryBindings(
    `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX film: <${uri}>

        SELECT ?property ?value ?label
            WHERE {
            film: ?property ?value .
            OPTIONAL {
                ?value rdfs:label ?label .
            }
        }
    `,
    {
      sources: [
        {
          type: 'sparql',
          value: 'http://localhost:3030/moviedb/sparql',
          mediaType: 'application/n-quads',
        },
      ],
    }
  );

  bindingsStream.on('data', (binding) => {
    var data = {};
    if (binding.get('property').value.split('/').pop() == 'title') {
      data = {
        id: 0,
        group: binding.get('property').value.split('/').pop(),
        label: binding.get('value').value,
      };
      filmName = binding.get('value').value;
    } else if (binding.get('property').value.split('/').pop() == 'date') {
      data = {
        id: filmData.length + 1,
        group: binding.get('property').value.split('/').pop(),
        label: binding.get('value').value,
      };
    } else {
      data = {
        id: filmData.length + 1,
        group: binding.get('property').value.split('/').pop(),
        uri: binding.get('value').value,
        label:
          binding.get('label') &&
          binding.get('label').value.replace(/ *\([^)]*\) */g, ''),
      };
    }

    if (
      [
        'title',
        'date',
        'actor',
        'director',
        'writer',
        'editor',
        'producer',
        'genre',
      ].includes(data.group)
    ) {
      filmData.push(data);
      var link = {};
      if (data.group === 'actor') {
        link = {
          from: 1,
          to: data.id,
        };
        filmLinks.push(link);
      } else if (data.group === 'director') {
        link = {
          from: 2,
          to: data.id,
        };
        filmLinks.push(link);
      } else if (data.group === 'writer') {
        link = {
          from: 3,
          to: data.id,
        };
        filmLinks.push(link);
      } else if (data.group === 'editor') {
        link = {
          from: 4,
          to: data.id,
        };
        filmLinks.push(link);
      } else if (data.group === 'producer') {
        link = {
          from: 5,
          to: data.id,
        };
        filmLinks.push(link);
      } else if (data.group === 'genre') {
        link = {
          from: 6,
          to: data.id,
        };
        filmLinks.push(link);
      } else if (data.group === 'date') {
        link = {
          from: 0,
          to: data.id,
        };
        filmLinks.push(link);
      }
    }
  });

  bindingsStream.on('end', () => {
    nodeData = {
      nodes: filmData,
      edges: filmLinks,
    };
    console.log('-', 'film', filmName, new Date().toLocaleTimeString());
    res.json({ nodeData, filmName });
  });
});

export default router;
