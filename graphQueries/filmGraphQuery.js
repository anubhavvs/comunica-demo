import { Network } from 'vis-network';
import { searchQuery } from '../searchQuery';

export const filmGraphQuery = async (uri) => {
  let response = await fetch(`${URL}film`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uri: uri }),
  });
  let data = await response.json();
  var nodeData = data.nodeData;
  var filmData = nodeData.nodes;
  var filmName = data.filmName;
  console.log(filmData);

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
    },
    edges: {
      width: 1,
    },
    groups: {
      source: { color: 'rgb(0,255,140)', size: 30 },
      actor: { color: 'rgb(0,255,255)', size: 20 },
      director: { color: 'rgb(10,140,10)', size: 20 },
      writer: { color: 'rgb(140,0,0)', size: 20 },
      editor: { color: 'rgb(100,50,0)', size: 20 },
      producer: { color: 'rgb(100,255,0)', size: 20 },
      genre: { color: 'rgb(100,0,140)', size: 20 },
    },
    height: '100%',
    width: '100%',
  };

  var network = new Network(graph, nodeData, options);

  var title = document.querySelector('#title');
  title.innerHTML = `<span>Graphical representation of the movie <u>${filmName}</u> 🎬</span>`;

  network.on('click', (event) => {
    if (event.nodes.length !== 0) {
      var selectedNode = filmData.find((x) => x.id === event.nodes[0]);

      if (
        selectedNode.id > 6 &&
        selectedNode.group !== 'date' &&
        selectedNode.group !== 'genre'
      ) {
        searchQuery(selectedNode.label, selectedNode.group);
      }
    }
  });

  network.on('hoverNode', function (params) {
    network.canvas.body.container.style.cursor = 'pointer';
  });

  network.on('blurNode', function (params) {
    network.canvas.body.container.style.cursor = 'default';
  });
};
