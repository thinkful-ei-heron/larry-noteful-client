import React from 'react'
import { Redirect } from 'react-router-dom'
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types';

import ValidationError from '../ValidationError/ValidationError';

import './AddNote.css'

export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteName: {
        value: '',
        touched: false
      },
      content: {
        value: '',
        touched: false
      },
      folder: {
        value: '',
        touched: false
      },
      redirectToReferrer: false      
    }
  }  

  static contextType = ApiContext;

  componentDidMount() {
    const folderId = this.context.folders[0].id;
    this.setState({folder: {value: folderId}});
  }

  updateNoteName (name) {
    this.setState({noteName: {value: name, touched: true}});
  }

  updateFolder (folderId) {
    this.setState({folder: {value: folderId, touched: true}});
  }

  updateContent (content) {
    this.setState({content: {value: content, touched: true}});
  }

  validateNoteName() {
    const name = this.state.noteName.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
  }

  validateFolderName() {
    const name = this.state.folder.value.trim();
    if (name.length === 0) {
      return 'Folder is required';
    }
  }

  validateContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return 'Note Content is Required';
    }
  }  

  render() {
    if (this.state.redirectToReferrer) {
      return (<Redirect to='/' />)
    }
    else return (
      <form className="new-note"
            onSubmit={event => {
              this.setState({ redirectToReferrer: true });
              this.context.addNote(
                      event, 
                      this.state.noteName.value,
                      this.state.content.value,
                      this.state.folder.value)}
            }>
        <h2>AddNote</h2>
        <div className="form-group">
          <label htmlFor="name">Note Name: </label>
          <input type="text" 
                 className="newFolder__control"
                 name="name" 
                 id="new-note-name"
                 placeholder="Note Name"
                 onChange={event => this.updateNoteName(event.target.value)} />
          {this.state.noteName.touched  && (
            <ValidationError message={this.validateNoteName()}/>
          )}
          <label htmlFor="folder">Folder: </label>
          <select id="new-note-folder"
                  name="folder"
                  onChange={event => this.updateFolder(event.target.value)} >
            {this.context.folders.map(folder => {
              return <option key={folder.id} value={folder.id}>{folder.name}</option>
            })}
          </select>
          {this.state.folder.touched  && (
            <ValidationError message={this.validateFolderName()}/>
          )}
          <label htmlFor="content">Note Content: </label>
          <textarea id="new-note-content" 
                    name="content" 
                    rows="5" 
                    cols="30"
                    onChange={event => this.updateContent(event.target.value)} >

          </textarea>
          {this.state.content.touched  && (
            <ValidationError message={this.validateContent()}/>
          )}                    
        </div>
        <div className="registration__button__group">
          <button type="button" 
                  className="new-note-button" 
                  onClick={this.props.history.goBack}>
            Cancel
          </button>
          <button type="submit" 
                  className="new-note-button"
                  disabled={this.validateNoteName()
                           || this.validateFolderName()
                           || this.validateContent()}>
            Save
          </button> 
        </div>
      </form>
    )
  }
}

AddNote.propTypes = {
  history: PropTypes.object.isRequired
};
