/**
 * This script is used when tooltip content script is activated.
 * If search result is to be displayed on tooltip in a tab,
 * the result html content is inserted to html DOM of any external web page displayed in the tab.
 * In order to avoid for search result html content to be affected by original web page's stylesheet,
 * external web page's styling is reset to firefox default with this css string.
 *
 * Base css styles are derived from:
 *   resource://gre-resources/html.css
 *   resource://gre-resources/forms.css
 *   resource://gre-resources/ua.css
 *   resource://gre-resources/plaintext.css
 *   resource://gre-resources/number-control.css
 *   resource://gre-resources/noscript.css
 *   resource://gre-resources/noframes.css
 *   resource://gre-resources/mathml.css
 *
 * @param {string} wrapper_id - Element ID which wraps search result html content.
 * @returns {string} User agent CSS for firefox with element id injected.
 */
const firefox_default_css = function(wrapper_id) {
    return `
/*
 * html.css
 */
html body ${wrapper_id} address,
html body ${wrapper_id} article,
html body ${wrapper_id} aside,
html body ${wrapper_id} blockquote,
html body ${wrapper_id} body,
html body ${wrapper_id} caption,
html body ${wrapper_id} center,
html body ${wrapper_id} col,
html body ${wrapper_id} colgroup,
html body ${wrapper_id} dd,
html body ${wrapper_id} dir,
html body ${wrapper_id} div,
html body ${wrapper_id} dl,
html body ${wrapper_id} dt,
html body ${wrapper_id} fieldset,
html body ${wrapper_id} figcaption,
html body ${wrapper_id} figure,
html body ${wrapper_id} footer,
html body ${wrapper_id} form,
html body ${wrapper_id} h1,
html body ${wrapper_id} h2,
html body ${wrapper_id} h3,
html body ${wrapper_id} h4,
html body ${wrapper_id} h5,
html body ${wrapper_id} h6,
html body ${wrapper_id} header,
html body ${wrapper_id} hgroup,
html body ${wrapper_id} hr,
html body ${wrapper_id} html,
html body ${wrapper_id} legend,
html body ${wrapper_id} li,
html body ${wrapper_id} listing,
html body ${wrapper_id} main,
html body ${wrapper_id} marquee,
html body ${wrapper_id} menu,
html body ${wrapper_id} nav,
html body ${wrapper_id} noframes,
html body ${wrapper_id} ol,
html body ${wrapper_id} p,
html body ${wrapper_id} plaintext,
html body ${wrapper_id} pre,
html body ${wrapper_id} section,
html body ${wrapper_id} summary,
html body ${wrapper_id} table,
html body ${wrapper_id} tbody,
html body ${wrapper_id} td,
html body ${wrapper_id} tfoot,
html body ${wrapper_id} th,
html body ${wrapper_id} thead,
html body ${wrapper_id} tr,
html body ${wrapper_id} ul,
html body ${wrapper_id} xmp {
  unicode-bidi: -moz-isolate;
}

html body ${wrapper_id} bdi, output {
  unicode-bidi: -moz-isolate;
}
html body ${wrapper_id} bdo, bdo[dir] {
  unicode-bidi: bidi-override;
}
html body ${wrapper_id} bdo[dir="auto"] {
  unicode-bidi: -moz-isolate-override;
}
html body ${wrapper_id} textarea[dir="auto"], pre[dir="auto"] { unicode-bidi: -moz-plaintext; }

/* blocks */

html body ${wrapper_id} article,
html body ${wrapper_id} aside,
html body ${wrapper_id} details,
html body ${wrapper_id} div,
html body ${wrapper_id} dt,
html body ${wrapper_id} figcaption,
html body ${wrapper_id} footer,
html body ${wrapper_id} form,
html body ${wrapper_id} header,
html body ${wrapper_id} hgroup,
html body ${wrapper_id} html,
html body ${wrapper_id} main,
html body ${wrapper_id} nav,
html body ${wrapper_id} section,
html body ${wrapper_id} summary {
  display: block;
}

html body ${wrapper_id} p, html body ${wrapper_id} dl, html body ${wrapper_id} multicol {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

html body ${wrapper_id} dd {
  display: block;
  margin-inline-start: 40px;
}

html body ${wrapper_id} blockquote, html body ${wrapper_id} figure {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 40px;
  margin-inline-end: 40px;
}

html body ${wrapper_id} address {
  display: block;
  font-style: italic;
}

html body ${wrapper_id} center {
  display: block;
  text-align: -moz-center;
}

html body ${wrapper_id} blockquote[type=cite] {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 1em;
  border-inline-start: solid;
  border-color: blue;
  border-width: thin;
}

html body ${wrapper_id} span[_moz_quote=true] {
  color: blue;
}

html body ${wrapper_id} pre[_moz_quote=true] {
  color: blue;
}

html body ${wrapper_id} h1 {
  display: block;
  font-size: 2em;
  font-weight: bold;
  margin-block-start: .67em;
  margin-block-end: .67em;
}

html body ${wrapper_id} h2,
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  margin-block-start: .83em;
  margin-block-end: .83em;
}

html body ${wrapper_id} h3,
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 1.17em;
  font-weight: bold;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

html body ${wrapper_id} h4,
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 1.00em;
  font-weight: bold;
  margin-block-start: 1.33em;
  margin-block-end: 1.33em;
}

html body ${wrapper_id} h5,
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 0.83em;
  font-weight: bold;
  margin-block-start: 1.67em;
  margin-block-end: 1.67em;
}

html body ${wrapper_id} h6,
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 0.67em;
  font-weight: bold;
  margin-block-start: 2.33em;
  margin-block-end: 2.33em;
}

html body ${wrapper_id} listing {
  display: block;
  font-family: -moz-fixed;
  font-size: medium;
  white-space: pre;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

html body ${wrapper_id} xmp, html body ${wrapper_id} pre, html body ${wrapper_id} plaintext {
  display: block;
  font-family: -moz-fixed;
  white-space: pre;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

/* tables */

html body ${wrapper_id} table {
  display: table;
  border-spacing: 2px;
  border-collapse: separate;
  /* XXXldb do we want this if we're border-collapse:collapse ? */
  box-sizing: border-box;
  text-indent: 0;
}

html body ${wrapper_id} table[align="left"] {
  float: left;
}

html body ${wrapper_id} table[align="right"] {
  float: right;
  text-align: start;
}


/* border collapse rules */

  /* Set hidden if we have 'frame' or 'rules' attribute.
     Set it on all sides when we do so there's more consistency
     in what authors should expect */

  /* Put this first so 'border' and 'frame' rules can override it. */
html body ${wrapper_id} table[rules] { 
  border-width: thin;
  border-style: hidden;
}

  /* 'border' before 'frame' so 'frame' overrides
      A border with a given value should, of course, pass that value
      as the border-width in pixels -> attr mapping */

  /* :-moz-table-border-nonzero is like [border]:not([border="0"]) except it
     also checks for other zero-like values according to HTML attribute
     parsing rules */
html body ${wrapper_id} table:-moz-table-border-nonzero { 
  border-width: thin;
  border-style: outset;
}

html body ${wrapper_id} table[frame] {
  border: thin hidden;
}

/* specificity must beat table:-moz-table-border-nonzero rule above */
html body ${wrapper_id} table[frame="void"]   { border-style: hidden; }
html body ${wrapper_id} table[frame="above"]  { border-style: outset hidden hidden hidden; }
html body ${wrapper_id} table[frame="below"]  { border-style: hidden hidden outset hidden; }
html body ${wrapper_id} table[frame="lhs"]    { border-style: hidden hidden hidden outset; }
html body ${wrapper_id} table[frame="rhs"]    { border-style: hidden outset hidden hidden; }
html body ${wrapper_id} table[frame="hsides"] { border-style: outset hidden; }
html body ${wrapper_id} table[frame="vsides"] { border-style: hidden outset; }
html body ${wrapper_id} table[frame="box"],
html body ${wrapper_id} table[frame="border"] { border-style: outset; }

 
/* Internal Table Borders */

  /* 'border' cell borders first */

html body ${wrapper_id} table:-moz-table-border-nonzero > * > tr > td,
html body ${wrapper_id} table:-moz-table-border-nonzero > * > tr > th,
html body ${wrapper_id} table:-moz-table-border-nonzero > * > td,
html body ${wrapper_id} table:-moz-table-border-nonzero > * > th,
html body ${wrapper_id} table:-moz-table-border-nonzero > td,
html body ${wrapper_id} table:-moz-table-border-nonzero > th
{
  border-width: thin;
  border-style: inset;
}

/* collapse only if rules are really specified */
html body ${wrapper_id} table[rules]:not([rules="none"]):not([rules=""]) {
  border-collapse: collapse;
}

/* only specified rules override 'border' settings  
  (increased specificity to achieve this) */
html body ${wrapper_id} table[rules]:not([rules=""])> tr > td,
html body ${wrapper_id} table[rules]:not([rules=""])> * > tr > td,
html body ${wrapper_id} table[rules]:not([rules=""])> tr > th,
html body ${wrapper_id} table[rules]:not([rules=""])> * > tr > th,
html body ${wrapper_id} table[rules]:not([rules=""])> td,
html body ${wrapper_id} table[rules]:not([rules=""])> th
{
  border-width: thin;
  border-style: none;
}


html body ${wrapper_id} table[rules][rules="none"]  > tr > td,
html body ${wrapper_id} table[rules][rules="none"] > * > tr > td,
html body ${wrapper_id} table[rules][rules="none"] > tr > th,
html body ${wrapper_id} table[rules][rules="none"] > * > tr > th,
html body ${wrapper_id} table[rules][rules="none"] > td,
html body ${wrapper_id} table[rules][rules="none"] > th
{
  border-width: thin;
  border-style: none;
}

html body ${wrapper_id} table[rules][rules="all"] > tr > td,
html body ${wrapper_id} table[rules][rules="all"] > * > tr > td,
html body ${wrapper_id} table[rules][rules="all"] > tr > th,
html body ${wrapper_id} table[rules][rules="all"] > * > tr > th,
html body ${wrapper_id} table[rules][rules="all"] > td,
html body ${wrapper_id} table[rules][rules="all"] > th 
{
  border-width: thin;
  border-style: solid;
}

html body ${wrapper_id} table[rules][rules="rows"] > tr,
html body ${wrapper_id} table[rules][rules="rows"] > * > tr {
  border-block-start-width: thin;
  border-block-end-width: thin;
  border-block-start-style: solid;
  border-block-end-style: solid;
}


html body ${wrapper_id} table[rules][rules="cols"] > tr > td,
html body ${wrapper_id} table[rules][rules="cols"] > * > tr > td,
html body ${wrapper_id} table[rules][rules="cols"] > tr > th,
html body ${wrapper_id} table[rules][rules="cols"] > * > tr > th {
  border-inline-start-width: thin;
  border-inline-end-width: thin;
  border-inline-start-style: solid;
  border-inline-end-style: solid;
}

html body ${wrapper_id} table[rules][rules="groups"] > colgroup {
  border-inline-start-width: thin;
  border-inline-end-width: thin;
  border-inline-start-style: solid;
  border-inline-end-style: solid;
}
html body ${wrapper_id} table[rules][rules="groups"] > tfoot,
html body ${wrapper_id} table[rules][rules="groups"] > thead,
html body ${wrapper_id} table[rules][rules="groups"] > tbody {
  border-block-start-width: thin;
  border-block-end-width: thin;
  border-block-start-style: solid;
  border-block-start-style: solid;
}
  
  
/* caption inherits from table not table-outer */  
html body ${wrapper_id} caption {
  display: table-caption;
  text-align: center;
}

html body ${wrapper_id} table[align="center"] > caption {
  margin-inline-start: auto;
  margin-inline-end: auto;
}

html body ${wrapper_id} table[align="center"] > caption[align="left"]:dir(ltr) {
  margin-inline-end: 0;
}
html body ${wrapper_id} table[align="center"] > caption[align="left"]:dir(rtl) {
  margin-inline-start: 0;
}

html body ${wrapper_id} table[align="center"] > caption[align="right"]:dir(ltr) {
  margin-inline-start: 0;
}
html body ${wrapper_id} table[align="center"] > caption[align="right"]:dir(rtl) {
  margin-inline-end: 0;
}

html body ${wrapper_id} tr {
  display: table-row;
  vertical-align: inherit;
}

html body ${wrapper_id} col {
  display: table-column;
}

html body ${wrapper_id} colgroup {
  display: table-column-group;
}

html body ${wrapper_id} tbody {
  display: table-row-group;
  vertical-align: middle;
}

html body ${wrapper_id} thead {
  display: table-header-group;
  vertical-align: middle;
}

html body ${wrapper_id} tfoot {
  display: table-footer-group;
  vertical-align: middle;
}

/* for XHTML tables without tbody */
html body ${wrapper_id} table > tr {
  vertical-align: middle;
}

html body ${wrapper_id} td { 
  display: table-cell;
  vertical-align: inherit;
  text-align: inherit; 
  padding: 1px;
}

html body ${wrapper_id} th {
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
  padding: 1px;
}

html body ${wrapper_id} tr > form:-moz-is-html, tbody > form:-moz-is-html,
html body ${wrapper_id} thead > form:-moz-is-html, tfoot > form:-moz-is-html,
html body ${wrapper_id} table > form:-moz-is-html {
  /* Important: don't show these forms in HTML */
  display: none !important;
}

html body ${wrapper_id} table[bordercolor] > tbody,
html body ${wrapper_id} table[bordercolor] > thead,
html body ${wrapper_id} table[bordercolor] > tfoot,
html body ${wrapper_id} table[bordercolor] > col,
html body ${wrapper_id} table[bordercolor] > colgroup,
html body ${wrapper_id} table[bordercolor] > tr,
html body ${wrapper_id} table[bordercolor] > * > tr,
html body ${wrapper_id} table[bordercolor]  > tr > td,
html body ${wrapper_id} table[bordercolor] > * > tr > td,
html body ${wrapper_id} table[bordercolor]  > tr > th,
html body ${wrapper_id} table[bordercolor] > * > tr > th {
  border-color: inherit;
}

/* inlines */

html body ${wrapper_id} q:before {
  content: open-quote;
}

html body ${wrapper_id} q:after {
  content: close-quote;
}

html body ${wrapper_id} b, html body ${wrapper_id} strong {
  font-weight: bolder;
}

html body ${wrapper_id} i, html body ${wrapper_id} cite, html body ${wrapper_id} em, html body ${wrapper_id} var, html body ${wrapper_id} dfn {
  font-style: italic;
}

html body ${wrapper_id} tt, html body ${wrapper_id} code, html body ${wrapper_id} kbd, html body ${wrapper_id} samp {
  font-family: -moz-fixed;
}

html body ${wrapper_id} u, html body ${wrapper_id} ins {
  text-decoration: underline;
}

html body ${wrapper_id} s, html body ${wrapper_id} strike, html body ${wrapper_id} del {
  text-decoration: line-through;
}

html body ${wrapper_id} big {
  font-size: larger;
}

html body ${wrapper_id} small {
  font-size: smaller;
}

html body ${wrapper_id} sub {
  vertical-align: sub;
  font-size: smaller;
  line-height: normal;
}

html body ${wrapper_id} sup {
  vertical-align: super;
  font-size: smaller;
  line-height: normal;
}

html body ${wrapper_id} nobr {
  white-space: nowrap;
}

html body ${wrapper_id} mark {
  background: yellow;
  color: black;
}

/* titles */
html body ${wrapper_id} abbr[title], acronym[title] {
  text-decoration: dotted underline;
}

/* lists */

html body ${wrapper_id} ul, html body ${wrapper_id} menu, html body ${wrapper_id} dir {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

html body ${wrapper_id} menu[type="context"] {
  display: none !important;
}

html body ${wrapper_id} ol {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

html body ${wrapper_id} li {
  display: list-item;
  text-align: match-parent;
}

/* nested lists have no top/bottom margins */
:-moz-any(ul, ol, dir, menu, dl) ul,
:-moz-any(ul, ol, dir, menu, dl) ol,
:-moz-any(ul, ol, dir, menu, dl) dir,
:-moz-any(ul, ol, dir, menu, dl) menu,
:-moz-any(ul, ol, dir, menu, dl) dl {
  margin-block-start: 0;
  margin-block-end: 0;
}

/* 2 deep unordered lists use a circle */
:-moz-any(ol, ul, menu, dir) ul,
:-moz-any(ol, ul, menu, dir) menu,
:-moz-any(ol, ul, menu, dir) dir {
  list-style-type: circle;
}

/* 3 deep (or more) unordered lists use a square */
:-moz-any(ol, ul, menu, dir) :-moz-any(ol, ul, menu, dir) ul,
:-moz-any(ol, ul, menu, dir) :-moz-any(ol, ul, menu, dir) menu,
:-moz-any(ol, ul, menu, dir) :-moz-any(ol, ul, menu, dir) dir {
  list-style-type: square;
}


/* leafs */

/* <hr> noshade and color attributes are handled completely by
 * the nsHTMLHRElement attribute mapping code
 */
html body ${wrapper_id} hr {
  display: block;
  border: 1px inset;
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
  margin-inline-start: auto;
  margin-inline-end: auto;
  color: gray;
  -moz-float-edge: margin-box;
  box-sizing: border-box;
}

html body ${wrapper_id} hr[size="1"] {
  border-style: solid none none none;
}

html body ${wrapper_id} img:-moz-broken::before, input:-moz-broken::before,
html body ${wrapper_id} img:-moz-user-disabled::before, input:-moz-user-disabled::before,
html body ${wrapper_id} img:-moz-loading::before, input:-moz-loading::before,
html body ${wrapper_id} applet:-moz-empty-except-children-with-localname(param):-moz-broken::before,
html body ${wrapper_id} applet:-moz-empty-except-children-with-localname(param):-moz-user-disabled::before {
  content: -moz-alt-content !important;
  unicode-bidi: -moz-isolate;
}

:-moz-any(object,applet):-moz-any(:-moz-broken,:-moz-user-disabled) > *|* {
  /*
    Inherit in the object's alignment so that if we aren't aligned explicitly
    we'll end up in the right place vertically.  See bug 36997.  Note that this
    is not !important because we _might_ be aligned explicitly.
  */
  vertical-align: inherit;
}

html body ${wrapper_id} img:-moz-suppressed, input:-moz-suppressed, object:-moz-suppressed,
html body ${wrapper_id} embed:-moz-suppressed, applet:-moz-suppressed {
  /*
    Set visibility too in case the page changes display.  Note that we _may_
    want to just set visibility and not display, in general, if we find that
    display:none breaks too many layouts.  And if we decide we really do want
    people to be able to right-click blocked images, etc, we need to set
    neither one, and hack the painting code.... :(
   */
  display: none !important;
  visibility: hidden !important;
}

html body ${wrapper_id} img[usemap], object[usemap] {
  color: blue;
}

html body ${wrapper_id} frameset {
  display: block ! important;
  overflow: -moz-hidden-unscrollable;
  position: static ! important;
  float: none ! important;
  border: none ! important;
}

html body ${wrapper_id} link { 
  display: none;
}

html body ${wrapper_id} frame {
  border-radius: 0 ! important;
}

html body ${wrapper_id} iframe {
  border: 2px inset;
}

html body ${wrapper_id} noframes {
  display: none;
}

html body ${wrapper_id} spacer {
  position: static ! important;
  float: none ! important;
}

html body ${wrapper_id} canvas {
  -moz-user-select: none;
}

/* focusable content: anything w/ tabindex >=0 is focusable, but we
   skip drawing a focus outline on a few things that handle it
   themselves. */
:-moz-focusring:not(input):not(button):not(select):not(textarea):not(iframe):not(frame):not(body):not(html) {
  /* Don't specify the outline-color, we should always use initial value. */
   outline: 1px dotted;
}

/* hidden elements */
html body ${wrapper_id} base, html body ${wrapper_id} basefont, html body ${wrapper_id} datalist, html body ${wrapper_id} head, html body ${wrapper_id} meta, html body ${wrapper_id} script, html body ${wrapper_id} style, html body ${wrapper_id} title,
html body ${wrapper_id} noembed, html body ${wrapper_id} param, html body ${wrapper_id} template {
   display: none;
}

html body ${wrapper_id} area {
  /* Don't give it frames other than its imageframe */
  display: none ! important;
}

html body ${wrapper_id} iframe:fullscreen {
  /* iframes in full-screen mode don't show a border. */
  border: none !important;
  padding: 0 !important;
}

/* media elements */
html body ${wrapper_id} video > xul|videocontrols, audio > xul|videocontrols {
  display: -moz-box;
  -moz-box-orient: vertical;
  -moz-binding: url("chrome://global/content/bindings/videocontrols.xml#videoControls");
}

html body ${wrapper_id} video:not([controls]) > xul|videocontrols,
html body ${wrapper_id} audio:not([controls]) > xul|videocontrols {
  visibility: hidden;
  -moz-binding: none;
}

html body ${wrapper_id} video {
  object-fit: contain;
}

html body ${wrapper_id} video > img:-moz-native-anonymous {
  /* Video poster images should render with the video element's "object-fit" &
     "object-position" properties */
  object-fit: inherit !important;
  object-position: inherit !important;
}

html body ${wrapper_id} audio:not([controls]) {
  display: none;
}

*|*::-moz-html-canvas-content {
  display: block !important;
  /* we want to be an absolute and fixed container */
  transform: translate(0) !important;
}

html body ${wrapper_id} video > .caption-box {
  position: relative;
  overflow: hidden;
}

/* details & summary */
/* Need to revert Bug 1259889 Part 2 when removing details preference. */
@supports -moz-bool-pref("dom.details_element.enabled") {
  html body ${wrapper_id} details > summary:first-of-type,
  html body ${wrapper_id} details > summary:-moz-native-anonymous {
    display: list-item;
    list-style: disclosure-closed inside;
  }

  html body ${wrapper_id} details[open] > summary:first-of-type,
  html body ${wrapper_id} details[open] > summary:-moz-native-anonymous {
    list-style-type: disclosure-open;
  }

  html body ${wrapper_id} details > summary:first-of-type > *|* {
    /* Cancel "list-style-position: inside" inherited from summary. */
    list-style-position: initial;
  }
}

/* emulation of non-standard HTML <marquee> tag */
html body ${wrapper_id} marquee {
  inline-size: -moz-available;
  display: inline-block;
  vertical-align: text-bottom;
  text-align: start;
  -moz-binding: url('chrome://xbl-marquee/content/xbl-marquee.xml#marquee-horizontal');
}

html body ${wrapper_id} marquee[direction="up"], marquee[direction="down"] {
  -moz-binding: url('chrome://xbl-marquee/content/xbl-marquee.xml#marquee-vertical');
  block-size: 200px;
}

/* PRINT ONLY rules follow */
@media print {

  html body ${wrapper_id} marquee { -moz-binding: none; }

}

/* Ruby */

html body ${wrapper_id} ruby {
  display: ruby;
}
html body ${wrapper_id} rb {
  display: ruby-base;
  white-space: nowrap;
}
html body ${wrapper_id} rp {
  display: none;
}
html body ${wrapper_id} rt {
  display: ruby-text;
}
html body ${wrapper_id} rtc {
  display: ruby-text-container;
}
html body ${wrapper_id} rtc, html body ${wrapper_id} rt {
  white-space: nowrap;
  font-size: 50%;
  -moz-min-font-size-ratio: 50%;
  line-height: 1;
%ifndef XP_WIN
  /* The widely-used Windows font Meiryo doesn't work fine with this
   * setting, so disable this on Windows. We should re-enable it once
   * Microsoft fixes this issue. See bug 1164279. */
  font-variant-east-asian: ruby;
%endif
}
html body ${wrapper_id} rtc, html body ${wrapper_id} rt {
  text-emphasis: none;
}
html body ${wrapper_id} rtc:lang(zh), html body ${wrapper_id} rt:lang(zh) {
  ruby-align: center;
}
html body ${wrapper_id} rtc:lang(zh-TW), html body ${wrapper_id} rt:lang(zh-TW) {
  font-size: 30%; /* bopomofo */
  -moz-min-font-size-ratio: 30%;
}
html body ${wrapper_id} rtc > rt {
  font-size: inherit;
}
html body ${wrapper_id} ruby, html body ${wrapper_id} rb, html body ${wrapper_id} rt, html body ${wrapper_id} rtc {
  unicode-bidi: -moz-isolate;
}

/*
 * forms.css
 */
*|html body ${wrapper_id} *::-moz-fieldset-content {
  display: block; /* nsRuleNode::ComputeDisplayData overrules this in some cases */
  unicode-bidi: inherit;
  text-overflow: inherit;
  overflow: inherit;
  overflow-clip-box: inherit;
  padding: inherit;
  block-size: 100%; /* Need this so percentage block-sizes of kids work right */
  /* Please keep the Multicol/Flex/Grid/Align sections below in sync with
     ::-moz-scrolled-content in ua.css */
  /* Multicol container */
  -moz-column-count: inherit;
  -moz-column-width: inherit;
  -moz-column-gap: inherit;
  -moz-column-rule: inherit;
  -moz-column-fill: inherit;
  /* Flex container */
  flex-direction: inherit;
  flex-wrap: inherit;
  /* Grid container */
  grid-auto-columns: inherit;
  grid-auto-rows: inherit;
  grid-auto-flow: inherit;
  grid-column-gap: inherit;
  grid-row-gap: inherit;
  grid-template-areas: inherit;
  grid-template-columns: inherit;
  grid-template-rows: inherit;
  /* CSS Align */
  align-content: inherit;
  align-items: inherit;
  justify-content: inherit;
  justify-items: inherit;
}

/* miscellaneous form elements */

html body ${wrapper_id} fieldset > legend {
  -moz-padding-start: 2px;
  -moz-padding-end: 2px;
  inline-size: -moz-fit-content;
}

html body ${wrapper_id} legend {
  display: block;
}

html body ${wrapper_id} fieldset {
  display: block;
  -moz-margin-start: 2px;
  -moz-margin-end: 2px;
  padding-block-start: 0.35em;
  padding-block-end: 0.75em;
  -moz-padding-start: 0.625em;
  -moz-padding-end: 0.625em;
  border: 2px groove ThreeDLightShadow;
}

html body ${wrapper_id} label {
  cursor: default;
}

/* default inputs, text inputs, and selects */

/* Note: Values in nsNativeTheme IsWidgetStyled function
   need to match textfield background/border values here */

html body ${wrapper_id} input {
  -moz-appearance: textfield;
  /* The sum of border and padding on block-start and block-end
     must be the same here, for buttons, and for <select> (including its
     internal padding magic) */
  padding: 1px;
  border: 2px inset ThreeDLightShadow;
  background-color: -moz-Field;
  color: -moz-FieldText;
  font: -moz-field;
  text-rendering: optimizeLegibility;
  line-height: normal;
  text-align: start;
  text-transform: none;
  word-spacing: normal;
  letter-spacing: normal;
  cursor: text;
  -moz-binding: url("chrome://global/content/platformHTMLBindings.xml#inputFields");
  text-indent: 0;
  -moz-user-select: text;
  text-shadow: none;
  overflow-clip-box: content-box;
}

html body ${wrapper_id} input > .anonymous-div,
html body ${wrapper_id} input::-moz-placeholder {
  word-wrap: normal !important;
  /* Make the line-height equal to the available height */
  line-height: -moz-block-height;
}

@-moz-document url-prefix(chrome://) {
  html body ${wrapper_id} input.uri-element-right-align:-moz-locale-dir(rtl) {
    direction: ltr !important;
    text-align: right !important;
  }

  /* Make sure that the location bar's alignment in RTL mode changes according
     to the input box direction if the user switches the text direction using
     cmd_switchTextDirection (which applies a dir attribute to the <input>). */
  html body ${wrapper_id} input.uri-element-right-align[dir=ltr]:-moz-locale-dir(rtl) {
    text-align: left !important;
  }
}

html body ${wrapper_id} textarea {
  margin-block-start: 1px;
  margin-block-end: 1px;
  border: 2px inset ThreeDLightShadow;
  /* The 1px inline padding is for parity with Win/IE */
  -moz-padding-start: 1px;
  -moz-padding-end: 1px;
  background-color: -moz-Field;
  color: -moz-FieldText;
  font: medium -moz-fixed;
  text-rendering: optimizeLegibility;
  text-align: start;
  text-transform: none;
  word-spacing: normal;
  letter-spacing: normal;
  vertical-align: text-bottom;
  cursor: text;
  resize: both;
  -moz-binding: url("chrome://global/content/platformHTMLBindings.xml#textAreas");
  -moz-appearance: textfield-multiline;
  text-indent: 0;
  -moz-user-select: text;
  text-shadow: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-clip-box: content-box;
}

html body ${wrapper_id} textarea > scrollbar {
  cursor: default;
}

html body ${wrapper_id} textarea > .anonymous-div,
html body ${wrapper_id} input > .anonymous-div,
html body ${wrapper_id} input::-moz-placeholder,
html body ${wrapper_id} textarea::-moz-placeholder {
  overflow: auto;
  border: 0px !important;
  padding: inherit !important;
  margin: 0px;
  text-decoration: inherit;
  text-decoration-color: inherit;
  text-decoration-style: inherit;
  display: inline-block;
  ime-mode: inherit;
  resize: inherit;
  -moz-control-character-visibility: visible;
  overflow-clip-box: inherit;
}

html body ${wrapper_id} input > .anonymous-div,
html body ${wrapper_id} input::-moz-placeholder {
  white-space: pre;
}

html body ${wrapper_id} input > .anonymous-div.wrap {
  white-space: pre-wrap;
}
html body ${wrapper_id} textarea > .anonymous-div.inherit-overflow,
html body ${wrapper_id} input > .anonymous-div.inherit-overflow {
  overflow: inherit;
}

html body ${wrapper_id} input::-moz-placeholder,
html body ${wrapper_id} textarea::-moz-placeholder {
  /*
   * Changing display to inline can leads to broken behaviour and will assert.
   */
  display: inline-block !important;

  /*
   * Changing resize would display a broken behaviour and will assert.
   */
  resize: none !important;

  overflow: hidden !important;

  /*
   * The placeholder should be ignored by pointer otherwise, we might have some
   * unexpected behavior like the resize handle not being selectable.
   */
  pointer-events: none !important;

  opacity: 0.54;
}

html body ${wrapper_id} textarea::-moz-placeholder {
  white-space: pre-wrap !important;
}

html body ${wrapper_id} input:-moz-read-write,
html body ${wrapper_id} textarea:-moz-read-write {
  -moz-user-modify: read-write !important;
}

html body ${wrapper_id} select {
  margin: 0;
  border-color: ThreeDLightShadow;
  background-color: -moz-Combobox;
  color: -moz-ComboboxText;
  font: -moz-list;
  /*
   * Note that the "UA !important" tests in
   * layout/style/test/test_animations.html depend on this rule, because
   * they need some UA !important rule to test.  If this changes, use a
   * different one there.
   */
  line-height: normal !important;
  white-space: nowrap !important;
  word-wrap: normal !important;
  text-align: start;
  cursor: default;
  box-sizing: border-box;
  -moz-user-select: none;
  -moz-appearance: menulist;
  border-width: 2px;
  border-style: inset;
  text-indent: 0;
  overflow: -moz-hidden-unscrollable;
  text-shadow: none;
  /* No text-decoration reaching inside, by default */
  display: inline-block;
  page-break-inside: avoid;
  overflow-clip-box: padding-box !important; /* bug 992447 */
}

/* Need the "select[size][multiple]" selector to override the settings on
   'select[size="1"]', eg if one has <select size="1" multiple> */

html body ${wrapper_id} select[size],
html body ${wrapper_id} select[multiple],
html body ${wrapper_id} select[size][multiple] {
  /* Different alignment and padding for listbox vs combobox */
  background-color: -moz-Field;
  color: -moz-FieldText;
  vertical-align: text-bottom;
  padding-block-start: 1px;
  padding-block-end: 1px;
  -moz-padding-start: 0;
  -moz-padding-end: 0;
  -moz-appearance: listbox;
}

html body ${wrapper_id} select[size="0"],
html body ${wrapper_id} select[size="1"] {
  /* Except this is not a listbox */
  background-color: -moz-Combobox;
  color: -moz-ComboboxText;
  vertical-align: baseline;
  padding: 0;
  -moz-appearance: menulist;
}

html body ${wrapper_id} select > button {
  inline-size: 12px;
  white-space: nowrap;
  position: static !important;
  background-image: url("arrow.gif") !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  -moz-appearance: menulist-button;

  /* Make sure to size correctly if the combobox has a non-auto height. */
  block-size: 100% ! important;
  box-sizing: border-box ! important;

  /*
    Make sure to align properly with the display frame.  Note that we
    want the baseline of the combobox to match the baseline of the
    display frame, so the dropmarker is what gets the vertical-align.
  */
  vertical-align: top !important;
}

html body ${wrapper_id} select > button:active {
  background-image: url("arrowd.gif") !important;
}

html body ${wrapper_id} select > button[orientation="left"] {
  background-image: url("arrow-left.gif") !important;
}

html body ${wrapper_id} select > button[orientation="right"] {
  background-image: url("arrow-right.gif") !important;
}

html body ${wrapper_id} select > button[orientation="left"]:active {
  background-image: url("arrowd-left.gif") !important;
}

html body ${wrapper_id} select > button[orientation="right"]:active {
  background-image: url("arrowd-right.gif") !important;
}

html body ${wrapper_id} select:empty {
  inline-size: 2.5em;
}

*|html body ${wrapper_id} *::-moz-display-comboboxcontrol-frame {
  overflow: -moz-hidden-unscrollable;
  /* This block-start/end padding plus the combobox block-start/end border need to
     add up to the block-start/end borderpadding of text inputs and buttons */
  padding-block-start: 1px;
  padding-block-end: 1px;
  -moz-padding-start: 4px;
  -moz-padding-end: 0;
  color: inherit;
  white-space: nowrap;
  text-align: inherit;
  -moz-user-select: none;
  /* Make sure to size correctly if the combobox has a non-auto block-size. */
  block-size: 100% ! important;
  box-sizing: border-box ! important;
  line-height: -moz-block-height;
}

html body ${wrapper_id} option {
  display: block;
  float: none !important;
  position: static !important;
  min-block-size: 1em;
  line-height: normal !important;
  -moz-user-select: none;
  text-indent: 0;
  white-space: nowrap !important;
  word-wrap: normal !important;
  text-align: match-parent;
}

html body ${wrapper_id} select > option {
  padding-block-start : 0;
  padding-block-end: 0;
  -moz-padding-start: 3px;
  -moz-padding-end: 5px;
}

html body ${wrapper_id} option:checked {
  background-color: -moz-html-cellhighlight !important;
  color: -moz-html-cellhighlighttext !important;
}

html body ${wrapper_id} select:focus > option:checked,
html body ${wrapper_id} select:focus > optgroup > option:checked {
  background-color: Highlight ! important;
  color: HighlightText ! important;
}

html body ${wrapper_id} optgroup {
  display: block;
  float: none !important;
  position: static !important;
  font: -moz-list;
  line-height: normal !important;
  font-style: italic;
  font-weight: bold;
  font-size: inherit;
  -moz-user-select: none;
  text-indent: 0;
  white-space: nowrap !important;
  word-wrap: normal !important;
}

html body ${wrapper_id} optgroup > option {
  -moz-padding-start: 20px;
  font-style: normal;
  font-weight: normal;
}

html body ${wrapper_id} optgroup:before {
  display: block;
  content: attr(label);
}

*|html body ${wrapper_id} *::-moz-dropdown-list {
  z-index: 2147483647;
  background-color: inherit;
  -moz-user-select: none;
  position: static !important;
  float: none !important;

  /*
   * We can't change the padding here, because that would affect our
   * intrinsic inline-size, since we scroll.  But at the same time, we want
   * to make sure that our inline-start border+padding matches the inline-start
   * border+padding of a combobox so that our scrollbar will line up
   * with the dropmarker.  So set our inline-start border to 2px.
   */
  border: 1px outset black !important;
  -moz-border-start-width: 2px ! important;
}

html body ${wrapper_id} input:disabled,
html body ${wrapper_id} textarea:disabled,
html body ${wrapper_id} option:disabled,
html body ${wrapper_id} optgroup:disabled,
html body ${wrapper_id} select:disabled:disabled /* Need the pseudo-class twice to have the specificity
                            be at least the same as select[size][multiple] above */
{
  -moz-user-input: disabled;
  color: GrayText;
  background-color: ThreeDLightShadow;
  cursor: inherit;
}

html body ${wrapper_id} input:disabled,
html body ${wrapper_id} textarea:disabled {
  cursor: default;
}

html body ${wrapper_id} option:disabled,
html body ${wrapper_id} optgroup:disabled {
  background-color: transparent;
}

/* hidden inputs */
html body ${wrapper_id} input[type="hidden"] {
  -moz-appearance: none;
  display: none !important;
  padding: 0;
  border: 0;
  cursor: auto;
  -moz-user-focus: ignore;
  -moz-binding: none;
}

/* image buttons */
html body ${wrapper_id} input[type="image"] {
  -moz-appearance: none;
  padding: 0;
  border: none;
  background-color: transparent;
  font-family: sans-serif;
  font-size: small;
  cursor: pointer;
  -moz-binding: none;
}

html body ${wrapper_id} input[type="image"]:disabled {
  cursor: inherit;
}

html body ${wrapper_id} input[type="image"]:-moz-focusring {
  /* Don't specify the outline-color, we should always use initial value. */
  outline: 1px dotted;
}

/* file selector */
html body ${wrapper_id} input[type="file"] {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  overflow-clip-box: padding-box;
  color: inherit;

  /* Revert rules which apply on all inputs. */
  -moz-appearance: none;
  -moz-binding: none;
  cursor: default;

  border: none;
  background-color: transparent;
  padding: 0;
}

html body ${wrapper_id} input[type="file"] > xul|label {
  min-inline-size: 12em;
  -moz-padding-start: 5px;
  text-align: match-parent;

  color: inherit;
  font-size: inherit;
  letter-spacing: inherit;

  /*
   * Force the text to have LTR directionality. Otherwise filenames containing
   * RTL characters will be reordered with chaotic results.
   */
  direction: ltr !important;
}

/* button part of file selector */
html body ${wrapper_id} input[type="file"] > button[type="button"] {
  block-size: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  cursor: inherit;
}

/* colored part of the color selector button */
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available)::-moz-color-swatch {
  width: 100%;
  height: 100%;
  min-width: 3px;
  min-height: 3px;
  -moz-margin-start: auto;
  -moz-margin-end: auto;
  box-sizing: border-box;
  border: 1px solid grey;
  display: block;
}

/* Try to make RTL <input type='file'> look nicer. */
/* TODO: find a better solution than forcing direction: ltr on all file
   input labels and remove this override -- bug 1161482 */
html body ${wrapper_id} input[type="file"]:-moz-dir(rtl) > xul|label {
  -moz-padding-start: 0px;
  -moz-padding-end: 5px;
}

/* radio buttons */
html body ${wrapper_id} input[type="radio"] {
  -moz-appearance: radio;
  margin-block-start: 3px;
  margin-block-end: 0px;
  -moz-margin-start: 5px;
  -moz-margin-end: 3px;
  border-radius: 100% !important;
}

/* check boxes */
html body ${wrapper_id} input[type="checkbox"] {
  -moz-appearance: checkbox;
  margin-block-start: 3px;
  margin-block-end: 3px;
  -moz-margin-start: 4px;
  -moz-margin-end: 3px;
  border-radius: 0 !important;
}

/* common features of radio buttons and check boxes */

/* NOTE: The width, height, border-width, and padding here must all
   add up the way nsFormControlFrame::GetIntrinsic(Width|Height)
   expects them to, or they will not come out with total width equal
   to total height on sites that set their 'width' or 'height' to 'auto'.
   (Should we maybe set !important on width and height, then?)  */
html body ${wrapper_id} input[type="radio"],
html body ${wrapper_id} input[type="checkbox"] {
  box-sizing: border-box;
  inline-size: 13px;
  block-size: 13px;
  cursor: default;
  padding: 0 !important;
  -moz-binding: none;
  /* same colors as |input| rule, but |!important| this time. */
  background-color: -moz-Field ! important;
  color: -moz-FieldText ! important;
  border: 2px inset ThreeDLightShadow ! important;
}

html body ${wrapper_id} input[type="radio"]:disabled,
html body ${wrapper_id} input[type="radio"]:disabled:active,
html body ${wrapper_id} input[type="radio"]:disabled:hover,
html body ${wrapper_id} input[type="radio"]:disabled:hover:active,
html body ${wrapper_id} input[type="checkbox"]:disabled,
html body ${wrapper_id} input[type="checkbox"]:disabled:active,
html body ${wrapper_id} input[type="checkbox"]:disabled:hover,
html body ${wrapper_id} input[type="checkbox"]:disabled:hover:active {
  padding: 1px;
  border: 1px inset ThreeDShadow ! important;
  /* same as above, but !important */
  color: GrayText ! important;
  background-color: ThreeDFace ! important;
  cursor: inherit;
}

html body ${wrapper_id} input[type="checkbox"]:-moz-focusring,
html body ${wrapper_id} input[type="radio"]:-moz-focusring {
  border-style: groove !important;
}

html body ${wrapper_id} input[type="checkbox"]:hover:active,
html body ${wrapper_id} input[type="radio"]:hover:active {
  background-color: ThreeDFace ! important;
  border-style: inset !important;
}

html body ${wrapper_id} input[type="search"] {
  box-sizing: border-box;
}

/* buttons */

/* Note: Values in nsNativeTheme IsWidgetStyled function
   need to match button background/border values here */

/* Non text-related properties for buttons: these ones are shared with
   input[type="color"] */
html body ${wrapper_id} button,
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available),
html body ${wrapper_id} input[type="reset"],
html body ${wrapper_id} input[type="button"],
html body ${wrapper_id} input[type="submit"] {
  -moz-appearance: button;
  /* The sum of border and padding on block-start and block-end
     must be the same here, for text inputs, and for <select>.  For
     buttons, make sure to include the -moz-focus-inner border/padding. */
  padding-block-start: 0px;
  -moz-padding-end: 6px;
  padding-block-end: 0px;
  -moz-padding-start: 6px;
  border: 2px outset ThreeDLightShadow;
  background-color: ButtonFace;
  cursor: default;
  box-sizing: border-box;
  -moz-user-select: none;
  -moz-binding: none;
}

/* Text-related properties for buttons: these ones are not shared with
   input[type="color"] */
html body ${wrapper_id} button,
html body ${wrapper_id} input[type="reset"],
html body ${wrapper_id} input[type="button"],
html body ${wrapper_id} input[type="submit"] {
  color: ButtonText;
  font: -moz-button;
  line-height: normal;
  white-space: pre;
  text-align: center;
  text-shadow: none;
  overflow-clip-box: padding-box;
}

html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available) {
  inline-size: 64px;
  block-size: 23px;
}

html body ${wrapper_id} button {
  /* Buttons should lay out like "normal" html, mostly */
  white-space: inherit;
  text-indent: 0;
  /* But no text-decoration reaching inside, by default */
  display: inline-block;
}

*|html body ${wrapper_id} *::-moz-button-content {
  display: block;
}

html body ${wrapper_id} button:hover,
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available):hover,
html body ${wrapper_id} input[type="reset"]:hover,
html body ${wrapper_id} input[type="button"]:hover,
html body ${wrapper_id} input[type="submit"]:hover {
  background-color: -moz-buttonhoverface;
}

html body ${wrapper_id} button:hover,
html body ${wrapper_id} input[type="reset"]:hover,
html body ${wrapper_id} input[type="button"]:hover,
html body ${wrapper_id} input[type="submit"]:hover {
  color: -moz-buttonhovertext;
}

html body ${wrapper_id} button:active:hover,
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available):active:hover,
html body ${wrapper_id} input[type="reset"]:active:hover,
html body ${wrapper_id} input[type="button"]:active:hover,
html body ${wrapper_id} input[type="submit"]:active:hover {
  padding-block-start: 0px;
  -moz-padding-end: 5px;
  padding-block-end: 0px;
  -moz-padding-start: 7px;
  border-style: inset;
  background-color: ButtonFace;
}

html body ${wrapper_id} button:active:hover,
html body ${wrapper_id} input[type="reset"]:active:hover,
html body ${wrapper_id} input[type="button"]:active:hover,
html body ${wrapper_id} input[type="submit"]:active:hover {
  color: ButtonText;
}

html body ${wrapper_id} button::-moz-focus-inner,
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available)::-moz-focus-inner,
html body ${wrapper_id} input[type="reset"]::-moz-focus-inner,
html body ${wrapper_id} input[type="button"]::-moz-focus-inner,
html body ${wrapper_id} input[type="submit"]::-moz-focus-inner,
html body ${wrapper_id} input[type="file"] > button[type="button"]::-moz-focus-inner {
  padding-block-start: 0px;
  -moz-padding-end: 2px;
  padding-block-end: 0px;
  -moz-padding-start: 2px;
  border: 1px dotted transparent;
}

html body ${wrapper_id} button:-moz-focusring::-moz-focus-inner,
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available):-moz-focusring::-moz-focus-inner,
html body ${wrapper_id} input[type="reset"]:-moz-focusring::-moz-focus-inner,
html body ${wrapper_id} input[type="button"]:-moz-focusring::-moz-focus-inner,
html body ${wrapper_id} input[type="submit"]:-moz-focusring::-moz-focus-inner,
html body ${wrapper_id} input[type="file"] > button[type="button"]:-moz-focusring::-moz-focus-inner {
  border-color: ButtonText;
}

html body ${wrapper_id} button:disabled:active, button:disabled,
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available):disabled:active,
html body ${wrapper_id} input[type="color"]:-moz-system-metric(color-picker-available):disabled,
html body ${wrapper_id} input[type="reset"]:disabled:active,
html body ${wrapper_id} input[type="reset"]:disabled,
html body ${wrapper_id} input[type="button"]:disabled:active,
html body ${wrapper_id} input[type="button"]:disabled,
html body ${wrapper_id} select:disabled > button,
html body ${wrapper_id} select:disabled > button,
html body ${wrapper_id} input[type="submit"]:disabled:active,
html body ${wrapper_id} input[type="submit"]:disabled {
  /* The sum of border and padding on block-start and block-end
     must be the same here and for text inputs */
  padding-block-start: 0px;
  -moz-padding-end: 6px;
  padding-block-end: 0px;
  -moz-padding-start: 6px;
  border: 2px outset ThreeDLightShadow;
  cursor: inherit;
}

html body ${wrapper_id} button:disabled:active, button:disabled,
html body ${wrapper_id} input[type="reset"]:disabled:active,
html body ${wrapper_id} input[type="reset"]:disabled,
html body ${wrapper_id} input[type="button"]:disabled:active,
html body ${wrapper_id} input[type="button"]:disabled,
html body ${wrapper_id} select:disabled > button,
html body ${wrapper_id} select:disabled > button,
html body ${wrapper_id} input[type="submit"]:disabled:active,
html body ${wrapper_id} input[type="submit"]:disabled {
  color: GrayText;
}

 /*
  * Make form controls inherit 'unicode-bidi' transparently as required by
  *  their various anonymous descendants and pseudo-elements:
  *
  * <textarea> and <input type="text">:
  *  inherit into the XULScroll frame with class 'anonymous-div' which is a
  *  child of the text control.
  *
  * Buttons (either <button>, <input type="submit">, <input type="button">
  *          or <input type="reset">)
  *  inherit into the ':-moz-button-content' pseudo-element.
  *
  * <select>:
  *  inherit into the ':-moz-display-comboboxcontrol-frame' pseudo-element and
  *  the <optgroup>'s ':before' pseudo-element, which is where the label of
  *  the <optgroup> gets displayed. The <option>s don't use anonymous boxes,
  *  so they need no special rules.
  */
html body ${wrapper_id} textarea > .anonymous-div,
html body ${wrapper_id} input > .anonymous-div,
html body ${wrapper_id} input::-moz-placeholder,
html body ${wrapper_id} textarea::-moz-placeholder,
*|html body ${wrapper_id} *::-moz-button-content,
*|html body ${wrapper_id} *::-moz-display-comboboxcontrol-frame,
html body ${wrapper_id} optgroup:before {
  unicode-bidi: inherit;
  text-overflow: inherit;
}

/**
 * Set default style for invalid elements.
 */
html body ${wrapper_id} :not(output):-moz-ui-invalid {
  box-shadow: 0 0 1.5px 1px red;
}

html body ${wrapper_id} :not(output):-moz-ui-invalid:-moz-focusring {
  box-shadow: 0 0 2px 2px rgba(255,0,0,0.4);
}

html body ${wrapper_id} output:-moz-ui-invalid {
  color: red;
}

@media print {
  html body ${wrapper_id} input, html body ${wrapper_id} textarea, html body ${wrapper_id} select, html body ${wrapper_id} button {
    -moz-user-input: none !important;
  }

  html body ${wrapper_id} input[type="file"] { height: 2em; }
}

html body ${wrapper_id} progress {
  -moz-appearance: progressbar;
  display: inline-block;
  vertical-align: -0.2em;

  /* Default style in case of there is -moz-appearance: none; */
  border: 2px solid;
  /* #e6e6e6 is a light gray. */
  -moz-border-top-colors: ThreeDShadow #e6e6e6;
  -moz-border-right-colors: ThreeDHighlight #e6e6e6;
  -moz-border-bottom-colors: ThreeDHighlight #e6e6e6;
  -moz-border-left-colors: ThreeDShadow #e6e6e6;
  background-color: #e6e6e6;
}

html body ${wrapper_id} ::-moz-progress-bar {
  /* Prevent styling that would change the type of frame we construct. */
  display: inline-block ! important;
  float: none ! important;
  position: static ! important;
  overflow: visible ! important;
  box-sizing: border-box ! important;

  -moz-appearance: progresschunk;
  height: 100%;
  width: 100%;

  /* Default style in case of there is -moz-appearance: none; */
  background-color: #0064b4; /* blue */
}

html body ${wrapper_id} meter {
  -moz-appearance: meterbar;
  display: inline-block;
  vertical-align: -0.2em;

  background: linear-gradient(#e6e6e6, #e6e6e6, #eeeeee 20%, #cccccc 45%, #cccccc 55%);
}

html body ${wrapper_id} ::-moz-meter-bar {
  /* Block styles that would change the type of frame we construct. */
  display: inline-block ! important;
  float: none ! important;
  position: static ! important;
  overflow: visible ! important;

  -moz-appearance: meterchunk;
  height: 100%;
  width: 100%;
}

html body ${wrapper_id} :-moz-meter-optimum::-moz-meter-bar {
  /* green. */
  background: linear-gradient(#ad7, #ad7, #cea 20%, #7a3 45%, #7a3 55%);
}
html body ${wrapper_id} :-moz-meter-sub-optimum::-moz-meter-bar {
  /* orange. */
  background: linear-gradient(#fe7, #fe7, #ffc 20%, #db3 45%, #db3 55%);
}
html body ${wrapper_id} :-moz-meter-sub-sub-optimum::-moz-meter-bar {
  /* red. */
  background: linear-gradient(#f77, #f77, #fcc 20%, #d44 45%, #d44 55%);
}

html body ${wrapper_id} input[type=range] {
  -moz-appearance: range;
  display: inline-block;
  inline-size: 12em;
  block-size: 1.3em;
  -moz-margin-start: 0.7em;
  -moz-margin-end: 0.7em;
  margin-block-start: 0;
  margin-block-end: 0;
  /* Override some rules that apply on all input types: */
  cursor: default;
  background: none;
  border: none;
  -moz-binding: none; /* we don't want any of platformHTMLBindings.xml#inputFields */
  /* Prevent nsFrame::HandlePress setting mouse capture to this element. */
  -moz-user-select: none ! important;
}

html body ${wrapper_id} input[type=range][orient=block] {
  inline-size: 1.3em;
  block-size: 12em;
  -moz-margin-start: 0;
  -moz-margin-end: 0;
  margin-block-start: 0.7em;
  margin-block-end: 0.7em;
}

html body ${wrapper_id} input[type=range][orient=horizontal] {
  width: 12em;
  height: 1.3em;
  margin: 0 0.7em;
}

html body ${wrapper_id} input[type=range][orient=vertical] {
  width: 1.3em;
  height: 12em;
  margin: 0.7em 0;
}

/**
 * Ideally we'd also require :-moz-focusring here, but that doesn't currently
 * work. Instead we only use the -moz-focus-outer border style if
 * NS_EVENT_STATE_FOCUSRING is set (the check is in
 * nsRangeFrame::BuildDisplayList).
 */
html body ${wrapper_id} input[type=range]::-moz-focus-outer {
  border: 1px dotted black;
}

/**
 * Layout handles positioning of this pseudo-element specially (so that content
 * authors can concentrate on styling the thumb without worrying about the
 * logic to position it). Specifically the 'margin', 'top' and 'left'
 * properties are ignored.
 *
 * If content authors want to have a vertical range, they will also need to
 * set the width/height of this pseudo-element.
 */
html body ${wrapper_id} input[type=range]::-moz-range-track {
  /* Prevent styling that would change the type of frame we construct. */
  display: inline-block !important;
  float: none !important;
  position: static !important;
  border: none;
  background-color: #999;
  inline-size: 100%;
  block-size: 0.2em;
  /* Prevent nsFrame::HandlePress setting mouse capture to this element. */
  -moz-user-select: none ! important;
}

html body ${wrapper_id} input[type=range][orient=block]::-moz-range-track {
  inline-size: 0.2em;
  block-size: 100%;
}

html body ${wrapper_id} input[type=range][orient=horizontal]::-moz-range-track {
  width: 100%;
  height: 0.2em;
}

html body ${wrapper_id} input[type=range][orient=vertical]::-moz-range-track {
  width: 0.2em;
  height: 100%;
}

/**
 * Layout handles positioning of this pseudo-element specially (so that content
 * authors can concentrate on styling this pseudo-element without worrying
 * about the logic to position it). Specifically the 'margin', 'top' and 'left'
 * properties are ignored. Additionally, if the range is horizontal, the width
 * property is ignored, and if the range range is vertical, the height property
 * is ignored.
 */
html body ${wrapper_id} input[type=range]::-moz-range-progress {
  /* Prevent styling that would change the type of frame we construct. */
  display: inline-block !important;
  float: none !important;
  position: static !important;
  /* Since one of width/height will be ignored, this just sets the "other"
     dimension.
   */
  width: 0.2em;
  height: 0.2em;
  /* Prevent nsFrame::HandlePress setting mouse capture to this element. */
  -moz-user-select: none ! important;
}

/**
 * Layout handles positioning of this pseudo-element specially (so that content
 * authors can concentrate on styling the thumb without worrying about the
 * logic to position it). Specifically the 'margin', 'top' and 'left'
 * properties are ignored.
 */
html body ${wrapper_id} input[type=range]::-moz-range-thumb {
  /* Native theming is atomic for range. Set -moz-appearance on the range
   * to get rid of it. The thumb's -moz-appearance is fixed.
   */
  -moz-appearance: range-thumb !important;
  /* Prevent styling that would change the type of frame we construct. */
  display: inline-block !important;
  float: none !important;
  position: static !important;
  width: 1em;
  height: 1em;
  border: 0.1em solid #999;
  border-radius: 0.5em;
  background-color: #F0F0F0;
  /* Prevent nsFrame::HandlePress setting mouse capture to this element. */
  -moz-user-select: none ! important;
}

/* As a temporary workaround until bug 677302 the rule for input[type=number]
 * has moved to number-control.css
 */

html body ${wrapper_id} input[type=number]::-moz-number-wrapper {
  /* Prevent styling that would change the type of frame we construct. */
  display: flex;
  float: none !important;
  position: static !important;
  block-size: 100%;
}

html body ${wrapper_id} input[type=number]::-moz-number-text {
  display: block; /* Flex items must be block-level. Normally we do fixup in
                     the style system to ensure this, but that fixup is disabled
                     inside of form controls. So, we hardcode display here. */
  -moz-appearance: none;
  /* work around autofocus bug 939248 on initial load */
  -moz-user-modify: read-write;
  /* This pseudo-element is also an 'input' element (nested inside and
   * distinct from the <input type=number> element) so we need to prevent the
   * explicit setting of 'text-align' by the general CSS rule for 'input'
   * above. We want to inherit its value from its <input type=number>
   * ancestor, not have that general CSS rule reset it.
   */
  text-align: inherit;
  flex: 1;
  min-inline-size: 0;
  padding: 0;
  border: 0;
  margin: 0;
}

html body ${wrapper_id} input[type=number]::-moz-number-spin-box {
  writing-mode: horizontal-tb;
  display: flex;
  flex-direction: column;
  /* The Window's Theme's spin buttons have a very narrow minimum width, so
   * make it something reasonable:
   */
  width: 16px;
  /* If the spin-box has auto height, it ends up enlarging the default height
   * of the control, so we limit it to 1em here. The height doesn't affect
   * the rendering of the spinner-buttons; it's only for layout purposes.
   *
   * This is a temporary hack until we implement better positioning for the
   * spin-box in vertical mode; it works OK at default size but less well
   * if the font-size is made substantially larger or smaller. (Bug 1175074.)
   */
  max-height: 1em;
  align-self: center;
  justify-content: center;
}

html body ${wrapper_id} input[type=number]::-moz-number-spin-up {
  -moz-appearance: spinner-upbutton;
  display: block; /* bug 926670 */
  flex: none;
  cursor: default;
  /* Style for when native theming is off: */
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="5"><path d="M1,4 L3,0 5,4" fill="dimgrey"/></svg>');
  background-repeat: no-repeat;
  background-position: center bottom;
  border: 1px solid darkgray;
  border-bottom: none;
  /* [JK] I think the border-*-*-radius properties here can remain physical,
     as we probably don't want to turn the spinner sideways in vertical writing mode */
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

html body ${wrapper_id} input[type=number]::-moz-number-spin-down {
  -moz-appearance: spinner-downbutton;
  display: block; /* bug 926670 */
  flex: none;
  cursor: default;
  /* Style for when native theming is off: */
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="5"><path d="M1,1 L3,5 5,1" fill="dimgrey"/></svg>');
  background-repeat: no-repeat;
  background-position: center top;
  border: 1px solid darkgray;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

html body ${wrapper_id} input[type="number"] > div > div > div:hover {
  /* give some indication of hover state for the up/down buttons */
  background-color: lightblue;
}

/*
 * ua.css
 */
 /* Tables */

*|html body ${wrapper_id} *::-moz-table {
  display: table !important;
  box-sizing: border-box; /* XXX do we really want this? */
}

*|html body ${wrapper_id} *::-moz-inline-table {
  display: inline-table !important;
  box-sizing: border-box; /* XXX do we really want this? */
}

*|html body ${wrapper_id} *::-moz-table-outer {
  display: inherit !important; /* table or inline-table */
  margin: inherit ! important;
  padding: 0 ! important;
  border: none ! important;
  float: inherit;
  clear: inherit;
  position: inherit;
  top: inherit;
  right: inherit;
  bottom: inherit;
  left: inherit;
  z-index: inherit;
  page-break-before: inherit;
  page-break-after: inherit;
  page-break-inside: inherit;
  vertical-align: inherit; /* needed for inline-table */
  line-height: inherit; /* needed for vertical-align on inline-table */
  align-self: inherit;
  justify-self: inherit;
  order: inherit;   /* needed for "order" to work on table flex/grid items */
  /* Bug 722777 */
  transform: inherit;
  transform-origin: inherit;
  /* Bug 724750 */
  backface-visibility: inherit;
  clip: inherit;
}

*|html body ${wrapper_id} *::-moz-table-row {
  display: table-row !important;
}

/* The ::-moz-table-column pseudo-element is for extra columns at the end
   of a table. */
*|html body ${wrapper_id} *::-moz-table-column {
  display: table-column !important;
}

*|html body ${wrapper_id} *::-moz-table-column-group {
  display: table-column-group !important;
}

*|html body ${wrapper_id} *::-moz-table-row-group {
  display: table-row-group !important;
}

*|html body ${wrapper_id} *::-moz-table-cell {
  display: table-cell !important;
  white-space: inherit;
}

/* Ruby */
*|html body ${wrapper_id} *::-moz-ruby {
  display: ruby;
  unicode-bidi: -moz-isolate;
}
*|html body ${wrapper_id} *::-moz-ruby-base {
  display: ruby-base;
  unicode-bidi: -moz-isolate;
}
*|html body ${wrapper_id} *::-moz-ruby-text {
  display: ruby-text;
  unicode-bidi: -moz-isolate;
}
*|html body ${wrapper_id} *::-moz-ruby-base-container {
  display: ruby-base-container;
  unicode-bidi: -moz-isolate;
}
*|html body ${wrapper_id} *::-moz-ruby-text-container {
  display: ruby-text-container;
  unicode-bidi: -moz-isolate;
}

/* Lists */

*|html body ${wrapper_id} *::-moz-list-bullet, *|html body ${wrapper_id} *::-moz-list-number {
  display: inline;
  vertical-align: baseline;
  font-variant-numeric: tabular-nums;
}

/* SVG documents don't always load this file but they do have links.
 * If you change the link rules, consider carefully whether to make
 * the same changes to svg.css.
 */

/* Links */

*|html body ${wrapper_id} *:-moz-any-link {
  cursor: pointer;
}

*|html body ${wrapper_id} *:-moz-any-link:-moz-focusring {
  /* Don't specify the outline-color, we should always use initial value. */
  outline: 1px dotted;
}

/* Miscellaneous */

*|html body ${wrapper_id} *::-moz-anonymous-block, *|html body ${wrapper_id} *::-moz-cell-content {
  display: block !important;
  position: static !important;
  unicode-bidi: inherit;
  text-overflow: inherit;
  overflow-clip-box: inherit;
}

*|html body ${wrapper_id} *::-moz-anonymous-block, *|html body ${wrapper_id} *::-moz-anonymous-positioned-block {
  /* we currently inherit from the inline that is split */
  outline: inherit;
  outline-offset: inherit;
  clip-path: inherit;
  filter: inherit;
  mask: inherit;
  opacity: inherit;
  text-decoration: inherit;
  -moz-box-ordinal-group: inherit !important;
  overflow-clip-box: inherit;
}

*|html body ${wrapper_id} *::-moz-xul-anonymous-block {
  display: block ! important;
  position: static ! important;
  float: none ! important;
  -moz-box-ordinal-group: inherit !important;
  text-overflow: inherit;
  overflow-clip-box: inherit;
}

*|html body ${wrapper_id} *::-moz-scrolled-content, *|html body ${wrapper_id} *::-moz-scrolled-canvas,
*|html body ${wrapper_id} *::-moz-scrolled-page-sequence {
  /* e.g., text inputs, select boxes */
  padding: inherit;
  /* The display doesn't affect the kind of frame constructed here.  This just
     affects auto-width sizing of the block we create. */
  display: block;
  -moz-box-orient: inherit;
  /* make unicode-bidi inherit, otherwise it has no effect on text inputs and
     blocks with overflow: scroll; */
  unicode-bidi: inherit;
  text-overflow: inherit;
  /* Please keep the Multicol/Flex/Grid/Align sections below in sync with
     ::-moz-fieldset-content in forms.css */
  /* Multicol container */
  -moz-column-count: inherit;
  -moz-column-width: inherit;
  -moz-column-gap: inherit;
  -moz-column-rule: inherit;
  -moz-column-fill: inherit;
  /* Flex container */
  flex-direction: inherit;
  flex-wrap: inherit;
  /* Grid container */
  grid-auto-columns: inherit;
  grid-auto-rows: inherit;
  grid-auto-flow: inherit;
  grid-column-gap: inherit;
  grid-row-gap: inherit;
  grid-template-areas: inherit;
  grid-template-columns: inherit;
  grid-template-rows: inherit;
  /* CSS Align */
  align-content: inherit;
  align-items: inherit;
  justify-content: inherit;
  justify-items: inherit;
  /* Do not change these. nsCSSFrameConstructor depends on them to create a good
     frame tree. */
  position: static !important;
  float: none !important;
  overflow-clip-box: inherit;
}

*|html body ${wrapper_id} *::-moz-viewport, *|html body ${wrapper_id} *::-moz-viewport-scroll, *|html body ${wrapper_id} *::-moz-canvas, *|html body ${wrapper_id} *::-moz-scrolled-canvas {
  display: block !important;
  background-color: inherit;
}

*|html body ${wrapper_id} *::-moz-viewport-scroll {
  overflow: auto;
  resize: both;
}

*|html body ${wrapper_id} *::-moz-column-content {
  /* the column boxes inside a column-flowed block */
  /* make unicode-bidi inherit, otherwise it has no effect on column boxes */
  unicode-bidi: inherit;
  text-overflow: inherit;
  /* inherit the outer frame's display, otherwise we turn into an inline */
  display: inherit !important;
  /* Carry through our parent's height so that %-height children get
  their heights set */
  height: 100%;
}

*|html body ${wrapper_id} *::-moz-anonymous-flex-item,
*|html body ${wrapper_id} *::-moz-anonymous-grid-item {
  /* Anonymous blocks that wrap contiguous runs of text
   * inside of a flex or grid container. */
  display: block;
}

*|html body ${wrapper_id} *::-moz-page-sequence, *|html body ${wrapper_id} *::-moz-scrolled-page-sequence {
  /* Collection of pages in print/print preview. Visual styles may only appear
   * in print preview. */
  display: block !important;
  background: linear-gradient(#606060, #8a8a8a) fixed;
  height: 100%;
}

*|html body ${wrapper_id} *::-moz-page {
  /* Individual page in print/print preview. Visual styles may only appear
   * in print preview. */
  display: block !important;
  background: white;
  box-shadow: 5px 5px 8px #202020;
  margin: 0.125in 0.25in;
}

*|html body ${wrapper_id} *::-moz-pagecontent {
  display: block !important;
  margin: auto;
}

*|html body ${wrapper_id} *::-moz-pagebreak {
  display: block !important;
}

*|html body ${wrapper_id} *::-moz-anonymous-positioned-block {
  display: block !important;
  position: inherit; /* relative or sticky */
  top: inherit;
  left: inherit;
  bottom: inherit;
  right: inherit;
  z-index: inherit;
  clip: inherit;
  opacity: inherit;
  unicode-bidi: inherit;
  text-overflow: inherit;
}

/* Printing */

@media print {

  html body ${wrapper_id} * {
    cursor: default !important;
  }

}

*|html body ${wrapper_id} *:fullscreen:not(:root) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  box-sizing: border-box !important;
  object-fit: contain !important;
  transform: none !important;
}

/* Selectors here should match the check in
 * nsViewportFrame.cpp:ShouldInTopLayerForFullscreen() */
*|html body ${wrapper_id} *:fullscreen:not(:root):not(:-moz-browser-frame) {
  -moz-top-layer: top !important;
}

*|html body ${wrapper_id} *::backdrop {
  -moz-top-layer: top !important;
  display: block;
  position: fixed;
  top: 0; left: 0;
  right: 0; bottom: 0;
}

*|html body ${wrapper_id} *:-moz-full-screen:not(:root)::backdrop {
  background: black;
}

/* XML parse error reporting */

parsererror|html body ${wrapper_id} parsererror {
  display: block;
  font-family: sans-serif;
  font-weight: bold;
  white-space: pre;
  margin: 1em;
  padding: 1em;
  border-width: thin;
  border-style: inset;
  border-color: red;
  font-size: 14pt;
  background-color: lightyellow;
  color: black;
}

parsererror|html body ${wrapper_id} sourcetext {
  display: block;
  white-space: pre;
  font-family: -moz-fixed;
  margin-top: 2em;
  margin-bottom: 1em;
  color: red;
  font-weight: bold;
  font-size: 12pt;
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret,
html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret > div.image,
html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret > div.bar {
  position: absolute;
  z-index: 2147483647;
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret > div.image {
  background-position: center bottom;
  background-size: 100%;
  background-repeat: no-repeat;
  bottom: 0;
  width: 100%;
  height: 100%;

  /* Override this property in moz-custom-content-container to make dummy touch
   * listener work. */
  pointer-events: auto;
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret > div.bar {
  margin-left: 49%;
  background-color: #008aa0;
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.no-bar > div.bar {
  display: none;
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.normal > div.image {
  background-image: url("resource://gre-resources/accessiblecaret-normal@1x.png");
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.left > div.image {
  background-image: url("resource://gre-resources/accessiblecaret-tilt-left@1x.png");
  margin-left: -39%;
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.right > div.image {
  background-image: url("resource://gre-resources/accessiblecaret-tilt-right@1x.png");
  margin-left: 41%;
}

html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.none {
  display: none;
}

@media (min-resolution: 1.5dppx) {
  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.normal > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-normal@1.5x.png");
  }

  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.left > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-tilt-left@1.5x.png");
  }

  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.right > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-tilt-right@1.5x.png");
  }
}

@media (min-resolution: 2dppx) {
  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.normal > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-normal@2x.png");
  }

  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.left > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-tilt-left@2x.png");
  }

  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.right > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-tilt-right@2x.png");
  }
}

@media (min-resolution: 2.25dppx) {
  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.normal > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-normal@2.25x.png");
  }

  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.left > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-tilt-left@2.25x.png");
  }

  html body ${wrapper_id} div:-moz-native-anonymous.moz-accessiblecaret.right > div.image {
    background-image: url("resource://gre-resources/accessiblecaret-tilt-right@2.25x.png");
  }
}

/* Custom content container in the CanvasFrame, fixed positioned on top of
   everything else, not reacting to pointer events. */
html body ${wrapper_id} div:-moz-native-anonymous.moz-custom-content-container {
  pointer-events: none;
  -moz-top-layer: top;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/*
 * plaintext.css
 */
 html body ${wrapper_id} pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  -moz-control-character-visibility: visible;
}

/*
 * number-control.css
 */
 html body ${wrapper_id} input[type="number"] {
  -moz-appearance: number-input;
  /* Has to revert some properties applied by the generic input rule. */
  -moz-binding: none;
  inline-size: 20ch; /* It'd be nice if this matched the default inline-size
                        of <input type=text>, but that's not easy to achieve
                        due to platform differences. */
}

/*
 * noscript.css
 */
html body ${wrapper_id} noscript {
  display: none !important;
}

/*
 * noframes.css
 */
 html body ${wrapper_id} noframes {
  display: block;
}

html body ${wrapper_id} frame, html body ${wrapper_id} frameset, html body ${wrapper_id} iframe {
  display: none !important;
}

/*
 * mathml.css
 */
 /* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**************************************************************************/
/* namespace for MathML elements                                          */
/**************************************************************************/

@namespace url(http://www.w3.org/1998/Math/MathML);

/**************************************************************************/
/* <math> - outermost math element                                        */
/**************************************************************************/

html body ${wrapper_id} math {
  writing-mode: horizontal-tb !important;
  direction: ltr;
  unicode-bidi: embed;
  display: inline;
  font-size: inherit;
  font-style: normal;
  font-family: serif;
  line-height: normal;
  word-spacing: normal;
  letter-spacing: normal;
  text-rendering: optimizeLegibility;
  -moz-float-edge: margin-box;
  -moz-math-display: inline;
}
html body ${wrapper_id} math[mode="display"], html body ${wrapper_id} math[display="block"] {
  display: block;
  text-align: -moz-center;
  -moz-math-display: block;
}
html body ${wrapper_id} math[display="inline"] {
  display: inline;
  -moz-math-display: inline;
}
html body ${wrapper_id} math[displaystyle="false"] {
  -moz-math-display: inline;
}
html body ${wrapper_id} math[displaystyle="true"] {
  -moz-math-display: block;
}

/**************************************************************************/
/* Token elements                                                         */
/**************************************************************************/

html body ${wrapper_id} ms {
  display: inline;
}
html body ${wrapper_id} ms:before, html body ${wrapper_id} ms:after {
  content: "\\0022"
}
html body ${wrapper_id} ms[lquote]:before {
  content: attr(lquote)
}
html body ${wrapper_id} ms[rquote]:after {
  content: attr(rquote)
 }

/**************************************************************************/
/* Links                                                                  */
/**************************************************************************/
html body ${wrapper_id} :-moz-any-link {
  text-decoration: none !important;
}

/**************************************************************************/
/* attributes common to all tags                                          */
/**************************************************************************/

/* These attributes are mapped to style in nsMathMLElement.cpp:

   - background -> background                             (deprecated)
   - color -> color                                       (deprecated)
   - fontfamily -> font-family                            (deprecated)
   - fontsize -> font-size                                (deprecated)
   - fontstyle -> font-style                              (deprecated)
   - fontweight -> font-weight                            (deprecated)
   - mathvariant -> -moz-math-variant
   - scriptsizemultiplier -> -moz-script-size-multiplier
   - scriptminsize -> -moz-script-min-size
   - scriptlevel -> -moz-script-level
   - mathsize -> font-size
   - mathcolor -> color
   - mathbackground -> background

*/


/**************************************************************************/
/* merror                                                                 */
/**************************************************************************/

html body ${wrapper_id} merror {
  display: block;
  font-family: sans-serif;
  font-weight: bold;
  white-space: pre;
  margin: 1em;
  padding: 1em;
  border-width: thin;
  border-style: inset;
  border-color: red;
  font-size: 14pt;
  background-color: lightyellow;
}

/**************************************************************************/
/* mtable and its related tags                                            */
/**************************************************************************/

html body ${wrapper_id} mtable {
  display: inline-table;
  border-collapse: separate;
  border-spacing: 0;
  text-indent: 0;
}
html body ${wrapper_id} mtable[frame="none"] {
  border: none;
}
html body ${wrapper_id} mtable[frame="solid"] {
  border: solid thin;
}
html body ${wrapper_id} mtable[frame="dashed"] {
  border: dashed thin;
}

html body ${wrapper_id} mtr, html body ${wrapper_id} mlabeledtr {
  display: table-row;
  vertical-align: baseline;
}

html body ${wrapper_id} mtd {
  display: table-cell;
  vertical-align: inherit;
  text-align: -moz-center;
  white-space: nowrap;
}

/* Don't support m(labeled)tr without mtable, nor mtd without m(labeled)tr */
html body ${wrapper_id} :not(mtable) > mtr,
html body ${wrapper_id} :not(mtable) > mlabeledtr,
html body ${wrapper_id} :not(mtr):not(mlabeledtr) > mtd {
  display: none !important;
}

/* Hide the label because mlabeledtr is not supported yet (bug 356870). This
   rule can be overriden by users. */
html body ${wrapper_id} mlabeledtr > mtd:first-child {
    display: none;
}

/**********************************************************************/
/* rules to achieve the default spacing between cells. When rowspacing,
   columnspacing and framespacing aren't set on mtable.  The back-end code
   will set the internal attributes depending on the cell's position.
   When they are set, the spacing behaviour is handled outside of CSS */
html body ${wrapper_id} mtd {
  padding-right: 0.4em;  /* half of columnspacing[colindex] */
  padding-left: 0.4em;   /* half of columnspacing[colindex-1] */
  padding-bottom: 0.5ex; /* half of rowspacing[rowindex] */
  padding-top: 0.5ex;    /* half of rowspacing[rowindex-1] */
}
/* turn off the spacing at the periphery of boundary cells */
html body ${wrapper_id} mtr:first-child > mtd {
  padding-top: 0ex;
}
html body ${wrapper_id} mtr:last-child > mtd {
  padding-bottom: 0ex;
}
html body ${wrapper_id} mtd:first-child {
  -moz-padding-start: 0em;
}
html body ${wrapper_id} mtd:last-child {
  -moz-padding-end: 0em;
}
/* re-instate the spacing if the table has a surrounding frame */
html body ${wrapper_id} mtable[frame="solid"] > mtr:first-child > mtd,
html body ${wrapper_id} mtable[frame="dashed"] > mtr:first-child > mtd {
  padding-top: 0.5ex; /* framespacing.top */
}
html body ${wrapper_id} mtable[frame="solid"] > mtr:last-child > mtd,
html body ${wrapper_id} mtable[frame="dashed"] > mtr:last-child > mtd {
  padding-bottom: 0.5ex; /* framespacing.bottom */
}
html body ${wrapper_id} mtable[frame="solid"] > mtr > mtd:first-child,
html body ${wrapper_id} mtable[frame="dashed"] > mtr > mtd:first-child {
  -moz-padding-start: 0.4em; /* framespacing.left (or right in rtl)*/
}
html body ${wrapper_id} mtable[frame="solid"] > mtr > mtd:last-child,
html body ${wrapper_id} mtable[frame="dashed"] > mtr > mtd:last-child {
  -moz-padding-end: 0.4em; /* framespacing.right (or left in rtl)*/
}

html body ${wrapper_id} mtable[rowspacing] > mtr > mtd,
html body ${wrapper_id} mtable[columnspacing] > mtr > mtd,
html body ${wrapper_id} mtable[framespacing] > mtr > mtd {
  /* Spacing handled outside of CSS */
  padding: 0px;
}

/**************************************************************************/
/* This rule is used to give a style context suitable for nsMathMLChars.
   We don't actually style -moz-math-anonymous by default. */
/*
html body ${wrapper_id} ::-moz-math-anonymous {
}
*/

/**********************************************************************/
/* This is used when wrapping non-MathML inline elements inside math. */
*|html body ${wrapper_id} *::-moz-mathml-anonymous-block {
  display: inline-block !important;
  position: static !important;
  text-indent: 0;
}

/**************************************************************************/
/* Controlling Displaystyle and Scriptlevel                               */
/**************************************************************************/

/*
  http://www.w3.org/Math/draft-spec/chapter3.html#presm.scriptlevel

  The determination of -moz-math-display for <math> involves the displaystyle
  and display attributes. See the <math> section above.
*/

/*
  Map mstyle@displaystyle to -moz-math-display.
*/
html body ${wrapper_id} mstyle[displaystyle="false"] {
  -moz-math-display: inline;
}
html body ${wrapper_id} mstyle[displaystyle="true"] {
  -moz-math-display: block;
}

/*  munder, mover and munderover change the scriptlevels of their children
   using -moz-math-increment-script-level because regular CSS rules are
   insufficient to control when the scriptlevel should be incremented. All other
   cases can be described using regular CSS, so we do it this way because it's
   more efficient and less code. */
html body ${wrapper_id} :-moz-math-increment-script-level { -moz-script-level: +1; }

/*
   The mfrac element sets displaystyle to "false", or if it was already false
   increments scriptlevel by 1, within numerator and denominator.
*/   
html body ${wrapper_id} mfrac > * {
    -moz-script-level: auto;
    -moz-math-display: inline;
}

/*
   The mroot element increments scriptlevel by 2, and sets displaystyle to
   "false", within index, but leaves both attributes unchanged within base.
   The msqrt element leaves both attributes unchanged within its argument.
*/
html body ${wrapper_id} mroot > :not(:first-child) {
    -moz-script-level: +2;
    -moz-math-display: inline;
}

/*
   The msub element [...] increments scriptlevel by 1, and sets displaystyle to
   "false", within subscript, but leaves both attributes unchanged within base.

   The msup element [...] increments scriptlevel by 1, and sets displaystyle to
   "false", within superscript, but leaves both attributes unchanged within
   base.

   The msubsup element [...] increments scriptlevel by 1, and sets displaystyle
   to "false", within subscript and superscript, but leaves both attributes
   unchanged within base.

   The mmultiscripts element increments scriptlevel by 1, and sets displaystyle
   to "false", within each of its arguments except base, but leaves both
   attributes unchanged within base.
 */
html body ${wrapper_id} msub > :not(:first-child),
html body ${wrapper_id} msup > :not(:first-child),
html body ${wrapper_id} msubsup > :not(:first-child),
html body ${wrapper_id} mmultiscripts > :not(:first-child) {
    -moz-script-level: +1;
    -moz-math-display: inline;
}

/*
   The munder element [...] always sets displaystyle to "false" within the
   underscript, but increments scriptlevel by 1 only when accentunder is
   "false". Within base, it always leaves both attributes unchanged.

   The mover element [...] always sets displaystyle to "false" within
   overscript, but increments scriptlevel by 1 only when accent is "false".
   Within base, it always leaves both attributes unchanged.

   The munderover [..] always sets displaystyle to "false" within underscript
   and overscript, but increments scriptlevel by 1 only when accentunder or
   accent, respectively, are "false". Within base, it always leaves both
   attributes unchanged.
*/
html body ${wrapper_id} munder > :not(:first-child),
html body ${wrapper_id} mover > :not(:first-child),
html body ${wrapper_id} munderover > :not(:first-child) {
    -moz-math-display: inline;
}

/*
   The displaystyle attribute is allowed on the mtable element to set the
   inherited value of the attribute. If the attribute is not present, the
   mtable element sets displaystyle to "false" within the table elements.
*/
html body ${wrapper_id} mtable { -moz-math-display: inline; }
html body ${wrapper_id} mtable[displaystyle="true"] { -moz-math-display: block; }

/*
   The mscarries element sets displaystyle to "false", and increments
   scriptlevel by 1, so the children are typically displayed in a smaller font.
   XXXfredw: This element is not implemented yet. See bug 534967.
html body ${wrapper_id} mscarries {
  -moz-script-level: +1;
  -moz-math-display: inline;
}
*/

/* "The mphantom element renders invisibly, but with the same size and other
   dimensions, including baseline position, that its contents would have if
   they were rendered normally.".
   Also, we do not expose the <mphantom> element to the accessible tree
   (see bug 1108378). */
html body ${wrapper_id} mphantom {
    visibility: hidden;
}

`;
};
