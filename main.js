const {crawlPage} = require('./crawl.js')

function main() {
    if (process.argv.length < 3) {
        console.log("no website provided")
        process.exit(1)
    }

    if (process.argv.length > 3) {
        console.log("Too many websites")
        process.exit(1)
    }

    const baseURL = process.argv[2]

    console.log("Starting Crawl of "+baseURL)
    crawlPage(baseURL)
}

main()