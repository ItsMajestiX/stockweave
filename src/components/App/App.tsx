import React from 'react';
import Nav from '../Nav/Nav';
import { Router } from '@reach/router';
import UploadView from '../UploadView/UploadView';
import ImageView from '../ImageView/ImageView';

class App extends React.Component<any, any> {
  render() {
    return (
    <div>
      <Router>
        <Nav path='/' active="home" />
        <Nav path='upload' active="upload" />
      </Router>
      <Router>
        <ImageView path='/' />
        <UploadView path='upload'/>
      </Router>
    </div>
    );
  }
}

export default App;
