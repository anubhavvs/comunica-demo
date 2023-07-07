import { Network } from 'vis-network';
import { filmGraphQuery } from './graphQueries/filmGraphQuery';
import URL from './config';

export const searchQuery = async (searchData, searchType) => {
  let response = await fetch(
    `${URL}query?type=${searchType}&name=${searchData}`
  );
  let nodeData = await response.json();
  const data = nodeData.nodes;
  const edges = nodeData.edges;

  var graph = document.querySelector('#graph');
  var options = {
    nodes: {
      shape: 'dot',
      size: 20,
      font: {
        size: 15,
        color: '#ffffff',
      },
      borderWidth: 2,
      shadow: true,
    },
    edges: {
      width: 1,
    },
    groups: {
      source: { color: 'rgb(0,255,140)' },
      movie: { color: 'rgb(0,255,255)', size: 20 },
    },
    height: '95%',
    width: '80%',
    interaction: { hover: true },
  };

  var network = new Network(graph, nodeData, options);

  var title = document.querySelector('#title');
  title.innerHTML = `<span>All movies for <u>${searchData}</u> 🎭</span>`;

  network.on('click', (event) => {
    if (event.nodes.length !== 0) {
      var selectedNode = data.find((x) => x.id === event.nodes[0]);
      if (selectedNode.id !== 1) filmGraphQuery(selectedNode.url);
      network.canvas.body.container.style.cursor = 'default';
    }
  });

  network.on('hoverNode', function (params) {
    network.canvas.body.container.style.cursor = 'pointer';
  });

  network.on('blurNode', function (params) {
    network.canvas.body.container.style.cursor = 'default';
  });
};
