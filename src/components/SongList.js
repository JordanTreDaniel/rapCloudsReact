import React, { Component } from "react";
import { connect } from "react-redux";
import { setSongs } from "../redux/actions";
import * as selectors from "../redux/selectors";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        maxWidth: "",
        minWidth: "20em",
        margin: "2em"
    },
    media: {
        height: 140,
    },
    songList: {
        display: "flex",
        justifyContent: "space-evenly",
        flexWrap: "wrap"
    }
}

class SongList extends Component {

    componentDidMount = () => {
        const { songs } = this.props;
        if (!songs.length) {
            const recoveredSongs = localStorage.getItem("songs");
            if (songs) {
                console.log("found songs", songs)
                this.props.setSongs(JSON.parse(recoveredSongs));
            }
        }
    }
    //TO-DO: Make SongCard component before MVP branch closes.
    renderCard = (song) => {
        const { classes } = this.props;
        return (
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={song.header_image_thumbnail_url}
                        title={song.full_title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {song.full_title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" href={`https://genius.com${song.path}`}>
                        Genius
        </Button>
                    <Button size="small" color="primary">
                        Rap Cloud
        </Button>
                </CardActions>
            </Card>
        );
    }
    render = () => {
        const { classes } = this.props;
        console.log(this.props)
        return (
            <div className={classes.songList}>
                {this.props.songs.map(song => this.renderCard(song))}
            </div>
        )
    }
}

const mapState = state => ({
    songs: selectors.getSongs(state)
});

SongList.defaultProps = {
    songs: []
}
const StyledSongList = withStyles(styles)(SongList)
export default connect(mapState, { setSongs })(StyledSongList);
