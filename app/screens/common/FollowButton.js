import React from "react";
import {TouchableOpacity, Text} from "react-native";
import { unfollowAuthor, unfollowLocation, unfollowCategory, isFollowingCategory, isFollowingAuthor, isFollowingLocation, followAuthor, followLocation, followCategory } from "../FollowInfoStorage";

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            following: false
        }
    }
    async componentDidMount() {
        this.updateFollow();
    }
    async updateFollow() {
        this.setState({
            following: await this.isFollowing(this.props.id)
        });
    }

    async isFollowing(id) {
        switch (this.props.type) {
            case "category":
                return await isFollowingCategory(id);
            case "author":
                return await isFollowingAuthor(id);
            case "location":
                return await isFollowingLocation(id);
        }
    }

    async follow(id) {
        switch (this.props.type) {
            case "category":
                return await followCategory(id);
            case "author":
                return await followAuthor(id);
            case "location":
                return await followLocation(id);
        }
    }

    async unfollow(id) {
        switch (this.props.type) {
            case "category":
                return await unfollowCategory(id);
            case "author":
                return await unfollowAuthor(id);
            case "location":
                return await unfollowLocation(id);
        }
    }

    async toggleFollow() {
        if (this.state.following) {
            await this.unfollow(this.props.id);
        }
        else {
            await this.follow(this.props.id);
        }
        this.updateFollow();
    }

    render() {
        return <TouchableOpacity
            style={this.props.containerStyle || {
                marginLeft: 4,
                marginTop: "auto",
                marginRight: 10,
                borderRadius: 5,
                // flex: 1,
                padding: 7,
                width: 100,
                backgroundColor: "maroon",
                alignSelf: "center",
                justifyContent: "center"
            }}
            onPress={() => this.toggleFollow()}
        >
            <Text style={{
                fontSize: 15,
                fontFamily: 'Hoefler Text',
                fontWeight: 'bold',
                color: 'white',
                alignSelf: 'center',
            }}>
                <Text>
                    {this.state.following ? "Following" : "Follow"}
                </Text>
            </Text>
        </TouchableOpacity>;
    }
}