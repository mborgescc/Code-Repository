//  Variáveis WebGL
var canvas;
var gl;
var fcolor;
var points = [];
var colors = [];

//  Vértices do quadrado
var vertices = [vec2( 0.2, 0.2 ),
                vec2( 0.2,-0.2 ),
                vec2(-0.2, 0.2 ),
                vec2(-0.2,-0.2 )];

//constant colors;
const green = vec4(0.0, 1.0, 0.0, 1.0);
const yellow = vec4(1.0, 1.0, 0.0, 1.0);
const blue = vec4(0.0,0.0,1.0,1.0);
const white = vec4(1.0,1.0,1.0,1.0);
const black = vec4(0.0,0.0,0.0,1.0);

//  Variáveis do programa
var SPEED = 0.01;
var CLOCKWISE = true;
var rotationCenter = vertices[0];

var angle = 0;
var vPosition, rotationMatrix, translationMatrix1, translationMatrix2;
var radian, cos, sin, matrix1, matrix2, matrix3;

var PI = Math.PI;

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

    document.onkeydown = function(event){
        var char = String.fromCharCode(event.keyCode || event.which);
        console.log(points[0][0]);

        var actualPoints = [points[0], points[1], points[2], points[3]];

        points = [];

        points.push(vec2((cos*(-rotationCenter[0]+actualPoints[0][0])-sin*(-rotationCenter[1]+actualPoints[0][1]))+rotationCenter[0],
                         (sin*(-rotationCenter[0]+actualPoints[0][0])+cos*(-rotationCenter[1]+actualPoints[0][1]))+rotationCenter[1]));
        points.push(vec2((cos*(-rotationCenter[0]+actualPoints[1][0])-sin*(-rotationCenter[1]+actualPoints[1][1]))+rotationCenter[0],
                         (sin*(-rotationCenter[0]+actualPoints[1][0])+cos*(-rotationCenter[1]+actualPoints[1][1]))+rotationCenter[1]));
        points.push(vec2((cos*(-rotationCenter[0]+actualPoints[2][0])-sin*(-rotationCenter[1]+actualPoints[2][1]))+rotationCenter[0],
                         (sin*(-rotationCenter[0]+actualPoints[2][0])+cos*(-rotationCenter[1]+actualPoints[2][1]))+rotationCenter[1]));
        points.push(vec2((cos*(-rotationCenter[0]+actualPoints[3][0])-sin*(-rotationCenter[1]+actualPoints[3][1]))+rotationCenter[0],
                         (sin*(-rotationCenter[0]+actualPoints[3][0])+cos*(-rotationCenter[1]+actualPoints[3][1]))+rotationCenter[1]));

        switch(char){
            case '1':
                rotationCenter = points[0];
                angle = 0;
                break;
            case '2':
                rotationCenter = points[1];
                angle = 0;
                break;
            case '3':
                rotationCenter = points[3];
                angle = 0;
                break;
            case '4':
                rotationCenter = points[2];
                angle = 0;
                break;
            default:
                angle = 0;
                break;
        }
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

        console.log(points[0]);
        console.log(points[1]);
        console.log(points[2]);
        console.log(points[3]);
    }

    //  Configurando o WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Carregando shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();  

    var vBuffer = gl.createBuffer(); 

    //Cor dos vértices
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer ); 
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    colors.push(green, yellow, blue, white);

    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    //Posição dos vértices
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    points.push(vertices[0]);
    points.push(vertices[1]);
    points.push(vertices[2]);
    points.push(vertices[3]);

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    //Matriz de rotação
    rotationMatrix = gl.getUniformLocation(program, "rotationMatrix");

    //Matrizes de translação
    translationMatrix1 = gl.getUniformLocation(program, "translationMatrix1");
    translationMatrix2 = gl.getUniformLocation(program, "translationMatrix2");

    console.log(points);
    console.log(colors);
    console.log(rotationCenter[0]);
    console.log(rotationCenter[1]);

    render();
};

function render()
{
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
    radian = PI * angle;
    cos = Math.cos(radian), sin = Math.sin(radian);

    matrix1 = new Float32Array([    cos,-sin,0.0,0.0,
                                    sin, cos,0.0,0.0,
                                    0.0, 0.0,1.0,0.0,
                                    0.0, 0.0,0.0,1.0]);

    gl.uniformMatrix4fv(rotationMatrix, false, matrix1);
    gl.uniform4f(translationMatrix1, -rotationCenter[0],-rotationCenter[1],0.0,0.0);
    gl.uniform4f(translationMatrix2, rotationCenter[0],rotationCenter[1],0.0,0.0);

    //Limpando buffer
    gl.clear( gl.COLOR_BUFFER_BIT);

    //Preenchimento
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, points.length );

    window.requestAnimFrame(render);
}