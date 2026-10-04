# RSS Feed

An Await widget that displays the latest posts from a configurable RSS or Atom feed.

## Configuration

Open the widget panel and set:

- `rssLink`: the RSS or Atom feed URL to request, defaulting to `https://github.blog/feed` when empty
- `layout`: `featured` shows the topmost post, while `list` shows multiple posts
- `updateInterval`: how often the widget refreshes the feed

The widget requests the feed with `AwaitNetwork`, normalizes feed-level `title`, `description`, and `link` values, then displays item `title`, `content`, `description`, `link`, and `pubDate` fields when present. Featured view prefers article `content`; list view prefers shorter `description` or `summary` text.

Feed text is stored without a character limit. In featured view, the body font grows with the widget's dimensions, and native text layout wraps and truncates the article within the space left by the headline and publication date. Headlines retain a line limit to leave room for the article. Short feed content can still leave unused space.

## Usage

See the project root's [README.md](https://github.com/LitoMore/await-widgets#usage) for general usage instructions.
