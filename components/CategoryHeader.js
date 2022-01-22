import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Strings, Margins, Fonts, FontSizes } from '../constants';
import HTML from '../components/HTML';
import { useFonts, PTSerif_400Regular } from '@expo-google-fonts/pt-serif';

export default function CategoryHeader(props) {

  let [fontsLoaded] = useFonts({
    PTSerif_400Regular,
  });

  let PTSerif = fontsLoaded ? "PTSerif_400Regular" : "System"

  const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: (props.title === "Humor" || props.title === "Cartoons") * Margins.defaultSmallMedium,
        paddingHorizontal: Margins.articleSides,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 5,
        backgroundColor: props.title === "Humor" ? "#fef2f2" : "#FFF",
      },
      seeAll: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
        backgroundColor: "#FFF",
        borderColor: "#8C1515",
        borderWidth: 1,
        borderRadius: 5,
        color: "#8C1515"
        // color: THEME.LABEL,
      },
      titleFont: {
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
        fontSize: FontSizes.extraLarge,
        fontWeight: "800"
      },
      header: {
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
        fontSize: FontSizes.large + 10,
        // color: THEME.LABEL
      },
  })

  return (
    <View style={styles.titleContainer}>
        <Text style={styles.titleFont}>{props.title}</Text>
        {props.title !== "Cartoons" && (<TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(Strings.category, { data: props.articles, title: props.title, navigation: props.navigation })}>
            <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
        </TouchableOpacity>)}
    </View>
  )
}
