import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
   allowlist: {
     // Needed for watching files during development
     "node_modules/@parcel/watcher@2.5.1": "ALLOW",
     // Provides native integration, supporting the ability to write dtrace probes for bunyan
     "node_modules/dtrace-provider@0.8.8": "ALLOW",
     // Needed by jest for running tests in watch mode
     "node_modules/fsevents@2.3.3": "ALLOW"
   },
})
