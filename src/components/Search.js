import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Input } from '@material-ui/core';
import { searchSongs } from "../redux/actions";
import * as selectors from "../redux/selectors";
import SongList from './SongList';
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ""
        }
    }

    search = () => {
        const { searchTerm } = this.state;
        this.props.searchSongs(searchTerm);
    }

    render = () => {
        console.log(this.props)
        return (
            <div className={"masterBox"}>
                <div className={"searchBar"}>
                    <Input type="text" onChange={e => {
                        const { value: searchTerm } = e.target;
                        this.setState({ searchTerm })
                    }} value={this.state.searchTerm}
                        disableUnderline
                        fullWidth
                        placeholder="Search Songs..."
                    ></Input>
                    <Button onClick={this.search}>Search</Button>
                </div>
                <div style={{ width: "80vw", margin: "auto", textAlign: "left" }}>
                    {/* <pre>{JSON.stringify(this.props.songs, null, 2)}</pre> */}
                    <SongList songs={this.props.songs} />
                </div>
            </div>


        )
    }
}

const mapState = state => ({
    songs: selectors.getSongs(state)
});

Search.defaultProps = {
    searchSongs: () => console.log("No function set for searchSongs"),
    songs: []
}
export default connect(mapState, { searchSongs })(Search);
