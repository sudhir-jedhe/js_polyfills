class FeedApp {
    constructor() {
        this.feedWrapper = document.querySelector('.feed .wrapper');
        this.isLoading = false;
        this.limit = 10; // Number of items to fetch per request
        this.skip = 0; // Number of items already fetched
    }

    init() {
        // Render initial feed
        this.renderFeed(this.limit, this.skip);

        // Attach scroll event listener
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                // If scrolled to bottom, load more feed items
                this.handleInfiniteScroll();
            }
        });
    }

    async renderFeed(limit, skip) {
        const feedData = await this.fetchFeed(limit, skip);
        feedData.forEach(feedItemData => {
            this.renderFeedItem(feedItemData);
        });
    }

    async fetchFeed(limit, skip) {
        if (this.isLoading) return []; // Prevent concurrent requests
        this.isLoading = true;

        // Simulate fetching data from the server (replace with actual fetch call)
        const response = await fetch(`https://api.example.com/feed?limit=${limit}&skip=${skip}`);
        const data = await response.json();

        this.isLoading = false;
        this.skip += data.length; // Update skip count
        return data;
    }

    renderFeedItem(feedItemData) {
        const feedItemElement = document.createElement('div');
        feedItemElement.classList.add('feed-item');
        feedItemElement.textContent = feedItemData.title; // Assuming feed item has a 'title' property
        this.feedWrapper.appendChild(feedItemElement);
    }

    renderLoader() {
        const loaderElement = document.createElement('div');
        loaderElement.classList.add('loader');
        this.feedWrapper.appendChild(loaderElement);
    }

    handleInfiniteScroll() {
        // Render loader
        this.renderLoader();

        // Fetch more feed items
        this.renderFeed(this.limit, this.skip);
    }
}

// Initialize FeedApp
const app = new FeedApp();
app.init();

// Export FeedApp
export default FeedApp;
