import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// import { PageTypes } from '../../config';
import './navbar.css';

class NavBar extends Component {
    static propTypes = {
        // navigate: PropTypes.func.isRequired,
        path: PropTypes.string.isRequired,
        logout: PropTypes.func.isRequired,
        userData: PropTypes.object,
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
        const navMenu = (this.props.userData)
            ? (
                <ul>
                    {logo}
                    <li><Link to='/reception' id='reception'>접수</Link></li>
                    <li><Link to='/dashboard' id='dashboard'>대시보드</Link></li>
                    <li><Link to='/schedule' id='schedule'>스케쥴</Link></li>
                    <li><Link to='/settings' id='settings'>설정</Link></li>
                    <li><Link to='/customerservice' id='customerservice'>고객지원</Link></li>
                    <li id='accountBtn'>
                        <span>
                            {this.props.userData.store.name}&nbsp;
                                <i className='fa fa-caret-down'></i>
                        </span>
                        <div id='dropdown'>
                            <ul>
                                <li><Link to='/account' id='account'>계정설정</Link></li>
                                <li><span onClick={this.props.logout}>로그아웃</span></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            ) : (
                <ul>
                    {logo}
                    {
                        (this.props.path === '/login')
                            ? (<li><Link to='/register' id='register'>회원가입</Link></li>)
                            : (<li><Link to='/login' id='login'>로그인</Link></li>)
                    }
                </ul>
            );

        return <header className="App-header"><nav>{navMenu}</nav></header>;
    }
}

export default NavBar;
