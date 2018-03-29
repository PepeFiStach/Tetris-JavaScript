var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.scale(20, 20);

var player = {
  matrix: generatePieces('T'),
  pos: {x:5, y:0},
};
var arena = createMatrix(12, 20);
var colors=[
  null,
  'red',
  'green',
  'lightblue',
  'violet',
  'pink',
  'purple',
  'orange',
];
function generatePieces(type){
  if(type === 'T'){
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  }
  else if(type === 'O'){
    return [
      [2, 2],
      [2, 2],
    ];
  }
  else if(type === 'L'){
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  }
  else if(type === 'J'){
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  }
  else if(type === 'S'){
    return [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ];
  }
  else if(type === 'Z'){
    return [
      [6, 6, 0],
      [0, 6, 6],
      [0, 0, 0],
    ];
  }
  else if(type === 'I'){
    return [
      [0, 7, 0, 0],
      [0, 7, 0, 0],
      [0, 7, 0, 0],
      [0, 7, 0, 0],
    ];
  }
}
function swipeRow(){
  here: for(var y = arena.length - 1; y > 0; y-- ){
    for(var x = 0; x < arena[y].length; x++){
      if(arena[y][x] === 0){
        continue here;
      }
    }
    var row = arena.splice(y,1);
    row = arena[0].fill(0);
    arena.unshift(row);
    console.table(arena);
    y++;
  }
}
function generateRandomPieces(){
  var pieces = 'ILJOTSZ';
  player.matrix = generatePieces(pieces[Math.floor(Math.random()*7)]);
  player.pos.y = 0;
  // player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  player.pos.x = 5;
  if(collide(arena, player)){
    for(var y = 0; y < arena.length; y++){
      arena[y].fill(0);
    }
  }
}
function collide(arena, player){
  for(var y = 0; y < player.matrix.length; y++){
    for(var x = 0; x < player.matrix[y].length; x++){
      if(player.matrix[y][x] !== 0 && (arena[y + player.pos.y] && arena[y + player.pos.y][x + player.pos.x]) !== 0){
        return true;
      }
    }
  }
  return false;
}
function createMatrix(width, height){ //create arena
  var matrix = [];
  while(height--){
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}
function merge(arena, player){
  for(var y = 0; y < player.matrix.length; y++){
    for(var x = 0; x < player.matrix[y].length; x++){
      if(player.matrix[y][x] !== 0){
        arena[y + player.pos.y][x + player.pos.x] = player.matrix[y][x];
      }
    }
  }
}
function playerRotate(dir){
  var offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if(offset > player.matrix[0].length){
      rotate(player.matrix, -dir);
    }
  }
}
function rotate(matrix, dir){
  for(var y = 0; y < matrix.length; y++){
    for(var x = 0; x < y; x++){
      [matrix[x][y],matrix[y][x]]=[matrix[y][x],matrix[x][y]];
    }
  }
  if(dir > 0){
    for(var y = 0; y < matrix.length; y++){
      matrix[y].reverse();
    }
  }
  else{
    matrix.reverse();
  }
}
function playerMove(dir){
  player.pos.x += dir;
  if(collide(arena,player)){
    player.pos.x -= dir;
  }
}
function playerDrop(){
  player.pos.y++;
  if(collide(arena,player)){
    player.pos.y--;
    merge(arena,player);
    generateRandomPieces();
    swipeRow();
  }
  dropCounter = 0;
}
var lastTime = 0;
var dropCounter = 0;
var dropInterval = 1000;
function update(time = 0){
  var deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if(dropCounter > dropInterval){
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
}
function draw(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {x:0,y:0});
  drawMatrix(player.matrix, player.pos);
}
function drawMatrix(matrix, offset){
  for(var y = 0; y < matrix.length; y++){
    for(var x = 0; x < matrix[y].length; x++){
      if(matrix[y][x] !== 0){
        ctx.fillStyle = colors[matrix[y][x]];
        ctx.fillRect(x + offset.x, y+offset.y, 1, 1);
      }
    }
  }
}
document.addEventListener("keydown",function(event){
  if(event.keyCode == 37){
    playerMove(-1);
  }
  else if(event.keyCode == 39){
    playerMove(1);
  }
  else if(event.keyCode == 40){
    playerDrop();
  }
  else if(event.keyCode == 81){
    playerRotate(1);
  }
  else if(event.keyCode == 69){
    playerRotate(-1);
  }
})
update();
