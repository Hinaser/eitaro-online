const firefox_default_css = function(content_tag_id) {
    return `
${content_tag_id} address,
${content_tag_id} article,
${content_tag_id} aside,
${content_tag_id} blockquote,
${content_tag_id} body,
${content_tag_id} caption,
${content_tag_id} center,
${content_tag_id} col,
${content_tag_id} colgroup,
${content_tag_id} dd,
${content_tag_id} dir,
${content_tag_id} div,
${content_tag_id} dl,
${content_tag_id} dt,
${content_tag_id} fieldset,
${content_tag_id} figcaption,
${content_tag_id} figure,
${content_tag_id} footer,
${content_tag_id} form,
${content_tag_id} h1,
${content_tag_id} h2,
${content_tag_id} h3,
${content_tag_id} h4,
${content_tag_id} h5,
${content_tag_id} h6,
${content_tag_id} header,
${content_tag_id} hgroup,
${content_tag_id} hr,
${content_tag_id} html,
${content_tag_id} legend,
${content_tag_id} li,
${content_tag_id} listing,
${content_tag_id} main,
${content_tag_id} marquee,
${content_tag_id} menu,
${content_tag_id} nav,
${content_tag_id} noframes,
${content_tag_id} ol,
${content_tag_id} p,
${content_tag_id} plaintext,
${content_tag_id} pre,
${content_tag_id} section,
${content_tag_id} summary,
${content_tag_id} table,
${content_tag_id} tbody,
${content_tag_id} td,
${content_tag_id} tfoot,
${content_tag_id} th,
${content_tag_id} thead,
${content_tag_id} tr,
${content_tag_id} ul,
${content_tag_id} xmp {
  unicode-bidi: -moz-isolate;
}

${content_tag_id} bdi, output {
  unicode-bidi: -moz-isolate;
}
${content_tag_id} bdo, bdo[dir] {
  unicode-bidi: bidi-override;
}
${content_tag_id} bdo[dir="auto"] {
  unicode-bidi: -moz-isolate-override;
}
${content_tag_id} textarea[dir="auto"], pre[dir="auto"] { unicode-bidi: -moz-plaintext; }

/* blocks */

${content_tag_id} article,
${content_tag_id} aside,
${content_tag_id} details,
${content_tag_id} div,
${content_tag_id} dt,
${content_tag_id} figcaption,
${content_tag_id} footer,
${content_tag_id} form,
${content_tag_id} header,
${content_tag_id} hgroup,
${content_tag_id} html,
${content_tag_id} main,
${content_tag_id} nav,
${content_tag_id} section,
${content_tag_id} summary {
  display: block;
}

${content_tag_id} p, ${content_tag_id} dl, ${content_tag_id} multicol {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

${content_tag_id} dd {
  display: block;
  margin-inline-start: 40px;
}

${content_tag_id} blockquote, ${content_tag_id} figure {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 40px;
  margin-inline-end: 40px;
}

${content_tag_id} address {
  display: block;
  font-style: italic;
}

${content_tag_id} center {
  display: block;
  text-align: -moz-center;
}

${content_tag_id} blockquote[type=cite] {
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

${content_tag_id} span[_moz_quote=true] {
  color: blue;
}

${content_tag_id} pre[_moz_quote=true] {
  color: blue;
}

${content_tag_id} h1 {
  display: block;
  font-size: 2em;
  font-weight: bold;
  margin-block-start: .67em;
  margin-block-end: .67em;
}

${content_tag_id} h2,
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  margin-block-start: .83em;
  margin-block-end: .83em;
}

${content_tag_id} h3,
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 1.17em;
  font-weight: bold;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

${content_tag_id} h4,
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

${content_tag_id} h5,
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

${content_tag_id} h6,
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

${content_tag_id} listing {
  display: block;
  font-family: -moz-fixed;
  font-size: medium;
  white-space: pre;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

${content_tag_id} xmp, ${content_tag_id} pre, ${content_tag_id} plaintext {
  display: block;
  font-family: -moz-fixed;
  white-space: pre;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

/* tables */

${content_tag_id} table {
  display: table;
  border-spacing: 2px;
  border-collapse: separate;
  /* XXXldb do we want this if we're border-collapse:collapse ? */
  box-sizing: border-box;
  text-indent: 0;
}

${content_tag_id} table[align="left"] {
  float: left;
}

${content_tag_id} table[align="right"] {
  float: right;
  text-align: start;
}


/* border collapse rules */

  /* Set hidden if we have 'frame' or 'rules' attribute.
     Set it on all sides when we do so there's more consistency
     in what authors should expect */

  /* Put this first so 'border' and 'frame' rules can override it. */
${content_tag_id} table[rules] { 
  border-width: thin;
  border-style: hidden;
}

  /* 'border' before 'frame' so 'frame' overrides
      A border with a given value should, of course, pass that value
      as the border-width in pixels -> attr mapping */

  /* :-moz-table-border-nonzero is like [border]:not([border="0"]) except it
     also checks for other zero-like values according to HTML attribute
     parsing rules */
${content_tag_id} table:-moz-table-border-nonzero { 
  border-width: thin;
  border-style: outset;
}

${content_tag_id} table[frame] {
  border: thin hidden;
}

/* specificity must beat table:-moz-table-border-nonzero rule above */
${content_tag_id} table[frame="void"]   { border-style: hidden; }
${content_tag_id} table[frame="above"]  { border-style: outset hidden hidden hidden; }
${content_tag_id} table[frame="below"]  { border-style: hidden hidden outset hidden; }
${content_tag_id} table[frame="lhs"]    { border-style: hidden hidden hidden outset; }
${content_tag_id} table[frame="rhs"]    { border-style: hidden outset hidden hidden; }
${content_tag_id} table[frame="hsides"] { border-style: outset hidden; }
${content_tag_id} table[frame="vsides"] { border-style: hidden outset; }
${content_tag_id} table[frame="box"],
${content_tag_id} table[frame="border"] { border-style: outset; }

 
/* Internal Table Borders */

  /* 'border' cell borders first */

${content_tag_id} table:-moz-table-border-nonzero > * > tr > td,
${content_tag_id} table:-moz-table-border-nonzero > * > tr > th,
${content_tag_id} table:-moz-table-border-nonzero > * > td,
${content_tag_id} table:-moz-table-border-nonzero > * > th,
${content_tag_id} table:-moz-table-border-nonzero > td,
${content_tag_id} table:-moz-table-border-nonzero > th
{
  border-width: thin;
  border-style: inset;
}

/* collapse only if rules are really specified */
${content_tag_id} table[rules]:not([rules="none"]):not([rules=""]) {
  border-collapse: collapse;
}

/* only specified rules override 'border' settings  
  (increased specificity to achieve this) */
${content_tag_id} table[rules]:not([rules=""])> tr > td,
${content_tag_id} table[rules]:not([rules=""])> * > tr > td,
${content_tag_id} table[rules]:not([rules=""])> tr > th,
${content_tag_id} table[rules]:not([rules=""])> * > tr > th,
${content_tag_id} table[rules]:not([rules=""])> td,
${content_tag_id} table[rules]:not([rules=""])> th
{
  border-width: thin;
  border-style: none;
}


${content_tag_id} table[rules][rules="none"]  > tr > td,
${content_tag_id} table[rules][rules="none"] > * > tr > td,
${content_tag_id} table[rules][rules="none"] > tr > th,
${content_tag_id} table[rules][rules="none"] > * > tr > th,
${content_tag_id} table[rules][rules="none"] > td,
${content_tag_id} table[rules][rules="none"] > th
{
  border-width: thin;
  border-style: none;
}

${content_tag_id} table[rules][rules="all"] > tr > td,
${content_tag_id} table[rules][rules="all"] > * > tr > td,
${content_tag_id} table[rules][rules="all"] > tr > th,
${content_tag_id} table[rules][rules="all"] > * > tr > th,
${content_tag_id} table[rules][rules="all"] > td,
${content_tag_id} table[rules][rules="all"] > th 
{
  border-width: thin;
  border-style: solid;
}

${content_tag_id} table[rules][rules="rows"] > tr,
${content_tag_id} table[rules][rules="rows"] > * > tr {
  border-block-start-width: thin;
  border-block-end-width: thin;
  border-block-start-style: solid;
  border-block-end-style: solid;
}


${content_tag_id} table[rules][rules="cols"] > tr > td,
${content_tag_id} table[rules][rules="cols"] > * > tr > td,
${content_tag_id} table[rules][rules="cols"] > tr > th,
${content_tag_id} table[rules][rules="cols"] > * > tr > th {
  border-inline-start-width: thin;
  border-inline-end-width: thin;
  border-inline-start-style: solid;
  border-inline-end-style: solid;
}

${content_tag_id} table[rules][rules="groups"] > colgroup {
  border-inline-start-width: thin;
  border-inline-end-width: thin;
  border-inline-start-style: solid;
  border-inline-end-style: solid;
}
${content_tag_id} table[rules][rules="groups"] > tfoot,
${content_tag_id} table[rules][rules="groups"] > thead,
${content_tag_id} table[rules][rules="groups"] > tbody {
  border-block-start-width: thin;
  border-block-end-width: thin;
  border-block-start-style: solid;
  border-block-start-style: solid;
}
  
  
/* caption inherits from table not table-outer */  
${content_tag_id} caption {
  display: table-caption;
  text-align: center;
}

${content_tag_id} table[align="center"] > caption {
  margin-inline-start: auto;
  margin-inline-end: auto;
}

${content_tag_id} table[align="center"] > caption[align="left"]:dir(ltr) {
  margin-inline-end: 0;
}
${content_tag_id} table[align="center"] > caption[align="left"]:dir(rtl) {
  margin-inline-start: 0;
}

${content_tag_id} table[align="center"] > caption[align="right"]:dir(ltr) {
  margin-inline-start: 0;
}
${content_tag_id} table[align="center"] > caption[align="right"]:dir(rtl) {
  margin-inline-end: 0;
}

${content_tag_id} tr {
  display: table-row;
  vertical-align: inherit;
}

${content_tag_id} col {
  display: table-column;
}

${content_tag_id} colgroup {
  display: table-column-group;
}

${content_tag_id} tbody {
  display: table-row-group;
  vertical-align: middle;
}

${content_tag_id} thead {
  display: table-header-group;
  vertical-align: middle;
}

${content_tag_id} tfoot {
  display: table-footer-group;
  vertical-align: middle;
}

/* for XHTML tables without tbody */
${content_tag_id} table > tr {
  vertical-align: middle;
}

${content_tag_id} td { 
  display: table-cell;
  vertical-align: inherit;
  text-align: inherit; 
  padding: 1px;
}

${content_tag_id} th {
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
  padding: 1px;
}

${content_tag_id} tr > form:-moz-is-html, tbody > form:-moz-is-html,
${content_tag_id} thead > form:-moz-is-html, tfoot > form:-moz-is-html,
${content_tag_id} table > form:-moz-is-html {
  /* Important: don't show these forms in HTML */
  display: none !important;
}

${content_tag_id} table[bordercolor] > tbody,
${content_tag_id} table[bordercolor] > thead,
${content_tag_id} table[bordercolor] > tfoot,
${content_tag_id} table[bordercolor] > col,
${content_tag_id} table[bordercolor] > colgroup,
${content_tag_id} table[bordercolor] > tr,
${content_tag_id} table[bordercolor] > * > tr,
${content_tag_id} table[bordercolor]  > tr > td,
${content_tag_id} table[bordercolor] > * > tr > td,
${content_tag_id} table[bordercolor]  > tr > th,
${content_tag_id} table[bordercolor] > * > tr > th {
  border-color: inherit;
}

/* inlines */

${content_tag_id} q:before {
  content: open-quote;
}

${content_tag_id} q:after {
  content: close-quote;
}

${content_tag_id} b, ${content_tag_id} strong {
  font-weight: bolder;
}

${content_tag_id} i, ${content_tag_id} cite, ${content_tag_id} em, ${content_tag_id} var, ${content_tag_id} dfn {
  font-style: italic;
}

${content_tag_id} tt, ${content_tag_id} code, ${content_tag_id} kbd, ${content_tag_id} samp {
  font-family: -moz-fixed;
}

${content_tag_id} u, ${content_tag_id} ins {
  text-decoration: underline;
}

${content_tag_id} s, ${content_tag_id} strike, ${content_tag_id} del {
  text-decoration: line-through;
}

${content_tag_id} big {
  font-size: larger;
}

${content_tag_id} small {
  font-size: smaller;
}

${content_tag_id} sub {
  vertical-align: sub;
  font-size: smaller;
  line-height: normal;
}

${content_tag_id} sup {
  vertical-align: super;
  font-size: smaller;
  line-height: normal;
}

${content_tag_id} nobr {
  white-space: nowrap;
}

${content_tag_id} mark {
  background: yellow;
  color: black;
}

/* titles */
${content_tag_id} abbr[title], acronym[title] {
  text-decoration: dotted underline;
}

/* lists */

${content_tag_id} ul, ${content_tag_id} menu, ${content_tag_id} dir {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

${content_tag_id} menu[type="context"] {
  display: none !important;
}

${content_tag_id} ol {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

${content_tag_id} li {
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
${content_tag_id} hr {
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

${content_tag_id} hr[size="1"] {
  border-style: solid none none none;
}

${content_tag_id} img:-moz-broken::before, input:-moz-broken::before,
${content_tag_id} img:-moz-user-disabled::before, input:-moz-user-disabled::before,
${content_tag_id} img:-moz-loading::before, input:-moz-loading::before,
${content_tag_id} applet:-moz-empty-except-children-with-localname(param):-moz-broken::before,
${content_tag_id} applet:-moz-empty-except-children-with-localname(param):-moz-user-disabled::before {
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

${content_tag_id} img:-moz-suppressed, input:-moz-suppressed, object:-moz-suppressed,
${content_tag_id} embed:-moz-suppressed, applet:-moz-suppressed {
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

${content_tag_id} img[usemap], object[usemap] {
  color: blue;
}

${content_tag_id} frameset {
  display: block ! important;
  overflow: -moz-hidden-unscrollable;
  position: static ! important;
  float: none ! important;
  border: none ! important;
}

${content_tag_id} link { 
  display: none;
}

${content_tag_id} frame {
  border-radius: 0 ! important;
}

${content_tag_id} iframe {
  border: 2px inset;
}

${content_tag_id} noframes {
  display: none;
}

${content_tag_id} spacer {
  position: static ! important;
  float: none ! important;
}

${content_tag_id} canvas {
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
${content_tag_id} base, ${content_tag_id} basefont, ${content_tag_id} datalist, ${content_tag_id} head, ${content_tag_id} meta, ${content_tag_id} script, ${content_tag_id} style, ${content_tag_id} title,
${content_tag_id} noembed, ${content_tag_id} param, ${content_tag_id} template {
   display: none;
}

${content_tag_id} area {
  /* Don't give it frames other than its imageframe */
  display: none ! important;
}

${content_tag_id} iframe:fullscreen {
  /* iframes in full-screen mode don't show a border. */
  border: none !important;
  padding: 0 !important;
}

/* media elements */
${content_tag_id} video > xul|videocontrols, audio > xul|videocontrols {
  display: -moz-box;
  -moz-box-orient: vertical;
  -moz-binding: url("chrome://global/content/bindings/videocontrols.xml#videoControls");
}

${content_tag_id} video:not([controls]) > xul|videocontrols,
${content_tag_id} audio:not([controls]) > xul|videocontrols {
  visibility: hidden;
  -moz-binding: none;
}

${content_tag_id} video {
  object-fit: contain;
}

${content_tag_id} video > img:-moz-native-anonymous {
  /* Video poster images should render with the video element's "object-fit" &
     "object-position" properties */
  object-fit: inherit !important;
  object-position: inherit !important;
}

${content_tag_id} audio:not([controls]) {
  display: none;
}

*|*::-moz-html-canvas-content {
  display: block !important;
  /* we want to be an absolute and fixed container */
  transform: translate(0) !important;
}

${content_tag_id} video > .caption-box {
  position: relative;
  overflow: hidden;
}

/* details & summary */
/* Need to revert Bug 1259889 Part 2 when removing details preference. */
@supports -moz-bool-pref("dom.details_element.enabled") {
  ${content_tag_id} details > summary:first-of-type,
  ${content_tag_id} details > summary:-moz-native-anonymous {
    display: list-item;
    list-style: disclosure-closed inside;
  }

  ${content_tag_id} details[open] > summary:first-of-type,
  ${content_tag_id} details[open] > summary:-moz-native-anonymous {
    list-style-type: disclosure-open;
  }

  ${content_tag_id} details > summary:first-of-type > *|* {
    /* Cancel "list-style-position: inside" inherited from summary. */
    list-style-position: initial;
  }
}

/* emulation of non-standard HTML <marquee> tag */
${content_tag_id} marquee {
  inline-size: -moz-available;
  display: inline-block;
  vertical-align: text-bottom;
  text-align: start;
  -moz-binding: url('chrome://xbl-marquee/content/xbl-marquee.xml#marquee-horizontal');
}

${content_tag_id} marquee[direction="up"], marquee[direction="down"] {
  -moz-binding: url('chrome://xbl-marquee/content/xbl-marquee.xml#marquee-vertical');
  block-size: 200px;
}

/* PRINT ONLY rules follow */
@media print {

  ${content_tag_id} marquee { -moz-binding: none; }

}

/* Ruby */

${content_tag_id} ruby {
  display: ruby;
}
${content_tag_id} rb {
  display: ruby-base;
  white-space: nowrap;
}
${content_tag_id} rp {
  display: none;
}
${content_tag_id} rt {
  display: ruby-text;
}
${content_tag_id} rtc {
  display: ruby-text-container;
}
${content_tag_id} rtc, ${content_tag_id} rt {
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
${content_tag_id} rtc, ${content_tag_id} rt {
  text-emphasis: none;
}
${content_tag_id} rtc:lang(zh), ${content_tag_id} rt:lang(zh) {
  ruby-align: center;
}
${content_tag_id} rtc:lang(zh-TW), ${content_tag_id} rt:lang(zh-TW) {
  font-size: 30%; /* bopomofo */
  -moz-min-font-size-ratio: 30%;
}
${content_tag_id} rtc > rt {
  font-size: inherit;
}
${content_tag_id} ruby, ${content_tag_id} rb, ${content_tag_id} rt, ${content_tag_id} rtc {
  unicode-bidi: -moz-isolate;
}
`;
};
