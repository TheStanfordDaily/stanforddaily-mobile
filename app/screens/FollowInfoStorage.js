import {AsyncStorage} from "react-native"

export async function getToken() {
    return await AsyncStorage.getItem('token') || "";
}

export async function setToken(token) {
    return await AsyncStorage.setItem('token', token);
}

export async function followCategory(category_id) {
    categories_followed = JSON.parse(await AsyncStorage.getItem('categories_followed') || "[]"); // store an array
    categories_followed.push(category_id);                                                       // add category_id to categories_followed
    return await AsyncStorage.setItem('categories_followed', JSON.stringify(categories_followed));
}

export async function unfollowCategory(category_id) {
    categories_followed = JSON.parse(await AsyncStorage.getItem('categories_followed') || "[]"); 
    var index = categories_followed.indexOf(category_id);
    if (index !== -1) categories_followed.splice(index);                                     // remove category_id from list
    return await AsyncStorage.setItem('categories_followed', JSON.stringify(categories_followed));
}

export async function followAuthor(author_id) {
    authors_followed = JSON.parse(await AsyncStorage.getItem('authors_followed') || "[]");  
    authors_followed.push(author_id);                                                        // add author_id to authors_followed
    return await AsyncStorage.setItem('authors_followed', JSON.stringify(authors_followed));
}

export async function unfollowAuthor(author_id) {
    authors_followed = JSON.parse(await AsyncStorage.getItem('authors_followed') || "[]"); 
    var index = authors_followed.indexOf(author_id);
    if (index !== -1) authors_followed.splice(index);                                       // remove author_id from list
    return await AsyncStorage.setItem('authors_followed', JSON.stringify(authors_followed));
}

export async function followLocation(location_id) {
    locations_followed = JSON.parse(await AsyncStorage.getItem('locations_followed') || "[]");  
    locations_followed.push(location_id);                                                        
    return await AsyncStorage.setItem('locations_followed', JSON.stringify(locations_followed));
}

export async function unfollowLocation(location_id) {
    locations_followed = JSON.parse(await AsyncStorage.getItem('locations_followed') || "[]"); 
    var index = locations_followed.indexOf(location_id);
    if (index !== -1) locations_followed.splice(index);                                       
    return await AsyncStorage.setItem('locations_followed', JSON.stringify(locations_followed));
}

export async function isFollowingCategory(category_id) {
    categories_followed = JSON.parse(await AsyncStorage.getItem('categories_followed') || "[]");
    var index = categories_followed.indexOf(category_id);
    if (index !== -1) return true;
    else return false;
}

export async function isFollowingAuthor(author_id) {
    authors_followed = JSON.parse(await AsyncStorage.getItem('authors_followed') || "[]");
    var index = authors_followed.indexOf(author_id);
    if (index !== -1) return true;
    else return false;
}

export async function isFollowingLocation(location_id) {
    locations_followed = JSON.parse(await AsyncStorage.getItem('locations_followed') || "[]");
    var index = locations_followed.indexOf(location_id);
    if (index !== -1) return true;
    else return false;
}

