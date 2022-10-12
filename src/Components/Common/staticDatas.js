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

export const CSV_HEADERS = [
  { key: 'title', label: 'Track Title', },
  { key: 'artist', label: 'Artist' },
  { key: 'album', label: 'Album' },
  { key: 'isrc', label: 'ISRC' },
  { key: 'label', label: 'Label' },
  { key: 'blockPolicyName', label: 'Policy' },
  { key: 'leakDate', label: 'Leak Date' },
  { key: 'releaseDate', label: 'Release Date' },
  { key: 'updatedDate', label: 'Last Updated' },
  { key: 'source', label: 'Source' },
]

export const TITLES = [
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