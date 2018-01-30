import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Divider, Label, Loader } from 'semantic-ui-react';

import './contentpanel.css';

class ContentPanel extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.element),
            PropTypes.element
        ]).isRequired,
        isSaving: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.savingTxt = '저장중';
    }

    render() {
        return (
            <Segment className='content-panel'>
                <Divider section clearing hidden />
                {this.props.children}
                <div className='save-state' hidden={!this.props.isSaving}>
                    <Loader inverted className='loading-icon' active inline size='small' />
                    {this.savingTxt}
                </div>
                <Divider section clearing hidden />
            </Segment>
        );
    }
}

export default ContentPanel;
