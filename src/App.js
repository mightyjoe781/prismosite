import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/NavbarCustom.js'
import React, {useState} from 'react'

async function fetchServerInfo() {
   return fetch('https://servers.minetest.net/list')
   .then((response) => response.json())
   .then((responseJson) => {
     return responseJson.list
   })
   .catch((error) => {
     console.error(error);
   });
}

function ServerInfo (props) {
    const serverName = props.value;
    const [server, setServer] = useState(()=> {
        fetchServerInfo().then(
            result => {
                result.forEach(srv => {
                    if(srv.name === serverName) {
                        setServer(srv)
                        console.log(srv)
                    }
                })
            }
        )
    });

    React.useEffect(
        ()=>{
        console.log("Use Effect is called")
        let timer1 = setInterval(()=>
        fetchServerInfo().then(
                result => {
                    result.forEach(srv => {
                        if(srv.name === serverName) {
                            setServer(srv)
                        }
                    })
                }
        ), 5000)
        return ()=> {
            // cleanup call
            console.log("Cleanup!")
            clearInterval(timer1)
        }
    },[serverName]);

    if(!server) {
        const playerCount = 'Resolving Request...'
        return <PlayerCount {...props} playerCount={playerCount} />
    }

    const playerCount = server.clients
    return (
        <div className='container'>
            <div>
                Total Players on {props.value} : {playerCount}
            </div>
            <div>
                All time player count : {server.total_clients}
            </div>
            <div>
                Current Lag : <span style={server.ping > 0.1? {color:"red"}: {color:"green"}} children={server.ping} />
            </div>
            <ul>
                {server.clients_list.map((playerName,i) => <li key={i} >{playerName}</li>) }
            </ul>
        </div>
    );
}

function PlayerCount (props) {
    return (
        <div className='container'>
            <div>
             Total Players on {props.value} : {props.playerCount}
            </div>
        </div>
    );
}


function App() {
  return (
    <div>
      <Navbar />
      <ServerInfo value="Prismo" />
      <ServerInfo value="Adventure Time" />
    </div>
  );
}

export default App;
