import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import ApiContext from '../ApiContext';

import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import config from '../config';
import './App.css';

class App extends Component {
  state = {
    notes: [],
    folders: []
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok)
          return notesRes.json().then(e => Promise.reject(e));
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e));

        return Promise.all([notesRes.json(), foldersRes.json()]);
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders });
      })
      .catch(error => {
        console.error({ error });
      });
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };

  handleAddFolder = (event, name) => {
    event.preventDefault();
    let bodyJson = JSON.stringify({ "name": name })
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyJson
    }).then(response => response.ok ? response.json() : Promise.reject(response))
      .then(responseJson => {
        let folders = [...this.state.folders, { name: responseJson.name, id: responseJson.id }]
        this.setState({ folders })
        console.log(this.state.folders);
      })
      .catch(e => console.error(e))
  };

  handleAddNote = (event, name, content, folderId) => {
    event.preventDefault();
    //name, modified, folderId, content
    let modified = new Date(Date.now())
    modified = modified.toISOString()
    let bodyJson = JSON.stringify({ name, content, folderId, modified })
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyJson
    }).then(response => response.ok ? response.json() : Promise.reject(response))
      .then(responseJson => {
        let notesCopy = [...this.state.notes, { id: responseJson.id, folderId: responseJson.folderId, name: responseJson.name, modified: responseJson.modified, content: responseJson.content }]
        this.setState({ notes: notesCopy })
      })
      .catch(e => console.error(e))
  }

  renderNavRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListNav}
          />
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
          />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.handleDeleteNote,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote
    };
    return (
      <ApiContext.Provider value={value}>
        <div className="App">
          <nav className="App__nav">
            <ErrorBoundary>{this.renderNavRoutes()}</ErrorBoundary>
          </nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{' '}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <main className="App__main">
            <ErrorBoundary>{this.renderMainRoutes()}</ErrorBoundary>
          </main>
        </div>
      </ApiContext.Provider>
    );
  }
}

export default App;
