import { JSX } from "solid-js";

export type IconType =
  | "fa-solid fa-address-book"
  | "fa-solid fa-address-card"
  | "fa-solid fa-adjust"
  | "fa-solid fa-align-center"
  | "fa-solid fa-align-justify"
  | "fa-solid fa-align-left"
  | "fa-solid fa-align-right"
  | "fa-solid fa-allergies"
  | "fa-solid fa-ambulance"
  | "fa-solid fa-american-sign-language-interpreting"
  | "fa-solid fa-anchor"
  | "fa-solid fa-angle-double-down"
  | "fa-solid fa-angle-double-left"
  | "fa-solid fa-angle-double-right"
  | "fa-solid fa-angle-double-up"
  | "fa-solid fa-angle-down"
  | "fa-solid fa-angle-left"
  | "fa-solid fa-angle-right"
  | "fa-solid fa-angle-up"
  | "fa-solid fa-archive"
  | "fa-solid fa-arrow-alt-circle-down"
  | "fa-solid fa-arrow-alt-circle-left"
  | "fa-solid fa-arrow-alt-circle-right"
  | "fa-solid fa-arrow-alt-circle-up"
  | "fa-solid fa-arrow-circle-down"
  | "fa-solid fa-arrow-circle-left"
  | "fa-solid fa-arrow-circle-right"
  | "fa-solid fa-arrow-circle-up"
  | "fa-solid fa-arrow-down"
  | "fa-solid fa-arrow-left"
  | "fa-solid fa-arrow-right"
  | "fa-solid fa-arrow-up"
  | "fa-soild fa-arrow-up-from-bracket"
  | "fa-solid fa-arrows-alt"
  | "fa-solid fa-arrows-alt-h"
  | "fa-solid fa-arrows-alt-v"
  | "fa-solid fa-assistive-listening-systems"
  | "fa-solid fa-asterisk"
  | "fa-solid fa-at"
  | "fa-solid fa-audio-description"
  | "fa-solid fa-backward"
  | "fa-solid fa-balance-scale"
  | "fa-solid fa-ban"
  | "fa-solid fa-band-aid"
  | "fa-solid fa-barcode"
  | "fa-solid fa-bars"
  | "fa-solid fa-baseball-ball"
  | "fa-solid fa-basketball-ball"
  | "fa-solid fa-bath"
  | "fa-solid fa-battery-empty"
  | "fa-solid fa-battery-full"
  | "fa-solid fa-battery-half"
  | "fa-solid fa-battery-quarter"
  | "fa-solid fa-battery-three-quarters"
  | "fa-solid fa-bed"
  | "fa-solid fa-beer"
  | "fa-solid fa-bell"
  | "fa-solid fa-bell-slash"
  | "fa-solid fa-bicycle"
  | "fa-solid fa-binoculars"
  | "fa-solid fa-birthday-cake"
  | "fa-solid fa-blind"
  | "fa-solid fa-bold"
  | "fa-solid fa-bolt"
  | "fa-solid fa-bomb"
  | "fa-solid fa-book"
  | "fa-solid fa-bookmark"
  | "fa-solid fa-border-all"
  | "fa-solid fa-bowling-ball"
  | "fa-solid fa-box"
  | "fa-solid fa-box-open"
  | "fa-solid fa-boxes"
  | "fa-solid fa-braille"
  | "fa-solid fa-briefcase"
  | "fa-solid fa-briefcase-medical"
  | "fa-solid fa-bug"
  | "fa-solid fa-building"
  | "fa-solid fa-bullhorn"
  | "fa-solid fa-bullseye"
  | "fa-solid fa-burn"
  | "fa-solid fa-bus"
  | "fa-solid fa-calculator"
  | "fa-solid fa-calendar"
  | "fa-solid fa-calendar-alt"
  | "fa-solid fa-calendar-check"
  | "fa-solid fa-calendar-minus"
  | "fa-solid fa-calendar-plus"
  | "fa-solid fa-calendar-times"
  | "fa-solid fa-camera"
  | "fa-solid fa-camera-retro"
  | "fa-solid fa-capsules"
  | "fa-solid fa-car"
  | "fa-solid fa-caret-down"
  | "fa-solid fa-caret-left"
  | "fa-solid fa-caret-right"
  | "fa-solid fa-caret-square-down"
  | "fa-solid fa-caret-square-left"
  | "fa-solid fa-caret-square-right"
  | "fa-solid fa-caret-square-up"
  | "fa-solid fa-caret-up"
  | "fa-solid fa-cart-arrow-down"
  | "fa-solid fa-cart-plus"
  | "fa-solid fa-certificate"
  | "fa-solid fa-chart-area"
  | "fa-solid fa-chart-bar"
  | "fa-solid fa-chart-line"
  | "fa-solid fa-chart-pie"
  | "fa-solid fa-check"
  | "fa-solid fa-check-circle"
  | "fa-solid fa-check-square"
  | "fa-solid fa-chess"
  | "fa-solid fa-chess-bishop"
  | "fa-solid fa-chess-board"
  | "fa-solid fa-chess-king"
  | "fa-solid fa-chess-knight"
  | "fa-solid fa-chess-pawn"
  | "fa-solid fa-chess-queen"
  | "fa-solid fa-chess-rook"
  | "fa-solid fa-chevron-circle-down"
  | "fa-solid fa-chevron-circle-left"
  | "fa-solid fa-chevron-circle-right"
  | "fa-solid fa-chevron-circle-up"
  | "fa-solid fa-chevron-down"
  | "fa-solid fa-chevron-left"
  | "fa-solid fa-chevron-right"
  | "fa-solid fa-chevron-up"
  | "fa-solid fa-child"
  | "fa-solid fa-circle"
  | "fa-solid fa-circle-notch"
  | "fa-solid fa-clipboard"
  | "fa-solid fa-clipboard-check"
  | "fa-solid fa-clipboard-list"
  | "fa-solid fa-clock"
  | "fa-solid fa-clone"
  | "fa-solid fa-closed-captioning"
  | "fa-solid fa-cloud"
  | "fa-solid fa-cloud-download-alt"
  | "fa-solid fa-cloud-upload-alt"
  | "fa-solid fa-code"
  | "fa-solid fa-code-branch"
  | "fa-solid fa-coffee"
  | "fa-solid fa-cog"
  | "fa-solid fa-cogs"
  | "fa-solid fa-columns"
  | "fa-solid fa-comment"
  | "fa-solid fa-comment-alt"
  | "fa-solid fa-comment-dots"
  | "fa-solid fa-comment-slash"
  | "fa-solid fa-comments"
  | "fa-solid fa-compass"
  | "fa-solid fa-compress"
  | "fa-solid fa-copy"
  | "fa-solid fa-copyright"
  | "fa-solid fa-couch"
  | "fa-solid fa-credit-card"
  | "fa-solid fa-crop"
  | "fa-solid fa-crosshairs"
  | "fa-solid fa-cube"
  | "fa-solid fa-cubes"
  | "fa-solid fa-cut"
  | "fa-solid fa-database"
  | "fa-solid fa-deaf"
  | "fa-solid fa-desktop"
  | "fa-solid fa-diagnoses"
  | "fa-solid fa-dna"
  | "fa-solid fa-dollar-sign"
  | "fa-solid fa-dolly"
  | "fa-solid fa-dolly-flatbed"
  | "fa-solid fa-donate"
  | "fa-solid fa-dot-circle"
  | "fa-solid fa-dove"
  | "fa-solid fa-download"
  | "fa-solid fa-edit"
  | "fa-solid fa-eject"
  | "fa-solid fa-ellipsis-h"
  | "fa-solid fa-ellipsis-v"
  | "fa-solid fa-envelope"
  | "fa-solid fa-envelope-open"
  | "fa-solid fa-envelope-square"
  | "fa-solid fa-eraser"
  | "fa-solid fa-euro-sign"
  | "fa-solid fa-exchange-alt"
  | "fa-solid fa-exclamation"
  | "fa-solid fa-exclamation-circle"
  | "fa-solid fa-exclamation-triangle"
  | "fa-solid fa-expand"
  | "fa-solid fa-expand-arrows-alt"
  | "fa-solid fa-external-link-alt"
  | "fa-solid fa-external-link-square-alt"
  | "fa-solid fa-eye"
  | "fa-solid fa-eye-dropper"
  | "fa-solid fa-eye-slash"
  | "fa-solid fa-fa-solidt-backward"
  | "fa-solid fa-fa-solidt-forward"
  | "fa-solid fa-fax"
  | "fa-solid fa-female"
  | "fa-solid fa-fighter-jet"
  | "fa-solid fa-file"
  | "fa-solid fa-file-alt"
  | "fa-solid fa-file-archive"
  | "fa-solid fa-file-audio"
  | "fa-solid fa-file-code"
  | "fa-solid fa-file-excel"
  | "fa-solid fa-file-image"
  | "fa-solid fa-file-medical"
  | "fa-solid fa-file-medical-alt"
  | "fa-solid fa-file-pdf"
  | "fa-solid fa-file-powerpoint"
  | "fa-solid fa-file-video"
  | "fa-solid fa-file-word"
  | "fa-solid fa-film"
  | "fa-solid fa-filter"
  | "fa-solid fa-fire"
  | "fa-solid fa-fire-extinguisher"
  | "fa-solid fa-first-aid"
  | "fa-solid fa-flag"
  | "fa-solid fa-flag-checkered"
  | "fa-solid fa-flask"
  | "fa-solid fa-folder"
  | "fa-solid fa-folder-open"
  | "fa-solid fa-font"
  | "fa-solid fa-football-ball"
  | "fa-solid fa-forward"
  | "fa-solid fa-frown"
  | "fa-solid fa-futbol"
  | "fa-solid fa-gamepad"
  | "fa-solid fa-gavel"
  | "fa-solid fa-gem"
  | "fa-solid fa-genderless"
  | "fa-solid fa-gift"
  | "fa-solid fa-glass-martini"
  | "fa-solid fa-globe"
  | "fa-solid fa-golf-ball"
  | "fa-solid fa-graduation-cap"
  | "fa-solid fa-h-square"
  | "fa-solid fa-hand-holding"
  | "fa-solid fa-hand-holding-heart"
  | "fa-solid fa-hand-holding-usd"
  | "fa-solid fa-hand-lizard"
  | "fa-solid fa-hand-paper"
  | "fa-solid fa-hand-peace"
  | "fa-solid fa-hand-point-down"
  | "fa-solid fa-hand-point-left"
  | "fa-solid fa-hand-point-right"
  | "fa-solid fa-hand-point-up"
  | "fa-solid fa-hand-pointer"
  | "fa-solid fa-hand-rock"
  | "fa-solid fa-hand-scissors"
  | "fa-solid fa-hand-spock"
  | "fa-solid fa-hands"
  | "fa-solid fa-hands-helping"
  | "fa-solid fa-handshake"
  | "fa-solid fa-hashtag"
  | "fa-solid fa-hdd"
  | "fa-solid fa-heading"
  | "fa-solid fa-headphones"
  | "fa-solid fa-heart"
  | "fa-solid fa-heartbeat"
  | "fa-solid fa-history"
  | "fa-solid fa-hockey-puck"
  | "fa-solid fa-home"
  | "fa-solid fa-hospital"
  | "fa-solid fa-hospital-alt"
  | "fa-solid fa-hospital-symbol"
  | "fa-solid fa-hourglass"
  | "fa-solid fa-hourglass-end"
  | "fa-solid fa-hourglass-half"
  | "fa-solid fa-hourglass-start"
  | "fa-solid fa-i-cursor"
  | "fa-solid fa-id-badge"
  | "fa-solid fa-id-card"
  | "fa-solid fa-id-card-alt"
  | "fa-solid fa-image"
  | "fa-solid fa-images"
  | "fa-solid fa-inbox"
  | "fa-solid fa-indent"
  | "fa-solid fa-industry"
  | "fa-solid fa-info"
  | "fa-solid fa-info-circle"
  | "fa-solid fa-italic"
  | "fa-solid fa-key"
  | "fa-solid fa-keyboard"
  | "fa-solid fa-language"
  | "fa-solid fa-laptop"
  | "fa-solid fa-layer-group"
  | "fa-solid fa-leaf"
  | "fa-solid fa-lemon"
  | "fa-solid fa-level-down-alt"
  | "fa-solid fa-level-up-alt"
  | "fa-solid fa-life-ring"
  | "fa-solid fa-lightbulb"
  | "fa-solid fa-link"
  | "fa-solid fa-lira-sign"
  | "fa-solid fa-list"
  | "fa-solid fa-list-alt"
  | "fa-solid fa-list-ol"
  | "fa-solid fa-list-ul"
  | "fa-solid fa-location-arrow"
  | "fa-solid fa-lock"
  | "fa-solid fa-lock-open"
  | "fa-solid fa-long-arrow-alt-down"
  | "fa-solid fa-long-arrow-alt-left"
  | "fa-solid fa-long-arrow-alt-right"
  | "fa-solid fa-long-arrow-alt-up"
  | "fa-solid fa-low-vision"
  | "fa-solid fa-magic"
  | "fa-solid fa-magnet"
  | "fa-solid fa-male"
  | "fa-solid fa-map"
  | "fa-solid fa-map-marker"
  | "fa-solid fa-map-marker-alt"
  | "fa-solid fa-map-pin"
  | "fa-solid fa-map-signs"
  | "fa-solid fa-mars"
  | "fa-solid fa-mars-double"
  | "fa-solid fa-mars-stroke"
  | "fa-solid fa-mars-stroke-h"
  | "fa-solid fa-mars-stroke-v"
  | "fa-solid fa-medkit"
  | "fa-solid fa-meh"
  | "fa-solid fa-mercury"
  | "fa-solid fa-microchip"
  | "fa-solid fa-microphone"
  | "fa-solid fa-microphone-slash"
  | "fa-solid fa-minus"
  | "fa-solid fa-minus-circle"
  | "fa-solid fa-minus-square"
  | "fa-solid fa-mobile"
  | "fa-solid fa-mobile-alt"
  | "fa-solid fa-money-bill-alt"
  | "fa-solid fa-moon"
  | "fa-solid fa-motorcycle"
  | "fa-solid fa-mouse-pointer"
  | "fa-solid fa-music"
  | "fa-solid fa-neuter"
  | "fa-solid fa-newspaper"
  | "fa-solid fa-notes-medical"
  | "fa-solid fa-object-group"
  | "fa-solid fa-object-ungroup"
  | "fa-solid fa-outdent"
  | "fa-solid fa-paint-brush"
  | "fa-solid fa-palette"
  | "fa-solid fa-pallet"
  | "fa-solid fa-paper-plane"
  | "fa-solid fa-paperclip"
  | "fa-solid fa-parachute-box"
  | "fa-solid fa-paragraph"
  | "fa-solid fa-paste"
  | "fa-solid fa-pause"
  | "fa-solid fa-pause-circle"
  | "fa-solid fa-paw"
  | "fa-solid fa-pen-square"
  | "fa-solid fa-pencil-alt"
  | "fa-solid fa-people-carry"
  | "fa-solid fa-percent"
  | "fa-solid fa-phone"
  | "fa-solid fa-phone-slash"
  | "fa-solid fa-phone-square"
  | "fa-solid fa-phone-volume"
  | "fa-solid fa-piggy-bank"
  | "fa-solid fa-pills"
  | "fa-solid fa-plane"
  | "fa-solid fa-play"
  | "fa-solid fa-play-circle"
  | "fa-solid fa-plug"
  | "fa-solid fa-plus"
  | "fa-solid fa-plus-circle"
  | "fa-solid fa-plus-square"
  | "fa-solid fa-podcast"
  | "fa-solid fa-poo"
  | "fa-solid fa-pound-sign"
  | "fa-solid fa-power-off"
  | "fa-solid fa-prescription-bottle"
  | "fa-solid fa-prescription-bottle-alt"
  | "fa-solid fa-print"
  | "fa-solid fa-procedures"
  | "fa-solid fa-puzzle-piece"
  | "fa-solid fa-qrcode"
  | "fa-solid fa-question"
  | "fa-solid fa-question-circle"
  | "fa-solid fa-quidditch"
  | "fa-solid fa-quote-left"
  | "fa-solid fa-quote-right"
  | "fa-solid fa-random"
  | "fa-solid fa-recycle"
  | "fa-solid fa-redo"
  | "fa-solid fa-redo-alt"
  | "fa-solid fa-registered"
  | "fa-solid fa-reply"
  | "fa-solid fa-reply-all"
  | "fa-solid fa-retweet"
  | "fa-solid fa-ribbon"
  | "fa-solid fa-road"
  | "fa-solid fa-rocket"
  | "fa-solid fa-rss"
  | "fa-solid fa-rss-square"
  | "fa-solid fa-ruble-sign"
  | "fa-solid fa-rupee-sign"
  | "fa-solid fa-save"
  | "fa-solid fa-search"
  | "fa-solid fa-search-minus"
  | "fa-solid fa-search-plus"
  | "fa-solid fa-seedling"
  | "fa-solid fa-server"
  | "fa-solid fa-share"
  | "fa-solid fa-share-alt"
  | "fa-solid fa-share-alt-square"
  | "fa-solid fa-share-square"
  | "fa-solid fa-shekel-sign"
  | "fa-solid fa-shield-alt"
  | "fa-solid fa-ship"
  | "fa-solid fa-shipping-fa-solidt"
  | "fa-solid fa-shopping-bag"
  | "fa-solid fa-shopping-basket"
  | "fa-solid fa-shopping-cart"
  | "fa-solid fa-shower"
  | "fa-solid fa-sign"
  | "fa-solid fa-sign-in-alt"
  | "fa-solid fa-sign-language"
  | "fa-solid fa-sign-out-alt"
  | "fa-solid fa-signal"
  | "fa-solid fa-sitemap"
  | "fa-solid fa-sliders-h"
  | "fa-solid fa-smile"
  | "fa-solid fa-smoking"
  | "fa-solid fa-snowflake"
  | "fa-solid fa-sort"
  | "fa-solid fa-sort-alpha-down"
  | "fa-solid fa-sort-alpha-up"
  | "fa-solid fa-sort-amount-down"
  | "fa-solid fa-sort-amount-up"
  | "fa-solid fa-sort-down"
  | "fa-solid fa-sort-numeric-down"
  | "fa-solid fa-sort-numeric-up"
  | "fa-solid fa-sort-up"
  | "fa-solid fa-space-shuttle"
  | "fa-solid fa-spinner"
  | "fa-solid fa-square"
  | "fa-solid fa-square-full"
  | "fa-solid fa-star"
  | "fa-solid fa-star-half"
  | "fa-solid fa-step-backward"
  | "fa-solid fa-step-forward"
  | "fa-solid fa-stethoscope"
  | "fa-solid fa-sticky-note"
  | "fa-solid fa-stop"
  | "fa-solid fa-stop-circle"
  | "fa-solid fa-stopwatch"
  | "fa-solid fa-street-view"
  | "fa-solid fa-strikethrough"
  | "fa-solid fa-subscript"
  | "fa-solid fa-subway"
  | "fa-solid fa-suitcase"
  | "fa-solid fa-sun"
  | "fa-solid fa-superscript"
  | "fa-solid fa-sync"
  | "fa-solid fa-sync-alt"
  | "fa-solid fa-syringe"
  | "fa-solid fa-table"
  | "fa-solid fa-table-tennis"
  | "fa-solid fa-tablet"
  | "fa-solid fa-tablet-alt"
  | "fa-solid fa-tablets"
  | "fa-solid fa-tachometer-alt"
  | "fa-solid fa-tag"
  | "fa-solid fa-tags"
  | "fa-solid fa-tape"
  | "fa-solid fa-tasks"
  | "fa-solid fa-taxi"
  | "fa-solid fa-terminal"
  | "fa-solid fa-text-height"
  | "fa-solid fa-text-width"
  | "fa-solid fa-th"
  | "fa-solid fa-th-large"
  | "fa-solid fa-th-list"
  | "fa-solid fa-thermometer"
  | "fa-solid fa-thermometer-empty"
  | "fa-solid fa-thermometer-full"
  | "fa-solid fa-thermometer-half"
  | "fa-solid fa-thermometer-quarter"
  | "fa-solid fa-thermometer-three-quarters"
  | "fa-solid fa-thumbs-down"
  | "fa-solid fa-thumbs-up"
  | "fa-solid fa-thumbtack"
  | "fa-solid fa-ticket-alt"
  | "fa-solid fa-times"
  | "fa-solid fa-times-circle"
  | "fa-solid fa-tint"
  | "fa-solid fa-toggle-off"
  | "fa-solid fa-toggle-on"
  | "fa-solid fa-trademark"
  | "fa-solid fa-train"
  | "fa-solid fa-transgender"
  | "fa-solid fa-transgender-alt"
  | "fa-solid fa-trash"
  | "fa-solid fa-trash-alt"
  | "fa-solid fa-tree"
  | "fa-solid fa-trophy"
  | "fa-solid fa-truck"
  | "fa-solid fa-truck-loading"
  | "fa-solid fa-truck-moving"
  | "fa-solid fa-tty"
  | "fa-solid fa-tv"
  | "fa-solid fa-umbrella"
  | "fa-solid fa-underline"
  | "fa-solid fa-undo"
  | "fa-solid fa-undo-alt"
  | "fa-solid fa-universal-access"
  | "fa-solid fa-university"
  | "fa-solid fa-unlink"
  | "fa-solid fa-unlock"
  | "fa-solid fa-unlock-alt"
  | "fa-solid fa-upload"
  | "fa-solid fa-user"
  | "fa-solid fa-user-circle"
  | "fa-solid fa-user-md"
  | "fa-solid fa-user-plus"
  | "fa-solid fa-user-secret"
  | "fa-solid fa-user-times"
  | "fa-solid fa-users"
  | "fa-solid fa-utensil-spoon"
  | "fa-solid fa-utensils"
  | "fa-solid fa-venus"
  | "fa-solid fa-venus-double"
  | "fa-solid fa-venus-mars"
  | "fa-solid fa-vial"
  | "fa-solid fa-vials"
  | "fa-solid fa-video"
  | "fa-solid fa-video-slash"
  | "fa-solid fa-volleyball-ball"
  | "fa-solid fa-volume-down"
  | "fa-solid fa-volume-off"
  | "fa-solid fa-volume-up"
  | "fa-solid fa-warehouse"
  | "fa-solid fa-weight"
  | "fa-solid fa-wheelchair"
  | "fa-solid fa-wifi"
  | "fa-solid fa-window-close"
  | "fa-solid fa-window-maximize"
  | "fa-solid fa-window-minimize"
  | "fa-solid fa-window-restore"
  | "fa-solid fa-wine-glass"
  | "fa-solid fa-won-sign"
  | "fa-solid fa-wrench"
  | "fa-solid fa-x-ray"
  | "fa-solid fa-yen-sign"
  | "fa-regular fa-address-book"
  | "fa-regular fa-address-card"
  | "fa-regular fa-arrow-alt-circle-down"
  | "fa-regular fa-arrow-alt-circle-left"
  | "fa-regular fa-arrow-alt-circle-right"
  | "fa-regular fa-arrow-alt-circle-up"
  | "fa-regular fa-bell"
  | "fa-regular fa-bell-slash"
  | "fa-regular fa-bookmark"
  | "fa-regular fa-building"
  | "fa-regular fa-calendar"
  | "fa-regular fa-calendar-alt"
  | "fa-regular fa-calendar-check"
  | "fa-regular fa-calendar-minus"
  | "fa-regular fa-calendar-plus"
  | "fa-regular fa-calendar-times"
  | "fa-regular fa-caret-square-down"
  | "fa-regular fa-caret-square-left"
  | "fa-regular fa-caret-square-right"
  | "fa-regular fa-caret-square-up"
  | "fa-regular fa-chart-bar"
  | "fa-regular fa-check-circle"
  | "fa-regular fa-check-square"
  | "fa-regular fa-circle"
  | "fa-regular fa-clipboard"
  | "fa-regular fa-clock"
  | "fa-regular fa-clone"
  | "fa-regular fa-closed-captioning"
  | "fa-regular fa-comment"
  | "fa-regular fa-comment-alt"
  | "fa-regular fa-comments"
  | "fa-regular fa-compass"
  | "fa-regular fa-copy"
  | "fa-regular fa-copyright"
  | "fa-regular fa-credit-card"
  | "fa-regular fa-dot-circle"
  | "fa-regular fa-edit"
  | "fa-regular fa-envelope"
  | "fa-regular fa-envelope-open"
  | "fa-regular fa-eye-slash"
  | "fa-regular fa-file"
  | "fa-regular fa-file-alt"
  | "fa-regular fa-file-archive"
  | "fa-regular fa-file-audio"
  | "fa-regular fa-file-code"
  | "fa-regular fa-file-excel"
  | "fa-regular fa-file-image"
  | "fa-regular fa-file-pdf"
  | "fa-regular fa-file-powerpoint"
  | "fa-regular fa-file-video"
  | "fa-regular fa-file-word"
  | "fa-regular fa-flag"
  | "fa-regular fa-folder"
  | "fa-regular fa-folder-open"
  | "fa-regular fa-frown"
  | "fa-regular fa-futbol"
  | "fa-regular fa-gem"
  | "fa-regular fa-hand-lizard"
  | "fa-regular fa-hand-paper"
  | "fa-regular fa-hand-peace"
  | "fa-regular fa-hand-point-down"
  | "fa-regular fa-hand-point-left"
  | "fa-regular fa-hand-point-right"
  | "fa-regular fa-hand-point-up"
  | "fa-regular fa-hand-pointer"
  | "fa-regular fa-hand-rock"
  | "fa-regular fa-hand-scissors"
  | "fa-regular fa-hand-spock"
  | "fa-regular fa-handshake"
  | "fa-regular fa-hdd"
  | "fa-regular fa-heart"
  | "fa-regular fa-hospital"
  | "fa-regular fa-hourglass"
  | "fa-regular fa-id-badge"
  | "fa-regular fa-id-card"
  | "fa-regular fa-image"
  | "fa-regular fa-images"
  | "fa-regular fa-keyboard"
  | "fa-regular fa-lemon"
  | "fa-regular fa-life-ring"
  | "fa-regular fa-lightbulb"
  | "fa-regular fa-list-alt"
  | "fa-regular fa-map"
  | "fa-regular fa-meh"
  | "fa-regular fa-minus-square"
  | "fa-regular fa-money-bill-alt"
  | "fa-regular fa-moon"
  | "fa-regular fa-newspaper"
  | "fa-regular fa-object-group"
  | "fa-regular fa-object-ungroup"
  | "fa-regular fa-paper-plane"
  | "fa-regular fa-pause-circle"
  | "fa-regular fa-play-circle"
  | "fa-regular fa-plus-square"
  | "fa-regular fa-question-circle"
  | "fa-regular fa-registered"
  | "fa-regular fa-save"
  | "fa-regular fa-share-square"
  | "fa-regular fa-smile"
  | "fa-regular fa-snowflake"
  | "fa-regular fa-square"
  | "fa-regular fa-star"
  | "fa-regular fa-star-half"
  | "fa-regular fa-sticky-note"
  | "fa-regular fa-stop-circle"
  | "fa-regular fa-sun"
  | "fa-regular fa-thumbs-down"
  | "fa-regular fa-thumbs-up"
  | "fa-regular fa-times-circle"
  | "fa-regular fa-trash-alt"
  | "fa-regular fa-user"
  | "fa-regular fa-user-circle"
  | "fa-regular fa-window-close"
  | "fa-regular fa-window-maximize"
  | "fa-regular fa-window-minimize"
  | "fa-regular fa-window-restore"
  | "fa-brands fa-500px"
  | "fa-brands fa-accessible-icon"
  | "fa-brands fa-accusoft"
  | "fa-brands fa-adn"
  | "fa-brands fa-adversal"
  | "fa-brands fa-affiliatetheme"
  | "fa-brands fa-algolia"
  | "fa-brands fa-amazon"
  | "fa-brands fa-amazon-pay"
  | "fa-brands fa-amilia"
  | "fa-brands fa-android"
  | "fa-brands fa-angellist"
  | "fa-brands fa-angrycreative"
  | "fa-brands fa-angular"
  | "fa-brands fa-app-store"
  | "fa-brands fa-app-store-ios"
  | "fa-brands fa-apper"
  | "fa-brands fa-apple"
  | "fa-brands fa-apple-pay"
  | "fa-brands fa-asymmetrik"
  | "fa-brands fa-audible"
  | "fa-brands fa-autoprefixer"
  | "fa-brands fa-avianex"
  | "fa-brands fa-aviato"
  | "fa-brands fa-aws"
  | "fa-brands fa-bandcamp"
  | "fa-brands fa-behance"
  | "fa-brands fa-behance-square"
  | "fa-brands fa-bimobject"
  | "fa-brands fa-bitbucket"
  | "fa-brands fa-bitcoin"
  | "fa-brands fa-bity"
  | "fa-brands fa-black-tie"
  | "fa-brands fa-blackberry"
  | "fa-brands fa-blogger"
  | "fa-brands fa-blogger-b"
  | "fa-brands fa-bluetooth"
  | "fa-brands fa-bluetooth-b"
  | "fa-brands fa-btc"
  | "fa-brands fa-buromobelexperte"
  | "fa-brands fa-buysellads"
  | "fa-brands fa-cc-amazon-pay"
  | "fa-brands fa-cc-amex"
  | "fa-brands fa-cc-apple-pay"
  | "fa-brands fa-cc-diners-club"
  | "fa-brands fa-cc-discover"
  | "fa-brands fa-cc-jcb"
  | "fa-brands fa-cc-mastercard"
  | "fa-brands fa-cc-paypal"
  | "fa-brands fa-cc-stripe"
  | "fa-brands fa-cc-visa"
  | "fa-brands fa-centercode"
  | "fa-brands fa-chrome"
  | "fa-brands fa-cloudscale"
  | "fa-brands fa-cloudsmith"
  | "fa-brands fa-cloudversify"
  | "fa-brands fa-codepen"
  | "fa-brands fa-codiepie"
  | "fa-brands fa-connectdevelop"
  | "fa-brands fa-contao"
  | "fa-brands fa-cpanel"
  | "fa-brands fa-creative-commons"
  | "fa-brands fa-css3"
  | "fa-brands fa-css3-alt"
  | "fa-brands fa-cuttlefish"
  | "fa-brands fa-d-and-d"
  | "fa-brands fa-dashcube"
  | "fa-brands fa-delicious"
  | "fa-brands fa-deploydog"
  | "fa-brands fa-deskpro"
  | "fa-brands fa-deviantart"
  | "fa-brands fa-digg"
  | "fa-brands fa-digital-ocean"
  | "fa-brands fa-discord"
  | "fa-brands fa-discourse"
  | "fa-brands fa-dochub"
  | "fa-brands fa-docker"
  | "fa-brands fa-draft2digital"
  | "fa-brands fa-dribbble"
  | "fa-brands fa-dribbble-square"
  | "fa-brands fa-dropbox"
  | "fa-brands fa-drupal"
  | "fa-brands fa-dyalog"
  | "fa-brands fa-earlybirds"
  | "fa-brands fa-edge"
  | "fa-brands fa-elementor"
  | "fa-brands fa-ember"
  | "fa-brands fa-empire"
  | "fa-brands fa-envira"
  | "fa-brands fa-erlang"
  | "fa-brands fa-ethereum"
  | "fa-brands fa-etsy"
  | "fa-brands fa-expeditedssl"
  | "fa-brands fa-facebook"
  | "fa-brands fa-facebook-f"
  | "fa-brands fa-facebook-messenger"
  | "fa-brands fa-facebook-square"
  | "fa-brands fa-firefox"
  | "fa-brands fa-first-order"
  | "fa-brands fa-firstdraft"
  | "fa-brands fa-flickr"
  | "fa-brands fa-flipboard"
  | "fa-brands fa-fly"
  | "fa-brands fa-font-awesome"
  | "fa-brands fa-font-awesome-alt"
  | "fa-brands fa-font-awesome-flag"
  | "fa-brands fa-fonticons"
  | "fa-brands fa-fonticons-fi"
  | "fa-brands fa-fort-awesome"
  | "fa-brands fa-fort-awesome-alt"
  | "fa-brands fa-forumbee"
  | "fa-brands fa-foursquare"
  | "fa-brands fa-free-code-camp"
  | "fa-brands fa-freebsd"
  | "fa-brands fa-get-pocket"
  | "fa-brands fa-gg"
  | "fa-brands fa-gg-circle"
  | "fa-brands fa-git"
  | "fa-brands fa-git-square"
  | "fa-brands fa-github"
  | "fa-brands fa-github-alt"
  | "fa-brands fa-github-square"
  | "fa-brands fa-gitkraken"
  | "fa-brands fa-gitlab"
  | "fa-brands fa-gitter"
  | "fa-brands fa-glide"
  | "fa-brands fa-glide-g"
  | "fa-brands fa-gofore"
  | "fa-brands fa-goodreads"
  | "fa-brands fa-goodreads-g"
  | "fa-brands fa-google"
  | "fa-brands fa-google-drive"
  | "fa-brands fa-google-play"
  | "fa-brands fa-google-plus"
  | "fa-brands fa-google-plus-g"
  | "fa-brands fa-google-plus-square"
  | "fa-brands fa-google-wallet"
  | "fa-brands fa-gratipay"
  | "fa-brands fa-grav"
  | "fa-brands fa-gripfire"
  | "fa-brands fa-grunt"
  | "fa-brands fa-gulp"
  | "fa-brands fa-hacker-news"
  | "fa-brands fa-hacker-news-square"
  | "fa-brands fa-hips"
  | "fa-brands fa-hire-a-helper"
  | "fa-brands fa-hooli"
  | "fa-brands fa-hotjar"
  | "fa-brands fa-houzz"
  | "fa-brands fa-html5"
  | "fa-brands fa-hubspot"
  | "fa-brands fa-imdb"
  | "fa-brands fa-instagram"
  | "fa-brands fa-internet-explorer"
  | "fa-brands fa-ioxhost"
  | "fa-brands fa-itunes"
  | "fa-brands fa-itunes-note"
  | "fa-brands fa-jenkins"
  | "fa-brands fa-joget"
  | "fa-brands fa-joomla"
  | "fa-brands fa-js"
  | "fa-brands fa-js-square"
  | "fa-brands fa-jsfiddle"
  | "fa-brands fa-keycdn"
  | "fa-brands fa-kickstarter"
  | "fa-brands fa-kickstarter-k"
  | "fa-brands fa-korvue"
  | "fa-brands fa-laravel"
  | "fa-brands fa-lastfm"
  | "fa-brands fa-lastfm-square"
  | "fa-brands fa-leanpub"
  | "fa-brands fa-less"
  | "fa-brands fa-line"
  | "fa-brands fa-linkedin"
  | "fa-brands fa-linkedin-in"
  | "fa-brands fa-linode"
  | "fa-brands fa-linux"
  | "fa-brands fa-lyft"
  | "fa-brands fa-magento"
  | "fa-brands fa-markdown"
  | "fa-brands fa-maxcdn"
  | "fa-brands fa-medapps"
  | "fa-brands fa-medium"
  | "fa-brands fa-medium-m"
  | "fa-brands fa-medrt"
  | "fa-brands fa-meetup"
  | "fa-brands fa-microsoft"
  | "fa-brands fa-mix"
  | "fa-brands fa-mixcloud"
  | "fa-brands fa-mizuni"
  | "fa-brands fa-modx"
  | "fa-brands fa-monero"
  | "fa-brands fa-napster"
  | "fa-brands fa-nintendo-switch"
  | "fa-brands fa-node"
  | "fa-brands fa-node-js"
  | "fa-brands fa-npm"
  | "fa-brands fa-ns8"
  | "fa-brands fa-nutritionix"
  | "fa-brands fa-odnoklassniki"
  | "fa-brands fa-odnoklassniki-square"
  | "fa-brands fa-opencart"
  | "fa-brands fa-openid"
  | "fa-brands fa-opera"
  | "fa-brands fa-optin-monster"
  | "fa-brands fa-osi"
  | "fa-brands fa-page4"
  | "fa-brands fa-pagelines"
  | "fa-brands fa-palfed"
  | "fa-brands fa-patreon"
  | "fa-brands fa-paypal"
  | "fa-brands fa-periscope"
  | "fa-brands fa-phabricator"
  | "fa-brands fa-phoenix-framework"
  | "fa-brands fa-php"
  | "fa-brands fa-pied-piper"
  | "fa-brands fa-pied-piper-alt"
  | "fa-brands fa-pied-piper-pp"
  | "fa-brands fa-pinterest"
  | "fa-brands fa-pinterest-p"
  | "fa-brands fa-pinterest-square"
  | "fa-brands fa-playstation"
  | "fa-brands fa-product-hunt"
  | "fa-brands fa-pushed"
  | "fa-brands fa-python"
  | "fa-brands fa-qq"
  | "fa-brands fa-quinscape"
  | "fa-brands fa-quora"
  | "fa-brands fa-ravelry"
  | "fa-brands fa-react"
  | "fa-brands fa-readme"
  | "fa-brands fa-rebel"
  | "fa-brands fa-red-river"
  | "fa-brands fa-reddit"
  | "fa-brands fa-reddit-alien"
  | "fa-brands fa-reddit-square"
  | "fa-brands fa-rendact"
  | "fa-brands fa-renren"
  | "fa-brands fa-replyd"
  | "fa-brands fa-resolving"
  | "fa-brands fa-rocketchat"
  | "fa-brands fa-rockrms"
  | "fa-brands fa-safari"
  | "fa-brands fa-sass"
  | "fa-brands fa-schlix"
  | "fa-brands fa-scribd"
  | "fa-brands fa-searchengin"
  | "fa-brands fa-sellcast"
  | "fa-brands fa-sellsy"
  | "fa-brands fa-servicestack"
  | "fa-brands fa-shirtsinbulk"
  | "fa-brands fa-simplybuilt"
  | "fa-brands fa-sistrix"
  | "fa-brands fa-skyatlas"
  | "fa-brands fa-skype"
  | "fa-brands fa-slack"
  | "fa-brands fa-slack-hash"
  | "fa-brands fa-slideshare"
  | "fa-brands fa-snapchat"
  | "fa-brands fa-snapchat-ghost"
  | "fa-brands fa-snapchat-square"
  | "fa-brands fa-soundcloud"
  | "fa-brands fa-speakap"
  | "fa-brands fa-spotify"
  | "fa-brands fa-stack-exchange"
  | "fa-brands fa-stack-overflow"
  | "fa-brands fa-staylinked"
  | "fa-brands fa-steam"
  | "fa-brands fa-steam-square"
  | "fa-brands fa-steam-symbol"
  | "fa-brands fa-sticker-mule"
  | "fa-brands fa-strava"
  | "fa-brands fa-stripe"
  | "fa-brands fa-stripe-s"
  | "fa-brands fa-studiovinari"
  | "fa-brands fa-stumbleupon"
  | "fa-brands fa-stumbleupon-circle"
  | "fa-brands fa-superpowers"
  | "fa-brands fa-supple"
  | "fa-brands fa-telegram"
  | "fa-brands fa-telegram-plane"
  | "fa-brands fa-tencent-weibo"
  | "fa-brands fa-themeisle"
  | "fa-brands fa-trello"
  | "fa-brands fa-tripadvisor"
  | "fa-brands fa-tumblr"
  | "fa-brands fa-tumblr-square"
  | "fa-brands fa-twitch"
  | "fa-brands fa-twitter"
  | "fa-brands fa-twitter-square"
  | "fa-brands fa-typo3"
  | "fa-brands fa-uber"
  | "fa-brands fa-uikit"
  | "fa-brands fa-uniregistry"
  | "fa-brands fa-untappd"
  | "fa-brands fa-usb"
  | "fa-brands fa-ussunnah"
  | "fa-brands fa-vaadin"
  | "fa-brands fa-viacoin"
  | "fa-brands fa-viadeo"
  | "fa-brands fa-viadeo-square"
  | "fa-brands fa-viber"
  | "fa-brands fa-vimeo"
  | "fa-brands fa-vimeo-square"
  | "fa-brands fa-vimeo-v"
  | "fa-brands fa-vine"
  | "fa-brands fa-vk"
  | "fa-brands fa-vnv"
  | "fa-brands fa-vuejs"
  | "fa-brands fa-weibo"
  | "fa-brands fa-weixin"
  | "fa-brands fa-whatsapp"
  | "fa-brands fa-whatsapp-square"
  | "fa-brands fa-whmcs"
  | "fa-brands fa-wikipedia-w"
  | "fa-brands fa-windows"
  | "fa-brands fa-wordpress"
  | "fa-brands fa-wordpress-simple"
  | "fa-brands fa-wpbeginner"
  | "fa-brands fa-wpexplorer"
  | "fa-brands fa-wpforms"
  | "fa-brands fa-xbox"
  | "fa-brands fa-xing"
  | "fa-brands fa-xing-square"
  | "fa-brands fa-y-combinator"
  | "fa-brands fa-yahoo"
  | "fa-brands fa-yandex"
  | "fa-brands fa-yandex-international"
  | "fa-brands fa-yelp"
  | "fa-brands fa-yoast"
  | "fa-brands fa-youtube"
  | "fa-brands fa-youtube-square";

export const SolidAddressBook: IconType = "fa-solid fa-address-book";
export const SolidAddressCard: IconType = "fa-solid fa-address-card";
export const SolidAdjust: IconType = "fa-solid fa-adjust";
export const SolidAlignCenter: IconType = "fa-solid fa-align-center";
export const SolidAlignJustify: IconType = "fa-solid fa-align-justify";
export const SolidAlignLeft: IconType = "fa-solid fa-align-left";
export const SolidAlignRight: IconType = "fa-solid fa-align-right";
export const SolidAllergies: IconType = "fa-solid fa-allergies";
export const SolidAmbulance: IconType = "fa-solid fa-ambulance";
export const SolidAmericanSignLanguageInterpreting: IconType =
  "fa-solid fa-american-sign-language-interpreting";
export const SolidAnchor: IconType = "fa-solid fa-anchor";
export const SolidAngleDoubleDown: IconType = "fa-solid fa-angle-double-down";
export const SolidAngleDoubleLeft: IconType = "fa-solid fa-angle-double-left";
export const SolidAngleDoubleRight: IconType = "fa-solid fa-angle-double-right";
export const SolidAngleDoubleUp: IconType = "fa-solid fa-angle-double-up";
export const SolidAngleDown: IconType = "fa-solid fa-angle-down";
export const SolidAngleLeft: IconType = "fa-solid fa-angle-left";
export const SolidAngleRight: IconType = "fa-solid fa-angle-right";
export const SolidAngleUp: IconType = "fa-solid fa-angle-up";
export const SolidArchive: IconType = "fa-solid fa-archive";
export const SolidArrowAltCircleDown: IconType =
  "fa-solid fa-arrow-alt-circle-down";
export const SolidArrowAltCircleLeft: IconType =
  "fa-solid fa-arrow-alt-circle-left";
export const SolidArrowAltCircleRight: IconType =
  "fa-solid fa-arrow-alt-circle-right";
export const SolidArrowAltCircleUp: IconType =
  "fa-solid fa-arrow-alt-circle-up";
export const SolidArrowCircleDown: IconType = "fa-solid fa-arrow-circle-down";
export const SolidArrowCircleLeft: IconType = "fa-solid fa-arrow-circle-left";
export const SolidArrowCircleRight: IconType = "fa-solid fa-arrow-circle-right";
export const SolidArrowCircleUp: IconType = "fa-solid fa-arrow-circle-up";
export const SolidArrowDown: IconType = "fa-solid fa-arrow-down";
export const SolidArrowLeft: IconType = "fa-solid fa-arrow-left";
export const SolidArrowRight: IconType = "fa-solid fa-arrow-right";
export const SolidArrowUp: IconType = "fa-solid fa-arrow-up";
export const SolidArrowUpFromBracket: IconType =
  "fa-soild fa-arrow-up-from-bracket";
export const SolidArrowsAlt: IconType = "fa-solid fa-arrows-alt";
export const SolidArrowsAltH: IconType = "fa-solid fa-arrows-alt-h";
export const SolidArrowsAltV: IconType = "fa-solid fa-arrows-alt-v";
export const SolidAssistiveListeningSystems: IconType =
  "fa-solid fa-assistive-listening-systems";
export const SolidAsterisk: IconType = "fa-solid fa-asterisk";
export const SolidAt: IconType = "fa-solid fa-at";
export const SolidAudioDescription: IconType = "fa-solid fa-audio-description";
export const SolidBackward: IconType = "fa-solid fa-backward";
export const SolidBalanceScale: IconType = "fa-solid fa-balance-scale";
export const SolidBan: IconType = "fa-solid fa-ban";
export const SolidBandAid: IconType = "fa-solid fa-band-aid";
export const SolidBarcode: IconType = "fa-solid fa-barcode";
export const SolidBars: IconType = "fa-solid fa-bars";
export const SolidBaseballBall: IconType = "fa-solid fa-baseball-ball";
export const SolidBasketballBall: IconType = "fa-solid fa-basketball-ball";
export const SolidBath: IconType = "fa-solid fa-bath";
export const SolidBatteryEmpty: IconType = "fa-solid fa-battery-empty";
export const SolidBatteryFull: IconType = "fa-solid fa-battery-full";
export const SolidBatteryHalf: IconType = "fa-solid fa-battery-half";
export const SolidBatteryQuarter: IconType = "fa-solid fa-battery-quarter";
export const SolidBatteryThreeQuarters: IconType =
  "fa-solid fa-battery-three-quarters";
export const SolidBed: IconType = "fa-solid fa-bed";
export const SolidBeer: IconType = "fa-solid fa-beer";
export const SolidBell: IconType = "fa-solid fa-bell";
export const SolidBellSlash: IconType = "fa-solid fa-bell-slash";
export const SolidBicycle: IconType = "fa-solid fa-bicycle";
export const SolidBinoculars: IconType = "fa-solid fa-binoculars";
export const SolidBirthdayCake: IconType = "fa-solid fa-birthday-cake";
export const SolidBlind: IconType = "fa-solid fa-blind";
export const SolidBold: IconType = "fa-solid fa-bold";
export const SolidBolt: IconType = "fa-solid fa-bolt";
export const SolidBomb: IconType = "fa-solid fa-bomb";
export const SolidBook: IconType = "fa-solid fa-book";
export const SolidBookmark: IconType = "fa-solid fa-bookmark";
export const SolidBorderAll: IconType = "fa-solid fa-border-all";
export const SolidBowlingBall: IconType = "fa-solid fa-bowling-ball";
export const SolidBox: IconType = "fa-solid fa-box";
export const SolidBoxOpen: IconType = "fa-solid fa-box-open";
export const SolidBoxes: IconType = "fa-solid fa-boxes";
export const SolidBraille: IconType = "fa-solid fa-braille";
export const SolidBriefcase: IconType = "fa-solid fa-briefcase";
export const SolidBriefcaseMedical: IconType = "fa-solid fa-briefcase-medical";
export const SolidBug: IconType = "fa-solid fa-bug";
export const SolidBuilding: IconType = "fa-solid fa-building";
export const SolidBullhorn: IconType = "fa-solid fa-bullhorn";
export const SolidBullseye: IconType = "fa-solid fa-bullseye";
export const SolidBurn: IconType = "fa-solid fa-burn";
export const SolidBus: IconType = "fa-solid fa-bus";
export const SolidCalculator: IconType = "fa-solid fa-calculator";
export const SolidCalendar: IconType = "fa-solid fa-calendar";
export const SolidCalendarAlt: IconType = "fa-solid fa-calendar-alt";
export const SolidCalendarCheck: IconType = "fa-solid fa-calendar-check";
export const SolidCalendarMinus: IconType = "fa-solid fa-calendar-minus";
export const SolidCalendarPlus: IconType = "fa-solid fa-calendar-plus";
export const SolidCalendarTimes: IconType = "fa-solid fa-calendar-times";
export const SolidCamera: IconType = "fa-solid fa-camera";
export const SolidCameraRetro: IconType = "fa-solid fa-camera-retro";
export const SolidCapsules: IconType = "fa-solid fa-capsules";
export const SolidCar: IconType = "fa-solid fa-car";
export const SolidCaretDown: IconType = "fa-solid fa-caret-down";
export const SolidCaretLeft: IconType = "fa-solid fa-caret-left";
export const SolidCaretRight: IconType = "fa-solid fa-caret-right";
export const SolidCaretSquareDown: IconType = "fa-solid fa-caret-square-down";
export const SolidCaretSquareLeft: IconType = "fa-solid fa-caret-square-left";
export const SolidCaretSquareRight: IconType = "fa-solid fa-caret-square-right";
export const SolidCaretSquareUp: IconType = "fa-solid fa-caret-square-up";
export const SolidCaretUp: IconType = "fa-solid fa-caret-up";
export const SolidCartArrowDown: IconType = "fa-solid fa-cart-arrow-down";
export const SolidCartPlus: IconType = "fa-solid fa-cart-plus";
export const SolidCertificate: IconType = "fa-solid fa-certificate";
export const SolidChartArea: IconType = "fa-solid fa-chart-area";
export const SolidChartBar: IconType = "fa-solid fa-chart-bar";
export const SolidChartLine: IconType = "fa-solid fa-chart-line";
export const SolidChartPie: IconType = "fa-solid fa-chart-pie";
export const SolidCheck: IconType = "fa-solid fa-check";
export const SolidCheckCircle: IconType = "fa-solid fa-check-circle";
export const SolidCheckSquare: IconType = "fa-solid fa-check-square";
export const SolidChess: IconType = "fa-solid fa-chess";
export const SolidChessBishop: IconType = "fa-solid fa-chess-bishop";
export const SolidChessBoard: IconType = "fa-solid fa-chess-board";
export const SolidChessKing: IconType = "fa-solid fa-chess-king";
export const SolidChessKnight: IconType = "fa-solid fa-chess-knight";
export const SolidChessPawn: IconType = "fa-solid fa-chess-pawn";
export const SolidChessQueen: IconType = "fa-solid fa-chess-queen";
export const SolidChessRook: IconType = "fa-solid fa-chess-rook";
export const SolidChevronCircleDown: IconType =
  "fa-solid fa-chevron-circle-down";
export const SolidChevronCircleLeft: IconType =
  "fa-solid fa-chevron-circle-left";
export const SolidChevronCircleRight: IconType =
  "fa-solid fa-chevron-circle-right";
export const SolidChevronCircleUp: IconType = "fa-solid fa-chevron-circle-up";
export const SolidChevronDown: IconType = "fa-solid fa-chevron-down";
export const SolidChevronLeft: IconType = "fa-solid fa-chevron-left";
export const SolidChevronRight: IconType = "fa-solid fa-chevron-right";
export const SolidChevronUp: IconType = "fa-solid fa-chevron-up";
export const SolidChild: IconType = "fa-solid fa-child";
export const SolidCircle: IconType = "fa-solid fa-circle";
export const SolidCircleNotch: IconType = "fa-solid fa-circle-notch";
export const SolidClipboard: IconType = "fa-solid fa-clipboard";
export const SolidClipboardCheck: IconType = "fa-solid fa-clipboard-check";
export const SolidClipboardList: IconType = "fa-solid fa-clipboard-list";
export const SolidClock: IconType = "fa-solid fa-clock";
export const SolidClone: IconType = "fa-solid fa-clone";
export const SolidClosedCaptioning: IconType = "fa-solid fa-closed-captioning";
export const SolidCloud: IconType = "fa-solid fa-cloud";
export const SolidCloudDownloadAlt: IconType = "fa-solid fa-cloud-download-alt";
export const SolidCloudUploadAlt: IconType = "fa-solid fa-cloud-upload-alt";
export const SolidCode: IconType = "fa-solid fa-code";
export const SolidCodeBranch: IconType = "fa-solid fa-code-branch";
export const SolidCoffee: IconType = "fa-solid fa-coffee";
export const SolidCog: IconType = "fa-solid fa-cog";
export const SolidCogs: IconType = "fa-solid fa-cogs";
export const SolidColumns: IconType = "fa-solid fa-columns";
export const SolidComment: IconType = "fa-solid fa-comment";
export const SolidCommentAlt: IconType = "fa-solid fa-comment-alt";
export const SolidCommentDots: IconType = "fa-solid fa-comment-dots";
export const SolidCommentSlash: IconType = "fa-solid fa-comment-slash";
export const SolidComments: IconType = "fa-solid fa-comments";
export const SolidCompass: IconType = "fa-solid fa-compass";
export const SolidCompress: IconType = "fa-solid fa-compress";
export const SolidCopy: IconType = "fa-solid fa-copy";
export const SolidCopyright: IconType = "fa-solid fa-copyright";
export const SolidCouch: IconType = "fa-solid fa-couch";
export const SolidCreditCard: IconType = "fa-solid fa-credit-card";
export const SolidCrop: IconType = "fa-solid fa-crop";
export const SolidCrosshairs: IconType = "fa-solid fa-crosshairs";
export const SolidCube: IconType = "fa-solid fa-cube";
export const SolidCubes: IconType = "fa-solid fa-cubes";
export const SolidCut: IconType = "fa-solid fa-cut";
export const SolidDatabase: IconType = "fa-solid fa-database";
export const SolidDeaf: IconType = "fa-solid fa-deaf";
export const SolidDesktop: IconType = "fa-solid fa-desktop";
export const SolidDiagnoses: IconType = "fa-solid fa-diagnoses";
export const SolidDna: IconType = "fa-solid fa-dna";
export const SolidDollarSign: IconType = "fa-solid fa-dollar-sign";
export const SolidDolly: IconType = "fa-solid fa-dolly";
export const SolidDollyFlatbed: IconType = "fa-solid fa-dolly-flatbed";
export const SolidDonate: IconType = "fa-solid fa-donate";
export const SolidDotCircle: IconType = "fa-solid fa-dot-circle";
export const SolidDove: IconType = "fa-solid fa-dove";
export const SolidDownload: IconType = "fa-solid fa-download";
export const SolidEdit: IconType = "fa-solid fa-edit";
export const SolidEject: IconType = "fa-solid fa-eject";
export const SolidEllipsisH: IconType = "fa-solid fa-ellipsis-h";
export const SolidEllipsisV: IconType = "fa-solid fa-ellipsis-v";
export const SolidEnvelope: IconType = "fa-solid fa-envelope";
export const SolidEnvelopeOpen: IconType = "fa-solid fa-envelope-open";
export const SolidEnvelopeSquare: IconType = "fa-solid fa-envelope-square";
export const SolidEraser: IconType = "fa-solid fa-eraser";
export const SolidEuroSign: IconType = "fa-solid fa-euro-sign";
export const SolidExchangeAlt: IconType = "fa-solid fa-exchange-alt";
export const SolidExclamation: IconType = "fa-solid fa-exclamation";
export const SolidExclamationCircle: IconType =
  "fa-solid fa-exclamation-circle";
export const SolidExclamationTriangle: IconType =
  "fa-solid fa-exclamation-triangle";
export const SolidExpand: IconType = "fa-solid fa-expand";
export const SolidExpandArrowsAlt: IconType = "fa-solid fa-expand-arrows-alt";
export const SolidExternalLinkAlt: IconType = "fa-solid fa-external-link-alt";
export const SolidExternalLinkSquareAlt: IconType =
  "fa-solid fa-external-link-square-alt";
export const SolidEye: IconType = "fa-solid fa-eye";
export const SolidEyeDropper: IconType = "fa-solid fa-eye-dropper";
export const SolidEyeSlash: IconType = "fa-solid fa-eye-slash";
export const SolidFaSolidtBackward: IconType = "fa-solid fa-fa-solidt-backward";
export const SolidFaSolidtForward: IconType = "fa-solid fa-fa-solidt-forward";
export const SolidFax: IconType = "fa-solid fa-fax";
export const SolidFemale: IconType = "fa-solid fa-female";
export const SolidFighterJet: IconType = "fa-solid fa-fighter-jet";
export const SolidFile: IconType = "fa-solid fa-file";
export const SolidFileAlt: IconType = "fa-solid fa-file-alt";
export const SolidFileArchive: IconType = "fa-solid fa-file-archive";
export const SolidFileAudio: IconType = "fa-solid fa-file-audio";
export const SolidFileCode: IconType = "fa-solid fa-file-code";
export const SolidFileExcel: IconType = "fa-solid fa-file-excel";
export const SolidFileImage: IconType = "fa-solid fa-file-image";
export const SolidFileMedical: IconType = "fa-solid fa-file-medical";
export const SolidFileMedicalAlt: IconType = "fa-solid fa-file-medical-alt";
export const SolidFilePdf: IconType = "fa-solid fa-file-pdf";
export const SolidFilePowerpoint: IconType = "fa-solid fa-file-powerpoint";
export const SolidFileVideo: IconType = "fa-solid fa-file-video";
export const SolidFileWord: IconType = "fa-solid fa-file-word";
export const SolidFilm: IconType = "fa-solid fa-film";
export const SolidFilter: IconType = "fa-solid fa-filter";
export const SolidFire: IconType = "fa-solid fa-fire";
export const SolidFireExtinguisher: IconType = "fa-solid fa-fire-extinguisher";
export const SolidFirstAid: IconType = "fa-solid fa-first-aid";
export const SolidFlag: IconType = "fa-solid fa-flag";
export const SolidFlagCheckered: IconType = "fa-solid fa-flag-checkered";
export const SolidFlask: IconType = "fa-solid fa-flask";
export const SolidFolder: IconType = "fa-solid fa-folder";
export const SolidFolderOpen: IconType = "fa-solid fa-folder-open";
export const SolidFont: IconType = "fa-solid fa-font";
export const SolidFootballBall: IconType = "fa-solid fa-football-ball";
export const SolidForward: IconType = "fa-solid fa-forward";
export const SolidFrown: IconType = "fa-solid fa-frown";
export const SolidFutbol: IconType = "fa-solid fa-futbol";
export const SolidGamepad: IconType = "fa-solid fa-gamepad";
export const SolidGavel: IconType = "fa-solid fa-gavel";
export const SolidGem: IconType = "fa-solid fa-gem";
export const SolidGenderless: IconType = "fa-solid fa-genderless";
export const SolidGift: IconType = "fa-solid fa-gift";
export const SolidGlassMartini: IconType = "fa-solid fa-glass-martini";
export const SolidGlobe: IconType = "fa-solid fa-globe";
export const SolidGolfBall: IconType = "fa-solid fa-golf-ball";
export const SolidGraduationCap: IconType = "fa-solid fa-graduation-cap";
export const SolidHSquare: IconType = "fa-solid fa-h-square";
export const SolidHandHolding: IconType = "fa-solid fa-hand-holding";
export const SolidHandHoldingHeart: IconType = "fa-solid fa-hand-holding-heart";
export const SolidHandHoldingUsd: IconType = "fa-solid fa-hand-holding-usd";
export const SolidHandLizard: IconType = "fa-solid fa-hand-lizard";
export const SolidHandPaper: IconType = "fa-solid fa-hand-paper";
export const SolidHandPeace: IconType = "fa-solid fa-hand-peace";
export const SolidHandPointDown: IconType = "fa-solid fa-hand-point-down";
export const SolidHandPointLeft: IconType = "fa-solid fa-hand-point-left";
export const SolidHandPointRight: IconType = "fa-solid fa-hand-point-right";
export const SolidHandPointUp: IconType = "fa-solid fa-hand-point-up";
export const SolidHandPointer: IconType = "fa-solid fa-hand-pointer";
export const SolidHandRock: IconType = "fa-solid fa-hand-rock";
export const SolidHandScissors: IconType = "fa-solid fa-hand-scissors";
export const SolidHandSpock: IconType = "fa-solid fa-hand-spock";
export const SolidHands: IconType = "fa-solid fa-hands";
export const SolidHandsHelping: IconType = "fa-solid fa-hands-helping";
export const SolidHandshake: IconType = "fa-solid fa-handshake";
export const SolidHashtag: IconType = "fa-solid fa-hashtag";
export const SolidHdd: IconType = "fa-solid fa-hdd";
export const SolidHeading: IconType = "fa-solid fa-heading";
export const SolidHeadphones: IconType = "fa-solid fa-headphones";
export const SolidHeart: IconType = "fa-solid fa-heart";
export const SolidHeartbeat: IconType = "fa-solid fa-heartbeat";
export const SolidHistory: IconType = "fa-solid fa-history";
export const SolidHockeyPuck: IconType = "fa-solid fa-hockey-puck";
export const SolidHome: IconType = "fa-solid fa-home";
export const SolidHospital: IconType = "fa-solid fa-hospital";
export const SolidHospitalAlt: IconType = "fa-solid fa-hospital-alt";
export const SolidHospitalSymbol: IconType = "fa-solid fa-hospital-symbol";
export const SolidHourglass: IconType = "fa-solid fa-hourglass";
export const SolidHourglassEnd: IconType = "fa-solid fa-hourglass-end";
export const SolidHourglassHalf: IconType = "fa-solid fa-hourglass-half";
export const SolidHourglassStart: IconType = "fa-solid fa-hourglass-start";
export const SolidICursor: IconType = "fa-solid fa-i-cursor";
export const SolidIdBadge: IconType = "fa-solid fa-id-badge";
export const SolidIdCard: IconType = "fa-solid fa-id-card";
export const SolidIdCardAlt: IconType = "fa-solid fa-id-card-alt";
export const SolidImage: IconType = "fa-solid fa-image";
export const SolidImages: IconType = "fa-solid fa-images";
export const SolidInbox: IconType = "fa-solid fa-inbox";
export const SolidIndent: IconType = "fa-solid fa-indent";
export const SolidIndustry: IconType = "fa-solid fa-industry";
export const SolidInfo: IconType = "fa-solid fa-info";
export const SolidInfoCircle: IconType = "fa-solid fa-info-circle";
export const SolidItalic: IconType = "fa-solid fa-italic";
export const SolidKey: IconType = "fa-solid fa-key";
export const SolidKeyboard: IconType = "fa-solid fa-keyboard";
export const SolidLanguage: IconType = "fa-solid fa-language";
export const SolidLaptop: IconType = "fa-solid fa-laptop";
export const SolidLayerGroup: IconType = "fa-solid fa-layer-group";
export const SolidLeaf: IconType = "fa-solid fa-leaf";
export const SolidLemon: IconType = "fa-solid fa-lemon";
export const SolidLevelDownAlt: IconType = "fa-solid fa-level-down-alt";
export const SolidLevelUpAlt: IconType = "fa-solid fa-level-up-alt";
export const SolidLifeRing: IconType = "fa-solid fa-life-ring";
export const SolidLightbulb: IconType = "fa-solid fa-lightbulb";
export const SolidLink: IconType = "fa-solid fa-link";
export const SolidLiraSign: IconType = "fa-solid fa-lira-sign";
export const SolidList: IconType = "fa-solid fa-list";
export const SolidListAlt: IconType = "fa-solid fa-list-alt";
export const SolidListOl: IconType = "fa-solid fa-list-ol";
export const SolidListUl: IconType = "fa-solid fa-list-ul";
export const SolidLocationArrow: IconType = "fa-solid fa-location-arrow";
export const SolidLock: IconType = "fa-solid fa-lock";
export const SolidLockOpen: IconType = "fa-solid fa-lock-open";
export const SolidLongArrowAltDown: IconType =
  "fa-solid fa-long-arrow-alt-down";
export const SolidLongArrowAltLeft: IconType =
  "fa-solid fa-long-arrow-alt-left";
export const SolidLongArrowAltRight: IconType =
  "fa-solid fa-long-arrow-alt-right";
export const SolidLongArrowAltUp: IconType = "fa-solid fa-long-arrow-alt-up";
export const SolidLowVision: IconType = "fa-solid fa-low-vision";
export const SolidMagic: IconType = "fa-solid fa-magic";
export const SolidMagnet: IconType = "fa-solid fa-magnet";
export const SolidMale: IconType = "fa-solid fa-male";
export const SolidMap: IconType = "fa-solid fa-map";
export const SolidMapMarker: IconType = "fa-solid fa-map-marker";
export const SolidMapMarkerAlt: IconType = "fa-solid fa-map-marker-alt";
export const SolidMapPin: IconType = "fa-solid fa-map-pin";
export const SolidMapSigns: IconType = "fa-solid fa-map-signs";
export const SolidMars: IconType = "fa-solid fa-mars";
export const SolidMarsDouble: IconType = "fa-solid fa-mars-double";
export const SolidMarsStroke: IconType = "fa-solid fa-mars-stroke";
export const SolidMarsStrokeH: IconType = "fa-solid fa-mars-stroke-h";
export const SolidMarsStrokeV: IconType = "fa-solid fa-mars-stroke-v";
export const SolidMedkit: IconType = "fa-solid fa-medkit";
export const SolidMeh: IconType = "fa-solid fa-meh";
export const SolidMercury: IconType = "fa-solid fa-mercury";
export const SolidMicrochip: IconType = "fa-solid fa-microchip";
export const SolidMicrophone: IconType = "fa-solid fa-microphone";
export const SolidMicrophoneSlash: IconType = "fa-solid fa-microphone-slash";
export const SolidMinus: IconType = "fa-solid fa-minus";
export const SolidMinusCircle: IconType = "fa-solid fa-minus-circle";
export const SolidMinusSquare: IconType = "fa-solid fa-minus-square";
export const SolidMobile: IconType = "fa-solid fa-mobile";
export const SolidMobileAlt: IconType = "fa-solid fa-mobile-alt";
export const SolidMoneyBillAlt: IconType = "fa-solid fa-money-bill-alt";
export const SolidMoon: IconType = "fa-solid fa-moon";
export const SolidMotorcycle: IconType = "fa-solid fa-motorcycle";
export const SolidMousePointer: IconType = "fa-solid fa-mouse-pointer";
export const SolidMusic: IconType = "fa-solid fa-music";
export const SolidNeuter: IconType = "fa-solid fa-neuter";
export const SolidNewspaper: IconType = "fa-solid fa-newspaper";
export const SolidNotesMedical: IconType = "fa-solid fa-notes-medical";
export const SolidObjectGroup: IconType = "fa-solid fa-object-group";
export const SolidObjectUngroup: IconType = "fa-solid fa-object-ungroup";
export const SolidOutdent: IconType = "fa-solid fa-outdent";
export const SolidPaintBrush: IconType = "fa-solid fa-paint-brush";
export const SolidPalette: IconType = "fa-solid fa-palette";
export const SolidPallet: IconType = "fa-solid fa-pallet";
export const SolidPaperPlane: IconType = "fa-solid fa-paper-plane";
export const SolidPaperclip: IconType = "fa-solid fa-paperclip";
export const SolidParachuteBox: IconType = "fa-solid fa-parachute-box";
export const SolidParagraph: IconType = "fa-solid fa-paragraph";
export const SolidPaste: IconType = "fa-solid fa-paste";
export const SolidPause: IconType = "fa-solid fa-pause";
export const SolidPauseCircle: IconType = "fa-solid fa-pause-circle";
export const SolidPaw: IconType = "fa-solid fa-paw";
export const SolidPenSquare: IconType = "fa-solid fa-pen-square";
export const SolidPencilAlt: IconType = "fa-solid fa-pencil-alt";
export const SolidPeopleCarry: IconType = "fa-solid fa-people-carry";
export const SolidPercent: IconType = "fa-solid fa-percent";
export const SolidPhone: IconType = "fa-solid fa-phone";
export const SolidPhoneSlash: IconType = "fa-solid fa-phone-slash";
export const SolidPhoneSquare: IconType = "fa-solid fa-phone-square";
export const SolidPhoneVolume: IconType = "fa-solid fa-phone-volume";
export const SolidPiggyBank: IconType = "fa-solid fa-piggy-bank";
export const SolidPills: IconType = "fa-solid fa-pills";
export const SolidPlane: IconType = "fa-solid fa-plane";
export const SolidPlay: IconType = "fa-solid fa-play";
export const SolidPlayCircle: IconType = "fa-solid fa-play-circle";
export const SolidPlug: IconType = "fa-solid fa-plug";
export const SolidPlus: IconType = "fa-solid fa-plus";
export const SolidPlusCircle: IconType = "fa-solid fa-plus-circle";
export const SolidPlusSquare: IconType = "fa-solid fa-plus-square";
export const SolidPodcast: IconType = "fa-solid fa-podcast";
export const SolidPoo: IconType = "fa-solid fa-poo";
export const SolidPoundSign: IconType = "fa-solid fa-pound-sign";
export const SolidPowerOff: IconType = "fa-solid fa-power-off";
export const SolidPrescriptionBottle: IconType =
  "fa-solid fa-prescription-bottle";
export const SolidPrescriptionBottleAlt: IconType =
  "fa-solid fa-prescription-bottle-alt";
export const SolidPrint: IconType = "fa-solid fa-print";
export const SolidProcedures: IconType = "fa-solid fa-procedures";
export const SolidPuzzlePiece: IconType = "fa-solid fa-puzzle-piece";
export const SolidQrcode: IconType = "fa-solid fa-qrcode";
export const SolidQuestion: IconType = "fa-solid fa-question";
export const SolidQuestionCircle: IconType = "fa-solid fa-question-circle";
export const SolidQuidditch: IconType = "fa-solid fa-quidditch";
export const SolidQuoteLeft: IconType = "fa-solid fa-quote-left";
export const SolidQuoteRight: IconType = "fa-solid fa-quote-right";
export const SolidRandom: IconType = "fa-solid fa-random";
export const SolidRecycle: IconType = "fa-solid fa-recycle";
export const SolidRedo: IconType = "fa-solid fa-redo";
export const SolidRedoAlt: IconType = "fa-solid fa-redo-alt";
export const SolidRegistered: IconType = "fa-solid fa-registered";
export const SolidReply: IconType = "fa-solid fa-reply";
export const SolidReplyAll: IconType = "fa-solid fa-reply-all";
export const SolidRetweet: IconType = "fa-solid fa-retweet";
export const SolidRibbon: IconType = "fa-solid fa-ribbon";
export const SolidRoad: IconType = "fa-solid fa-road";
export const SolidRocket: IconType = "fa-solid fa-rocket";
export const SolidRss: IconType = "fa-solid fa-rss";
export const SolidRssSquare: IconType = "fa-solid fa-rss-square";
export const SolidRubleSign: IconType = "fa-solid fa-ruble-sign";
export const SolidRupeeSign: IconType = "fa-solid fa-rupee-sign";
export const SolidSave: IconType = "fa-solid fa-save";
export const SolidSearch: IconType = "fa-solid fa-search";
export const SolidSearchMinus: IconType = "fa-solid fa-search-minus";
export const SolidSearchPlus: IconType = "fa-solid fa-search-plus";
export const SolidSeedling: IconType = "fa-solid fa-seedling";
export const SolidServer: IconType = "fa-solid fa-server";
export const SolidShare: IconType = "fa-solid fa-share";
export const SolidShareAlt: IconType = "fa-solid fa-share-alt";
export const SolidShareAltSquare: IconType = "fa-solid fa-share-alt-square";
export const SolidShareSquare: IconType = "fa-solid fa-share-square";
export const SolidShekelSign: IconType = "fa-solid fa-shekel-sign";
export const SolidShieldAlt: IconType = "fa-solid fa-shield-alt";
export const SolidShip: IconType = "fa-solid fa-ship";
export const SolidShippingFaSolidt: IconType = "fa-solid fa-shipping-fa-solidt";
export const SolidShoppingBag: IconType = "fa-solid fa-shopping-bag";
export const SolidShoppingBasket: IconType = "fa-solid fa-shopping-basket";
export const SolidShoppingCart: IconType = "fa-solid fa-shopping-cart";
export const SolidShower: IconType = "fa-solid fa-shower";
export const SolidSign: IconType = "fa-solid fa-sign";
export const SolidSignInAlt: IconType = "fa-solid fa-sign-in-alt";
export const SolidSignLanguage: IconType = "fa-solid fa-sign-language";
export const SolidSignOutAlt: IconType = "fa-solid fa-sign-out-alt";
export const SolidSignal: IconType = "fa-solid fa-signal";
export const SolidSitemap: IconType = "fa-solid fa-sitemap";
export const SolidSlidersH: IconType = "fa-solid fa-sliders-h";
export const SolidSmile: IconType = "fa-solid fa-smile";
export const SolidSmoking: IconType = "fa-solid fa-smoking";
export const SolidSnowflake: IconType = "fa-solid fa-snowflake";
export const SolidSort: IconType = "fa-solid fa-sort";
export const SolidSortAlphaDown: IconType = "fa-solid fa-sort-alpha-down";
export const SolidSortAlphaUp: IconType = "fa-solid fa-sort-alpha-up";
export const SolidSortAmountDown: IconType = "fa-solid fa-sort-amount-down";
export const SolidSortAmountUp: IconType = "fa-solid fa-sort-amount-up";
export const SolidSortDown: IconType = "fa-solid fa-sort-down";
export const SolidSortNumericDown: IconType = "fa-solid fa-sort-numeric-down";
export const SolidSortNumericUp: IconType = "fa-solid fa-sort-numeric-up";
export const SolidSortUp: IconType = "fa-solid fa-sort-up";
export const SolidSpaceShuttle: IconType = "fa-solid fa-space-shuttle";
export const SolidSpinner: IconType = "fa-solid fa-spinner";
export const SolidSquare: IconType = "fa-solid fa-square";
export const SolidSquareFull: IconType = "fa-solid fa-square-full";
export const SolidStar: IconType = "fa-solid fa-star";
export const SolidStarHalf: IconType = "fa-solid fa-star-half";
export const SolidStepBackward: IconType = "fa-solid fa-step-backward";
export const SolidStepForward: IconType = "fa-solid fa-step-forward";
export const SolidStethoscope: IconType = "fa-solid fa-stethoscope";
export const SolidStickyNote: IconType = "fa-solid fa-sticky-note";
export const SolidStop: IconType = "fa-solid fa-stop";
export const SolidStopCircle: IconType = "fa-solid fa-stop-circle";
export const SolidStopwatch: IconType = "fa-solid fa-stopwatch";
export const SolidStreetView: IconType = "fa-solid fa-street-view";
export const SolidStrikethrough: IconType = "fa-solid fa-strikethrough";
export const SolidSubscript: IconType = "fa-solid fa-subscript";
export const SolidSubway: IconType = "fa-solid fa-subway";
export const SolidSuitcase: IconType = "fa-solid fa-suitcase";
export const SolidSun: IconType = "fa-solid fa-sun";
export const SolidSuperscript: IconType = "fa-solid fa-superscript";
export const SolidSync: IconType = "fa-solid fa-sync";
export const SolidSyncAlt: IconType = "fa-solid fa-sync-alt";
export const SolidSyringe: IconType = "fa-solid fa-syringe";
export const SolidTable: IconType = "fa-solid fa-table";
export const SolidTableTennis: IconType = "fa-solid fa-table-tennis";
export const SolidTablet: IconType = "fa-solid fa-tablet";
export const SolidTabletAlt: IconType = "fa-solid fa-tablet-alt";
export const SolidTablets: IconType = "fa-solid fa-tablets";
export const SolidTachometerAlt: IconType = "fa-solid fa-tachometer-alt";
export const SolidTag: IconType = "fa-solid fa-tag";
export const SolidTags: IconType = "fa-solid fa-tags";
export const SolidTape: IconType = "fa-solid fa-tape";
export const SolidTasks: IconType = "fa-solid fa-tasks";
export const SolidTaxi: IconType = "fa-solid fa-taxi";
export const SolidTerminal: IconType = "fa-solid fa-terminal";
export const SolidTextHeight: IconType = "fa-solid fa-text-height";
export const SolidTextWidth: IconType = "fa-solid fa-text-width";
export const SolidTh: IconType = "fa-solid fa-th";
export const SolidThLarge: IconType = "fa-solid fa-th-large";
export const SolidThList: IconType = "fa-solid fa-th-list";
export const SolidThermometer: IconType = "fa-solid fa-thermometer";
export const SolidThermometerEmpty: IconType = "fa-solid fa-thermometer-empty";
export const SolidThermometerFull: IconType = "fa-solid fa-thermometer-full";
export const SolidThermometerHalf: IconType = "fa-solid fa-thermometer-half";
export const SolidThermometerQuarter: IconType =
  "fa-solid fa-thermometer-quarter";
export const SolidThermometerThreeQuarters: IconType =
  "fa-solid fa-thermometer-three-quarters";
export const SolidThumbsDown: IconType = "fa-solid fa-thumbs-down";
export const SolidThumbsUp: IconType = "fa-solid fa-thumbs-up";
export const SolidThumbtack: IconType = "fa-solid fa-thumbtack";
export const SolidTicketAlt: IconType = "fa-solid fa-ticket-alt";
export const SolidTimes: IconType = "fa-solid fa-times";
export const SolidTimesCircle: IconType = "fa-solid fa-times-circle";
export const SolidTint: IconType = "fa-solid fa-tint";
export const SolidToggleOff: IconType = "fa-solid fa-toggle-off";
export const SolidToggleOn: IconType = "fa-solid fa-toggle-on";
export const SolidTrademark: IconType = "fa-solid fa-trademark";
export const SolidTrain: IconType = "fa-solid fa-train";
export const SolidTransgender: IconType = "fa-solid fa-transgender";
export const SolidTransgenderAlt: IconType = "fa-solid fa-transgender-alt";
export const SolidTrash: IconType = "fa-solid fa-trash";
export const SolidTrashAlt: IconType = "fa-solid fa-trash-alt";
export const SolidTree: IconType = "fa-solid fa-tree";
export const SolidTrophy: IconType = "fa-solid fa-trophy";
export const SolidTruck: IconType = "fa-solid fa-truck";
export const SolidTruckLoading: IconType = "fa-solid fa-truck-loading";
export const SolidTruckMoving: IconType = "fa-solid fa-truck-moving";
export const SolidTty: IconType = "fa-solid fa-tty";
export const SolidTv: IconType = "fa-solid fa-tv";
export const SolidUmbrella: IconType = "fa-solid fa-umbrella";
export const SolidUnderline: IconType = "fa-solid fa-underline";
export const SolidUndo: IconType = "fa-solid fa-undo";
export const SolidUndoAlt: IconType = "fa-solid fa-undo-alt";
export const SolidUniversalAccess: IconType = "fa-solid fa-universal-access";
export const SolidUniversity: IconType = "fa-solid fa-university";
export const SolidUnlink: IconType = "fa-solid fa-unlink";
export const SolidUnlock: IconType = "fa-solid fa-unlock";
export const SolidUnlockAlt: IconType = "fa-solid fa-unlock-alt";
export const SolidUpload: IconType = "fa-solid fa-upload";
export const SolidUser: IconType = "fa-solid fa-user";
export const SolidUserCircle: IconType = "fa-solid fa-user-circle";
export const SolidUserMd: IconType = "fa-solid fa-user-md";
export const SolidUserPlus: IconType = "fa-solid fa-user-plus";
export const SolidUserSecret: IconType = "fa-solid fa-user-secret";
export const SolidUserTimes: IconType = "fa-solid fa-user-times";
export const SolidUsers: IconType = "fa-solid fa-users";
export const SolidUtensilSpoon: IconType = "fa-solid fa-utensil-spoon";
export const SolidUtensils: IconType = "fa-solid fa-utensils";
export const SolidVenus: IconType = "fa-solid fa-venus";
export const SolidVenusDouble: IconType = "fa-solid fa-venus-double";
export const SolidVenusMars: IconType = "fa-solid fa-venus-mars";
export const SolidVial: IconType = "fa-solid fa-vial";
export const SolidVials: IconType = "fa-solid fa-vials";
export const SolidVideo: IconType = "fa-solid fa-video";
export const SolidVideoSlash: IconType = "fa-solid fa-video-slash";
export const SolidVolleyballBall: IconType = "fa-solid fa-volleyball-ball";
export const SolidVolumeDown: IconType = "fa-solid fa-volume-down";
export const SolidVolumeOff: IconType = "fa-solid fa-volume-off";
export const SolidVolumeUp: IconType = "fa-solid fa-volume-up";
export const SolidWarehouse: IconType = "fa-solid fa-warehouse";
export const SolidWeight: IconType = "fa-solid fa-weight";
export const SolidWheelchair: IconType = "fa-solid fa-wheelchair";
export const SolidWifi: IconType = "fa-solid fa-wifi";
export const SolidWindowClose: IconType = "fa-solid fa-window-close";
export const SolidWindowMaximize: IconType = "fa-solid fa-window-maximize";
export const SolidWindowMinimize: IconType = "fa-solid fa-window-minimize";
export const SolidWindowRestore: IconType = "fa-solid fa-window-restore";
export const SolidWineGlass: IconType = "fa-solid fa-wine-glass";
export const SolidWonSign: IconType = "fa-solid fa-won-sign";
export const SolidWrench: IconType = "fa-solid fa-wrench";
export const SolidXRay: IconType = "fa-solid fa-x-ray";
export const SolidYenSign: IconType = "fa-solid fa-yen-sign";
export const RegularAddressBook: IconType = "fa-regular fa-address-book";
export const RegularAddressCard: IconType = "fa-regular fa-address-card";
export const RegularArrowAltCircleDown: IconType =
  "fa-regular fa-arrow-alt-circle-down";
export const RegularArrowAltCircleLeft: IconType =
  "fa-regular fa-arrow-alt-circle-left";
export const RegularArrowAltCircleRight: IconType =
  "fa-regular fa-arrow-alt-circle-right";
export const RegularArrowAltCircleUp: IconType =
  "fa-regular fa-arrow-alt-circle-up";
export const RegularBell: IconType = "fa-regular fa-bell";
export const RegularBellSlash: IconType = "fa-regular fa-bell-slash";
export const RegularBookmark: IconType = "fa-regular fa-bookmark";
export const RegularBuilding: IconType = "fa-regular fa-building";
export const RegularCalendar: IconType = "fa-regular fa-calendar";
export const RegularCalendarAlt: IconType = "fa-regular fa-calendar-alt";
export const RegularCalendarCheck: IconType = "fa-regular fa-calendar-check";
export const RegularCalendarMinus: IconType = "fa-regular fa-calendar-minus";
export const RegularCalendarPlus: IconType = "fa-regular fa-calendar-plus";
export const RegularCalendarTimes: IconType = "fa-regular fa-calendar-times";
export const RegularCaretSquareDown: IconType =
  "fa-regular fa-caret-square-down";
export const RegularCaretSquareLeft: IconType =
  "fa-regular fa-caret-square-left";
export const RegularCaretSquareRight: IconType =
  "fa-regular fa-caret-square-right";
export const RegularCaretSquareUp: IconType = "fa-regular fa-caret-square-up";
export const RegularChartBar: IconType = "fa-regular fa-chart-bar";
export const RegularCheckCircle: IconType = "fa-regular fa-check-circle";
export const RegularCheckSquare: IconType = "fa-regular fa-check-square";
export const RegularCircle: IconType = "fa-regular fa-circle";
export const RegularClipboard: IconType = "fa-regular fa-clipboard";
export const RegularClock: IconType = "fa-regular fa-clock";
export const RegularClone: IconType = "fa-regular fa-clone";
export const RegularClosedCaptioning: IconType =
  "fa-regular fa-closed-captioning";
export const RegularComment: IconType = "fa-regular fa-comment";
export const RegularCommentAlt: IconType = "fa-regular fa-comment-alt";
export const RegularComments: IconType = "fa-regular fa-comments";
export const RegularCompass: IconType = "fa-regular fa-compass";
export const RegularCopy: IconType = "fa-regular fa-copy";
export const RegularCopyright: IconType = "fa-regular fa-copyright";
export const RegularCreditCard: IconType = "fa-regular fa-credit-card";
export const RegularDotCircle: IconType = "fa-regular fa-dot-circle";
export const RegularEdit: IconType = "fa-regular fa-edit";
export const RegularEnvelope: IconType = "fa-regular fa-envelope";
export const RegularEnvelopeOpen: IconType = "fa-regular fa-envelope-open";
export const RegularEyeSlash: IconType = "fa-regular fa-eye-slash";
export const RegularFile: IconType = "fa-regular fa-file";
export const RegularFileAlt: IconType = "fa-regular fa-file-alt";
export const RegularFileArchive: IconType = "fa-regular fa-file-archive";
export const RegularFileAudio: IconType = "fa-regular fa-file-audio";
export const RegularFileCode: IconType = "fa-regular fa-file-code";
export const RegularFileExcel: IconType = "fa-regular fa-file-excel";
export const RegularFileImage: IconType = "fa-regular fa-file-image";
export const RegularFilePdf: IconType = "fa-regular fa-file-pdf";
export const RegularFilePowerpoint: IconType = "fa-regular fa-file-powerpoint";
export const RegularFileVideo: IconType = "fa-regular fa-file-video";
export const RegularFileWord: IconType = "fa-regular fa-file-word";
export const RegularFlag: IconType = "fa-regular fa-flag";
export const RegularFolder: IconType = "fa-regular fa-folder";
export const RegularFolderOpen: IconType = "fa-regular fa-folder-open";
export const RegularFrown: IconType = "fa-regular fa-frown";
export const RegularFutbol: IconType = "fa-regular fa-futbol";
export const RegularGem: IconType = "fa-regular fa-gem";
export const RegularHandLizard: IconType = "fa-regular fa-hand-lizard";
export const RegularHandPaper: IconType = "fa-regular fa-hand-paper";
export const RegularHandPeace: IconType = "fa-regular fa-hand-peace";
export const RegularHandPointDown: IconType = "fa-regular fa-hand-point-down";
export const RegularHandPointLeft: IconType = "fa-regular fa-hand-point-left";
export const RegularHandPointRight: IconType = "fa-regular fa-hand-point-right";
export const RegularHandPointUp: IconType = "fa-regular fa-hand-point-up";
export const RegularHandPointer: IconType = "fa-regular fa-hand-pointer";
export const RegularHandRock: IconType = "fa-regular fa-hand-rock";
export const RegularHandScissors: IconType = "fa-regular fa-hand-scissors";
export const RegularHandSpock: IconType = "fa-regular fa-hand-spock";
export const RegularHandshake: IconType = "fa-regular fa-handshake";
export const RegularHdd: IconType = "fa-regular fa-hdd";
export const RegularHeart: IconType = "fa-regular fa-heart";
export const RegularHospital: IconType = "fa-regular fa-hospital";
export const RegularHourglass: IconType = "fa-regular fa-hourglass";
export const RegularIdBadge: IconType = "fa-regular fa-id-badge";
export const RegularIdCard: IconType = "fa-regular fa-id-card";
export const RegularImage: IconType = "fa-regular fa-image";
export const RegularImages: IconType = "fa-regular fa-images";
export const RegularKeyboard: IconType = "fa-regular fa-keyboard";
export const RegularLemon: IconType = "fa-regular fa-lemon";
export const RegularLifeRing: IconType = "fa-regular fa-life-ring";
export const RegularLightbulb: IconType = "fa-regular fa-lightbulb";
export const RegularListAlt: IconType = "fa-regular fa-list-alt";
export const RegularMap: IconType = "fa-regular fa-map";
export const RegularMeh: IconType = "fa-regular fa-meh";
export const RegularMinusSquare: IconType = "fa-regular fa-minus-square";
export const RegularMoneyBillAlt: IconType = "fa-regular fa-money-bill-alt";
export const RegularMoon: IconType = "fa-regular fa-moon";
export const RegularNewspaper: IconType = "fa-regular fa-newspaper";
export const RegularObjectGroup: IconType = "fa-regular fa-object-group";
export const RegularObjectUngroup: IconType = "fa-regular fa-object-ungroup";
export const RegularPaperPlane: IconType = "fa-regular fa-paper-plane";
export const RegularPauseCircle: IconType = "fa-regular fa-pause-circle";
export const RegularPlayCircle: IconType = "fa-regular fa-play-circle";
export const RegularPlusSquare: IconType = "fa-regular fa-plus-square";
export const RegularQuestionCircle: IconType = "fa-regular fa-question-circle";
export const RegularRegistered: IconType = "fa-regular fa-registered";
export const RegularSave: IconType = "fa-regular fa-save";
export const RegularShareSquare: IconType = "fa-regular fa-share-square";
export const RegularSmile: IconType = "fa-regular fa-smile";
export const RegularSnowflake: IconType = "fa-regular fa-snowflake";
export const RegularSquare: IconType = "fa-regular fa-square";
export const RegularStar: IconType = "fa-regular fa-star";
export const RegularStarHalf: IconType = "fa-regular fa-star-half";
export const RegularStickyNote: IconType = "fa-regular fa-sticky-note";
export const RegularStopCircle: IconType = "fa-regular fa-stop-circle";
export const RegularSun: IconType = "fa-regular fa-sun";
export const RegularThumbsDown: IconType = "fa-regular fa-thumbs-down";
export const RegularThumbsUp: IconType = "fa-regular fa-thumbs-up";
export const RegularTimesCircle: IconType = "fa-regular fa-times-circle";
export const RegularTrashAlt: IconType = "fa-regular fa-trash-alt";
export const RegularUser: IconType = "fa-regular fa-user";
export const RegularUserCircle: IconType = "fa-regular fa-user-circle";
export const RegularWindowClose: IconType = "fa-regular fa-window-close";
export const RegularWindowMaximize: IconType = "fa-regular fa-window-maximize";
export const RegularWindowMinimize: IconType = "fa-regular fa-window-minimize";
export const RegularWindowRestore: IconType = "fa-regular fa-window-restore";
export const Brand500px: IconType = "fa-brands fa-500px";
export const BrandAccessibleIcon: IconType = "fa-brands fa-accessible-icon";
export const BrandAccusoft: IconType = "fa-brands fa-accusoft";
export const BrandAdn: IconType = "fa-brands fa-adn";
export const BrandAdversal: IconType = "fa-brands fa-adversal";
export const BrandAffiliatetheme: IconType = "fa-brands fa-affiliatetheme";
export const BrandAlgolia: IconType = "fa-brands fa-algolia";
export const BrandAmazon: IconType = "fa-brands fa-amazon";
export const BrandAmazonPay: IconType = "fa-brands fa-amazon-pay";
export const BrandAmilia: IconType = "fa-brands fa-amilia";
export const BrandAndroid: IconType = "fa-brands fa-android";
export const BrandAngellist: IconType = "fa-brands fa-angellist";
export const BrandAngrycreative: IconType = "fa-brands fa-angrycreative";
export const BrandAngular: IconType = "fa-brands fa-angular";
export const BrandAppStore: IconType = "fa-brands fa-app-store";
export const BrandAppStoreIos: IconType = "fa-brands fa-app-store-ios";
export const BrandApper: IconType = "fa-brands fa-apper";
export const BrandApple: IconType = "fa-brands fa-apple";
export const BrandApplePay: IconType = "fa-brands fa-apple-pay";
export const BrandAsymmetrik: IconType = "fa-brands fa-asymmetrik";
export const BrandAudible: IconType = "fa-brands fa-audible";
export const BrandAutoprefixer: IconType = "fa-brands fa-autoprefixer";
export const BrandAvianex: IconType = "fa-brands fa-avianex";
export const BrandAviato: IconType = "fa-brands fa-aviato";
export const BrandAws: IconType = "fa-brands fa-aws";
export const BrandBandcamp: IconType = "fa-brands fa-bandcamp";
export const BrandBehance: IconType = "fa-brands fa-behance";
export const BrandBehanceSquare: IconType = "fa-brands fa-behance-square";
export const BrandBimobject: IconType = "fa-brands fa-bimobject";
export const BrandBitbucket: IconType = "fa-brands fa-bitbucket";
export const BrandBitcoin: IconType = "fa-brands fa-bitcoin";
export const BrandBity: IconType = "fa-brands fa-bity";
export const BrandBlackTie: IconType = "fa-brands fa-black-tie";
export const BrandBlackberry: IconType = "fa-brands fa-blackberry";
export const BrandBlogger: IconType = "fa-brands fa-blogger";
export const BrandBloggerB: IconType = "fa-brands fa-blogger-b";
export const BrandBluetooth: IconType = "fa-brands fa-bluetooth";
export const BrandBluetoothB: IconType = "fa-brands fa-bluetooth-b";
export const BrandBtc: IconType = "fa-brands fa-btc";
export const BrandBuromobelexperte: IconType = "fa-brands fa-buromobelexperte";
export const BrandBuysellads: IconType = "fa-brands fa-buysellads";
export const BrandCcAmazonPay: IconType = "fa-brands fa-cc-amazon-pay";
export const BrandCcAmex: IconType = "fa-brands fa-cc-amex";
export const BrandCcApplePay: IconType = "fa-brands fa-cc-apple-pay";
export const BrandCcDinersClub: IconType = "fa-brands fa-cc-diners-club";
export const BrandCcDiscover: IconType = "fa-brands fa-cc-discover";
export const BrandCcJcb: IconType = "fa-brands fa-cc-jcb";
export const BrandCcMastercard: IconType = "fa-brands fa-cc-mastercard";
export const BrandCcPaypal: IconType = "fa-brands fa-cc-paypal";
export const BrandCcStripe: IconType = "fa-brands fa-cc-stripe";
export const BrandCcVisa: IconType = "fa-brands fa-cc-visa";
export const BrandCentercode: IconType = "fa-brands fa-centercode";
export const BrandChrome: IconType = "fa-brands fa-chrome";
export const BrandCloudscale: IconType = "fa-brands fa-cloudscale";
export const BrandCloudsmith: IconType = "fa-brands fa-cloudsmith";
export const BrandCloudversify: IconType = "fa-brands fa-cloudversify";
export const BrandCodepen: IconType = "fa-brands fa-codepen";
export const BrandCodiepie: IconType = "fa-brands fa-codiepie";
export const BrandConnectdevelop: IconType = "fa-brands fa-connectdevelop";
export const BrandContao: IconType = "fa-brands fa-contao";
export const BrandCpanel: IconType = "fa-brands fa-cpanel";
export const BrandCreativeCommons: IconType = "fa-brands fa-creative-commons";
export const BrandCss3: IconType = "fa-brands fa-css3";
export const BrandCss3Alt: IconType = "fa-brands fa-css3-alt";
export const BrandCuttlefish: IconType = "fa-brands fa-cuttlefish";
export const BrandDAndD: IconType = "fa-brands fa-d-and-d";
export const BrandDashcube: IconType = "fa-brands fa-dashcube";
export const BrandDelicious: IconType = "fa-brands fa-delicious";
export const BrandDeploydog: IconType = "fa-brands fa-deploydog";
export const BrandDeskpro: IconType = "fa-brands fa-deskpro";
export const BrandDeviantart: IconType = "fa-brands fa-deviantart";
export const BrandDigg: IconType = "fa-brands fa-digg";
export const BrandDigitalOcean: IconType = "fa-brands fa-digital-ocean";
export const BrandDiscord: IconType = "fa-brands fa-discord";
export const BrandDiscourse: IconType = "fa-brands fa-discourse";
export const BrandDochub: IconType = "fa-brands fa-dochub";
export const BrandDocker: IconType = "fa-brands fa-docker";
export const BrandDraft2digital: IconType = "fa-brands fa-draft2digital";
export const BrandDribbble: IconType = "fa-brands fa-dribbble";
export const BrandDribbbleSquare: IconType = "fa-brands fa-dribbble-square";
export const BrandDropbox: IconType = "fa-brands fa-dropbox";
export const BrandDrupal: IconType = "fa-brands fa-drupal";
export const BrandDyalog: IconType = "fa-brands fa-dyalog";
export const BrandEarlybirds: IconType = "fa-brands fa-earlybirds";
export const BrandEdge: IconType = "fa-brands fa-edge";
export const BrandElementor: IconType = "fa-brands fa-elementor";
export const BrandEmber: IconType = "fa-brands fa-ember";
export const BrandEmpire: IconType = "fa-brands fa-empire";
export const BrandEnvira: IconType = "fa-brands fa-envira";
export const BrandErlang: IconType = "fa-brands fa-erlang";
export const BrandEthereum: IconType = "fa-brands fa-ethereum";
export const BrandEtsy: IconType = "fa-brands fa-etsy";
export const BrandExpeditedssl: IconType = "fa-brands fa-expeditedssl";
export const BrandFacebook: IconType = "fa-brands fa-facebook";
export const BrandFacebookF: IconType = "fa-brands fa-facebook-f";
export const BrandFacebookMessenger: IconType =
  "fa-brands fa-facebook-messenger";
export const BrandFacebookSquare: IconType = "fa-brands fa-facebook-square";
export const BrandFirefox: IconType = "fa-brands fa-firefox";
export const BrandFirstOrder: IconType = "fa-brands fa-first-order";
export const BrandFirstdraft: IconType = "fa-brands fa-firstdraft";
export const BrandFlickr: IconType = "fa-brands fa-flickr";
export const BrandFlipboard: IconType = "fa-brands fa-flipboard";
export const BrandFly: IconType = "fa-brands fa-fly";
export const BrandFontAwesome: IconType = "fa-brands fa-font-awesome";
export const BrandFontAwesomeAlt: IconType = "fa-brands fa-font-awesome-alt";
export const BrandFontAwesomeFlag: IconType = "fa-brands fa-font-awesome-flag";
export const BrandFonticons: IconType = "fa-brands fa-fonticons";
export const BrandFonticonsFi: IconType = "fa-brands fa-fonticons-fi";
export const BrandFortAwesome: IconType = "fa-brands fa-fort-awesome";
export const BrandFortAwesomeAlt: IconType = "fa-brands fa-fort-awesome-alt";
export const BrandForumbee: IconType = "fa-brands fa-forumbee";
export const BrandFoursquare: IconType = "fa-brands fa-foursquare";
export const BrandFreeCodeCamp: IconType = "fa-brands fa-free-code-camp";
export const BrandFreebsd: IconType = "fa-brands fa-freebsd";
export const BrandGetPocket: IconType = "fa-brands fa-get-pocket";
export const BrandGg: IconType = "fa-brands fa-gg";
export const BrandGgCircle: IconType = "fa-brands fa-gg-circle";
export const BrandGit: IconType = "fa-brands fa-git";
export const BrandGitSquare: IconType = "fa-brands fa-git-square";
export const BrandGithub: IconType = "fa-brands fa-github";
export const BrandGithubAlt: IconType = "fa-brands fa-github-alt";
export const BrandGithubSquare: IconType = "fa-brands fa-github-square";
export const BrandGitkraken: IconType = "fa-brands fa-gitkraken";
export const BrandGitlab: IconType = "fa-brands fa-gitlab";
export const BrandGitter: IconType = "fa-brands fa-gitter";
export const BrandGlide: IconType = "fa-brands fa-glide";
export const BrandGlideG: IconType = "fa-brands fa-glide-g";
export const BrandGofore: IconType = "fa-brands fa-gofore";
export const BrandGoodreads: IconType = "fa-brands fa-goodreads";
export const BrandGoodreadsG: IconType = "fa-brands fa-goodreads-g";
export const BrandGoogle: IconType = "fa-brands fa-google";
export const BrandGoogleDrive: IconType = "fa-brands fa-google-drive";
export const BrandGooglePlay: IconType = "fa-brands fa-google-play";
export const BrandGooglePlus: IconType = "fa-brands fa-google-plus";
export const BrandGooglePlusG: IconType = "fa-brands fa-google-plus-g";
export const BrandGooglePlusSquare: IconType =
  "fa-brands fa-google-plus-square";
export const BrandGoogleWallet: IconType = "fa-brands fa-google-wallet";
export const BrandGratipay: IconType = "fa-brands fa-gratipay";
export const BrandGrav: IconType = "fa-brands fa-grav";
export const BrandGripfire: IconType = "fa-brands fa-gripfire";
export const BrandGrunt: IconType = "fa-brands fa-grunt";
export const BrandGulp: IconType = "fa-brands fa-gulp";
export const BrandHackerNews: IconType = "fa-brands fa-hacker-news";
export const BrandHackerNewsSquare: IconType =
  "fa-brands fa-hacker-news-square";
export const BrandHips: IconType = "fa-brands fa-hips";
export const BrandHireAHelper: IconType = "fa-brands fa-hire-a-helper";
export const BrandHooli: IconType = "fa-brands fa-hooli";
export const BrandHotjar: IconType = "fa-brands fa-hotjar";
export const BrandHouzz: IconType = "fa-brands fa-houzz";
export const BrandHtml5: IconType = "fa-brands fa-html5";
export const BrandHubspot: IconType = "fa-brands fa-hubspot";
export const BrandImdb: IconType = "fa-brands fa-imdb";
export const BrandInstagram: IconType = "fa-brands fa-instagram";
export const BrandInternetExplorer: IconType = "fa-brands fa-internet-explorer";
export const BrandIoxhost: IconType = "fa-brands fa-ioxhost";
export const BrandItunes: IconType = "fa-brands fa-itunes";
export const BrandItunesNote: IconType = "fa-brands fa-itunes-note";
export const BrandJenkins: IconType = "fa-brands fa-jenkins";
export const BrandJoget: IconType = "fa-brands fa-joget";
export const BrandJoomla: IconType = "fa-brands fa-joomla";
export const BrandJs: IconType = "fa-brands fa-js";
export const BrandJsSquare: IconType = "fa-brands fa-js-square";
export const BrandJsfiddle: IconType = "fa-brands fa-jsfiddle";
export const BrandKeycdn: IconType = "fa-brands fa-keycdn";
export const BrandKickstarter: IconType = "fa-brands fa-kickstarter";
export const BrandKickstarterK: IconType = "fa-brands fa-kickstarter-k";
export const BrandKorvue: IconType = "fa-brands fa-korvue";
export const BrandLaravel: IconType = "fa-brands fa-laravel";
export const BrandLastfm: IconType = "fa-brands fa-lastfm";
export const BrandLastfmSquare: IconType = "fa-brands fa-lastfm-square";
export const BrandLeanpub: IconType = "fa-brands fa-leanpub";
export const BrandLess: IconType = "fa-brands fa-less";
export const BrandLine: IconType = "fa-brands fa-line";
export const BrandLinkedin: IconType = "fa-brands fa-linkedin";
export const BrandLinkedinIn: IconType = "fa-brands fa-linkedin-in";
export const BrandLinode: IconType = "fa-brands fa-linode";
export const BrandLinux: IconType = "fa-brands fa-linux";
export const BrandLyft: IconType = "fa-brands fa-lyft";
export const BrandMagento: IconType = "fa-brands fa-magento";
export const BrandMarkdown: IconType = "fa-brands fa-markdown";
export const BrandMaxcdn: IconType = "fa-brands fa-maxcdn";
export const BrandMedapps: IconType = "fa-brands fa-medapps";
export const BrandMedium: IconType = "fa-brands fa-medium";
export const BrandMediumM: IconType = "fa-brands fa-medium-m";
export const BrandMedrt: IconType = "fa-brands fa-medrt";
export const BrandMeetup: IconType = "fa-brands fa-meetup";
export const BrandMicrosoft: IconType = "fa-brands fa-microsoft";
export const BrandMix: IconType = "fa-brands fa-mix";
export const BrandMixcloud: IconType = "fa-brands fa-mixcloud";
export const BrandMizuni: IconType = "fa-brands fa-mizuni";
export const BrandModx: IconType = "fa-brands fa-modx";
export const BrandMonero: IconType = "fa-brands fa-monero";
export const BrandNapster: IconType = "fa-brands fa-napster";
export const BrandNintendoSwitch: IconType = "fa-brands fa-nintendo-switch";
export const BrandNode: IconType = "fa-brands fa-node";
export const BrandNodeJs: IconType = "fa-brands fa-node-js";
export const BrandNpm: IconType = "fa-brands fa-npm";
export const BrandNs8: IconType = "fa-brands fa-ns8";
export const BrandNutritionix: IconType = "fa-brands fa-nutritionix";
export const BrandOdnoklassniki: IconType = "fa-brands fa-odnoklassniki";
export const BrandOdnoklassnikiSquare: IconType =
  "fa-brands fa-odnoklassniki-square";
export const BrandOpencart: IconType = "fa-brands fa-opencart";
export const BrandOpenid: IconType = "fa-brands fa-openid";
export const BrandOpera: IconType = "fa-brands fa-opera";
export const BrandOptinMonster: IconType = "fa-brands fa-optin-monster";
export const BrandOsi: IconType = "fa-brands fa-osi";
export const BrandPage4: IconType = "fa-brands fa-page4";
export const BrandPagelines: IconType = "fa-brands fa-pagelines";
export const BrandPalfed: IconType = "fa-brands fa-palfed";
export const BrandPatreon: IconType = "fa-brands fa-patreon";
export const BrandPaypal: IconType = "fa-brands fa-paypal";
export const BrandPeriscope: IconType = "fa-brands fa-periscope";
export const BrandPhabricator: IconType = "fa-brands fa-phabricator";
export const BrandPhoenixFramework: IconType = "fa-brands fa-phoenix-framework";
export const BrandPhp: IconType = "fa-brands fa-php";
export const BrandPiedPiper: IconType = "fa-brands fa-pied-piper";
export const BrandPiedPiperAlt: IconType = "fa-brands fa-pied-piper-alt";
export const BrandPiedPiperPp: IconType = "fa-brands fa-pied-piper-pp";
export const BrandPinterest: IconType = "fa-brands fa-pinterest";
export const BrandPinterestP: IconType = "fa-brands fa-pinterest-p";
export const BrandPinterestSquare: IconType = "fa-brands fa-pinterest-square";
export const BrandPlaystation: IconType = "fa-brands fa-playstation";
export const BrandProductHunt: IconType = "fa-brands fa-product-hunt";
export const BrandPushed: IconType = "fa-brands fa-pushed";
export const BrandPython: IconType = "fa-brands fa-python";
export const BrandQq: IconType = "fa-brands fa-qq";
export const BrandQuinscape: IconType = "fa-brands fa-quinscape";
export const BrandQuora: IconType = "fa-brands fa-quora";
export const BrandRavelry: IconType = "fa-brands fa-ravelry";
export const BrandReact: IconType = "fa-brands fa-react";
export const BrandReadme: IconType = "fa-brands fa-readme";
export const BrandRebel: IconType = "fa-brands fa-rebel";
export const BrandRedRiver: IconType = "fa-brands fa-red-river";
export const BrandReddit: IconType = "fa-brands fa-reddit";
export const BrandRedditAlien: IconType = "fa-brands fa-reddit-alien";
export const BrandRedditSquare: IconType = "fa-brands fa-reddit-square";
export const BrandRendact: IconType = "fa-brands fa-rendact";
export const BrandRenren: IconType = "fa-brands fa-renren";
export const BrandReplyd: IconType = "fa-brands fa-replyd";
export const BrandResolving: IconType = "fa-brands fa-resolving";
export const BrandRocketchat: IconType = "fa-brands fa-rocketchat";
export const BrandRockrms: IconType = "fa-brands fa-rockrms";
export const BrandSafari: IconType = "fa-brands fa-safari";
export const BrandSass: IconType = "fa-brands fa-sass";
export const BrandSchlix: IconType = "fa-brands fa-schlix";
export const BrandScribd: IconType = "fa-brands fa-scribd";
export const BrandSearchengin: IconType = "fa-brands fa-searchengin";
export const BrandSellcast: IconType = "fa-brands fa-sellcast";
export const BrandSellsy: IconType = "fa-brands fa-sellsy";
export const BrandServicestack: IconType = "fa-brands fa-servicestack";
export const BrandShirtsinbulk: IconType = "fa-brands fa-shirtsinbulk";
export const BrandSimplybuilt: IconType = "fa-brands fa-simplybuilt";
export const BrandSistrix: IconType = "fa-brands fa-sistrix";
export const BrandSkyatlas: IconType = "fa-brands fa-skyatlas";
export const BrandSkype: IconType = "fa-brands fa-skype";
export const BrandSlack: IconType = "fa-brands fa-slack";
export const BrandSlackHash: IconType = "fa-brands fa-slack-hash";
export const BrandSlideshare: IconType = "fa-brands fa-slideshare";
export const BrandSnapchat: IconType = "fa-brands fa-snapchat";
export const BrandSnapchatGhost: IconType = "fa-brands fa-snapchat-ghost";
export const BrandSnapchatSquare: IconType = "fa-brands fa-snapchat-square";
export const BrandSoundcloud: IconType = "fa-brands fa-soundcloud";
export const BrandSpeakap: IconType = "fa-brands fa-speakap";
export const BrandSpotify: IconType = "fa-brands fa-spotify";
export const BrandStackExchange: IconType = "fa-brands fa-stack-exchange";
export const BrandStackOverflow: IconType = "fa-brands fa-stack-overflow";
export const BrandStaylinked: IconType = "fa-brands fa-staylinked";
export const BrandSteam: IconType = "fa-brands fa-steam";
export const BrandSteamSquare: IconType = "fa-brands fa-steam-square";
export const BrandSteamSymbol: IconType = "fa-brands fa-steam-symbol";
export const BrandStickerMule: IconType = "fa-brands fa-sticker-mule";
export const BrandStrava: IconType = "fa-brands fa-strava";
export const BrandStripe: IconType = "fa-brands fa-stripe";
export const BrandStripeS: IconType = "fa-brands fa-stripe-s";
export const BrandStudiovinari: IconType = "fa-brands fa-studiovinari";
export const BrandStumbleupon: IconType = "fa-brands fa-stumbleupon";
export const BrandStumbleuponCircle: IconType =
  "fa-brands fa-stumbleupon-circle";
export const BrandSuperpowers: IconType = "fa-brands fa-superpowers";
export const BrandSupple: IconType = "fa-brands fa-supple";
export const BrandTelegram: IconType = "fa-brands fa-telegram";
export const BrandTelegramPlane: IconType = "fa-brands fa-telegram-plane";
export const BrandTencentWeibo: IconType = "fa-brands fa-tencent-weibo";
export const BrandThemeisle: IconType = "fa-brands fa-themeisle";
export const BrandTrello: IconType = "fa-brands fa-trello";
export const BrandTripadvisor: IconType = "fa-brands fa-tripadvisor";
export const BrandTumblr: IconType = "fa-brands fa-tumblr";
export const BrandTumblrSquare: IconType = "fa-brands fa-tumblr-square";
export const BrandTwitch: IconType = "fa-brands fa-twitch";
export const BrandTwitter: IconType = "fa-brands fa-twitter";
export const BrandTwitterSquare: IconType = "fa-brands fa-twitter-square";
export const BrandTypo3: IconType = "fa-brands fa-typo3";
export const BrandUber: IconType = "fa-brands fa-uber";
export const BrandUikit: IconType = "fa-brands fa-uikit";
export const BrandUniregistry: IconType = "fa-brands fa-uniregistry";
export const BrandUntappd: IconType = "fa-brands fa-untappd";
export const BrandUsb: IconType = "fa-brands fa-usb";
export const BrandUssunnah: IconType = "fa-brands fa-ussunnah";
export const BrandVaadin: IconType = "fa-brands fa-vaadin";
export const BrandViacoin: IconType = "fa-brands fa-viacoin";
export const BrandViadeo: IconType = "fa-brands fa-viadeo";
export const BrandViadeoSquare: IconType = "fa-brands fa-viadeo-square";
export const BrandViber: IconType = "fa-brands fa-viber";
export const BrandVimeo: IconType = "fa-brands fa-vimeo";
export const BrandVimeoSquare: IconType = "fa-brands fa-vimeo-square";
export const BrandVimeoV: IconType = "fa-brands fa-vimeo-v";
export const BrandVine: IconType = "fa-brands fa-vine";
export const BrandVk: IconType = "fa-brands fa-vk";
export const BrandVnv: IconType = "fa-brands fa-vnv";
export const BrandVuejs: IconType = "fa-brands fa-vuejs";
export const BrandWeibo: IconType = "fa-brands fa-weibo";
export const BrandWeixin: IconType = "fa-brands fa-weixin";
export const BrandWhatsapp: IconType = "fa-brands fa-whatsapp";
export const BrandWhatsappSquare: IconType = "fa-brands fa-whatsapp-square";
export const BrandWhmcs: IconType = "fa-brands fa-whmcs";
export const BrandWikipediaW: IconType = "fa-brands fa-wikipedia-w";
export const BrandWindows: IconType = "fa-brands fa-windows";
export const BrandWordpress: IconType = "fa-brands fa-wordpress";
export const BrandWordpressSimple: IconType = "fa-brands fa-wordpress-simple";
export const BrandWpbeginner: IconType = "fa-brands fa-wpbeginner";
export const BrandWpexplorer: IconType = "fa-brands fa-wpexplorer";
export const BrandWpforms: IconType = "fa-brands fa-wpforms";
export const BrandXbox: IconType = "fa-brands fa-xbox";
export const BrandXing: IconType = "fa-brands fa-xing";
export const BrandXingSquare: IconType = "fa-brands fa-xing-square";
export const BrandYCombinator: IconType = "fa-brands fa-y-combinator";
export const BrandYahoo: IconType = "fa-brands fa-yahoo";
export const BrandYandex: IconType = "fa-brands fa-yandex";
export const BrandYandexInternational: IconType =
  "fa-brands fa-yandex-international";
export const BrandYelp: IconType = "fa-brands fa-yelp";
export const BrandYoast: IconType = "fa-brands fa-yoast";
export const BrandYoutube: IconType = "fa-brands fa-youtube";
export const BrandYoutubeSquare: IconType = "fa-brands fa-youtube-square";

export const Icon = (props: { of: IconType }): JSX.Element => (
  <i class={props.of} />
);
