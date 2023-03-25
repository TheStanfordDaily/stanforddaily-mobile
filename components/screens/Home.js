import React, { useCallback, useContext, useState } from "react"
import { ActivityIndicator, LayoutAnimation, ScrollView, StyleSheet, View, Text, Modal, Image, PixelRatio, Platform, Dimensions, UIManager } from "react-native"
import { Divider, Icon, Layout, Input } from "@ui-kitten/components"
import { Canvas, Carousel, Diptych, Mark, Shelf, Wildcard } from "../"
import { useWordPress } from "../../hooks/useWordPress"
import { Sections, Spacing } from "../../constants"
import _ from "lodash"
import { DeviceType } from "expo-device"
import { ThemeContext } from "../../theme-context"
import Collapsible from "react-native-collapsible"
import { FlatList } from "react-native-gesture-handler"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

// TODO: Use `LayoutAnimation` so that loading new cards does not seem so abrupt.

export default function Home({ navigation, route }) {
    const [pageNumber, setPageNumber] = useState(1)
    const { data, articles, error, loading } = useWordPress(pageNumber)
    const { deviceType } = useContext(ThemeContext)
    const groupSize = deviceType === DeviceType.PHONE ? 1 : 2
    
    function peekBelow(e) {
      let paddingToBottom = 10
      paddingToBottom += e.nativeEvent.layoutMeasurement.height
      if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
        setPageNumber(pageNumber + 1)
      }
    }
    
    
    return articles ? (
      <Layout style={styles.container}>
        <FlatList
          ListHeaderComponent={() => (
            <React.Fragment>
              <Carousel articles={articles[Sections.FEATURED.slug] ?? []} navigation={navigation} />
              <Mark category={Sections.NEWS} seed={data[Sections.NEWS.slug] ?? []} navigation={navigation} />
              <Diptych articles={articles[Sections.NEWS.slug] ?? []} navigation={navigation} />
              <Divider marginTop={Spacing.medium} />
              <Mark category={Sections.OPINIONS} seed={data[Sections.OPINIONS.slug]} navigation={navigation} />
              <Shelf articles={articles[Sections.OPINIONS.slug] ?? []} navigation={navigation} />

              <Mark category={Sections.SPORTS} seed={data[Sections.SPORTS.slug] ?? []} navigation={navigation} />
              <Diptych articles={articles[Sections.SPORTS.slug] ?? []} navigation={navigation} />
              <Divider marginTop={Spacing.medium} />
              {_.chunk(articles?.culture?.slice(0, 4*groupSize), groupSize)?.map((group, outerIndex) => (
                <View style={{ flex: 1/groupSize, flexDirection: "row" }}>
                  {group.map((item, index) => <Wildcard item={item} index={outerIndex*index + index} key={item.id.toString()} navigation={navigation} />)}
                </View>
              ))}
              <Divider />
              <Mark category={Sections.HUMOR} seed={data[Sections.HUMOR.slug] ?? []} alternate navigation={navigation} />
              <Shelf articles={articles[Sections.HUMOR.slug] ?? []} alternate navigation={navigation} />
              <Divider />
              {/*  <Canvas articles={articles[Sections.CARTOONS.slug]} /> <Divider /> */}
            </React.Fragment>
          )}
          data={data?.wildcard ?? []}
          renderItem={(post, index) => <Wildcard item={post.item} index={index} key={post.item.id.toString()} navigation={navigation} verbose />}
          onScroll={peekBelow}
          onEndReachedThreshold={0.5}
          keyExtractor={(item, index) => index.toString()}
          // ListFooterComponent={() => <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
        />
      </Layout>
    ) : (
      <Layout style={styles.loading}>
        <ActivityIndicator />
      </Layout>
    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})