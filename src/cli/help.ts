interface Command {
    name: string
    description: string
}

interface Flag {
    name: string
    alias?: string
    description: string
}

const commands: Command[] = [
    { name: "init",          description: "Configure Cloudflare credentials" },
    { name: "list-images",   description: "List images" },
    { name: "list-variants", description: "List variants" },
    { name: "upload-image",  description: "Upload a local image file to Cloudflare" },
    { name: "delete-image",  description: "Delete an image on Cloudflare Images" },
]

const flags: Flag[] = [
    { name: "help",    alias: "h", description: "Show usage information"   },
    { name: "version", alias: "v", description: "Show version information" },
]

const longestCommandName = Math.max(...(commands.map(x => x.name.length)))
// const longestFlagName    = Math.max(...(commands.map(x => x.name.length)))

export const HELP = `
    Usage
      $ cf-images <command>

    Commands
      init           Configure Cloudflare credentials
      list-images    List images
      list-variants  List variants
      upload-image   Upload a local image file to Cloudflare
      delete-image   Delete an image on Cloudflare Images

    Options
      --help         Show usage information
      --version      Show version information
      -d --debug     Enable verbose output

    Examples
      $ cf-images list-images >> cloudflare-images.json
`

/*
=============================================================================
Reference
=============================================================================

gcloud GROUP | COMMAND [--account=ACCOUNT] [--configuration=CONFIGURATION] \
    [--flatten=[KEY,...]][--format=FORMAT] [--help] [--project=PROJECT_ID] \
    [--quiet, -q][--verbosity=VERBOSITY; default="warning"] [--version, -v] \
    [-h] [--log-http][--trace-token=TRACE_TOKEN] [--no-user-output-enabled]

*/
