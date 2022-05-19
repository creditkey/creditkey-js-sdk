export default function pdp(layout = 'left', version = '1') {
 return pdpLayouts[layout](version); 
}

export default function HelloWorld() {
  return "Hello World";
}

const pdpLayouts = {
  left: pfpLeft,
  center: pdpCenter,
  right: pdpRight
}

const pdpLeft = (version) => {
  // add styling to left align fetched content?
}

const getPdpdContent = () => {
  // async way to get pdp content from a source?
}
