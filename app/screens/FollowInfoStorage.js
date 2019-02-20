import {AsyncStorage} from "react-native"

async function followCategory(category_id) {
    categories_followed = JSON.parse(await AsyncStorage.getItem('categories_followed') || "[]"); // store an array
    categories_followed.push(category_id);                                                       // add category_id to categories_followed
    return await AsyncStorage.setItem('categories_followed', JSON.stringify(categories_followed));
}

async function unfollowCategory(category_id) {
    categories_followed = JSON.parse(await AsyncStorage.getItem('categories_followed') || "[]"); 
    var index = categories_followed.indexOf(category_id);
    if (index !== -1) categories_followed.splice(index);                                     // remove category_id from list
    return await AsyncStorage.setItem('categories_followed', JSON.stringify(categories_followed));
}

async function followAuthor(author_id) {
    authors_followed = JSON.parse(await AsyncStorage.getItem('authors_followed') || "[]");  
    authors_followed.push(author_id);                                                        // add author_id to authors_followed
    return await AsyncStorage.setItem('authors_followed', JSON.stringify(authors_followed));
}

async function unfollowAuthor(author_id) {
    authors_followed = JSON.parse(await AsyncStorage.getItem('authors_followed') || "[]"); 
    var index = authors_followed.indexOf(author_id);
    if (index !== -1) authors_followed.splice(index);                                       // remove author_id from list
    return await AsyncStorage.setItem('authors_followed', JSON.stringify(authors_followed));
}

async function isFollowingCategory(category_id) {
    categories_followed = JSON.parse(await AsyncStorage.getItem('categories_followed') || "[]");
    var index = categories_followed.indexOf(category_id);
    if (index !== -1) return true;
    else return false;
}

async function isFollowingAuthor(author_id) {
    authors_followed = JSON.parse(await AsyncStorage.getItem('authors_followed') || "[]");
    var index = authors_followed.indexOf(author_id);
    if (index !== -1) return true;
    else return false;
}
