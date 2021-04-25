import React, {Component} from 'react';
import Header from "../../common/header/Header";

import './Home.css'

//Router import for redirection.
import {Redirect} from 'react-router-dom';

import {
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    Divider,
    FormControl,
    Grid,
    TextField, Typography
} from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import {red} from '@material-ui/core/colors';

class Home extends Component {

    constructor() {
        super();
        this.baseUrl = 'https://api.instagram.com/v1/';
        this.state = {
            profile_picture: '',
            recent_media: null,
            filtered_media: null,
            likes: [],
            comments: [],
            searchText: ''
        }
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.fetchOwnerInfo();
            this.fetchMostRecentMedia();
        }
    }

    render() {
        if (this.props.location.state === undefined) {
            return <Redirect to='/'/>
        }
        if (this.props.location.state.loginSuccess === true) {
            return <div>
                <div><Header {...this.props} isLoggedIn={true} showSearchBox={true}
                             profilePictureUrl={this.state.profile_picture}
                             onSearch={this.onSearch} showMyAccount={true}/></div>
                <Container className='posts-card-container'>
                    <Grid container spacing={2} alignContent='center' justify='flex-start' direction='row'>
                        {
                            (this.state.filtered_media || []).map((details, index) => (
                                <Grid item xs={6} key={details.id}>
                                    <Card key={details.id + '_card'}>
                                        <CardHeader
                                            avatar={<Avatar variant="circle" src={details.user.profile_picture}
                                                            className='avatar'/>}
                                            title={details.user.username}
                                            subheader={new Date(details.created_time * 1000).toLocaleString()}/>
                                        <CardMedia style={{height: 0, paddingTop: '56.25%', marginBottom: 5}}
                                                   image={details.images.standard_resolution.url}/>
                                        <Divider variant="middle" className='divider'/>
                                        <CardContent>
                                            <div
                                                className='post-caption'>{details.caption.text.split("\n")[0]}</div>

                                            <div className='post-tags'>
                                                {details.tags.map((tag, index) => (
                                                    <span key={index}>{'#' + tag + ' '}</span>)
                                                )}
                                            </div>
                                            <br/>
                                            <div className='likes'>
                                                {
                                                    this.state.likes[index] ?
                                                        <FavoriteIcon fontSize='default' style={{color: red[500]}}
                                                                      onClick={() => this.onFavIconClick(index)}/>
                                                        :
                                                        <FavoriteBorderIcon fontSize='default'
                                                                            onClick={() => this.onFavIconClick(index)}/>
                                                }

                                                <pre> </pre>
                                                <Typography>
                                                    <span>{this.state.likes[index] ? details.likes.count + 1 + ' likes' : details.likes.count + ' likes'}</span>
                                                </Typography>
                                            </div>

                                            <div id='all-comments'>
                                                {
                                                    this.state.comments[index] ?
                                                        (this.state.comments)[index].map((comment, index) => (
                                                            <p key={index}>
                                                                <b>{details.user.username}</b> : {comment}
                                                            </p>
                                                        ))
                                                        :
                                                        <p></p>
                                                }
                                            </div>

                                            <div className='post-comment'>
                                                <FormControl className='post-comment-form-control'>
                                                    <TextField id={'textfield-' + index} label="Add a comment"/>
                                                </FormControl>
                                                <div className='add-button'>
                                                    <FormControl>
                                                        <Button variant='contained' color='primary'
                                                                onClick={() => this.onAddComment(index)}>ADD</Button>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Container>
            </div>
        }
    }

    fetchOwnerInfo = () => {
        let data = null;

        let xhr = new XMLHttpRequest();

        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({profile_picture: JSON.parse(this.responseText).data.profile_picture});
            }
        });

        let url = this.baseUrl + "users/self/?access_token=" + sessionStorage.getItem("access-token");

        xhr.open("GET", url);

        xhr.send(data);
    }

    fetchMostRecentMedia = () => {
        let data = null;

        let xhr = new XMLHttpRequest();

        let that = this;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    recent_media: JSON.parse(this.responseText).data,
                    filtered_media: JSON.parse(this.responseText).data
                });
            }
        });

        let url = this.baseUrl + "users/self/media/recent/?access_token=" + sessionStorage.getItem("access-token");

        xhr.open("GET", url);

        xhr.send(data);
    }

    onFavIconClick = (index) => {
        let currentLikes = this.state.likes;
        currentLikes[index] = !currentLikes[index];
        this.setState({'likes': currentLikes})
    }

    onAddComment = (index) => {
        var textfield = document.getElementById("textfield-" + index);
        if (textfield.value == null || textfield.value.trim() === "") {
            return;
        }
        let currentComment = this.state.comments;
        if (currentComment[index] === undefined) {
            currentComment[index] = [textfield.value];
        } else {
            currentComment[index] = currentComment[index].concat([textfield.value]);
        }

        textfield.value = '';

        this.setState({'comments': currentComment})
    }

    onSearch = (e) => {
        this.setState({'searchText': e.target.value})
        if (this.state.searchText == null || this.state.searchText.trim() === "") {
            this.setState({filtered_media: this.state.recent_media});
        } else {
            let filteredRecentMedia = this.state.recent_media.filter((element) => {
                return element.caption.text.toUpperCase().split("\n")[0].indexOf(e.target.value.toUpperCase()) > -1
            });
            this.setState({filtered_media: filteredRecentMedia});
        }
    }

}

export default Home;