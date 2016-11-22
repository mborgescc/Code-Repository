//  Variáveis WebGL
var canvas;
var gl;
var fcolor;
var points = [];

//constant colors;
var colors = [  vec4(0.0, 0.0, 0.0, 1.0), //blue
                vec4(0.88, 0.43, 0.12, 1.0), //green
                vec4(), //yellow
                vec4(), //red
                vec4(), //orange
                vec4(1.0,1.0,1.0,1.0), //white
                vec4(0.0,0.0,0.0,1.0)] //black

//  Variáveis do programa
var SPEED = 0.01;
var CLOCKWISE = true;

var angle = 0;
var bufferId, vPosition, rotationMatrix;

var PI = Math.PI;

//  Vértices do triângulo
var cube_vertex = [ vec3(  0.65,     0.65,   0.65 ),
                    vec3(  0.65,     0.65,  -0.65 ),
                    vec3(  0.65,    -0.65,   0.65 ),
                    vec3(  0.65,    -0.65,  -0.65 ),
                    vec3( -0.65,     0.65,   0.65 ),
                    vec3( -0.65,     0.65,  -0.65 ),
                    vec3( -0.65,    -0.65,   0.65 ),
                    vec3( -0.65,    -0.65,  -0.65 )]

//  Inicialização da página
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //  Tratando eventos
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

    // Associando variáveis do shader com o buffer de dados
    gl.enableVertexAttribArray( vPosition );

    render();
};

function insertPoint(p)
{
    points.push(p);
}

function insert_face(num)
{
    switch(num){
        case 0:
            points.push(cube_vertex[0]);
            points.push(cube_vertex[1]);
            points.push(cube_vertex[2]);
            points.push(cube_vertex[3]);
            break;
        case 1:
            points.push(cube_vertex[4]);
            points.push(cube_vertex[5]);
            points.push(cube_vertex[6]);
            points.push(cube_vertex[7]);
            break;
        case 2:
            points.push(cube_vertex[0]);
            points.push(cube_vertex[1]);
            points.push(cube_vertex[4]);
            points.push(cube_vertex[5]);
            break;
        case 3:
            points.push(cube_vertex[0]);
            points.push(cube_vertex[2]);
            points.push(cube_vertex[4]);
            points.push(cube_vertex[6]);
            break;
        case 4:
            points.push(cube_vertex[1]);
            points.push(cube_vertex[3]);
            points.push(cube_vertex[5]);
            points.push(cube_vertex[7]);
            break;
        case 5:
            points.push(cube_vertex[2]);
            points.push(cube_vertex[3]);
            points.push(cube_vertex[6]);
            points.push(cube_vertex[7]);
            break;
    }
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

    gl.uniformMatrix4fv(rotationMatrix, false, matrix);

    //Limpando buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Gerando pontos
    for(i=0;i<6;i++){
        points = [];
        insert_face(i);
        //Preenchimento
        gl.uniform4fv(fColor, flatten(colors[i]));
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, points.length );
        //Linhas
        for(i=1;i<points.length-1;i++){
            triangleVector = [points[0], points[i], points[i+1]];
            gl.uniform4fv(fColor, flatten(colors[6]));
            gl.bufferData( gl.ARRAY_BUFFER, flatten(triangleVector), gl.STATIC_DRAW );
            gl.drawArrays(gl.LINE_STRIP,0,triangleVector.length);
        }
    }

    window.requestAnimFrame(render);
}