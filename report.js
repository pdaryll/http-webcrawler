function printReport(pages) {
    console.log("===========")
    console.log("REPORT")
    console.log("===========")
    const sortedPages = sortPages(pages)
    for (const page of sortedPages) {
        const url = page[0]
        const hits = page[1]
        console.log(`Found ${hits} links to ${url}`)
    }
    console.log("===========")
    console.log("END OF REPORT")
    console.log("===========")
}

function sortPages(pages) {
    const pageArr = Object.entries(pages)
    pageArr.sort((a,b) => {
        aHits = a[1]
        bHits = b[1]
        return b[1] - a[1]
    })
    return pageArr
}

module.exports = {
    sortPages,
    printReport
}