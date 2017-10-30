import zlib from 'zlib';
export default class Tilemap {
  constructor(tilemapData) {
    this.images = [];
    this.tiles = [];
    this.layers = [];
    this.objects = [];

    // Load the map data
    this.mapWidth = tilemapData.width;
    this.mapHeight = tilemapData.height;
    this.tileWidth = tilemapData.tilewidth;
    this.tileHeight = tilemapData.tileheight;

    // Load our tiles from tilesets
    tilemapData.tilesets.forEach((tileset) => {
      // Create an image for the tileset's image
      var image = new Image();
      image.src = tileset.image;
      this.images.push(image);

      // Create tiles for tileset
      var id = tileset.firstgid;
      for(let y = 0; y < tileset.imageheight; y += tileset.tileheight) {
        for(let x = 0; x < tileset.imagewidth; x += tileset.tilewidth) {
          this.tiles[id] = {
            image: image,
            sx: x,
            sy: y
          };
          id++;
        }
      }
    });

    // Load the map layer data
    tilemapData.layers.forEach((layer) => {
      switch(layer.type)
      {
        case 'tilelayer':
          if (layer.compression)
          {
            zlib.unzip(Buffer.from(layer.data,'base64'), (err, data) => {
              if (err)
              {
                console.log(err);
                return;
              }
              var newLayer = {name: layer.name, data: []};
              for (var i = 0; i < data.length; i++) 
                if (i%4 === 0)
                  newLayer.data.push(data[i]);

              this.layers.push(newLayer); 
              //console.log(newLayer);           
            });
          }
          else
          {
            var newLayer = {name: layer.name, data: layer.data};
            this.layers.push(newLayer);
            //console.log(newLayer);
          }
          break;
        default:
          console.log('Unknown layer type: ' + layer.type);
      }
    });
    // CHEAT: Assume only one layer
    // NOTE: we can use a typed array for better efficiency
    this.data = new Uint8Array(tilemapData.layers[0].data);
  }

  render(ctx) {
    //console.log(this.layers.length);
    //console.log(this.mapHeight + ' ' + this.mapWidth);
    //console.log(this.tileHeight + ' ' + this.tileWidth);
    this.layers.forEach((layer) => {
      for(let y = 0; y < this.mapHeight; y++) 
      {
        for(let x = 0; x < this.mapWidth; x++) 
        {
          var tileIndex = layer.data[y * this.mapWidth + x];
          if(tileIndex === 0) continue; // Skip non-existant tiles
          var tile = this.tiles[tileIndex];
          if(!tile.image) continue; // Don't draw a non-existant image
          ctx.drawImage(
            // The source image
            tile.image,
            // The portion of the source image to draw
            tile.sx,
            tile.sy,
            this.tileWidth,
            this.tileHeight,
            // Where to draw the tile on-screen
            x * this.tileWidth,
            y * this.tileHeight,
            this.tileWidth,
            this.tileHeight
          );
        }
      }
    });
  }
}
