const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
    
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }
    const normalizedCurrentURL = normalizeURL(currentURL)
    if (pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`Actively crawling: ${currentURL}`)
    try {
        const response = await fetch(currentURL)

        if (response.status > 399) {
            console.log(currentURL + " returned: " + response.status + " status")
            return pages
        }

        const contentType = response.headers.get("content-type")

        if (!contentType.includes("text/html")) {
            console.log(`Site has Content Type of ${contentType}, must be text/html`)
            return pages
        }

        const htmlBody = await response.text()
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    } catch (err) {
        console.log("Error: " + err.message)
    }
    return pages
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {
        let newURL = linkElement.href

        if (newURL.slice(0, 1) === '/') {
            newURL = baseURL + newURL
        }

        try {
            const urlObj = new URL(newURL)
            urls.push(newURL)
        } catch (err) {
            console.log("error with url: "+ `${err.message}`)
        }
    }
    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}