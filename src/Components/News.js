import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';


export class News extends Component {

    static defaultProps = {
        country: "in",
        category: 'general'
    }

    static propTypes = {
        country: PropTypes.string,
        category: PropTypes.string
    }

    constructor(props) {
        super(props);
        this.props = {
            country: "in",
            category: "general"
        }
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }
    }

    async updateNews() {
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=53ccd38bb4f54021854335a1cbd01af6&page=${this.state.page}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        })
    }

    async componentDidMount() { //runs after render
        this.updateNews();
    }

    // handlePrevClick = async () => {
    //     this.setState({ page: this.setState.page - 1 });
    //     this.updateNews();
    // }

    // handleNextClick = async () => {

    //     this.setState({ page: this.setState.page + 1 });
    //     this.updateNews();
    // }
    
    fetchMoreData = async() => {
        this.setState({page: this.state.page +1});
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=53ccd38bb4f54021854335a1cbd01af6&page=${this.state.page}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults
        })
      };

    render() {

        return (
            <>  
                <h3 className='my-4 text-center'>NewsInfo - Top Headlines</h3>
                {this.state.loading === true && <Spinner />} 

                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={this.hasMore && <Spinner />}
                >
                <div className='container'>
                <div className='row'>
                    {this.state.articles.map((element) => {
                        return <div className='col-md-3' key={element.url}>
                            <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 85) : ""} imageUrl={element.urlToImage} newsUrl={element.url} date={element.publishedAt} source={element.source.name} />
                        </div>
                    })}
                </div>
                </div>
                </InfiniteScroll>
                
            </>
        )
    }
}

export default News
