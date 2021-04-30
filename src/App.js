import axios from 'axios';
import './App.css';
import { useState } from 'react';

const RepoCard = (props) => {
  const [selected, setSelected] = useState(false);
  const [newRepo, setNewRepo] = useState(true);
  
  console.log(props.data.version)
  return (
    <div className="largeContainer">
      <div className={newRepo ? "newCardContainer" : selected ? "selectedCardContainer" : "cardContainer"} onClick={() => (
        setNewRepo(false),
        setSelected(!selected)
      )} >
        <p>{props.data.name}</p>
        <p>{props.data.version}</p>
        <p>{props.data.date}</p>
      </div>
      {selected ?
        <div className="bodyContainer">
          <p>{props.data.body}</p>
        </div>
        : <div />
      }
    </div>
  )
}

function App() {

  const [org, setOrg] = useState('');
  const [repo, setRepo] = useState('');
  const [repoArray, setReppoArray] = useState([]);

  const handleAddRepo = () => {
    axios.get('https://api.github.com/repos/' + org + '/' + repo)
    .then(res => {
      getLatest(res);
    })
    .catch(res => alert(res))
  }

  const getLatest = (res) => {
    axios.get('https://api.github.com/repos/' + org + '/' + repo + '/releases/latest')
      .then(resol => {
        let data = {...res.data, version: resol.data.name, body: resol.data.body, date: resol.data.published_at};
        console.log(data);
        setReppoArray(repoArray.concat(data));
      })
      .catch(setReppoArray(repoArray.concat(res.data)))
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          GitHub Repo Tracker
        </p>
      </header>
      <div className="Form">
        <form>
          <input className="Input" type="text" placeholder="Organization" onChange={e => setOrg(e.target.value)}/>
          <input className="Input" type="text" placeholder="Repo" onChange={e => setRepo(e.target.value)}/>
          <button className="Button" type="button" onClick={handleAddRepo}>Add</button>
        </form>
        {repoArray.map(x => <RepoCard data={x} key={x.id} />)}
      </div>
    </div>
  );
}

export default App;
