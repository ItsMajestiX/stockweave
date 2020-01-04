import React, { ReactNode, CSSProperties } from 'react';

interface CCLicenseButtonProps {
    public: boolean,
    adaptations: 'y' | 'n' | 'sa' | '',
    commercial: boolean
}

interface CCLicenseButtonState {
    public: boolean
    adaptations: '' | 'nd' | 'sa'
    commercial: 'nc' | ''
}

let borderStyle:CSSProperties = {
    borderWidth: 0
}

class CCLicenseButton extends React.Component<CCLicenseButtonProps, CCLicenseButtonState> {
    constructor(props: any) {
        super(props);
        this.getLicenseName = this.getLicenseName.bind(this);
        this.getLicenseElement = this.getLicenseElement.bind(this);
        this.state = {
            public: this.props.public,
            commercial: !this.props.commercial ? 'nc': '',
            adaptations: this.props.adaptations === 'y' ? '' : this.props.adaptations === 'n' ? 'nd' : 'sa'
        }
    }

    getLicenseName() {
        return ('by-' + this.props.commercial + '-' + this.props.adaptations).replace('--', '-').replace(/-$/, '');
    }

    getLicenseElement(): ReactNode {
        if (this.props.public) {
            return (
                <img src="https://i.creativecommons.org/p/zero/1.0/88x31.png" alt="CC0" />
            )
        }
        else {
            return (
                <a rel="license" href={"http://creativecommons.org/licenses/" + this.getLicenseName() + "/4.0/"}><img alt="Creative Commons License" style={borderStyle} src={"https://i.creativecommons.org/l/" + this.getLicenseName() + "/4.0/88x31.png"} /></a>
            )
        }
    }

    render() {
        return this.getLicenseElement();
    }
}

export default CCLicenseButton;