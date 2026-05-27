let socket = null;

let conectado = false;

// =====================================================
// CONECTAR
// =====================================================

function conectarESP32(){

// evitar duplicados

if(
socket &&
(
socket.readyState === WebSocket.OPEN ||
socket.readyState === WebSocket.CONNECTING
)
){
return;
}

try{

socket = new WebSocket(
"ws://192.168.4.1:81/"
);

// =================================================
// OPEN
// =================================================

socket.onopen = () => {

console.log("ESP32 conectado");

conectado = true;

if(typeof actualizarEstado === "function"){

actualizarEstado(true);
}
};

// =================================================
// MENSAJES
// =================================================

socket.onmessage = (event) => {

console.log("RX:",event.data);

if(typeof manejarEvento === "function"){

manejarEvento(event.data);
}
};

// =================================================
// CLOSE
// =================================================

socket.onclose = () => {

console.log("ESP32 desconectado");

conectado = false;

if(typeof actualizarEstado === "function"){

actualizarEstado(false);
}

// reconexion automática

setTimeout(()=>{

conectarESP32();

},2000);
};

// =================================================
// ERROR
// =================================================

socket.onerror = () => {

console.log("Error websocket");

conectado = false;

if(typeof actualizarEstado === "function"){

actualizarEstado(false);
}

try{
socket.close();
}
catch(e){}
};

}
catch(e){

console.log(e);

setTimeout(()=>{

conectarESP32();

},2000);
}
}

// =====================================================
// ENVIAR
// =====================================================

function enviarESP32(msg){

if(
socket &&
socket.readyState === WebSocket.OPEN
){

socket.send(msg);

console.log("TX:",msg);
}
}