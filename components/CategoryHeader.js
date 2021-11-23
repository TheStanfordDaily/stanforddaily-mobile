import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Strings, Margins, Fonts, FontSizes } from '../constants';
import HTML from '../components/HTML';
import { useFonts, PTSerif_400Regular } from '@expo-google-fonts/pt-serif';

export default function CategoryHeader(props) {

  return (
    <View style={styles.titleContainer}>
        <Text style={styles.header}>{props.title}</Text>
        <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(Strings.category, { data: props.articles, title: props.title, navigation: props.navigation })}>
            <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    titleContainer: {
        marginTop: Margins.small,
        marginHorizontal: Margins.articleSides,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 5
        // backgroundColor: THEME.BACKGROUND
      },
      seeAll: {
        paddingHorizontal: 15,
        fontFamily: "PTSerif_400Regular",
        // color: THEME.LABEL,
      },
      titleFont: {
        fontFamily: Fonts.PTSerifBold,
        fontSize: FontSizes.mediumSmall,
      },
      header: {
        fontFamily: Fonts.PTSerifBold,
        fontSize: FontSizes.large + 10,
        // color: THEME.LABEL
      },
})