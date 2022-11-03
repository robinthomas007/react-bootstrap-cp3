import youtube from './../../Static/Images/youtube.png'
import facebook from './../../Static/Images/facebook.png'
import soundCloud from './../../Static/Images/soundCloud.png'
import instagram from './../../Static/Images/instagram.png'
import twitter from './../../Static/Images/twitter.png'
import vimeo from './../../Static/Images/vimeo.png'
import dailymotion from './../../Static/Images/dailymotion.png'
import audiomack from './../../Static/Images/audiomack.png'

export const PLATFORM_LIST = [
  { id: 'ALL', name: 'ALL' },
  { id: "youtube", name: <div className="select-platform-images"><img alt="youtube" src={youtube} /></div> },
  { id: 'soundCloud', name: <div className="select-platform-images"><img alt="soundCloud" src={soundCloud} /></div> },
  { id: 'facebook', name: <div className="select-platform-images"><img alt="facebook" src={facebook} /></div> },
  { id: 'instagram', name: <div className="select-platform-images"><img alt="instagram" src={instagram} /></div> },
  { id: 'twitter', name: <div className="select-platform-images"><img alt="twitter" src={twitter} /></div> },
  { id: 'vimeo', name: <div className="select-platform-images"><img alt="vimeo" src={vimeo} /></div> },
  { id: 'dailymotion', name: <div className="select-platform-images"><img alt="dailymotion" src={dailymotion} /></div> },
  { id: 'audiomack', name: <div className="select-platform-images"><img alt="audiomack" src={audiomack} /></div> }
];

export const DURATIONS_LIST = [
  { id: 'ALL', name: 'ALL' },
  { id: "<30 sec", name: "Less than 30 seconds" },
  { id: "<1:00", name: "Less than 60 seconds" },
  { id: "<1:30", name: "Less than 1 min 30 seconds" },
  { id: "<2:00", name: "Less than 2 mins" },
  { id: "<2:30", name: "Less than 2 mins 30 seconds" },
]

export const WHEN_LIST = [
  { id: 'Pre-Release', name: 'Pre-Release' },
  { id: "Post-Release", name: "Post-Release" },
  { id: "Always", name: "Always" }
]


export const SOURCE_LIST = [
  { id: 'cp3', name: 'CP3' },
  { id: "grd", name: "GRD" },
]

export const CONFIGURATION_LIST = [
  { id: 'album', name: 'Album' },
  { id: 'multi-track', name: 'Multi-track' },
  { id: 'single', name: 'Single' },
]

export const SEARCH_TITLES = [
  { id: "title", name: "Track Title" },
  { id: "artist", name: "Artist" },
  { id: "album", name: "Album" },
  { id: "isrc", name: "ISRC" },
  { id: "label", name: "Label" },
  { id: "blockPolicyName", name: "Policy" },
  { id: "leakDate", name: "Leak Date" },
  { id: "releaseDate", name: "Release Date" },
  { id: "updatedDate", name: "Last Updated" },
  { id: "source", name: "Source" },
];

export const FIRST_SEEN_TITLES = [
  { id: "title", name: "Track Title" },
  { id: "artist", name: "Artist" },
  { id: "album", name: "Album" },
  { id: "isrc", name: "ISRC" },
  { id: "label", name: "Label" },
  { id: "team", name: "Team" },
  { id: "blockPolicyName", name: "Policy" },
  { id: "leakDate", name: "Leak Date" },
  { id: "releaseDate", name: "Release Date" },
  { id: "updatedDate", name: "Last Updated" },
  { id: "configuration", name: "Configuration" },
  { id: "source", name: "Source" },
];

export const GREEN_LIST_TITLES = [
  { id: "account", name: "Account" },
  { id: "artist", name: "Artist" },
  { id: "labelName", name: "Label" },
  { id: "accountManager", name: "Account Manager" },
  { id: "contact", name: "Contact" },
  { id: "url", name: "Greenlisted URL" },
  { id: "addedBy", name: "Added By" },
  { id: "updatedDate", name: "Last Updated" },
  { id: "endDate", name: "End Date" },
  { id: "type", name: "Type" },
];

export const GREEN_LIST_TYPES = [
  { id: "UMG", name: "UMG" },
  { id: "3rd Party", name: "3rd Party" },
];