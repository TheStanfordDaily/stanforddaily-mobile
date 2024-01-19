import { Avatar, Layout, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Profile({ profile }) {
  return (
    profile && (
      <Layout level="2">
        <Layout style={styles.header} level="1">
          <View style={styles.profileContainer}>
            {profile["avatar_urls"]?.["96"] && (
              <Avatar style={styles.profileAvatar} size="large" source={{ uri: profile["avatar_urls"]["96"] }} />
            )}
            <View style={styles.profileDetailsContainer}>
              <Text category="h4">{profile.name}</Text>
              <Text appearance="hint" category="s1">
                {profile.description}
              </Text>
            </View>
          </View>
        </Layout>
      </Layout>
    )
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: "row",
  },
  profileAvatar: {
    marginHorizontal: 8,
  },
  profileDetailsContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  rateBar: {
    marginTop: 24,
  },
  followButton: {
    marginTop: 24,
  },
  profileParametersContainer: {
    flexDirection: "row",
    minHeight: 220,
    marginHorizontal: 8,
    marginTop: 24,
    marginBottom: 8,
  },
  profileSocialsSection: {
    marginHorizontal: 16,
  },
  profileSocialContainer: {
    flex: 1,
  },
  profileSectionsDivider: {
    width: 1,
    height: "100%",
    marginHorizontal: 8,
  },
  profileDescriptionSection: {
    flex: 1,
    marginHorizontal: 16,
  },
  profileParametersSection: {
    flexDirection: "row",
    marginVertical: 16,
    marginHorizontal: 8,
  },
  profileParameter: {
    flex: 1,
    marginHorizontal: 8,
  },
});
