import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './navigation.css';

class Navigation extends Component {
    static propTypes = {
        // match: PropTypes.object.isRequired,
        showLoginModal: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = { storeName: 'Playground' };
    }

    activate() {
        // const activeOption = this.props.match.path.substring(1);
        // const elem = document.getElementById(activeOption);
        // if (elem !== null) {
        //     elem.classList.add('active');
        // }
        // this.setState({ scope: activeOption })
    }

    render() {
        console.log(this.props);
        return (
            <header className="App-header">
                <nav>
                    <ul>
                        <li style={{ float: 'left' }}>
                            <Link to='/' id='home'>
                                {/* <img src={'/logo.svg'} className="" alt="logo" /> */}Kidok
                            </Link>
                        </li>
                        <li><Link to='/reception' id='reception' onClick={this.activate}>Reception</Link></li>
                        <li><Link to='/dashboard' id='dashboard' onClick={this.activate}>Dashboard</Link></li>
                        <li><Link to='/schedule' id='schedule' onClick={this.activate}>Schedule</Link></li>
                        <li><Link to='/settings' id='settings' onClick={this.activate}>Settings</Link></li>
                        <li><Link to='/customerservice' id='customerservice' onClick={this.activate}>Customer Service</Link></li>
                        <li><span id='registerBtn' onClick={() => {}}>Register</span></li>
                        <li><span id='loginBtn' onClick={this.props.showLoginModal}>Log In</span></li>
                        <li id='accountBtn'>
                            <span>
                                {this.state.storeName}&nbsp;
                                <i className='fa fa-caret-down'></i>
                            </span>
                            <div id='dropdown'>
                                <ul>
                                    <li><span>Account Settings</span></li>
                                    <li><span>Log Out</span></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>
        )
    }

    componentDidMount() {
        this.activate();
    }
}

export default Navigation;
