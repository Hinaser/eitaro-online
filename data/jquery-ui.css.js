const jquery_ui_css = function (content_tag_id){
	return `
/*! jQuery UI - v1.11.4 - 2015-03-11
* http://jqueryui.com
* Includes: core.css, accordion.css, autocomplete.css, button.css, datepicker.css, dialog.css, draggable.css, menu.css, progressbar.css, resizable.css, selectable.css, selectmenu.css, slider.css, sortable.css, spinner.css, tabs.css, tooltip.css, theme.css
* To view and modify this theme, visit http://jqueryui.com/themeroller/?ffDefault=Trebuchet%20MS%2CTahoma%2CVerdana%2CArial%2Csans-serif&fwDefault=bold&fsDefault=1.1em&cornerRadius=4px&bgColorHeader=f6a828&bgTextureHeader=gloss_wave&bgImgOpacityHeader=35&borderColorHeader=e78f08&fcHeader=ffffff&iconColorHeader=ffffff&bgColorContent=eeeeee&bgTextureContent=highlight_soft&bgImgOpacityContent=100&borderColorContent=dddddd&fcContent=333333&iconColorContent=222222&bgColorDefault=f6f6f6&bgTextureDefault=glass&bgImgOpacityDefault=100&borderColorDefault=cccccc&fcDefault=1c94c4&iconColorDefault=ef8c08&bgColorHover=fdf5ce&bgTextureHover=glass&bgImgOpacityHover=100&borderColorHover=fbcb09&fcHover=c77405&iconColorHover=ef8c08&bgColorActive=ffffff&bgTextureActive=glass&bgImgOpacityActive=65&borderColorActive=fbd850&fcActive=eb8f00&iconColorActive=ef8c08&bgColorHighlight=ffe45c&bgTextureHighlight=highlight_soft&bgImgOpacityHighlight=75&borderColorHighlight=fed22f&fcHighlight=363636&iconColorHighlight=228ef1&bgColorError=b81900&bgTextureError=diagonals_thick&bgImgOpacityError=18&borderColorError=cd0a0a&fcError=ffffff&iconColorError=ffd27a&bgColorOverlay=666666&bgTextureOverlay=diagonals_thick&bgImgOpacityOverlay=20&opacityOverlay=50&bgColorShadow=000000&bgTextureShadow=flat&bgImgOpacityShadow=10&opacityShadow=20&thicknessShadow=5px&offsetTopShadow=-5px&offsetLeftShadow=-5px&cornerRadiusShadow=5px
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

/* Layout helpers
----------------------------------*/
${content_tag_id} .ui-helper-hidden {
	display: none;
}
${content_tag_id} .ui-helper-hidden-accessible {
	border: 0;
	clip: rect(0 0 0 0);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
}
${content_tag_id} .ui-helper-reset {
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	line-height: 1.3;
	text-decoration: none;
	font-size: 100%;
	list-style: none;
}
${content_tag_id} .ui-helper-clearfix:before,
${content_tag_id} .ui-helper-clearfix:after {
	content: "";
	display: table;
	border-collapse: collapse;
}
${content_tag_id} .ui-helper-clearfix:after {
	clear: both;
}
${content_tag_id} .ui-helper-clearfix {
	min-height: 0; /* support: IE7 */
}
${content_tag_id} .ui-helper-zfix {
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	position: absolute;
	opacity: 0;
	filter:Alpha(Opacity=0); /* support: IE8 */
}

${content_tag_id} .ui-front {
	z-index: 100;
}


/* Interaction Cues
----------------------------------*/
${content_tag_id} .ui-state-disabled {
	cursor: default !important;
}


/* Icons
----------------------------------*/

/* states and images */
${content_tag_id} .ui-icon {
	display: block;
	text-indent: -99999px;
	overflow: hidden;
	background-repeat: no-repeat;
}


/* Misc visuals
----------------------------------*/

/* Overlays */
${content_tag_id} .ui-widget-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
${content_tag_id} .ui-accordion .ui-accordion-header {
	display: block;
	cursor: pointer;
	position: relative;
	margin: 2px 0 0 0;
	padding: .5em .5em .5em .7em;
	min-height: 0; /* support: IE7 */
	font-size: 100%;
}
${content_tag_id} .ui-accordion .ui-accordion-icons {
	padding-left: 2.2em;
}
${content_tag_id} .ui-accordion .ui-accordion-icons .ui-accordion-icons {
	padding-left: 2.2em;
}
${content_tag_id} .ui-accordion .ui-accordion-header .ui-accordion-header-icon {
	position: absolute;
	left: .5em;
	top: 50%;
	margin-top: -8px;
}
${content_tag_id} .ui-accordion .ui-accordion-content {
	padding: 1em 2.2em;
	border-top: 0;
	overflow: auto;
}
${content_tag_id} .ui-autocomplete {
	position: absolute;
	top: 0;
	left: 0;
	cursor: default;
}
${content_tag_id} .ui-button {
	display: inline-block;
	position: relative;
	padding: 0;
	line-height: normal;
	margin-right: .1em;
	cursor: pointer;
	vertical-align: middle;
	text-align: center;
	overflow: visible; /* removes extra width in IE */
}
${content_tag_id} .ui-button,
${content_tag_id} .ui-button:link,
${content_tag_id} .ui-button:visited,
${content_tag_id} .ui-button:hover,
${content_tag_id} .ui-button:active {
	text-decoration: none;
}
/* to make room for the icon, a width needs to be set here */
${content_tag_id} .ui-button-icon-only {
	width: 2.2em;
}
/* button elements seem to need a little more width */
${content_tag_id} button.ui-button-icon-only {
	width: 2.4em;
}
${content_tag_id} .ui-button-icons-only {
	width: 3.4em;
}
${content_tag_id} button.ui-button-icons-only {
	width: 3.7em;
}

/* button text element */
${content_tag_id} .ui-button .ui-button-text {
	display: block;
	line-height: normal;
}
${content_tag_id} .ui-button-text-only .ui-button-text {
	padding: .4em 1em;
}
${content_tag_id} .ui-button-icon-only .ui-button-text,
${content_tag_id} .ui-button-icons-only .ui-button-text {
	padding: .4em;
	text-indent: -9999999px;
}
${content_tag_id} .ui-button-text-icon-primary .ui-button-text,
${content_tag_id} .ui-button-text-icons .ui-button-text {
	padding: .4em 1em .4em 2.1em;
}
${content_tag_id} .ui-button-text-icon-secondary .ui-button-text,
${content_tag_id} .ui-button-text-icons .ui-button-text {
	padding: .4em 2.1em .4em 1em;
}
${content_tag_id} .ui-button-text-icons .ui-button-text {
	padding-left: 2.1em;
	padding-right: 2.1em;
}
/* no icon support for input elements, provide padding by default */
${content_tag_id} input.ui-button {
	padding: .4em 1em;
}

/* button icon element(s) */
${content_tag_id} .ui-button-icon-only .ui-icon,
${content_tag_id} .ui-button-text-icon-primary .ui-icon,
${content_tag_id} .ui-button-text-icon-secondary .ui-icon,
${content_tag_id} .ui-button-text-icons .ui-icon,
${content_tag_id} .ui-button-icons-only .ui-icon {
	position: absolute;
	top: 50%;
	margin-top: -8px;
}
${content_tag_id} .ui-button-icon-only .ui-icon {
	left: 50%;
	margin-left: -8px;
}
${content_tag_id} .ui-button-text-icon-primary .ui-button-icon-primary,
${content_tag_id} .ui-button-text-icons .ui-button-icon-primary,
${content_tag_id} .ui-button-icons-only .ui-button-icon-primary {
	left: .5em;
}
${content_tag_id} .ui-button-text-icon-secondary .ui-button-icon-secondary,
${content_tag_id} .ui-button-text-icons .ui-button-icon-secondary,
${content_tag_id} .ui-button-icons-only .ui-button-icon-secondary {
	right: .5em;
}

/* button sets */
${content_tag_id} .ui-buttonset {
	margin-right: 7px;
}
${content_tag_id} .ui-buttonset .ui-button {
	margin-left: 0;
	margin-right: -.3em;
}

/* workarounds */
/* reset extra padding in Firefox, see h5bp.com/l */
${content_tag_id} input.ui-button::-moz-focus-inner,
${content_tag_id} button.ui-button::-moz-focus-inner {
	border: 0;
	padding: 0;
}
${content_tag_id} .ui-datepicker {
	width: 17em;
	padding: .2em .2em 0;
	display: none;
}
${content_tag_id} .ui-datepicker .ui-datepicker-header {
	position: relative;
	padding: .2em 0;
}
${content_tag_id} .ui-datepicker .ui-datepicker-prev,
${content_tag_id} .ui-datepicker .ui-datepicker-next {
	position: absolute;
	top: 2px;
	width: 1.8em;
	height: 1.8em;
}
${content_tag_id} .ui-datepicker .ui-datepicker-prev-hover,
${content_tag_id} .ui-datepicker .ui-datepicker-next-hover {
	top: 1px;
}
${content_tag_id} .ui-datepicker .ui-datepicker-prev {
	left: 2px;
}
${content_tag_id} .ui-datepicker .ui-datepicker-next {
	right: 2px;
}
${content_tag_id} .ui-datepicker .ui-datepicker-prev-hover {
	left: 1px;
}
${content_tag_id} .ui-datepicker .ui-datepicker-next-hover {
	right: 1px;
}
${content_tag_id} .ui-datepicker .ui-datepicker-prev span,
${content_tag_id} .ui-datepicker .ui-datepicker-next span {
	display: block;
	position: absolute;
	left: 50%;
	margin-left: -8px;
	top: 50%;
	margin-top: -8px;
}
${content_tag_id} .ui-datepicker .ui-datepicker-title {
	margin: 0 2.3em;
	line-height: 1.8em;
	text-align: center;
}
${content_tag_id} .ui-datepicker .ui-datepicker-title select {
	font-size: 1em;
	margin: 1px 0;
}
${content_tag_id} .ui-datepicker select.ui-datepicker-month,
${content_tag_id} .ui-datepicker select.ui-datepicker-year {
	width: 45%;
}
${content_tag_id} .ui-datepicker table {
	width: 100%;
	font-size: .9em;
	border-collapse: collapse;
	margin: 0 0 .4em;
}
${content_tag_id} .ui-datepicker th {
	padding: .7em .3em;
	text-align: center;
	font-weight: bold;
	border: 0;
}
${content_tag_id} .ui-datepicker td {
	border: 0;
	padding: 1px;
}
${content_tag_id} .ui-datepicker td span,
${content_tag_id} .ui-datepicker td a {
	display: block;
	padding: .2em;
	text-align: right;
	text-decoration: none;
}
${content_tag_id} .ui-datepicker .ui-datepicker-buttonpane {
	background-image: none;
	margin: .7em 0 0 0;
	padding: 0 .2em;
	border-left: 0;
	border-right: 0;
	border-bottom: 0;
}
${content_tag_id} .ui-datepicker .ui-datepicker-buttonpane button {
	float: right;
	margin: .5em .2em .4em;
	cursor: pointer;
	padding: .2em .6em .3em .6em;
	width: auto;
	overflow: visible;
}
${content_tag_id} .ui-datepicker .ui-datepicker-buttonpane button.ui-datepicker-current {
	float: left;
}

/* with multiple calendars */
${content_tag_id} .ui-datepicker.ui-datepicker-multi {
	width: auto;
}
${content_tag_id} .ui-datepicker-multi .ui-datepicker-group {
	float: left;
}
${content_tag_id} .ui-datepicker-multi .ui-datepicker-group table {
	width: 95%;
	margin: 0 auto .4em;
}
${content_tag_id} .ui-datepicker-multi-2 .ui-datepicker-group {
	width: 50%;
}
${content_tag_id} .ui-datepicker-multi-3 .ui-datepicker-group {
	width: 33.3%;
}
${content_tag_id} .ui-datepicker-multi-4 .ui-datepicker-group {
	width: 25%;
}
${content_tag_id} .ui-datepicker-multi .ui-datepicker-group-last .ui-datepicker-header,
${content_tag_id} .ui-datepicker-multi .ui-datepicker-group-middle .ui-datepicker-header {
	border-left-width: 0;
}
${content_tag_id} .ui-datepicker-multi .ui-datepicker-buttonpane {
	clear: left;
}
${content_tag_id} .ui-datepicker-row-break {
	clear: both;
	width: 100%;
	font-size: 0;
}

/* RTL support */
${content_tag_id} .ui-datepicker-rtl {
	direction: rtl;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-prev {
	right: 2px;
	left: auto;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-next {
	left: 2px;
	right: auto;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-prev:hover {
	right: 1px;
	left: auto;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-next:hover {
	left: 1px;
	right: auto;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-buttonpane {
	clear: right;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-buttonpane button {
	float: left;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-buttonpane button.ui-datepicker-current,
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-group {
	float: right;
}
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-group-last .ui-datepicker-header,
${content_tag_id} .ui-datepicker-rtl .ui-datepicker-group-middle .ui-datepicker-header {
	border-right-width: 0;
	border-left-width: 1px;
}
${content_tag_id} .ui-dialog {
	overflow: hidden;
	position: absolute;
	top: 0;
	left: 0;
	padding: .2em;
	outline: 0;
}
${content_tag_id} .ui-dialog .ui-dialog-titlebar {
	padding: .4em 1em;
	position: relative;
}
${content_tag_id} .ui-dialog .ui-dialog-title {
	float: left;
	margin: .1em 0;
	white-space: nowrap;
	width: 90%;
	overflow: hidden;
	text-overflow: ellipsis;
}
${content_tag_id} .ui-dialog .ui-dialog-titlebar-close {
	position: absolute;
	right: .3em;
	top: 50%;
	width: 20px;
	margin: -10px 0 0 0;
	padding: 1px;
	height: 20px;
}
${content_tag_id} .ui-dialog .ui-dialog-content {
	position: relative;
	border: 0;
	padding: .5em 1em;
	background: none;
	overflow: auto;
}
${content_tag_id} .ui-dialog .ui-dialog-buttonpane {
	text-align: left;
	border-width: 1px 0 0 0;
	background-image: none;
	margin-top: .5em;
	padding: .3em 1em .5em .4em;
}
${content_tag_id} .ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset {
	float: right;
}
${content_tag_id} .ui-dialog .ui-dialog-buttonpane button {
	margin: .5em .4em .5em 0;
	cursor: pointer;
}
${content_tag_id} .ui-dialog .ui-resizable-se {
	width: 12px;
	height: 12px;
	right: -5px;
	bottom: -5px;
	background-position: 16px 16px;
}
${content_tag_id} .ui-draggable .ui-dialog-titlebar {
	cursor: move;
}
${content_tag_id} .ui-draggable-handle {
	-ms-touch-action: none;
	touch-action: none;
}
${content_tag_id} .ui-menu {
	list-style: none;
	padding: 0;
	margin: 0;
	display: block;
	outline: none;
}
${content_tag_id} .ui-menu .ui-menu {
	position: absolute;
}
${content_tag_id} .ui-menu .ui-menu-item {
	position: relative;
	margin: 0;
	padding: 3px 1em 3px .4em;
	cursor: pointer;
	min-height: 0; /* support: IE7 */
	/* support: IE10, see #8844 */
	list-style-image: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
}
${content_tag_id} .ui-menu .ui-menu-divider {
	margin: 5px 0;
	height: 0;
	font-size: 0;
	line-height: 0;
	border-width: 1px 0 0 0;
}
${content_tag_id} .ui-menu .ui-state-focus,
${content_tag_id} .ui-menu .ui-state-active {
	margin: -1px;
}

/* icon support */
${content_tag_id} .ui-menu-icons {
	position: relative;
}
${content_tag_id} .ui-menu-icons .ui-menu-item {
	padding-left: 2em;
}

/* left-aligned */
${content_tag_id} .ui-menu .ui-icon {
	position: absolute;
	top: 0;
	bottom: 0;
	left: .2em;
	margin: auto 0;
}

/* right-aligned */
${content_tag_id} .ui-menu .ui-menu-icon {
	left: auto;
	right: 0;
}
${content_tag_id} .ui-progressbar {
	height: 2em;
	text-align: left;
	overflow: hidden;
}
${content_tag_id} .ui-progressbar .ui-progressbar-value {
	margin: -1px;
	height: 100%;
}
${content_tag_id} .ui-progressbar .ui-progressbar-overlay {
	background: url("data:image/gif;base64,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");
	height: 100%;
	filter: alpha(opacity=25); /* support: IE8 */
	opacity: 0.25;
}
${content_tag_id} .ui-progressbar-indeterminate .ui-progressbar-value {
	background-image: none;
}
${content_tag_id} .ui-resizable {
	position: relative;
}
${content_tag_id} .ui-resizable-handle {
	position: absolute;
	font-size: 0.1px;
	display: block;
	-ms-touch-action: none;
	touch-action: none;
}
${content_tag_id} .ui-resizable-disabled .ui-resizable-handle,
${content_tag_id} .ui-resizable-autohide .ui-resizable-handle {
	display: none;
}
${content_tag_id} .ui-resizable-n {
	cursor: n-resize;
	height: 7px;
	width: 100%;
	top: -5px;
	left: 0;
}
${content_tag_id} .ui-resizable-s {
	cursor: s-resize;
	height: 7px;
	width: 100%;
	bottom: -5px;
	left: 0;
}
${content_tag_id} .ui-resizable-e {
	cursor: e-resize;
	width: 7px;
	right: -5px;
	top: 0;
	height: 100%;
}
${content_tag_id} .ui-resizable-w {
	cursor: w-resize;
	width: 7px;
	left: -5px;
	top: 0;
	height: 100%;
}
${content_tag_id} .ui-resizable-se {
	cursor: se-resize;
	width: 12px;
	height: 12px;
	right: 1px;
	bottom: 1px;
}
${content_tag_id} .ui-resizable-sw {
	cursor: sw-resize;
	width: 9px;
	height: 9px;
	left: -5px;
	bottom: -5px;
}
${content_tag_id} .ui-resizable-nw {
	cursor: nw-resize;
	width: 9px;
	height: 9px;
	left: -5px;
	top: -5px;
}
${content_tag_id} .ui-resizable-ne {
	cursor: ne-resize;
	width: 9px;
	height: 9px;
	right: -5px;
	top: -5px;
}
${content_tag_id} .ui-selectable {
	-ms-touch-action: none;
	touch-action: none;
}
${content_tag_id} .ui-selectable-helper {
	position: absolute;
	z-index: 100;
	border: 1px dotted black;
}
${content_tag_id} .ui-selectmenu-menu {
	padding: 0;
	margin: 0;
	position: absolute;
	top: 0;
	left: 0;
	display: none;
}
${content_tag_id} .ui-selectmenu-menu .ui-menu {
	overflow: auto;
	/* Support: IE7 */
	overflow-x: hidden;
	padding-bottom: 1px;
}
${content_tag_id} .ui-selectmenu-menu .ui-menu .ui-selectmenu-optgroup {
	font-size: 1em;
	font-weight: bold;
	line-height: 1.5;
	padding: 2px 0.4em;
	margin: 0.5em 0 0 0;
	height: auto;
	border: 0;
}
${content_tag_id} .ui-selectmenu-open {
	display: block;
}
${content_tag_id} .ui-selectmenu-button {
	display: inline-block;
	overflow: hidden;
	position: relative;
	text-decoration: none;
	cursor: pointer;
}
${content_tag_id} .ui-selectmenu-button span.ui-icon {
	right: 0.5em;
	left: auto;
	margin-top: -8px;
	position: absolute;
	top: 50%;
}
${content_tag_id} .ui-selectmenu-button span.ui-selectmenu-text {
	text-align: left;
	padding: 0.4em 2.1em 0.4em 1em;
	display: block;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
${content_tag_id} .ui-slider {
	position: relative;
	text-align: left;
}
${content_tag_id} .ui-slider .ui-slider-handle {
	position: absolute;
	z-index: 2;
	width: 1.2em;
	height: 1.2em;
	cursor: default;
	-ms-touch-action: none;
	touch-action: none;
}
${content_tag_id} .ui-slider .ui-slider-range {
	position: absolute;
	z-index: 1;
	font-size: .7em;
	display: block;
	border: 0;
	background-position: 0 0;
}

/* support: IE8 - See #6727 */
${content_tag_id} .ui-slider.ui-state-disabled .ui-slider-handle,
${content_tag_id} .ui-slider.ui-state-disabled .ui-slider-range {
	filter: inherit;
}

${content_tag_id} .ui-slider-horizontal {
	height: .8em;
}
${content_tag_id} .ui-slider-horizontal .ui-slider-handle {
	top: -.3em;
	margin-left: -.6em;
}
${content_tag_id} .ui-slider-horizontal .ui-slider-range {
	top: 0;
	height: 100%;
}
${content_tag_id} .ui-slider-horizontal .ui-slider-range-min {
	left: 0;
}
${content_tag_id} .ui-slider-horizontal .ui-slider-range-max {
	right: 0;
}

${content_tag_id} .ui-slider-vertical {
	width: .8em;
	height: 100px;
}
${content_tag_id} .ui-slider-vertical .ui-slider-handle {
	left: -.3em;
	margin-left: 0;
	margin-bottom: -.6em;
}
${content_tag_id} .ui-slider-vertical .ui-slider-range {
	left: 0;
	width: 100%;
}
${content_tag_id} .ui-slider-vertical .ui-slider-range-min {
	bottom: 0;
}
${content_tag_id} .ui-slider-vertical .ui-slider-range-max {
	top: 0;
}
${content_tag_id} .ui-sortable-handle {
	-ms-touch-action: none;
	touch-action: none;
}
${content_tag_id} .ui-spinner {
	position: relative;
	display: inline-block;
	overflow: hidden;
	padding: 0;
	vertical-align: middle;
}
${content_tag_id} .ui-spinner-input {
	border: none;
	background: none;
	color: inherit;
	padding: 0;
	margin: .2em 0;
	vertical-align: middle;
	margin-left: .4em;
	margin-right: 22px;
}
${content_tag_id} .ui-spinner-button {
	width: 16px;
	height: 50%;
	font-size: .5em;
	padding: 0;
	margin: 0;
	text-align: center;
	position: absolute;
	cursor: default;
	display: block;
	overflow: hidden;
	right: 0;
}
/* more specificity required here to override default borders */
${content_tag_id} .ui-spinner a.ui-spinner-button {
	border-top: none;
	border-bottom: none;
	border-right: none;
}
/* vertically center icon */
${content_tag_id} .ui-spinner .ui-icon {
	position: absolute;
	margin-top: -8px;
	top: 50%;
	left: 0;
}
${content_tag_id} .ui-spinner-up {
	top: 0;
}
${content_tag_id} .ui-spinner-down {
	bottom: 0;
}

/* TR overrides */
${content_tag_id} .ui-spinner .ui-icon-triangle-1-s {
	/* need to fix icons sprite */
	background-position: -65px -16px;
}
${content_tag_id} .ui-tabs {
	position: relative;/* position: relative prevents IE scroll bug (element with position: relative inside container with overflow: auto appear as "fixed") */
	padding: .2em;
}
${content_tag_id} .ui-tabs .ui-tabs-nav {
	margin: 0;
	padding: .2em .2em 0;
}
${content_tag_id} .ui-tabs .ui-tabs-nav li {
	list-style: none;
	float: left;
	position: relative;
	top: 0;
	margin: 1px .2em 0 0;
	border-bottom-width: 0;
	padding: 0;
	white-space: nowrap;
}
${content_tag_id} .ui-tabs .ui-tabs-nav .ui-tabs-anchor {
	float: left;
	padding: .5em 1em;
	text-decoration: none;
}
${content_tag_id} .ui-tabs .ui-tabs-nav li.ui-tabs-active {
	margin-bottom: -1px;
	padding-bottom: 1px;
}
${content_tag_id} .ui-tabs .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor,
${content_tag_id} .ui-tabs .ui-tabs-nav li.ui-state-disabled .ui-tabs-anchor,
${content_tag_id} .ui-tabs .ui-tabs-nav li.ui-tabs-loading .ui-tabs-anchor {
	cursor: text;
}
${content_tag_id} .ui-tabs-collapsible .ui-tabs-nav li.ui-tabs-active .ui-tabs-anchor {
	cursor: pointer;
}
${content_tag_id} .ui-tabs .ui-tabs-panel {
	display: block;
	border-width: 0;
	padding: 1em 1.4em;
	background: none;
}
${content_tag_id} .ui-tooltip {
	padding: 8px;
	position: absolute;
	z-index: 9999;
	max-width: 300px;
	-webkit-box-shadow: 0 0 5px #aaa;
	box-shadow: 0 0 5px #aaa;
}
body ${content_tag_id} .ui-tooltip {
	border-width: 2px;
}

/* Component containers
----------------------------------*/
${content_tag_id} .ui-widget {
	font-family: Trebuchet MS,Tahoma,Verdana,Arial,sans-serif;
	font-size: 1.1em;
}
${content_tag_id} .ui-widget .ui-widget {
	font-size: 1em;
}
${content_tag_id} .ui-widget input,
${content_tag_id} .ui-widget select,
${content_tag_id} .ui-widget textarea,
${content_tag_id} .ui-widget button {
	font-family: Trebuchet MS,Tahoma,Verdana,Arial,sans-serif;
	font-size: 1em;
}
${content_tag_id} .ui-widget-content {
	border: 1px solid #dddddd;
	background: #eeeeee url("images/ui-bg_highlight-soft_100_eeeeee_1x100.png") 50% top repeat-x;
	color: #333333;
}
${content_tag_id} .ui-widget-content a {
	color: #333333;
}
${content_tag_id} .ui-widget-header {
	border: 1px solid #e78f08;
	background: #f6a828 url("images/ui-bg_gloss-wave_35_f6a828_500x100.png") 50% 50% repeat-x;
	color: #ffffff;
	font-weight: bold;
}
${content_tag_id} .ui-widget-header a {
	color: #ffffff;
}

/* Interaction states
----------------------------------*/
${content_tag_id} .ui-state-default,
${content_tag_id} .ui-widget-content .ui-state-default,
${content_tag_id} .ui-widget-header .ui-state-default {
	border: 1px solid #cccccc;
	background: #f6f6f6 url("images/ui-bg_glass_100_f6f6f6_1x400.png") 50% 50% repeat-x;
	font-weight: bold;
	color: #1c94c4;
}
${content_tag_id} .ui-state-default a,
${content_tag_id} .ui-state-default a:link,
${content_tag_id} .ui-state-default a:visited {
	color: #1c94c4;
	text-decoration: none;
}
${content_tag_id} .ui-state-hover,
${content_tag_id} .ui-widget-content .ui-state-hover,
${content_tag_id} .ui-widget-header .ui-state-hover,
${content_tag_id} .ui-state-focus,
${content_tag_id} .ui-widget-content .ui-state-focus,
${content_tag_id} .ui-widget-header .ui-state-focus {
	border: 1px solid #fbcb09;
	background: #fdf5ce url("images/ui-bg_glass_100_fdf5ce_1x400.png") 50% 50% repeat-x;
	font-weight: bold;
	color: #c77405;
}
${content_tag_id} .ui-state-hover a,
${content_tag_id} .ui-state-hover a:hover,
${content_tag_id} .ui-state-hover a:link,
${content_tag_id} .ui-state-hover a:visited,
${content_tag_id} .ui-state-focus a,
${content_tag_id} .ui-state-focus a:hover,
${content_tag_id} .ui-state-focus a:link,
${content_tag_id} .ui-state-focus a:visited {
	color: #c77405;
	text-decoration: none;
}
${content_tag_id} .ui-state-active,
${content_tag_id} .ui-widget-content .ui-state-active,
${content_tag_id} .ui-widget-header .ui-state-active {
	border: 1px solid #fbd850;
	background: #ffffff url("images/ui-bg_glass_65_ffffff_1x400.png") 50% 50% repeat-x;
	font-weight: bold;
	color: #eb8f00;
}
${content_tag_id} .ui-state-active a,
${content_tag_id} .ui-state-active a:link,
${content_tag_id} .ui-state-active a:visited {
	color: #eb8f00;
	text-decoration: none;
}

/* Interaction Cues
----------------------------------*/
${content_tag_id} .ui-state-highlight,
${content_tag_id} .ui-widget-content .ui-state-highlight,
${content_tag_id} .ui-widget-header .ui-state-highlight {
	border: 1px solid #fed22f;
	background: #ffe45c url("images/ui-bg_highlight-soft_75_ffe45c_1x100.png") 50% top repeat-x;
	color: #363636;
}
${content_tag_id} .ui-state-highlight a,
${content_tag_id} .ui-widget-content .ui-state-highlight a,
${content_tag_id} .ui-widget-header .ui-state-highlight a {
	color: #363636;
}
${content_tag_id} .ui-state-error,
${content_tag_id} .ui-widget-content .ui-state-error,
${content_tag_id} .ui-widget-header .ui-state-error {
	border: 1px solid #cd0a0a;
	background: #b81900 url("images/ui-bg_diagonals-thick_18_b81900_40x40.png") 50% 50% repeat;
	color: #ffffff;
}
${content_tag_id} .ui-state-error a,
${content_tag_id} .ui-widget-content .ui-state-error a,
${content_tag_id} .ui-widget-header .ui-state-error a {
	color: #ffffff;
}
${content_tag_id} .ui-state-error-text,
${content_tag_id} .ui-widget-content .ui-state-error-text,
${content_tag_id} .ui-widget-header .ui-state-error-text {
	color: #ffffff;
}
${content_tag_id} .ui-priority-primary,
${content_tag_id} .ui-widget-content .ui-priority-primary,
${content_tag_id} .ui-widget-header .ui-priority-primary {
	font-weight: bold;
}
${content_tag_id} .ui-priority-secondary,
${content_tag_id} .ui-widget-content .ui-priority-secondary,
${content_tag_id} .ui-widget-header .ui-priority-secondary {
	opacity: .7;
	filter:Alpha(Opacity=70); /* support: IE8 */
	font-weight: normal;
}
${content_tag_id} .ui-state-disabled,
${content_tag_id} .ui-widget-content .ui-state-disabled,
${content_tag_id} .ui-widget-header .ui-state-disabled {
	opacity: .35;
	filter:Alpha(Opacity=35); /* support: IE8 */
	background-image: none;
}
${content_tag_id} .ui-state-disabled .ui-icon {
	filter:Alpha(Opacity=35); /* support: IE8 - See #6059 */
}

/* Icons
----------------------------------*/

/* states and images */
${content_tag_id} .ui-icon {
	width: 16px;
	height: 16px;
}
${content_tag_id} .ui-icon,
${content_tag_id} .ui-widget-content .ui-icon {
	background-image: url("images/ui-icons_222222_256x240.png");
}
${content_tag_id} .ui-widget-header .ui-icon {
	background-image: url("images/ui-icons_ffffff_256x240.png");
}
${content_tag_id} .ui-state-default .ui-icon {
	background-image: url("images/ui-icons_ef8c08_256x240.png");
}
${content_tag_id} .ui-state-hover .ui-icon,
${content_tag_id} .ui-state-focus .ui-icon {
	background-image: url("images/ui-icons_ef8c08_256x240.png");
}
${content_tag_id} .ui-state-active .ui-icon {
	background-image: url("images/ui-icons_ef8c08_256x240.png");
}
${content_tag_id} .ui-state-highlight .ui-icon {
	background-image: url("images/ui-icons_228ef1_256x240.png");
}
${content_tag_id} .ui-state-error .ui-icon,
${content_tag_id} .ui-state-error-text .ui-icon {
	background-image: url("images/ui-icons_ffd27a_256x240.png");
}

/* positioning */
${content_tag_id} .ui-icon-blank { background-position: 16px 16px; }
${content_tag_id} .ui-icon-carat-1-n { background-position: 0 0; }
${content_tag_id} .ui-icon-carat-1-ne { background-position: -16px 0; }
${content_tag_id} .ui-icon-carat-1-e { background-position: -32px 0; }
${content_tag_id} .ui-icon-carat-1-se { background-position: -48px 0; }
${content_tag_id} .ui-icon-carat-1-s { background-position: -64px 0; }
${content_tag_id} .ui-icon-carat-1-sw { background-position: -80px 0; }
${content_tag_id} .ui-icon-carat-1-w { background-position: -96px 0; }
${content_tag_id} .ui-icon-carat-1-nw { background-position: -112px 0; }
${content_tag_id} .ui-icon-carat-2-n-s { background-position: -128px 0; }
${content_tag_id} .ui-icon-carat-2-e-w { background-position: -144px 0; }
${content_tag_id} .ui-icon-triangle-1-n { background-position: 0 -16px; }
${content_tag_id} .ui-icon-triangle-1-ne { background-position: -16px -16px; }
${content_tag_id} .ui-icon-triangle-1-e { background-position: -32px -16px; }
${content_tag_id} .ui-icon-triangle-1-se { background-position: -48px -16px; }
${content_tag_id} .ui-icon-triangle-1-s { background-position: -64px -16px; }
${content_tag_id} .ui-icon-triangle-1-sw { background-position: -80px -16px; }
${content_tag_id} .ui-icon-triangle-1-w { background-position: -96px -16px; }
${content_tag_id} .ui-icon-triangle-1-nw { background-position: -112px -16px; }
${content_tag_id} .ui-icon-triangle-2-n-s { background-position: -128px -16px; }
${content_tag_id} .ui-icon-triangle-2-e-w { background-position: -144px -16px; }
${content_tag_id} .ui-icon-arrow-1-n { background-position: 0 -32px; }
${content_tag_id} .ui-icon-arrow-1-ne { background-position: -16px -32px; }
${content_tag_id} .ui-icon-arrow-1-e { background-position: -32px -32px; }
${content_tag_id} .ui-icon-arrow-1-se { background-position: -48px -32px; }
${content_tag_id} .ui-icon-arrow-1-s { background-position: -64px -32px; }
${content_tag_id} .ui-icon-arrow-1-sw { background-position: -80px -32px; }
${content_tag_id} .ui-icon-arrow-1-w { background-position: -96px -32px; }
${content_tag_id} .ui-icon-arrow-1-nw { background-position: -112px -32px; }
${content_tag_id} .ui-icon-arrow-2-n-s { background-position: -128px -32px; }
${content_tag_id} .ui-icon-arrow-2-ne-sw { background-position: -144px -32px; }
${content_tag_id} .ui-icon-arrow-2-e-w { background-position: -160px -32px; }
${content_tag_id} .ui-icon-arrow-2-se-nw { background-position: -176px -32px; }
${content_tag_id} .ui-icon-arrowstop-1-n { background-position: -192px -32px; }
${content_tag_id} .ui-icon-arrowstop-1-e { background-position: -208px -32px; }
${content_tag_id} .ui-icon-arrowstop-1-s { background-position: -224px -32px; }
${content_tag_id} .ui-icon-arrowstop-1-w { background-position: -240px -32px; }
${content_tag_id} .ui-icon-arrowthick-1-n { background-position: 0 -48px; }
${content_tag_id} .ui-icon-arrowthick-1-ne { background-position: -16px -48px; }
${content_tag_id} .ui-icon-arrowthick-1-e { background-position: -32px -48px; }
${content_tag_id} .ui-icon-arrowthick-1-se { background-position: -48px -48px; }
${content_tag_id} .ui-icon-arrowthick-1-s { background-position: -64px -48px; }
${content_tag_id} .ui-icon-arrowthick-1-sw { background-position: -80px -48px; }
${content_tag_id} .ui-icon-arrowthick-1-w { background-position: -96px -48px; }
${content_tag_id} .ui-icon-arrowthick-1-nw { background-position: -112px -48px; }
${content_tag_id} .ui-icon-arrowthick-2-n-s { background-position: -128px -48px; }
${content_tag_id} .ui-icon-arrowthick-2-ne-sw { background-position: -144px -48px; }
${content_tag_id} .ui-icon-arrowthick-2-e-w { background-position: -160px -48px; }
${content_tag_id} .ui-icon-arrowthick-2-se-nw { background-position: -176px -48px; }
${content_tag_id} .ui-icon-arrowthickstop-1-n { background-position: -192px -48px; }
${content_tag_id} .ui-icon-arrowthickstop-1-e { background-position: -208px -48px; }
${content_tag_id} .ui-icon-arrowthickstop-1-s { background-position: -224px -48px; }
${content_tag_id} .ui-icon-arrowthickstop-1-w { background-position: -240px -48px; }
${content_tag_id} .ui-icon-arrowreturnthick-1-w { background-position: 0 -64px; }
${content_tag_id} .ui-icon-arrowreturnthick-1-n { background-position: -16px -64px; }
${content_tag_id} .ui-icon-arrowreturnthick-1-e { background-position: -32px -64px; }
${content_tag_id} .ui-icon-arrowreturnthick-1-s { background-position: -48px -64px; }
${content_tag_id} .ui-icon-arrowreturn-1-w { background-position: -64px -64px; }
${content_tag_id} .ui-icon-arrowreturn-1-n { background-position: -80px -64px; }
${content_tag_id} .ui-icon-arrowreturn-1-e { background-position: -96px -64px; }
${content_tag_id} .ui-icon-arrowreturn-1-s { background-position: -112px -64px; }
${content_tag_id} .ui-icon-arrowrefresh-1-w { background-position: -128px -64px; }
${content_tag_id} .ui-icon-arrowrefresh-1-n { background-position: -144px -64px; }
${content_tag_id} .ui-icon-arrowrefresh-1-e { background-position: -160px -64px; }
${content_tag_id} .ui-icon-arrowrefresh-1-s { background-position: -176px -64px; }
${content_tag_id} .ui-icon-arrow-4 { background-position: 0 -80px; }
${content_tag_id} .ui-icon-arrow-4-diag { background-position: -16px -80px; }
${content_tag_id} .ui-icon-extlink { background-position: -32px -80px; }
${content_tag_id} .ui-icon-newwin { background-position: -48px -80px; }
${content_tag_id} .ui-icon-refresh { background-position: -64px -80px; }
${content_tag_id} .ui-icon-shuffle { background-position: -80px -80px; }
${content_tag_id} .ui-icon-transfer-e-w { background-position: -96px -80px; }
${content_tag_id} .ui-icon-transferthick-e-w { background-position: -112px -80px; }
${content_tag_id} .ui-icon-folder-collapsed { background-position: 0 -96px; }
${content_tag_id} .ui-icon-folder-open { background-position: -16px -96px; }
${content_tag_id} .ui-icon-document { background-position: -32px -96px; }
${content_tag_id} .ui-icon-document-b { background-position: -48px -96px; }
${content_tag_id} .ui-icon-note { background-position: -64px -96px; }
${content_tag_id} .ui-icon-mail-closed { background-position: -80px -96px; }
${content_tag_id} .ui-icon-mail-open { background-position: -96px -96px; }
${content_tag_id} .ui-icon-suitcase { background-position: -112px -96px; }
${content_tag_id} .ui-icon-comment { background-position: -128px -96px; }
${content_tag_id} .ui-icon-person { background-position: -144px -96px; }
${content_tag_id} .ui-icon-print { background-position: -160px -96px; }
${content_tag_id} .ui-icon-trash { background-position: -176px -96px; }
${content_tag_id} .ui-icon-locked { background-position: -192px -96px; }
${content_tag_id} .ui-icon-unlocked { background-position: -208px -96px; }
${content_tag_id} .ui-icon-bookmark { background-position: -224px -96px; }
${content_tag_id} .ui-icon-tag { background-position: -240px -96px; }
${content_tag_id} .ui-icon-home { background-position: 0 -112px; }
${content_tag_id} .ui-icon-flag { background-position: -16px -112px; }
${content_tag_id} .ui-icon-calendar { background-position: -32px -112px; }
${content_tag_id} .ui-icon-cart { background-position: -48px -112px; }
${content_tag_id} .ui-icon-pencil { background-position: -64px -112px; }
${content_tag_id} .ui-icon-clock { background-position: -80px -112px; }
${content_tag_id} .ui-icon-disk { background-position: -96px -112px; }
${content_tag_id} .ui-icon-calculator { background-position: -112px -112px; }
${content_tag_id} .ui-icon-zoomin { background-position: -128px -112px; }
${content_tag_id} .ui-icon-zoomout { background-position: -144px -112px; }
${content_tag_id} .ui-icon-search { background-position: -160px -112px; }
${content_tag_id} .ui-icon-wrench { background-position: -176px -112px; }
${content_tag_id} .ui-icon-gear { background-position: -192px -112px; }
${content_tag_id} .ui-icon-heart { background-position: -208px -112px; }
${content_tag_id} .ui-icon-star { background-position: -224px -112px; }
${content_tag_id} .ui-icon-link { background-position: -240px -112px; }
${content_tag_id} .ui-icon-cancel { background-position: 0 -128px; }
${content_tag_id} .ui-icon-plus { background-position: -16px -128px; }
${content_tag_id} .ui-icon-plusthick { background-position: -32px -128px; }
${content_tag_id} .ui-icon-minus { background-position: -48px -128px; }
${content_tag_id} .ui-icon-minusthick { background-position: -64px -128px; }
${content_tag_id} .ui-icon-close { background-position: -80px -128px; }
${content_tag_id} .ui-icon-closethick { background-position: -96px -128px; }
${content_tag_id} .ui-icon-key { background-position: -112px -128px; }
${content_tag_id} .ui-icon-lightbulb { background-position: -128px -128px; }
${content_tag_id} .ui-icon-scissors { background-position: -144px -128px; }
${content_tag_id} .ui-icon-clipboard { background-position: -160px -128px; }
${content_tag_id} .ui-icon-copy { background-position: -176px -128px; }
${content_tag_id} .ui-icon-contact { background-position: -192px -128px; }
${content_tag_id} .ui-icon-image { background-position: -208px -128px; }
${content_tag_id} .ui-icon-video { background-position: -224px -128px; }
${content_tag_id} .ui-icon-script { background-position: -240px -128px; }
${content_tag_id} .ui-icon-alert { background-position: 0 -144px; }
${content_tag_id} .ui-icon-info { background-position: -16px -144px; }
${content_tag_id} .ui-icon-notice { background-position: -32px -144px; }
${content_tag_id} .ui-icon-help { background-position: -48px -144px; }
${content_tag_id} .ui-icon-check { background-position: -64px -144px; }
${content_tag_id} .ui-icon-bullet { background-position: -80px -144px; }
${content_tag_id} .ui-icon-radio-on { background-position: -96px -144px; }
${content_tag_id} .ui-icon-radio-off { background-position: -112px -144px; }
${content_tag_id} .ui-icon-pin-w { background-position: -128px -144px; }
${content_tag_id} .ui-icon-pin-s { background-position: -144px -144px; }
${content_tag_id} .ui-icon-play { background-position: 0 -160px; }
${content_tag_id} .ui-icon-pause { background-position: -16px -160px; }
${content_tag_id} .ui-icon-seek-next { background-position: -32px -160px; }
${content_tag_id} .ui-icon-seek-prev { background-position: -48px -160px; }
${content_tag_id} .ui-icon-seek-end { background-position: -64px -160px; }
${content_tag_id} .ui-icon-seek-start { background-position: -80px -160px; }
/* ui-icon-seek-first is deprecated, use ui-icon-seek-start instead */
${content_tag_id} .ui-icon-seek-first { background-position: -80px -160px; }
${content_tag_id} .ui-icon-stop { background-position: -96px -160px; }
${content_tag_id} .ui-icon-eject { background-position: -112px -160px; }
${content_tag_id} .ui-icon-volume-off { background-position: -128px -160px; }
${content_tag_id} .ui-icon-volume-on { background-position: -144px -160px; }
${content_tag_id} .ui-icon-power { background-position: 0 -176px; }
${content_tag_id} .ui-icon-signal-diag { background-position: -16px -176px; }
${content_tag_id} .ui-icon-signal { background-position: -32px -176px; }
${content_tag_id} .ui-icon-battery-0 { background-position: -48px -176px; }
${content_tag_id} .ui-icon-battery-1 { background-position: -64px -176px; }
${content_tag_id} .ui-icon-battery-2 { background-position: -80px -176px; }
${content_tag_id} .ui-icon-battery-3 { background-position: -96px -176px; }
${content_tag_id} .ui-icon-circle-plus { background-position: 0 -192px; }
${content_tag_id} .ui-icon-circle-minus { background-position: -16px -192px; }
${content_tag_id} .ui-icon-circle-close { background-position: -32px -192px; }
${content_tag_id} .ui-icon-circle-triangle-e { background-position: -48px -192px; }
${content_tag_id} .ui-icon-circle-triangle-s { background-position: -64px -192px; }
${content_tag_id} .ui-icon-circle-triangle-w { background-position: -80px -192px; }
${content_tag_id} .ui-icon-circle-triangle-n { background-position: -96px -192px; }
${content_tag_id} .ui-icon-circle-arrow-e { background-position: -112px -192px; }
${content_tag_id} .ui-icon-circle-arrow-s { background-position: -128px -192px; }
${content_tag_id} .ui-icon-circle-arrow-w { background-position: -144px -192px; }
${content_tag_id} .ui-icon-circle-arrow-n { background-position: -160px -192px; }
${content_tag_id} .ui-icon-circle-zoomin { background-position: -176px -192px; }
${content_tag_id} .ui-icon-circle-zoomout { background-position: -192px -192px; }
${content_tag_id} .ui-icon-circle-check { background-position: -208px -192px; }
${content_tag_id} .ui-icon-circlesmall-plus { background-position: 0 -208px; }
${content_tag_id} .ui-icon-circlesmall-minus { background-position: -16px -208px; }
${content_tag_id} .ui-icon-circlesmall-close { background-position: -32px -208px; }
${content_tag_id} .ui-icon-squaresmall-plus { background-position: -48px -208px; }
${content_tag_id} .ui-icon-squaresmall-minus { background-position: -64px -208px; }
${content_tag_id} .ui-icon-squaresmall-close { background-position: -80px -208px; }
${content_tag_id} .ui-icon-grip-dotted-vertical { background-position: 0 -224px; }
${content_tag_id} .ui-icon-grip-dotted-horizontal { background-position: -16px -224px; }
${content_tag_id} .ui-icon-grip-solid-vertical { background-position: -32px -224px; }
${content_tag_id} .ui-icon-grip-solid-horizontal { background-position: -48px -224px; }
${content_tag_id} .ui-icon-gripsmall-diagonal-se { background-position: -64px -224px; }
${content_tag_id} .ui-icon-grip-diagonal-se { background-position: -80px -224px; }


/* Misc visuals
----------------------------------*/

/* Corner radius */
${content_tag_id} .ui-corner-all,
${content_tag_id} .ui-corner-top,
${content_tag_id} .ui-corner-left,
${content_tag_id} .ui-corner-tl {
	border-top-left-radius: 4px;
}
${content_tag_id} .ui-corner-all,
${content_tag_id} .ui-corner-top,
${content_tag_id} .ui-corner-right,
${content_tag_id} .ui-corner-tr {
	border-top-right-radius: 4px;
}
${content_tag_id} .ui-corner-all,
${content_tag_id} .ui-corner-bottom,
${content_tag_id} .ui-corner-left,
${content_tag_id} .ui-corner-bl {
	border-bottom-left-radius: 4px;
}
${content_tag_id} .ui-corner-all,
${content_tag_id} .ui-corner-bottom,
${content_tag_id} .ui-corner-right,
${content_tag_id} .ui-corner-br {
	border-bottom-right-radius: 4px;
}

/* Overlays */
${content_tag_id} .ui-widget-overlay {
	background: #666666 url("images/ui-bg_diagonals-thick_20_666666_40x40.png") 50% 50% repeat;
	opacity: .5;
	filter: Alpha(Opacity=50); /* support: IE8 */
}
${content_tag_id} .ui-widget-shadow {
	margin: -5px 0 0 -5px;
	padding: 5px;
	background: #000000 url("images/ui-bg_flat_10_000000_40x100.png") 50% 50% repeat-x;
	opacity: .2;
	filter: Alpha(Opacity=20); /* support: IE8 */
	border-radius: 5px;
}
`;
};
