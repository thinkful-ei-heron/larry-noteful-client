import React from 'react'
import { Redirect } from 'react-router-dom'
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types';

import ValidationError from '../ValidationError/ValidationError';

import './AddFolder.css'

export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: {
        value: '',
        touched: false
      },
      redirectToReferrer: false
    }
  }
  static contextType = ApiContext

  updateFolderName (name) {
    this.setState({folderName: {value: name, touched: true}});
  }

  validateFolderName() {
    const name = this.state.folderName.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
  }

  render() {
    if (this.state.redirectToReferrer) {
      return (<Redirect to='/' />)
    }
    else return (
      <form className="new-folder" 
            onSubmit={event => {
              this.setState({ redirectToReferrer: true });
              this.context.addFolder(event, this.state.folderName.value)
              }
            }>
        <h2>Add Folder</h2>
        <div className="form-group">
          <label htmlFor="name">Folder Name: </label>
          <input type="text" 
                 className="newFolder__control"
                 name="name" 
                 id="new-folder-name"
                 placeholder="Folder Name"
                 onChange={event => this.updateFolderName(event.target.value)} />
          {this.state.folderName.touched  && (
            <ValidationError message={this.validateFolderName()}/>
          )}
        </div>
        <div className="registration__button__group">
          <button type="button" 
                  className="new-folder-button" 
                  onClick={this.props.history.goBack}>
            Cancel
          </button>
          <button type="submit" 
                  className="new-folder-button"
                  disabled={this.validateFolderName()}>
            Save
          </button>
        </div>
      </form>
    )
  }
}

AddFolder.propTypes = {
  history: PropTypes.object.isRequired
};
