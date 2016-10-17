//  Variáveis WebGL
var canvas;
var gl;
var fcolor;
var points = [];

//constant colors;
const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);

//  Variáveis do programa
var NumSides = 5;
var SPEED = 0.01;
var CLOCKWISE = true;
var FILL = false;

var angle = 0;
var bufferId, vPosition, rotationMatrix;

var PI = Math.PI;

//  Vértices do triângulo
var center = [
        vec2( 0, 0 )];

//  Inicialização da página
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //  Tratando eventos
    document.getElementById("sides").onchange = function(event) {
        NumSides = parseInt(event.target.value);
        divide();
    }

    document.getElementById("quickness").onchange = function(event) {
        SPEED = parseInt(event.target.value)/100;
    }

    document.getElementById("clock").onchange = function(event) {
        CLOCKWISE = true;
    }

    document.getElementById("notclock").onchange = function(event) {
        CLOCKWISE = false;
    }

    divide();

    //  Configurando o WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Carregando shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    bufferId = gl.createBuffer(); 
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );  

    //Posição dos vértices
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

    fColor = gl.getUniformLocation(program, "fColor");

    //Matriz de rotação
    rotationMatrix = gl.getUniformLocation(program, 'rotationMatrix');

    render();
};

function insertPoint(p)
{
    points.push(p);
}

function divide()
{
    var i;
    insertPoint(center);
    const side = 2*(PI/NumSides);

    for(i=0;i<NumSides;i++){
        insertPoint(vec2(Math.cos(i*side),Math.sin(i*side)));
    }

}

function render()
{
    // First, initialize the corners of our gasket with three points.
    if(angle >= 360||angle <= -360){
        angle = 0;
    }

    if(CLOCKWISE){
        angle += SPEED;
    } else{
        angle -= SPEED;
    }

    var radian = PI * angle;
    var cos = Math.cos(radian), sin = Math.sin(radian);

    var matrix = new Float32Array([cos,-sin,0.0,0.0,
                                    sin,cos,0.0,0.0,
                                    0.0,0.0,1.0,0.0,
                                    0.0,0.0,0.0,1.0]);

    points = [];

    divide();

    // Carregando dados na GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associando variáveis do shader com o buffer de dados
    gl.enableVertexAttribArray( vPosition );

    gl.uniformMatrix4fv(rotationMatrix, false, matrix);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform4fv(fColor, flatten(red));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, points.length );
    gl.uniform4fv(fColor, flatten(black));
    gl.drawArrays(gl.LINE_LOOP,0,points.length);

    window.requestAnimFrame(render);
}