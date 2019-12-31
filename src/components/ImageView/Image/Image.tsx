import React from 'react';
import CCLicenseButton from './CCLicenseButton/CCLicenseButton';

const Image: React.FC = () => {
  return (
    <div className="card border-primary mb-3 p-1">
        <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" className="card-img-top" alt="image" />
        <div className="card-body">
            <h5 className="card-title">foo</h5>
            <p className="card-text">bar</p>
            <CCLicenseButton public={false} adaptations='' commercial='' />
        </div>
    </div>
  );
}

export default Image;