const firefox_default_css = function(wrapper_id) {
    return `
${wrapper_id} address,
${wrapper_id} article,
${wrapper_id} aside,
${wrapper_id} blockquote,
${wrapper_id} body,
${wrapper_id} caption,
${wrapper_id} center,
${wrapper_id} col,
${wrapper_id} colgroup,
${wrapper_id} dd,
${wrapper_id} dir,
${wrapper_id} div,
${wrapper_id} dl,
${wrapper_id} dt,
${wrapper_id} fieldset,
${wrapper_id} figcaption,
${wrapper_id} figure,
${wrapper_id} footer,
${wrapper_id} form,
${wrapper_id} h1,
${wrapper_id} h2,
${wrapper_id} h3,
${wrapper_id} h4,
${wrapper_id} h5,
${wrapper_id} h6,
${wrapper_id} header,
${wrapper_id} hgroup,
${wrapper_id} hr,
${wrapper_id} html,
${wrapper_id} legend,
${wrapper_id} li,
${wrapper_id} listing,
${wrapper_id} main,
${wrapper_id} marquee,
${wrapper_id} menu,
${wrapper_id} nav,
${wrapper_id} noframes,
${wrapper_id} ol,
${wrapper_id} p,
${wrapper_id} plaintext,
${wrapper_id} pre,
${wrapper_id} section,
${wrapper_id} summary,
${wrapper_id} table,
${wrapper_id} tbody,
${wrapper_id} td,
${wrapper_id} tfoot,
${wrapper_id} th,
${wrapper_id} thead,
${wrapper_id} tr,
${wrapper_id} ul,
${wrapper_id} xmp {
  unicode-bidi: -moz-isolate;
}

${wrapper_id} bdi, output {
  unicode-bidi: -moz-isolate;
}
${wrapper_id} bdo, bdo[dir] {
  unicode-bidi: bidi-override;
}
${wrapper_id} bdo[dir="auto"] {
  unicode-bidi: -moz-isolate-override;
}
${wrapper_id} textarea[dir="auto"], pre[dir="auto"] { unicode-bidi: -moz-plaintext; }

/* blocks */

${wrapper_id} article,
${wrapper_id} aside,
${wrapper_id} details,
${wrapper_id} div,
${wrapper_id} dt,
${wrapper_id} figcaption,
${wrapper_id} footer,
${wrapper_id} form,
${wrapper_id} header,
${wrapper_id} hgroup,
${wrapper_id} html,
${wrapper_id} main,
${wrapper_id} nav,
${wrapper_id} section,
${wrapper_id} summary {
  display: block;
}

${wrapper_id} p, ${wrapper_id} dl, ${wrapper_id} multicol {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

${wrapper_id} dd {
  display: block;
  margin-inline-start: 40px;
}

${wrapper_id} blockquote, ${wrapper_id} figure {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 40px;
  margin-inline-end: 40px;
}

${wrapper_id} address {
  display: block;
  font-style: italic;
}

${wrapper_id} center {
  display: block;
  text-align: -moz-center;
}

${wrapper_id} blockquote[type=cite] {
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

${wrapper_id} span[_moz_quote=true] {
  color: blue;
}

${wrapper_id} pre[_moz_quote=true] {
  color: blue;
}

${wrapper_id} h1 {
  display: block;
  font-size: 2em;
  font-weight: bold;
  margin-block-start: .67em;
  margin-block-end: .67em;
}

${wrapper_id} h2,
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  margin-block-start: .83em;
  margin-block-end: .83em;
}

${wrapper_id} h3,
:-moz-any(article, aside, nav, section)
:-moz-any(article, aside, nav, section)
h1 {
  display: block;
  font-size: 1.17em;
  font-weight: bold;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

${wrapper_id} h4,
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

${wrapper_id} h5,
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

${wrapper_id} h6,
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

${wrapper_id} listing {
  display: block;
  font-family: -moz-fixed;
  font-size: medium;
  white-space: pre;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

${wrapper_id} xmp, ${wrapper_id} pre, ${wrapper_id} plaintext {
  display: block;
  font-family: -moz-fixed;
  white-space: pre;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

/* tables */

${wrapper_id} table {
  display: table;
  border-spacing: 2px;
  border-collapse: separate;
  /* XXXldb do we want this if we're border-collapse:collapse ? */
  box-sizing: border-box;
  text-indent: 0;
}

${wrapper_id} table[align="left"] {
  float: left;
}

${wrapper_id} table[align="right"] {
  float: right;
  text-align: start;
}


/* border collapse rules */

  /* Set hidden if we have 'frame' or 'rules' attribute.
     Set it on all sides when we do so there's more consistency
     in what authors should expect */

  /* Put this first so 'border' and 'frame' rules can override it. */
${wrapper_id} table[rules] { 
  border-width: thin;
  border-style: hidden;
}

  /* 'border' before 'frame' so 'frame' overrides
      A border with a given value should, of course, pass that value
      as the border-width in pixels -> attr mapping */

  /* :-moz-table-border-nonzero is like [border]:not([border="0"]) except it
     also checks for other zero-like values according to HTML attribute
     parsing rules */
${wrapper_id} table:-moz-table-border-nonzero { 
  border-width: thin;
  border-style: outset;
}

${wrapper_id} table[frame] {
  border: thin hidden;
}

/* specificity must beat table:-moz-table-border-nonzero rule above */
${wrapper_id} table[frame="void"]   { border-style: hidden; }
${wrapper_id} table[frame="above"]  { border-style: outset hidden hidden hidden; }
${wrapper_id} table[frame="below"]  { border-style: hidden hidden outset hidden; }
${wrapper_id} table[frame="lhs"]    { border-style: hidden hidden hidden outset; }
${wrapper_id} table[frame="rhs"]    { border-style: hidden outset hidden hidden; }
${wrapper_id} table[frame="hsides"] { border-style: outset hidden; }
${wrapper_id} table[frame="vsides"] { border-style: hidden outset; }
${wrapper_id} table[frame="box"],
${wrapper_id} table[frame="border"] { border-style: outset; }

 
/* Internal Table Borders */

  /* 'border' cell borders first */

${wrapper_id} table:-moz-table-border-nonzero > * > tr > td,
${wrapper_id} table:-moz-table-border-nonzero > * > tr > th,
${wrapper_id} table:-moz-table-border-nonzero > * > td,
${wrapper_id} table:-moz-table-border-nonzero > * > th,
${wrapper_id} table:-moz-table-border-nonzero > td,
${wrapper_id} table:-moz-table-border-nonzero > th
{
  border-width: thin;
  border-style: inset;
}

/* collapse only if rules are really specified */
${wrapper_id} table[rules]:not([rules="none"]):not([rules=""]) {
  border-collapse: collapse;
}

/* only specified rules override 'border' settings  
  (increased specificity to achieve this) */
${wrapper_id} table[rules]:not([rules=""])> tr > td,
${wrapper_id} table[rules]:not([rules=""])> * > tr > td,
${wrapper_id} table[rules]:not([rules=""])> tr > th,
${wrapper_id} table[rules]:not([rules=""])> * > tr > th,
${wrapper_id} table[rules]:not([rules=""])> td,
${wrapper_id} table[rules]:not([rules=""])> th
{
  border-width: thin;
  border-style: none;
}


${wrapper_id} table[rules][rules="none"]  > tr > td,
${wrapper_id} table[rules][rules="none"] > * > tr > td,
${wrapper_id} table[rules][rules="none"] > tr > th,
${wrapper_id} table[rules][rules="none"] > * > tr > th,
${wrapper_id} table[rules][rules="none"] > td,
${wrapper_id} table[rules][rules="none"] > th
{
  border-width: thin;
  border-style: none;
}

${wrapper_id} table[rules][rules="all"] > tr > td,
${wrapper_id} table[rules][rules="all"] > * > tr > td,
${wrapper_id} table[rules][rules="all"] > tr > th,
${wrapper_id} table[rules][rules="all"] > * > tr > th,
${wrapper_id} table[rules][rules="all"] > td,
${wrapper_id} table[rules][rules="all"] > th 
{
  border-width: thin;
  border-style: solid;
}

${wrapper_id} table[rules][rules="rows"] > tr,
${wrapper_id} table[rules][rules="rows"] > * > tr {
  border-block-start-width: thin;
  border-block-end-width: thin;
  border-block-start-style: solid;
  border-block-end-style: solid;
}


${wrapper_id} table[rules][rules="cols"] > tr > td,
${wrapper_id} table[rules][rules="cols"] > * > tr > td,
${wrapper_id} table[rules][rules="cols"] > tr > th,
${wrapper_id} table[rules][rules="cols"] > * > tr > th {
  border-inline-start-width: thin;
  border-inline-end-width: thin;
  border-inline-start-style: solid;
  border-inline-end-style: solid;
}

${wrapper_id} table[rules][rules="groups"] > colgroup {
  border-inline-start-width: thin;
  border-inline-end-width: thin;
  border-inline-start-style: solid;
  border-inline-end-style: solid;
}
${wrapper_id} table[rules][rules="groups"] > tfoot,
${wrapper_id} table[rules][rules="groups"] > thead,
${wrapper_id} table[rules][rules="groups"] > tbody {
  border-block-start-width: thin;
  border-block-end-width: thin;
  border-block-start-style: solid;
  border-block-start-style: solid;
}
  
  
/* caption inherits from table not table-outer */  
${wrapper_id} caption {
  display: table-caption;
  text-align: center;
}

${wrapper_id} table[align="center"] > caption {
  margin-inline-start: auto;
  margin-inline-end: auto;
}

${wrapper_id} table[align="center"] > caption[align="left"]:dir(ltr) {
  margin-inline-end: 0;
}
${wrapper_id} table[align="center"] > caption[align="left"]:dir(rtl) {
  margin-inline-start: 0;
}

${wrapper_id} table[align="center"] > caption[align="right"]:dir(ltr) {
  margin-inline-start: 0;
}
${wrapper_id} table[align="center"] > caption[align="right"]:dir(rtl) {
  margin-inline-end: 0;
}

${wrapper_id} tr {
  display: table-row;
  vertical-align: inherit;
}

${wrapper_id} col {
  display: table-column;
}

${wrapper_id} colgroup {
  display: table-column-group;
}

${wrapper_id} tbody {
  display: table-row-group;
  vertical-align: middle;
}

${wrapper_id} thead {
  display: table-header-group;
  vertical-align: middle;
}

${wrapper_id} tfoot {
  display: table-footer-group;
  vertical-align: middle;
}

/* for XHTML tables without tbody */
${wrapper_id} table > tr {
  vertical-align: middle;
}

${wrapper_id} td { 
  display: table-cell;
  vertical-align: inherit;
  text-align: inherit; 
  padding: 1px;
}

${wrapper_id} th {
  display: table-cell;
  vertical-align: inherit;
  font-weight: bold;
  padding: 1px;
}

${wrapper_id} tr > form:-moz-is-html, tbody > form:-moz-is-html,
${wrapper_id} thead > form:-moz-is-html, tfoot > form:-moz-is-html,
${wrapper_id} table > form:-moz-is-html {
  /* Important: don't show these forms in HTML */
  display: none !important;
}

${wrapper_id} table[bordercolor] > tbody,
${wrapper_id} table[bordercolor] > thead,
${wrapper_id} table[bordercolor] > tfoot,
${wrapper_id} table[bordercolor] > col,
${wrapper_id} table[bordercolor] > colgroup,
${wrapper_id} table[bordercolor] > tr,
${wrapper_id} table[bordercolor] > * > tr,
${wrapper_id} table[bordercolor]  > tr > td,
${wrapper_id} table[bordercolor] > * > tr > td,
${wrapper_id} table[bordercolor]  > tr > th,
${wrapper_id} table[bordercolor] > * > tr > th {
  border-color: inherit;
}

/* inlines */

${wrapper_id} q:before {
  content: open-quote;
}

${wrapper_id} q:after {
  content: close-quote;
}

${wrapper_id} b, ${wrapper_id} strong {
  font-weight: bolder;
}

${wrapper_id} i, ${wrapper_id} cite, ${wrapper_id} em, ${wrapper_id} var, ${wrapper_id} dfn {
  font-style: italic;
}

${wrapper_id} tt, ${wrapper_id} code, ${wrapper_id} kbd, ${wrapper_id} samp {
  font-family: -moz-fixed;
}

${wrapper_id} u, ${wrapper_id} ins {
  text-decoration: underline;
}

${wrapper_id} s, ${wrapper_id} strike, ${wrapper_id} del {
  text-decoration: line-through;
}

${wrapper_id} big {
  font-size: larger;
}

${wrapper_id} small {
  font-size: smaller;
}

${wrapper_id} sub {
  vertical-align: sub;
  font-size: smaller;
  line-height: normal;
}

${wrapper_id} sup {
  vertical-align: super;
  font-size: smaller;
  line-height: normal;
}

${wrapper_id} nobr {
  white-space: nowrap;
}

${wrapper_id} mark {
  background: yellow;
  color: black;
}

/* titles */
${wrapper_id} abbr[title], acronym[title] {
  text-decoration: dotted underline;
}

/* lists */

${wrapper_id} ul, ${wrapper_id} menu, ${wrapper_id} dir {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

${wrapper_id} menu[type="context"] {
  display: none !important;
}

${wrapper_id} ol {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

${wrapper_id} li {
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
${wrapper_id} hr {
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

${wrapper_id} hr[size="1"] {
  border-style: solid none none none;
}

${wrapper_id} img:-moz-broken::before, input:-moz-broken::before,
${wrapper_id} img:-moz-user-disabled::before, input:-moz-user-disabled::before,
${wrapper_id} img:-moz-loading::before, input:-moz-loading::before,
${wrapper_id} applet:-moz-empty-except-children-with-localname(param):-moz-broken::before,
${wrapper_id} applet:-moz-empty-except-children-with-localname(param):-moz-user-disabled::before {
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

${wrapper_id} img:-moz-suppressed, input:-moz-suppressed, object:-moz-suppressed,
${wrapper_id} embed:-moz-suppressed, applet:-moz-suppressed {
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

${wrapper_id} img[usemap], object[usemap] {
  color: blue;
}

${wrapper_id} frameset {
  display: block ! important;
  overflow: -moz-hidden-unscrollable;
  position: static ! important;
  float: none ! important;
  border: none ! important;
}

${wrapper_id} link { 
  display: none;
}

${wrapper_id} frame {
  border-radius: 0 ! important;
}

${wrapper_id} iframe {
  border: 2px inset;
}

${wrapper_id} noframes {
  display: none;
}

${wrapper_id} spacer {
  position: static ! important;
  float: none ! important;
}

${wrapper_id} canvas {
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
${wrapper_id} base, ${wrapper_id} basefont, ${wrapper_id} datalist, ${wrapper_id} head, ${wrapper_id} meta, ${wrapper_id} script, ${wrapper_id} style, ${wrapper_id} title,
${wrapper_id} noembed, ${wrapper_id} param, ${wrapper_id} template {
   display: none;
}

${wrapper_id} area {
  /* Don't give it frames other than its imageframe */
  display: none ! important;
}

${wrapper_id} iframe:fullscreen {
  /* iframes in full-screen mode don't show a border. */
  border: none !important;
  padding: 0 !important;
}

/* media elements */
${wrapper_id} video > xul|videocontrols, audio > xul|videocontrols {
  display: -moz-box;
  -moz-box-orient: vertical;
  -moz-binding: url("chrome://global/content/bindings/videocontrols.xml#videoControls");
}

${wrapper_id} video:not([controls]) > xul|videocontrols,
${wrapper_id} audio:not([controls]) > xul|videocontrols {
  visibility: hidden;
  -moz-binding: none;
}

${wrapper_id} video {
  object-fit: contain;
}

${wrapper_id} video > img:-moz-native-anonymous {
  /* Video poster images should render with the video element's "object-fit" &
     "object-position" properties */
  object-fit: inherit !important;
  object-position: inherit !important;
}

${wrapper_id} audio:not([controls]) {
  display: none;
}

*|*::-moz-html-canvas-content {
  display: block !important;
  /* we want to be an absolute and fixed container */
  transform: translate(0) !important;
}

${wrapper_id} video > .caption-box {
  position: relative;
  overflow: hidden;
}

/* details & summary */
/* Need to revert Bug 1259889 Part 2 when removing details preference. */
@supports -moz-bool-pref("dom.details_element.enabled") {
  ${wrapper_id} details > summary:first-of-type,
  ${wrapper_id} details > summary:-moz-native-anonymous {
    display: list-item;
    list-style: disclosure-closed inside;
  }

  ${wrapper_id} details[open] > summary:first-of-type,
  ${wrapper_id} details[open] > summary:-moz-native-anonymous {
    list-style-type: disclosure-open;
  }

  ${wrapper_id} details > summary:first-of-type > *|* {
    /* Cancel "list-style-position: inside" inherited from summary. */
    list-style-position: initial;
  }
}

/* emulation of non-standard HTML <marquee> tag */
${wrapper_id} marquee {
  inline-size: -moz-available;
  display: inline-block;
  vertical-align: text-bottom;
  text-align: start;
  -moz-binding: url('chrome://xbl-marquee/content/xbl-marquee.xml#marquee-horizontal');
}

${wrapper_id} marquee[direction="up"], marquee[direction="down"] {
  -moz-binding: url('chrome://xbl-marquee/content/xbl-marquee.xml#marquee-vertical');
  block-size: 200px;
}

/* PRINT ONLY rules follow */
@media print {

  ${wrapper_id} marquee { -moz-binding: none; }

}

/* Ruby */

${wrapper_id} ruby {
  display: ruby;
}
${wrapper_id} rb {
  display: ruby-base;
  white-space: nowrap;
}
${wrapper_id} rp {
  display: none;
}
${wrapper_id} rt {
  display: ruby-text;
}
${wrapper_id} rtc {
  display: ruby-text-container;
}
${wrapper_id} rtc, ${wrapper_id} rt {
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
${wrapper_id} rtc, ${wrapper_id} rt {
  text-emphasis: none;
}
${wrapper_id} rtc:lang(zh), ${wrapper_id} rt:lang(zh) {
  ruby-align: center;
}
${wrapper_id} rtc:lang(zh-TW), ${wrapper_id} rt:lang(zh-TW) {
  font-size: 30%; /* bopomofo */
  -moz-min-font-size-ratio: 30%;
}
${wrapper_id} rtc > rt {
  font-size: inherit;
}
${wrapper_id} ruby, ${wrapper_id} rb, ${wrapper_id} rt, ${wrapper_id} rtc {
  unicode-bidi: -moz-isolate;
}
`;
};
