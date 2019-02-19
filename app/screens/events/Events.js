import React from "react";
import { View, ScrollView, Image, Text, Linking } from "react-native";
import Header from "../common/header";
import { ICONS } from "../../assets/constants";
import { Ionicons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';

const styles = {
    link: {
        color: 'darkblue',
        textDecorationLine: 'underline',
        marginTop: 10
    }
}

export default () => (<View style={{ flex: 1 }}>
    <Header />
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingTop: 10, paddingBottom: 40 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>
                    The Stanford Daily Presents: Publication Roast{"\n"}
                </Text>
                {"\n"}
                Saturday, 2/23/18 from 7:30 PM – 9 PM
            {"\n"}
                At Roble Theater
        </Text>
            <Image source={require("./qr.png")} style={{margin: 30, marginBottom: 5}} />
            <Text style={{marginBottom: 10}}>
            Show this QR code for admission
            </Text>
            <Text style={styles.link} onPress={() => WebBrowser.openBrowserAsync("https://www.facebook.com/events/409871419583104/")}>
                Open Facebook event
        </Text>
            <Text style={styles.link} onPress={() => WebBrowser.openBrowserAsync("https://www.facebook.com/stanforddaily/")}>
                Like us on Facebook
        </Text>
            <Text style={styles.link} onPress={() => WebBrowser.openBrowserAsync("https://www.instagram.com/stanforddaily/")}>
                Follow us on Instagram
        </Text>
            <Text style={styles.link} onPress={() => WebBrowser.openBrowserAsync("https://soundcloud.com/dailybrew/")}>
                The Daily Brew podcast
        </Text>
        <Text style={{color: 'white', height: 100}} onPress={() => WebBrowser.openBrowserAsync("https://soundcloud.com/dailybrew/")}>
                test
        </Text>
        </View>
    </ScrollView>
</View>);