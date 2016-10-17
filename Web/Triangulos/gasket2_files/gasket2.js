//  Variáveis WebGL
var canvas;
var gl;
var points = [];
//var colors=[];

//  Variáveis do programa
var NumTimesToSubdivide = 5;
var SPEED = 0.01;
var CLOCKWISE = true;
var FILL = false;

var angle = 0;
var bufferId, vPosition, rotationMatrix;

//  Vértices do triângulo
var vertices = [
        vec2( -Math.cos(Math.PI/6), -Math.sin(Math.PI/6) ),
        vec2(  0,  1 ),
        vec2(  Math.cos(Math.PI/6), -Math.sin(Math.PI/6) )
    ];

//var cores = [
//        vec4(1.0, 0.0, 0.0, 1.0),
//        vec4(0.0,0.0,0.0,1.0)
//    ];

//var matrixDistortion = [
//        vec4(cos())]

//  Inicialização da página
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //  Tratando eventos
    document.getElementById("deepness").onchange = function(event) {
        NumTimesToSubdivide = parseInt(event.target.value);
        divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);
    }

    document.getElementById("quickness").onchange = function(event) {
        SPEED = parseInt(event.target.value)/100;
    }

    document.getElementById("fill").onchange = function(event) {
        FILL = event.target.checked;
    }

    document.getElementById("clock").onchange = function(event) {
        CLOCKWISE = true;
    }

    document.getElementById("notclock").onchange = function(event) {
        CLOCKWISE = false;
    }

    divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

    //  Configurando o WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Carregando shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    bufferId = gl.createBuffer(); 
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );  

    //var cBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );

    //var vColor = gl.getAttribLocation( program, "vColor" );
    //gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    //Posição dos vértices
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

    //Distorção dos vértices
    //distortion = gl.getAttribLocation( program, "distortion" );
    //gl.vertexAttribPointer(distortion+0,4,gl.FLOAT,false,0,0);
    //gl.vertexAttribPointer(distortion+1,4,gl.FLOAT,false,0,0);
    //gl.vertexAttribPointer(distortion+2,4,gl.FLOAT,false,0,0);
    //gl.vertexAttribPointer(distortion+3,4,gl.FLOAT,false,0,0);


    //Matriz de rotação
    rotationMatrix = gl.getUniformLocation(program, 'rotationMatrix');

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
    
        //bisect the sides
        
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles
        
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
        if(FILL){
            divideTriangle(ab, bc, ac, count );
        }
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

    var radian = Math.PI * angle;
    var cos = Math.cos(radian), sin = Math.sin(radian);

    var matrix = new Float32Array([cos,-sin,0.0,0.0,
                                    sin,cos,0.0,0.0,
                                    0.0,0.0,1.0,0.0,
                                    0.0,0.0,0.0,1.0]);

    points = [];
    //colors = [];

    divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

    //colors.push(cores[0]);
    //colors.push(cores[1]);

    // Carregando dados na GPU
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // Associando variáveis do shader com o buffer de dados
    gl.enableVertexAttribArray( vPosition );
    //gl.enableVertexAttribArray( vColor );

    gl.uniformMatrix4fv(rotationMatrix, false, matrix);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    //if(FILL){gl.drawArrays(gl.LINE_LOOP,0,points.length);}

    window.requestAnimFrame(render);
}