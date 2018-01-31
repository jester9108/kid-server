import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Divider, Header, Label, Segment, Message } from 'semantic-ui-react';

import ContentPanel from '../panel/ContentPanel.jsx';
import AmenityIcon from '../assets/AmenityIcon.jsx';
import { DataTypes } from '../../config';

class StoreTab extends Component {
    static propTypes = {
        // showDeleteAccountModal: PropTypes.func.isRequired,
        requireSave: PropTypes.func.isRequired,
        save: PropTypes.func.isRequired,
        userData: PropTypes.object.isRequired,
        isSaving: PropTypes.bool.isRequired,
        error: PropTypes.string,
    };

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            storeName: props.userData.store.name || '',
            address: props.userData.store.address || '',
            description: props.userData.store.description || '',
            storePhone: props.userData.store.phone || '',
            website: props.userData.store.website || '',
            tag: props.userData.store.tag || [],
            ageMin: (typeof props.userData.store.age.min === 'undefined') ? 4 : props.userData.store.age.min,
            ageMax: props.userData.store.age.max || 12,
            maxCapacity: props.userData.store.maxCapacity || 100,
            openHours: props.userData.store.openHour || [],
            amenities: props.userData.store.amenities || [],
            images: props.userData.store.images || [],
            amenityTypes: {},
            saveCallback: null,
        }

        // Bind methods
        this.onChange = this.onChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.toggleAmenities = this.toggleAmenities.bind(this);

        // Constants
        this.headerTxt = '기본정보';
        this.storeNameTxt = '이름';
        this.addressTxt = '주소';
        this.descriptionTxt = '140자 소개글';
        this.phoneTxt = '전화번호';
        this.websiteTxt = '웹사이트';
        this.tagTxt = '태그';
        this.ageTxt = '고객 연령';
        this.minTxt = '최소';
        this.maxTxt = '최대';
        this.maxCapTxt = '수용 인원';
        this.openHourTxt = '영업 시간';
        this.addOpenHourTxt = '영업 시간 추가';
        this.headerTxt2 = '서비스';
        this.headerTxt3 = '이미지';
    }

    componentDidMount() {
        fetch('/api/resources/amenities', {
            method: 'GET',
            headers: {
                // 'Authorization': `Bearer ${accessToken}`,
                // 'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    this.setState({ amenityTypes: response.data })
                    console.log('AMENITIES FETCHED')
                    console.log(this.state)
                } else {
                    // dispatch(saveFailure(response.message));
                }
            });
    }

    toggleAmenities(amenityType) {
        clearTimeout(this.state.saveCallback);
        const saveCallback = setTimeout(this.saveChanges, 1500);
        let newAmenities = this.state.amenities.slice(0);
        if (newAmenities.indexOf(amenityType) < 0) {
            newAmenities.push(amenityType);
        } else {
            newAmenities.splice(newAmenities.indexOf(amenityType), 1);
        }
        this.setState({ amenities: newAmenities, saveCallback: saveCallback });
        this.props.requireSave();
    }

    onChange(event) {
        clearTimeout(this.state.saveCallback);
        const saveCallback = setTimeout(this.saveChanges, 1500);
        this.setState({
            [event.target.id]: event.target.value,
            saveCallback: saveCallback,
        });
        this.props.requireSave();
    }

    saveChanges() {
        const newUserData = Object.assign({}, this.props.userData, {
            store: {
                name: this.state.storeName,
                address: this.state.address,
                description: this.state.description,
                phone: this.state.storePhone,
                website: this.state.website,
                tag: this.state.tag,
                age: { min: this.state.ageMin, max: this.state.ageMax },
                maxCapacity: this.state.maxCapacity,
                openHour: this.state.openHours,
                amenities: this.state.amenities,
                images: this.state.images,
            },
        });
        this.props.save(newUserData, DataTypes.STORE);
    }

    render() {
        return (
            <ContentPanel isSaving={this.props.isSaving}>
                <Form success={false} error={this.props.error} onSubmit={this.login}>
                    <Message error header='오류' content={this.props.error} />
                    <Grid>
                        <Grid.Column width={1} />
                        <Grid.Column width={14}>
                            {/* Basic store settings */}
                            <div>
                                <Header as='h3' dividing>{this.headerTxt}</Header>
                                <Divider hidden section />
                                <Grid>
                                    {/* Name, Description, Website, Tag, Age, Capacity */}
                                    <Grid.Column width={8}>
                                        <Form.Field>
                                            <Label basic color='black' pointing='below'>{this.storeNameTxt}</Label>
                                            <input id='storeName' type='text' value={this.state.storeName} onChange={this.onChange} />
                                        </Form.Field>
                                        <Form.Field>
                                            <Label basic color='black' pointing='below'>{this.descriptionTxt}</Label>
                                            <input id='description' type='text' value={this.state.description} onChange={this.onChange} />
                                        </Form.Field>
                                        <Form.Field>
                                            <Label basic color='black' pointing='below'>{this.websiteTxt}</Label>
                                            <input id='website' type='text' value={this.state.website} onChange={this.onChange} />
                                        </Form.Field>
                                        <Form.Field>
                                            <Label basic color='black' pointing='below'>{this.tagTxt}</Label>
                                            <input id='tag' type='text' value={this.state.tag} onChange={this.onChange} />
                                        </Form.Field>
                                        <Label basic color='black' pointing='below'>{this.ageTxt}</Label>
                                        <Grid>
                                            <Grid.Column width={8}>
                                                <Form.Group inline unstackable>
                                                    <Form.Field width={7}>
                                                        <label>{this.minTxt}</label>
                                                    </Form.Field>
                                                    <Form.Field width={9}>
                                                        <input id='ageMin' type='text' value={this.state.ageMin} onChange={this.onChange} />
                                                    </Form.Field>
                                                </Form.Group>
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <Form.Group inline unstackable>
                                                    <Form.Field width={7}>
                                                        <label>{this.maxTxt}</label>
                                                    </Form.Field>
                                                    <Form.Field width={9}>
                                                        <input id='ageMax' type='text' value={this.state.ageMax} onChange={this.onChange} />
                                                    </Form.Field>
                                                </Form.Group>
                                            </Grid.Column>
                                        </Grid>
                                        <Label basic color='black' pointing='below'>{this.maxCapTxt}</Label>
                                        <Form.Group inline unstackable>
                                            <Form.Field width={3}>
                                                <label>{this.maxTxt}</label>
                                            </Form.Field>
                                            <Form.Field width={5}>
                                                <input id='maxCapacity' type='text' value={this.state.maxCapacity} onChange={this.onChange} />
                                            </Form.Field>
                                        </Form.Group>
                                    </Grid.Column>
                                    {/* Address, Phone, Openhours */}
                                    <Grid.Column width={8}>
                                        <Form.Field>
                                            <Label basic color='black' pointing='below'>{this.addressTxt}</Label>
                                            <input id='address' type='text' value={this.state.address} onChange={this.onChange} />
                                        </Form.Field>
                                        <Form.Field>
                                            <Label basic color='black' pointing='below'>{this.phoneTxt}</Label>
                                            <input id='storePhone' type='text' value={this.state.storePhone} onChange={this.onChange} />
                                        </Form.Field>
                                        <Form.Field>
                                            <Label basic color='blue' className='no-border option-btn' style={{ float: 'right' }} onClick={() => { }}>{this.addOpenHourTxt}</Label>
                                            <Label basic color='black' pointing='below'>{this.openHourTxt}</Label>
                                            {/* Open hour item */}
                                            <Segment>
                                                <Grid>
                                                    <Grid.Column width={16}>
                                                        <Form.Group inline unstackable>
                                                            <Form.Field width={3}>
                                                                <label>{this.minTxt}</label>
                                                            </Form.Field>
                                                            <Form.Field width={5}>
                                                                <input id='ageMin' type='text' /* value={this.state.ageMin} */ onChange={this.onChange} />
                                                            </Form.Field>
                                                            <Form.Field width={3}>
                                                                <label>{this.maxTxt}</label>
                                                            </Form.Field>
                                                            <Form.Field width={5}>
                                                                <input id='ageMax' type='text' /* value={this.state.ageMax} */ onChange={this.onChange} />
                                                            </Form.Field>
                                                        </Form.Group>
                                                    </Grid.Column>
                                                </Grid>
                                            </Segment>
                                            {/* ... */}
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid>
                            </div>
                            <Divider hidden section />
                            {/* Amenities */}
                            <div>
                                <Header as='h3' dividing>{this.headerTxt2}</Header>
                                <Grid>
                                    {
                                        Object.values(this.state.amenityTypes)
                                            .map((amenityType) => (
                                                <Grid.Column key={amenityType} width={2}>
                                                    <AmenityIcon type={amenityType} selected={this.state.amenities} onToggle={this.toggleAmenities} />
                                                </Grid.Column>
                                            ))
                                    }
                                </Grid>
                                <Divider hidden section />
                            </div>
                            <Divider hidden section />
                            {/* Amenities */}
                            <div>
                                <Header as='h3' dividing>{this.headerTxt3}</Header>
                                <Divider hidden section />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={1} />
                    </Grid>
                </Form>
            </ContentPanel>
        );
    }
}

export default StoreTab;
