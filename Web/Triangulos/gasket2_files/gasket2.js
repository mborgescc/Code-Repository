//  Variáveis WebGL
var canvas;
var gl;
var points = [];

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

//  Inicialização da página
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //  Tratando evento de alteração de profundidade para a recursão de desenho de triângulos
    document.getElementById("deepness").onchange = function(event) {
        NumTimesToSubdivide = parseInt(event.target.value);
    }

    document.getElementById("quickness").onchange = function(event) {
        SPEED = parseInt(event.target.value)/100;
    }

    document.getElementById("fill").onchange = function(event) {
        FILL = event.target.checked;
    }

    divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

    //  Configurando o WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Carregando shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    bufferId = gl.createBuffer();   
    // Carregando dados na GPU
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    //Posição dos vértices
    vPosition = gl.getAttribLocation( program, "vPosition" );
    // Associando variáveis do shader com o buffer de dados
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

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
        if(FILL){divideTriangle(ab,ac,bc,count);}
    }
}

function render()
{
    // First, initialize the corners of our gasket with three points.
    if(angle >= 360){
        angle = 0;
    }
    angle += SPEED;

    var radian = Math.PI * angle;
    var cos = Math.cos(radian), sin = Math.sin(radian);

    var matrix = new Float32Array([cos,-sin,0.0,0.0,
                                    sin,cos,0.0,0.0,
                                    0.0,0.0,1.0,0.0,
                                    0.0,0.0,0.0,1.0]);

    points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

    gl.uniformMatrix4fv(rotationMatrix, false, matrix);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    window.requestAnimFrame(render);
}

