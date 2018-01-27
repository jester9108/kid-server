import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './navbar.css';

class NavBar extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        logout: PropTypes.func.isRequired,
        showLoginModal: PropTypes.func.isRequired,
        user: PropTypes.object,
    };

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate(prevProps) {
        const prevTabId = (prevProps) ? prevProps.path.substring(1) : null;
        const activeTabId = this.props.path.substring(1);
        const prevTabElem = document.getElementById(prevTabId);
        if (prevTabElem !== null) {
            prevTabElem.classList.remove('active');
        }
        const activeTabElem = document.getElementById(activeTabId);
        if (activeTabElem !== null) {
            activeTabElem.classList.add('active');
        }
    }

    render() {
        const logo = (
            <li style={{ float: 'left' }}>
                <Link to='/' id='home'>
                    {/* <img src={'/logo.svg'} className="" alt="logo" /> */}Kidok
                            </Link>
            </li>
        );
        const navMenu = (this.props.user)
            ? (
                <ul>
                    {logo}
                    <li><Link to='/reception' id='reception' >Reception</Link></li>
                    <li><Link to='/dashboard' id='dashboard' >Dashboard</Link></li>
                    <li><Link to='/schedule' id='schedule' >Schedule</Link></li>
                    <li><Link to='/settings' id='settings' >Settings</Link></li>
                    <li><Link to='/customerservice' id='customerservice' >Customer Service</Link></li>
                    <li id='accountBtn'>
                        <span>
                            {this.props.user.settings.name}&nbsp;
                                <i className='fa fa-caret-down'></i>
                        </span>
                        <div id='dropdown'>
                            <ul>
                                <li><span>Account Settings</span></li>
                                <li><span onClick={this.props.logout}>Log Out</span></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            ) : (
                <ul>
                    {logo}
                    <li><span id='register' onClick={() => { }}>Register</span></li>
                    <li><span id='login' onClick={this.props.showLoginModal}>Log In</span></li>
                </ul>
            );

        return <header className="App-header"><nav>{navMenu}</nav></header>;
    }
}

export default NavBar;
