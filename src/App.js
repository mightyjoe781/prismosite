import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/NavbarCustom.js'
import React, {useState, useEffect} from 'react'
import {Row,Col, Container, Spinner} from 'reactstrap'

async function fetchServerInfo() {
    try {
        var res = await fetch('https://servers.minetest.net/list')
        return await res.json()
    } catch(err) {
        console.log(err)
    }
}

function countdown(s) {
  const d = Math.floor(s / (3600 * 24));
  s  -= d * 3600 * 24;
  const h = Math.floor(s / 3600);
  s  -= h * 3600;
  const m = Math.floor(s / 60);
  s  -= m * 60;
  const tmp = [];
  (d) && tmp.push(d + 'd');
  (d || h) && tmp.push(h + 'h');
  (d || h || m) && tmp.push(m + 'm');
  tmp.push(s + 's');
  return tmp.join(' ');
}

function ServerInfo (props) {
    const serverName = props.value;
    const [server, setServer] = useState("")

    useEffect(()=>{
        console.log("Use Effect Called")
        let timer = setInterval(()=>
        fetchServerInfo().then(
            results => {
                results.list.forEach(srv => {
                    if(srv.name === serverName) {
                        setServer(srv)
                    }
                })
            }), 5000)
        return ()=> {
            // cleanup call
            console.log("Cleanup!")
            clearInterval(timer)
        }
    }, [serverName]);

    const playerCount = (server) ? server.clients : (<Spinner size="sm" />)
    if(!server) {
        return (
            <PlayerCount {...props} playerCount={playerCount} />
        )
    }
    const restartTime = new Date(new Date() - server.uptime*1000).toLocaleString()
    const elapsedTime = countdown(server.uptime)
    return (
        <div className='container'>
            <div>
                Total Players on {props.value} : {playerCount}
            </div>
            <div>
                All time player count : {server.total_clients}
            </div>
            <div>
                Current Lag : <span style={server.ping > 0.1? {color:"red"}: {color:"green"}} children={server.ping.toFixed(5)} /> ms
            </div>
            <div>
                Last server restart time : {restartTime} ({elapsedTime} ago)
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
      <Navbar color="dark" dark="true" expand="md" container="fluid" />
      <Container className='bg-light border'>
        <Row xs="1" sm="2" md="2" lg="2">
            <Col className='border'>
              <ServerInfo value="Prismo" />
            </Col>
            <Col className='border'>
              <ServerInfo value="Adventure Time" />
            </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
