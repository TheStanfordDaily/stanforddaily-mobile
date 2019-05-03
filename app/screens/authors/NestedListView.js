import React from "react";
import { SectionList, TouchableOpacity, View, Text, Image, Dimensions } from "react-native";
import { COLORS, FONTS, FONT_SIZES, DEFAULT_IMAGE } from "../../assets/constants";

const styles = {
    header: {
        borderRadius: 8,
        borderBottomWidth: 3,
        borderBottomColor: COLORS.LIGHT_GRAY,
        paddingLeft: 15,
        paddingBottom: 15
    },
    headerText: {
        fontSize: FONT_SIZES.DEFAULT_MEDIUM,
        fontFamily: FONTS.PT_SERIF_BOLD,
        top: 8,
    },
    author: {
        borderRadius: 10,
        borderBottomColor: COLORS.LIGHT_GRAY,
        borderBottomWidth: 1,
        paddingLeft: 15,
        flexDirection: 'column',
        paddingBottom: 10
    },
    authorText: {
        fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
        fontFamily: FONTS.PT_SERIF,
        flex: 1,
        left: 45,
        bottom: 5,
        position: 'absolute'
    },
    image: {
        flex: 1,
        marginLeft: 0,
        marginTop: 8.5,
        width: 34,
        height: 34,
        borderRadius: 17,
        borderBottomWidth: 1,
        overflow: "hidden"
    }
}

class Item extends React.PureComponent {
    render() {
        if (!this.props.open) {
            return <View />;
        }
        return <TouchableOpacity onPress={() => this.props.navigate(this.props.item.id)}>
            <View style={styles.author}>
                <View style={{ flex: 1 }}>
                    <View
                        style={{ flex: 1 }}>
                        <Image
                            style={styles.image}
                            source={{ uri: this.props.item.profileImage || DEFAULT_IMAGE }}
                        />
                        <Text style={styles.authorText}>{this.props.item.name}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>;
    }
}

class SectionHeader extends React.PureComponent {
    render() {
        return <TouchableOpacity onPress={evt => this.props.onClick()}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerText}>{this.props.name}</Text>
                </View>
            </View>
        </TouchableOpacity>;
    }
}

export default class NestedListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: {}
        }
    }
    onRowClick(rowName) {
        this.setState({
            open: { ...this.state.open, [rowName]: !this.state.open[rowName] }
        });
    }
    render() {
        const data = this.props.data.filter(node => node.name && node.name.trim());
        return (<SectionList
            initialNumToRender={1000}
            renderItem={({ item, index, section }) =>
                <Item item={item} open={this.state.open[section.name]} navigate={e => this.props.navigate(e)} />
            }
            renderSectionHeader={({ section: { name } }) => (
                <SectionHeader name={name} onClick={e => this.onRowClick(name)} />
            )}
            sections={data}
            extraData={data}
            keyExtractor={(item, index) => item.name}
        />);
    }
}