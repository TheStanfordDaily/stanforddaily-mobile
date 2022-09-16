import React, { Component } from 'react';
import { View, Image, ImageBackground } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

 // Reference: How To Cache Images in an Expo Managed React Native App
 // https://hackernoon.com/how-to-cache-images-in-an-expo-managed-react-native-app-5q9m3z6s

export default class CachedImage extends Component {
  state = {
    imgURI: ''
  }

  async componentDidMount() {
    const filesystemURI = await this.getImageFilesystemKey(this.props.source.uri);
    await this.loadImage(filesystemURI, this.props.source.uri);
  }

  async componentDidUpdate() {
    const filesystemURI = await this.getImageFilesystemKey(this.props.source.uri);
    if (this.props.source.uri === this.state.imgURI ||
      filesystemURI === this.state.imgURI) {
      return null;
    }
    await this.loadImage(filesystemURI, this.props.source.uri);
  }

  async getImageFilesystemKey(remoteURI) {
    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      remoteURI
    );
    return `${FileSystem.cacheDirectory}${hashed}`;
  }

  async loadImage(filesystemURI, remoteURI) {
    try {
      // Use the cached image if it exists
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists) {
        this.setState({
          imgURI: filesystemURI
        });
        return;
      }

      // otherwise download to cache
      const imageObject = await FileSystem.downloadAsync(
        remoteURI,
        filesystemURI
      );
      this.setState({
        imgURI: imageObject.uri
      });
    }
    catch (err) {
      console.log('Image loading error:', err);
      this.setState({ imgURI: remoteURI });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, height: 300 }}>
        {this.props.isBackground ? (
          <ImageBackground
            {...this.props}
            source={this.state.imgURI ? { uri: this.state.imgURI } : null}
          >
            {this.props.children}
          </ImageBackground>
        ) : (
          <Image
            {...this.props}
            source={this.state.imgURI ? { uri: this.state.imgURI } : null}
          />
        )}
      </View>
    );
  }
}