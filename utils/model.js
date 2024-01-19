/**
 * WordPress post object
 *
 * @typedef {Object} WordPressPost
 * @property {number} id
 * @property {Date} date
 * @property {Date} date_gmt
 * @property {GUID} guid
 * @property {Date} modified
 * @property {Date} modified_gmt
 * @property {string} slug
 * @property {string} status
 * @property {string} type
 * @property {string} link
 * @property {GUID} title
 * @property {Content} content
 * @property {Content} excerpt
 * @property {number} author
 * @property {number} featured_media
 * @property {string} comment_status
 * @property {string} ping_status
 * @property {boolean} sticky
 * @property {string} template
 * @property {string} format
 * @property {WordPressPostMeta} meta
 * @property {number[]} categories
 * @property {number[]} tags
 * @property {any[]} site-layouts
 * @property {number[]} coauthors
 * @property {any[]} apple_news_notices
 * @property {Parsely} parsely
 * @property {string} jetpack_featured_media_url
 * @property {string} wps_subtitle
 * @property {WordPressPostLinks} _links
 * @property {Embedded} _embedded
 */

/**
 * @typedef {Object} Embedded
 * @property {EmbeddedAuthor[]} author
 * @property {WpFeaturedmedia[]} wp:featuredmedia
 * @property {EmbeddedWpTerm[][]} wp:term
 */

/**
 * @typedef {Object} EmbeddedAuthor
 * @property {number} id
 * @property {string} name
 * @property {string} url
 * @property {string} description
 * @property {string} link
 * @property {string} slug
 * @property {{ [key: string]: string }} avatar_urls
 * @property {AuthorLinks} _links
 */

/**
 * @typedef {Object} AuthorLinks
 * @property {About[]} self
 * @property {About[]} collection
 */

/**
 * @typedef {Object} About
 * @property {string} href
 */

/**
 * @typedef {Object} WpFeaturedmedia
 * @property {number} id
 * @property {Date} date
 * @property {string} slug
 * @property {string} type
 * @property {string} link
 * @property {GUID} title
 * @property {number} author
 * @property {Parsely} parsely
 * @property {GUID} caption
 * @property {string} alt_text
 * @property {string} media_type
 * @property {string} mime_type
 * @property {MediaDetails} media_details
 * @property {string} source_url
 * @property {WpFeaturedmediaLinks} _links
 */

/**
 * @typedef {Object} WpFeaturedmediaLinks
 * @property {About[]} self
 * @property {About[]} collection
 * @property {About[]} about
 * @property {ReplyElement[]} author
 * @property {ReplyElement[]} replies
 */

/**
 * @typedef {Object} ReplyElement
 * @property {boolean} embeddable
 * @property {string} href
 */

/**
 * @typedef {Object} GUID
 * @property {string} rendered
 */

/**
 * @typedef {Object} MediaDetails
 * @property {number} width
 * @property {number} height
 * @property {string} file
 * @property {number} filesize
 * @property {Sizes} sizes
 * @property {ImageMeta} image_meta
 */

/**
 * @typedef {Object} ImageMeta
 * @property {string} aperture
 * @property {string} credit
 * @property {string} camera
 * @property {string} caption
 * @property {string} created_timestamp
 * @property {string} copyright
 * @property {string} focal_length
 * @property {string} iso
 * @property {string} shutter_speed
 * @property {string} title
 * @property {string} orientation
 * @property {any[]} keywords
 */

/**
 * @typedef {Object} Sizes
 * @property {The1536_X1536} thumbnail
 * @property {The1536_X1536} medium
 * @property {The1536_X1536} medium_large
 * @property {The1536_X1536} large
 * @property {The1536_X1536} 1536x1536
 * @property {The1536_X1536} 2048x2048
 * @property {The1536_X1536} full
 */

/**
 * @typedef {Object} The1536_X1536
 * @property {string} file
 * @property {number} width
 * @property {number} height
 * @property {number} [filesize]
 * @property {string} mime_type
 * @property {string} source_url
 */

/**
 * @typedef {Object} Parsely
 * @property {string} version
 * @property {ParselyMeta} meta
 * @property {string} rendered
 * @property {string} tracker_url
 */

/**
 * @typedef {Object} ParselyMeta
 * @property {string} @context
 * @property {string} @type
 * @property {string} headline
 * @property {string} url
 * @property {MainEntityOfPage} mainEntityOfPage
 * @property {string} thumbnailUrl
 * @property {Image} image
 * @property {string} articleSection
 * @property {MetaAuthor[]} author
 * @property {string[]} creator
 * @property {Publisher} publisher
 * @property {string[]} keywords
 * @property {Date} dateCreated
 * @property {Date} datePublished
 * @property {Date} dateModified
 */

/**
 * @typedef {Object} MetaAuthor
 * @property {string} @type
 * @property {string} name
 */

/**
 * @typedef {Object} Image
 * @property {string} @type
 * @property {string} url
 */

/**
 * @typedef {Object} MainEntityOfPage
 * @property {string} @type
 * @property {string} @id
 */

/**
 * @typedef {Object} Publisher
 * @property {string} @type
 * @property {string} name
 * @property {string} logo
 */

/**
 * @typedef {Object} EmbeddedWpTerm
 * @property {number} id
 * @property {string} link
 * @property {string} name
 * @property {string} slug
 * @property {Taxonomy} taxonomy
 * @property {WpTermLinks} _links
 */

/**
 * @typedef {Object} WpTermLinks
 * @property {About[]} self
 * @property {About[]} collection
 * @property {About[]} about
 * @property {About[]} wp:post_type
 * @property {Cury[]} curies
 * @property {ReplyElement[]} [up]
 */

/**
 * @typedef {Object} Cury
 * @property {Name} name
 * @property {Href} href
 * @property {boolean} templated
 */

/**
 * @enum {string} Href
 */
const Href = {
  HTTPS_API_W_ORG_REL: "https://api.w.org/{rel}",
};

/**
 * @enum {string} Name
 */
const Name = {
  WP: "wp",
};

/**
 * @enum {string} Taxonomy
 */
const Taxonomy = {
  AUTHOR: "author",
  CATEGORY: "category",
  POST_TAG: "post_tag",
};

/**
 * @typedef {Object} WordPressPostLinks
 * @property {About[]} self
 * @property {About[]} collection
 * @property {About[]} about
 * @property {ReplyElement[]} author
 * @property {ReplyElement[]} replies
 * @property {VersionHistory[]} version-history
 * @property {PredecessorVersion[]} predecessor-version
 * @property {ReplyElement[]} wp:featuredmedia
 * @property {About[]} wp:attachment
 * @property {LinksWpTerm[]} wp:term
 * @property {Cury[]} curies
 */

/**
 * @typedef {Object} PredecessorVersion
 * @property {number} id
 * @property {string} href
 */

/**
 * @typedef {Object} VersionHistory
 * @property {number} count
 * @property {string} href
 */

/**
 * @typedef {Object} LinksWpTerm
 * @property {string} taxonomy
 * @property {boolean} embeddable
 * @property {string} href
 */

/**
 * @typedef {Object} Content
 * @property {string} rendered
 * @property {boolean} protected
 */

/**
 * @typedef {Object} WordPressPostMeta
 * @property {Date} apple_news_api_created_at
 * @property {string} apple_news_api_id
 * @property {Date} apple_news_api_modified_at
 * @property {string} apple_news_api_revision
 * @property {string} apple_news_api_share_url
 * @property {number} apple_news_coverimage
 * @property {string} apple_news_coverimage_caption
 * @property {boolean} apple_news_is_hidden
 * @property {boolean} apple_news_is_paid
 * @property {boolean} apple_news_is_preview
 * @property {boolean} apple_news_is_sponsored
 * @property {string} apple_news_maturity_rating
 * @property {string} apple_news_metadata
 * @property {string} apple_news_pullquote
 * @property {string} apple_news_pullquote_position
 * @property {string} apple_news_slug
 * @property {string} apple_news_sections
 * @property {boolean} apple_news_suppress_video_url
 * @property {boolean} apple_news_use_image_component
 * @property {string} footnotes
 */

const WPAPI = require("wpapi");
const wp = new WPAPI({ endpoint: "https://stanforddaily.com/wp-json" });

export default wp;
