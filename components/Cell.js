import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Margins, FontSizes } from '../constants';
import { relativeDate, normalize } from '../helpers/format';

const Cell = ({item, onPress}) => {
    let thumbnailURL
      if (item._embedded["wp:featuredmedia"][0].code) {
        console.log(item._embedded["wp:featuredmedia"][0].data.status);
      } else {
        thumbnailURL = item._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url
      }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>

          <Image
            source={{ uri: thumbnailURL }}
            resizeMode={"cover"}
            style={styles.cardImg, styles.cardImgWrapper}
          />
     
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title.rendered}</Text>
          <Text style={styles.date}>{item._embedded.author[0].name + "\n" + relativeDate(Date.parse(item.date)).toUpperCase()}</Text>
          {/* <Text numberOfLines={2} style={styles.cardDetails}>{data.description}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Cell;

const styles = StyleSheet.create({
  card: {
    // height: 100,
    marginVertical: 5,
    marginHorizontal: Margins.articleSides,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    // shadowColor: '#999',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    // height: 100,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
  },

  date: {
    fontFamily: "system",
    fontSize: 10,
    fontWeight: "500",
    color: "#4D4F53"
  //   color: THEME.SECONDARY_LABEL,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: normalize(FontSizes.mediumSmall),
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
  },
});