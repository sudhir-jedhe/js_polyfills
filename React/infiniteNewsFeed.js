class FeedApp {
    constructor() {
        this.feedWrapper = document.querySelector('.feed .wrapper');
        this.limit = 10;  // Number of items to fetch per request
        this.skip = 0;    // Number of items already fetched
        this.loading = false; // Prevents multiple loads
    }

    init() {
        // Initial render of feed items
        this.renderFeed(this.limit, this.skip);
        // Set up the scroll event listener
        window.addEventListener('scroll', () => this.handleInfiniteScroll());
    }

    async renderFeed(limit, skip) {
        this.renderLoader(); // Show loader while fetching data
        const feedItems = await this.fetchFeed(limit, skip);
        feedItems.forEach(item => this.renderFeedItem(item));
    }

    async fetchFeed(limit, skip) {
        // Simulating an API call with a delay
        return new Promise(resolve => {
            setTimeout(() => {
                // Mock data for demonstration purposes
                const mockData = Array.from({ length: limit }, (_, i) => ({
                    id: skip + i + 1,
                    title: `News Item ${skip + i + 1}`,
                    content: `Content for news item ${skip + i + 1}`
                }));
                resolve(mockData);
            }, 1000); // Simulate network delay
        });
    }

    renderFeedItem(feedItemData) {
        const itemElement = document.createElement('div');
        itemElement.className = 'feed-item';
        itemElement.innerHTML = `
            <h3>${feedItemData.title}</h3>
            <p>${feedItemData.content}</p>
        `;
        this.feedWrapper.appendChild(itemElement);
    }

    renderLoader() {
        if (!this.loading) {
            this.loading = true;
            const loader = document.createElement('div');
            loader.className = 'loader';
            loader.innerText = 'Loading...';
            this.feedWrapper.appendChild(loader);
        }
    }

    handleInfiniteScroll() {
        // Check if we are near the bottom of the page
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !this.loading) {
            this.skip += this.limit; // Increase the skip value
            this.renderFeed(this.limit, this.skip);
            this.loading = false; // Reset loading state after fetch
        }
    }
}

// Do not edit below this line
const app = new FeedApp();
app.init();

// Do not edit below this line
export default FeedApp;
