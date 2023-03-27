import React, { useCallback, useContext, useState } from "react"
import { ActivityIndicator, StyleSheet, View, Modal, PixelRatio } from "react-native"
import { Divider, Icon, Layout, Input, Text } from "@ui-kitten/components"
import { Carousel, Diptych, Mark, Shelf, Wildcard } from "../"
import { useWordPress } from "../../hooks/useWordPress"
import { Sections, Spacing, Strings } from "../../utils/constants"
import _ from "lodash"
import { DeviceType } from "expo-device"
import { ThemeContext } from "../../theme-context"
import Collapsible from "react-native-collapsible"
import { FlatList } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"

// TODO: Implement skeleton loading.

export default function Home({ navigation, route }) {
    const [pageNumber, setPageNumber] = useState(1)
    const { data, articles, error, loading } = useWordPress(pageNumber)
    const { theme, deviceType } = useContext(ThemeContext)
    const groupSize = deviceType === DeviceType.PHONE ? 1 : 2

    const SearchBar = ({ onSearch }) => {
      const [searchQuery, setSearchQuery] = useState('');
    
      const renderSearchIcon = (props) => (
        <Icon {...props} name='search' />
      );
    
      const onSearchChange = (query) => {
        setSearchQuery(query);
      };
  
      const onSearchSubmit = (query) => {
        if (onSearch) {
          onSearch(query);
        }
      };
    
      return (
        <Input
          style={styles.searchBar}
          value={searchQuery}
          placeholder='Search'
          accessoryLeft={renderSearchIcon}
          onChangeText={onSearchChange}
          onSubmitEditing={onSearchSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      );
    };

    return articles ? (
      <Layout style={styles.container}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <SearchBar onSearch={(query) => navigation.navigate(Strings.section, { category: { name: Strings.search }, seed: [], query: searchQuery })} />
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
                <View style={{ flex: 1/groupSize, flexDirection: "row" }} key={outerIndex}>
                  {group.map((item, index) => <Wildcard item={item} index={outerIndex*index + index} key={item.id.toString()} navigation={navigation} />)}
                </View>
              ))}
              <Divider />
              <Mark category={Sections.HUMOR} seed={data[Sections.HUMOR.slug] ?? []} alternate navigation={navigation} />
              <Shelf articles={articles[Sections.HUMOR.slug] ?? []} alternate navigation={navigation} />
              <Divider />
            </React.Fragment>
          )}
          data={data?.wildcard ?? []}
          renderItem={(post, index) => <Wildcard item={post.item} index={index} key={post.item.id.toString()} navigation={navigation} verbose />}
          onEndReached={() => setPageNumber(pageNumber + 1)}
          onEndReachedThreshold={0.25}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
        />
      </Layout>
    ) : (
      <Layout style={styles.empty}>
        {loading ? <ActivityIndicator /> : <Text>Something went wrong.{`\n${JSON.stringify(error)}`}</Text>}
      </Layout>
    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})