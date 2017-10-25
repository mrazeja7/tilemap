import Tilemap from './tilemap';
import data from './example_tilemap.json';

var tilemap = new Tilemap(data);

var canvas = document.createElement('canvas');
canvas.width = 1000;
canvas.height = 1000;
var context = canvas.getContext('2d');
document.body.appendChild(canvas);

// After 3 seconds (to allow image load time), render
setTimeout(() => {
  tilemap.render(context);
}, 3000)
