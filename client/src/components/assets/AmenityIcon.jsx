import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AmenityIcon extends Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        selected: PropTypes.arrayOf(PropTypes.string).isRequired,
        onToggle: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        const amenities = {
            PARKING: { name: '주차', icon: 'svc-parking.svg' },
            PLAYGROUND: { name: '놀이기구', icon: 'svc-playground.svg' },
            CAFE: { name: '카페', icon: 'svc-cafe.svg' },
            DAYCARE: { name: '애봐줌', icon: 'svc-playground.svg' },
        };

        // Bind methods
        this.toggleAmenity = this.toggleAmenity.bind(this);

        // Initial state
        const amenity = amenities[props.type];
        this.state = {
            amenity: amenity,
            active: props.selected.includes(amenity),
        };
    }

    toggleAmenity() {
        this.setState({ active: !this.state.active });
        this.props.onToggle(this.props.type);
    }

    render() {
        if (this.state.amenity) {
            return (
                <div id={this.props.type.toLowerCase()} className={this.state.active ? 'svc-btn active' : 'svc-btn'} onClick={this.toggleAmenity}>
                    <img className='svc-icon' src={this.state.amenity.icon} alt={this.state.amenity.name} />
                    <br />
                    {this.state.amenity.name}
                </div>
            );
        }
        else {
            return null;
        }
    }
}

export default AmenityIcon;
