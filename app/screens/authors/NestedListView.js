import React from "react";
import { SectionList, TouchableOpacity, View, Text, Image } from "react-native";
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

export default class NestedListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data.filter(node => node.name && node.name.trim()),
            open: {}
        }
    }
    onRowClick(rowName) {
        this.setState({
            open: { ...this.state.open, [rowName]: !this.state.open[rowName] }
        });
    }
    render() {
        return (<SectionList
            renderItem={({ item, index, section }) =>
                this.state.open[section.name] ?
                <TouchableOpacity onPress={() => this.props.navigate(item.id)}>
                    <View style={styles.author}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{ flex: 1 }}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.profileImage || DEFAULT_IMAGE }}
                                />
                                <Text style={styles.authorText}>{item.name}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity> : <View />
            }
            renderSectionHeader={({ section: { name } }) => (
                <TouchableOpacity onPress={evt => this.onRowClick(name)}>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerText}>{name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
            sections={this.state.data}
            extraData={this.state.data}
            keyExtractor={(item, index) => item + index}
        />);
    }
}