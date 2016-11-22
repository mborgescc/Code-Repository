//  Variáveis WebGL
var canvas;
var gl;
var fcolor;
var points = [];

//constant colors;
const black = vec4(0.0, 0.0, 0.0, 1.0);
const orange = vec4(0.88, 0.43, 0.12, 1.0);

//  Variáveis do programa
var NumSides = 5;
var SPEED = 0.01;
var CLOCKWISE = true;

var angle = 0;
var bufferId, vPosition, rotationMatrix;

var PI = Math.PI;

//  Vértices do triângulo
var center = vec2( 0.0, 0.0 );

//  Inicialização da página
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //  Tratando eventos
    document.getElementById("sides").onchange = function(event) {
        NumSides = parseInt(event.target.value);
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

    //  Configurando o WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 0.0 );

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
    rotationMatrix = gl.getUniformLocation(program, "rotationMatrix");

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
    insertPoint(vec2(1.0,0.0));
}

function render()
{
    var i;
    var triangleVector;

    //Ângulo
    if(angle >= 360||angle <= -360){
        angle = 0;
    }

    //Sentido de rotação
    if(CLOCKWISE){
        angle += SPEED;
    } else{
        angle -= SPEED;
    }

    //Matriz de rotação
    var radian = PI * angle;
    var cos = Math.cos(radian), sin = Math.sin(radian);

    var matrix = new Float32Array([cos,-sin,0.0,0.0,
                                    sin,cos,0.0,0.0,
                                    0.0,0.0,1.0,0.0,
                                    0.0,0.0,0.0,1.0]);

    //Gerando pontos
    points = [];
    divide();

    // Associando variáveis do shader com o buffer de dados
    gl.enableVertexAttribArray( vPosition );
    gl.uniformMatrix4fv(rotationMatrix, false, matrix);

    //Limpando buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Preenchimento
    gl.uniform4fv(fColor, flatten(orange));
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, points.length );

    //Linhas
    for(i=1;i<points.length-1;i++){
        triangleVector = [points[0], points[i], points[i+1]];
        gl.uniform4fv(fColor, flatten(black));
        gl.bufferData( gl.ARRAY_BUFFER, flatten(triangleVector), gl.STATIC_DRAW );
        gl.drawArrays(gl.LINE_LOOP,0,triangleVector.length);
    }

    window.requestAnimFrame(render);
}