// later will have sections here and stuff
export const SideMenu = () => (
<View style={styles.sideMenuContainer}>
    <View style={styles.sideBarTitle}>
    <Text style={styles.sideBarTitleText}> Community </Text>
    </View>
    <FlatList
    data={communityItems}
    style={styles.flatListStyle}
    ItemSeparatorComponent={() => <Separator />}
    renderItem={({ item }) =>
        <TouchableOpacity>
        <View style={styles.sideMenuItem}>
            <Ionicons name={CATEGORY_ICONS[item.label]} style={setTextStyle(item)} size={32} />
            <Text style={setTextStyle(item)}>{item.label}</Text>
        </View>
        </TouchableOpacity>
    }
    />
    <TouchableHighlight style={{ width: '100%', marginLeft: 28 }}>
    <View style={{flexDirection: 'column'}}>
    {/* <View style={styles.sideMenuItem, { flexDirection: 'row', justifyContent: 'center', marginRight: MARGINS.ARTICLE_SIDES }}>
    <Switch />
    <Text>Push Notifications</Text>
    </View> */}
        <View style={styles.sideMenuItem, { marginBottom: 40, flexDirection: 'row', justifyContent: 'center', marginRight: MARGINS.ARTICLE_SIDES }}>
        <TouchableOpacity onPress={ () => {Linking.openURL('https://open.spotify.com/show/2ty8gvAnvYP31X8TUrFwoj?si=YmnmqxYuSFq8U2mv_P2fCg')}}><Image style={{width: 32, height: 32}} source={require('../media/spotify.png')} /></TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={ ()=>{ Linking.openURL('https://www.youtube.com/channel/UCWg3QqUzqxXt6herm5sMjNw')}}><Ionicons name="logo-youtube" size={32} /></TouchableOpacity>
        </View>
    </View>
    </TouchableHighlight>
</View>
);