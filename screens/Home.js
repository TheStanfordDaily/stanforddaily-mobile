import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Image, FlatList } from 'react-native';
import { Strings, Heights, Margins, Fonts, Alignments, FontSizes, Sections, PlatformPalette } from '../constants';
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from '../helpers/wpapi';
import LightboxGallery from '../components/LightboxGallery';
import { getThumbnailURL, formatDate } from '../helpers/format';
import Column from '../components/Column';
import { Card, Divider, Layout, List, ListItem, Text } from '@ui-kitten/components';
import moment from 'moment';
import Duet from '../components/Duet';
import Mark from '../components/Mark';
import Culture from '../components/Culture';
import Shelf from '../components/Shelf'; // Could probably have an index file with all the sections and import all of them on one line.
import Featured from "../components/Featured";

const { width, height } = Dimensions.get("window")
const dummyData = require("../dummy.json")

const thumbnailImage = (details) => {
  console.log(details.sizes.thumbnail)
}

export default function Home(props) {

    const [sections, setSections] = useState({});

    return (
      <Layout style={styles.container}>
        <ScrollView>
          <Featured articles={dummyData.slice(40, 45)} />
          <Mark title={Sections.NEWS.name} onPress={() => console.log("navigate to next screen")}/>
          <Duet articles={dummyData.slice(0, 10)} />
          <Divider marginTop={8} />
          <Mark title={Sections.OPINIONS.name} onPress={() => console.log("navigate to next screen")}/>
          <Shelf articles={dummyData.slice(10, 20)} />
          <Mark title={Sections.SPORTS.name} onPress={() => console.log("navigate to next screen")}/>
          <Duet articles={dummyData.slice(20, 30)} />
          <Divider marginTop={8} />
          <Culture theGrind={dummyData.slice(30, 32)} artsAndLife={dummyData.slice(32,34)} />
          <Divider />
          <Mark alternate title={Sections.HUMOR.name} onPress={() => console.log("navigate to next screen")}/>
          <Shelf alternate articles={dummyData.slice(33, 40)} />
          {/* Infinite scroll/wildcard will go here, with cell similar to the ones in `Culture` component. */}
        </ScrollView>
      </Layout>
    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})