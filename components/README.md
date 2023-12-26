# Components

## Carousel
The `Carousel` component displays a horizontal scrollable list of articles, chiefly featured ones.
Its content panels are `Card` components that display a large image and details like title, date and image below.

**Component**:
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| navigation | <code>Object</code> | The navigation object from React Navigation. |
| articles | <code>Array</code> | An array of articles to be displayed in the carousel. |

**Example**
```js
<Carousel navigation={navigation} articles={articles} />
```

## Mark
`Mark` is large section signpost in all caps.

This component displays the name of a section and provides navigation to a screen with more articles from that section.
The `TouchableOpacity` makes the entire component tappable and changes its opacity as an indication of impression.

The component's background color and text color may change depending on the `alternate` prop.
If set to `true`, the background takes on the accent color typically used for the Humor section on the website.

**Component**:   
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| navigation | <code>Object</code> | Passed from the `Home` screen, which automatically receives the navigation object from React Navigation. |
| alternate | <code>boolean</code> | A flag indicating whether to use an accent color. Primarily intended for displaying Humor section. |
| seed | <code>Array</code> | A collection of articles from the `Home` screen that can be immediately displayed upon navigation to the detail view. |
| category | <code>Object</code> | The category object representing the section. It should have a `name` property like "News" or "The Grind." |

## Polyptych
Displays a set of articles in a paginated layout.

`Polyptych` groups the articles into pages and displays each page as a row of cards.
Each card represents an article and includes an image, the article's title, and the date it was published.
The image is displayed at the top of the card, the title is displayed in the middle, and the date is displayed at the bottom.

The number of cards in each row depends on the device type.
If the device is a phone, there are two cards per row.
If the device is a tablet or desktop, there are three cards per row.

The user can navigate between pages by swiping left or right.
The currently selected page is stored in the `selection` state variable but is not used for anything yet in particular.
When a card is tapped, the component navigates to the `Post` screen and passes the corresponding article as a parameter.

Canonically, a polyptych is an altarpiece of multiple panels that are joined by hinges. The name is a metaphor.

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| articles | <code>Array.&lt;Object&gt;</code> | The array of article objects to display. Expected to be non-null. |
| navigation | <code>Object</code> | The navigation object used for navigating between screens. |

**Example**  
```js
<Polyptych articles={articles[Section.SPORTS.slug]} navigation={navigation} />
```

## Wildcard
Displays a `Card` preview for an article or some other related form of content.

**Component**:
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| navigation | <code>Object</code> | The navigation object used for navigating between screens. |
| verbose | <code>boolean</code> | A flag indicating whether to include the excerpt in the card. |
| title | <code>string</code> | The headline. |
| item | <code>Object</code> | The article object. |
| index | <code>number</code> | The index of the article in a parent view. Currently unused in the implementation. |

## Header
`Header` is a sub-component of `Wildcard` that displays the article title, date, and image.

**Component**:   
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The title of the article. |
| verbose | <code>boolean</code> | A flag indicating whether to include the excerpt in the card. |
| date | <code>string</code> | The publication date. |
| uri | <code>string</code> | The URI for the feature image of the article. |

## Footer
`Footer` is a sub-component of `Wildcard` that displays the article byline and section.

**Component**:   
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| byline | <code>string</code> | The author's name(s) in a displayable format. |
| section | <code>string</code> | The name of the section to which the article belongs. |
