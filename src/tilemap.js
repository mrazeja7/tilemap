export default class Tilemap {
  constructor(tilemapData) {
    this.images = [];
    this.tiles = [];

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
    // CHEAT: Assume only one layer
    // NOTE: we can use a typed array for better efficiency
    this.data = new Uint8Array(tilemapData.layers[0].data);
  }

  render(ctx) {
    for(let y = 0; y < this.mapHeight; y++) {
      for(let x = 0; x < this.mapWidth; x++) {
        var tileIndex = this.data[y * this.mapWidth + x];
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
  }
}
