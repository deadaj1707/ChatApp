//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//font-awesome
import "font-awesome/css/font-awesome.css";
//socket.io-client
import Mains from "./Components/Mains";
import { io } from "socket.io-client";

const socket =io("http://localhost:4000");


function App() {
  
  //username
  return (
    <Mains socket={socket}/>
  );
}

export default App;
